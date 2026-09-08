import { site } from "@/content/site";

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

/** Cream paper, ink type, one hairline — the studio's letterhead as HTML. */
export const wrapMail = (title: string, inner: string) => `
<!doctype html><html><body style="margin:0;background:#f2ead9;font-family:Georgia,'Times New Roman',serif;color:#0a0908;">
  <div style="max-width:560px;margin:0 auto;padding:48px 28px;">
    <p style="margin:0 0 28px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#978c78;">Gentle Frame Studio</p>
    <h1 style="margin:0 0 24px;font-size:28px;font-weight:500;line-height:1.2;">${title}</h1>
    ${inner}
    <p style="margin:40px 0 0;padding-top:20px;border-top:1px solid rgba(10,9,8,0.12);font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#978c78;">${site.legalName} — ${site.location} — ${site.domain}</p>
  </div>
</body></html>`;

export const mailRow = (label: string, value: string) =>
  value
    ? `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;"><span style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#978c78;display:block;margin-bottom:4px;">${label}</span>${escapeHtml(value).replace(/\n/g, "<br/>")}</p>`
    : "";

export const mailParagraph = (text: string) =>
  `<p style="margin:0 0 22px;font-size:17px;line-height:1.7;">${text}</p>`;

export const mailButton = (href: string, label: string) =>
  `<p style="margin:32px 0;"><a href="${href}" style="display:inline-block;padding:16px 28px;border:1px solid #0a0908;border-radius:999px;color:#0a0908;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;">${label}</a></p>`;
