import { saveSettingsAction } from "@/app/admin/documents/actions";
import { buttonClass, Field, inputClass } from "@/components/portal/ui";
import type { StudioSettings } from "@/lib/portal/types";

/** The studio's own details - printed on every quote, invoice and contract. */
export default function SettingsForm({ studio }: { studio: StudioSettings }) {
  return (
    <form action={saveSettingsAction} className="max-w-2xl">
      <div className="grid gap-8 md:grid-cols-2">
        <Field label="Legal name" htmlFor="name">
          <input id="name" name="name" defaultValue={studio.name} className={inputClass} />
        </Field>
        <Field label="Brand" htmlFor="brand">
          <input id="brand" name="brand" defaultValue={studio.brand} className={inputClass} />
        </Field>
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" defaultValue={studio.email} className={inputClass} />
        </Field>
        <Field label="Website" htmlFor="website">
          <input id="website" name="website" defaultValue={studio.website} className={inputClass} />
        </Field>
        <Field label="Address" htmlFor="address_line1">
          <input id="address_line1" name="address_line1" defaultValue={studio.address_line1 ?? ""} className={inputClass} />
        </Field>
        <div className="grid grid-cols-[110px_1fr] gap-6">
          <Field label="Postal code" htmlFor="postal_code">
            <input id="postal_code" name="postal_code" defaultValue={studio.postal_code ?? ""} className={inputClass} />
          </Field>
          <Field label="City" htmlFor="city">
            <input id="city" name="city" defaultValue={studio.city ?? ""} className={inputClass} />
          </Field>
        </div>
        <Field label="Country (ISO)" htmlFor="country">
          <input id="country" name="country" maxLength={2} defaultValue={studio.country} className={`${inputClass} uppercase`} />
        </Field>
        <Field label="VAT number (leave empty until registered)" htmlFor="vat_number">
          <input id="vat_number" name="vat_number" defaultValue={studio.vat_number ?? ""} placeholder="BE 0xxx.xxx.xxx" className={inputClass} />
        </Field>
        <Field label="IBAN (printed on invoices)" htmlFor="iban">
          <input id="iban" name="iban" defaultValue={studio.iban ?? ""} placeholder="BE.. .... .... ...." className={inputClass} />
        </Field>
        <Field label="Default VAT rate (%)" htmlFor="default_vat_rate">
          <input id="default_vat_rate" name="default_vat_rate" inputMode="decimal" defaultValue={String(studio.default_vat_rate)} className={inputClass} />
        </Field>
        <Field label="Payment terms (days)" htmlFor="payment_terms_days">
          <input id="payment_terms_days" name="payment_terms_days" inputMode="numeric" defaultValue={String(studio.payment_terms_days)} className={inputClass} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Closing line on every document" htmlFor="invoice_footer">
            <input id="invoice_footer" name="invoice_footer" defaultValue={studio.invoice_footer} className={inputClass} />
          </Field>
        </div>
      </div>
      <div className="mt-12">
        <button type="submit" className={buttonClass}>
          Save settings
        </button>
      </div>
    </form>
  );
}
