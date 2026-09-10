import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { site } from "@/content/site";
import { formatDate, formatMoney } from "@/lib/portal/labels";
import { reminderMail } from "@/lib/portal/reminder-mail";
import { getResend, MAIL_FROM } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminEmail } from "@/lib/supabase/env";

interface DueRow {
  id: string;
  kind: "quote" | "invoice" | "contract" | "other";
  number: string | null;
  title: string;
  status: string;
  due_date: string | null;
  sent_at: string | null;
  total_cents: number;
  currency: string;
  clients: { name: string; email: string; language: "nl" | "en" } | null;
}

const DAY = 86_400_000;
const daysSince = (date: string) => Math.floor((Date.now() - new Date(date).getTime()) / DAY);

/**
 * Runs once a day (vercel.json). Invoices past due become "overdue"
 * and the client gets a gentle reminder (again after 7 and 14 days);
 * expired quotes and unsigned contracts are listed for the studio.
 * One digest mail to the studio, and only when something happened.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization");
  if (!secret || header !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const resend = getResend();
  const today = new Date().toISOString().slice(0, 10);
  const digest: string[] = [];

  // Trash older than 30 days is purged for good (FKs cascade).
  const cutoff = new Date(Date.now() - 30 * DAY).toISOString();
  for (const table of ["documents", "projects", "clients"] as const) {
    const { count } = await admin.from(table).delete({ count: "exact" }).lt("deleted_at", cutoff);
    if (count) digest.push(`Purged ${count} ${table} from the trash`);
  }

  const { data } = await admin
    .from("documents")
    .select("id, kind, number, title, status, due_date, sent_at, total_cents, currency, clients(name, email, language)")
    .in("status", ["sent", "overdue"])
    .is("deleted_at", null);
  const rows = (data ?? []) as unknown as DueRow[];

  for (const row of rows) {
    if (!row.clients) continue;
    const url = `${site.url}/portal/documents/${row.id}`;
    const label = `${row.number ?? "(draft)"} · ${row.title} · ${row.clients.name}`;

    // Invoices: flip to overdue on the first day past due, remind on day 0, 7, 14.
    if (row.kind === "invoice" && row.due_date && row.due_date < today) {
      const daysOverdue = daysSince(row.due_date);
      if (row.status === "sent") {
        await admin.from("documents").update({ status: "overdue" }).eq("id", row.id);
        digest.push(`Invoice overdue: ${label}`);
      }
      const remindToday = row.status === "sent" || daysOverdue === 7 || daysOverdue === 14;
      if (remindToday && resend) {
        const mail = reminderMail({
          language: row.clients.language,
          clientName: row.clients.name,
          number: row.number ?? "",
          title: row.title,
          total: formatMoney(row.total_cents, row.currency),
          dueDate: formatDate(row.due_date),
          url,
          daysOverdue,
        });
        const { error } = await resend.emails.send({
          from: MAIL_FROM,
          to: row.clients.email,
          replyTo: site.email,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
        });
        digest.push(error ? `Reminder FAILED (${daysOverdue}d): ${label}` : `Reminder sent (${daysOverdue}d): ${label}`);
      }
      continue;
    }

    // Quotes past their validity: the studio decides, the client isn't chased.
    if (row.kind === "quote" && row.status === "sent" && row.due_date && row.due_date < today) {
      digest.push(`Quote expired ${daysSince(row.due_date)}d ago: ${label}`);
    }

    // Contracts unsigned for a week: worth a personal nudge.
    if (row.kind === "contract" && row.status === "sent" && row.sent_at && daysSince(row.sent_at) >= 7 && daysSince(row.sent_at) % 7 === 0) {
      digest.push(`Contract unsigned for ${daysSince(row.sent_at)}d: ${label}`);
    }
  }

  if (digest.length && resend) {
    await resend.emails.send({
      from: MAIL_FROM,
      to: adminEmail() || site.email,
      subject: `Studio reminders · ${formatDate(today)}`,
      text: `${digest.join("\n")}\n\n${site.url}/admin/documents`,
    });
  }

  return NextResponse.json({ ok: true, checked: rows.length, actions: digest });
}
