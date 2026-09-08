import { createClientAction, updateClientAction } from "@/app/admin/actions";
import { buttonClass, Field, inputClass } from "@/components/portal/ui";
import { LANGUAGES } from "@/lib/portal/labels";
import type { Client } from "@/lib/portal/types";

/** Create or edit a client. Same fields, two actions. */
export default function ClientForm({ client }: { client?: Client }) {
  const editing = Boolean(client);
  return (
    <form action={editing ? updateClientAction : createClientAction} className="max-w-2xl">
      {client ? <input type="hidden" name="id" value={client.id} /> : null}

      <div className="grid gap-8 md:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <input id="name" name="name" required minLength={2} defaultValue={client?.name ?? ""} className={inputClass} />
        </Field>
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" required defaultValue={client?.email ?? ""} className={inputClass} />
        </Field>
        <Field label="Company (optional)" htmlFor="company">
          <input id="company" name="company" defaultValue={client?.company ?? ""} className={inputClass} />
        </Field>
        <Field label="VAT number (optional)" htmlFor="vat_number">
          <input id="vat_number" name="vat_number" defaultValue={client?.vat_number ?? ""} className={inputClass} />
        </Field>
        <Field label="Address" htmlFor="address_line1">
          <input id="address_line1" name="address_line1" defaultValue={client?.address_line1 ?? ""} className={inputClass} />
        </Field>
        <div className="grid grid-cols-[110px_1fr] gap-6">
          <Field label="Postal code" htmlFor="postal_code">
            <input id="postal_code" name="postal_code" defaultValue={client?.postal_code ?? ""} className={inputClass} />
          </Field>
          <Field label="City" htmlFor="city">
            <input id="city" name="city" defaultValue={client?.city ?? ""} className={inputClass} />
          </Field>
        </div>
        <Field label="Country (ISO code)" htmlFor="country">
          <input id="country" name="country" maxLength={2} defaultValue={client?.country ?? "BE"} className={`${inputClass} uppercase`} />
        </Field>
        <Field label="Language for mails & portal" htmlFor="language">
          <select id="language" name="language" defaultValue={client?.language ?? "nl"} className={`${inputClass} cursor-pointer appearance-none bg-ink`}>
            {LANGUAGES.map((option) => (
              <option key={option.value} value={option.value} className="bg-ink text-cream">
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-8">
        <Field label="Internal notes (never shown to the client)" htmlFor="notes">
          <textarea id="notes" name="notes" rows={3} defaultValue={client?.notes ?? ""} className={`${inputClass} resize-none leading-relaxed`} />
        </Field>
      </div>

      <div className="mt-12">
        <button type="submit" className={buttonClass}>
          {editing ? "Save changes" : "Create client"}
        </button>
      </div>
    </form>
  );
}
