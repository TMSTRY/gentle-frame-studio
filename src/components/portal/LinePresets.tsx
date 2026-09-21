"use client";

const PRESETS = [
  { label: "Rush · 72 h", description: "Rush delivery: ceremony version within 72 hours" },
  { label: "USB keepsake", description: "Keepsake: the film on a USB stick in a linen box, delivered by post" },
  { label: "QR card", description: "Printed cards with a QR code to the private screening room (25 pieces)" },
  { label: "Extra minute", description: "Additional film minute beyond the agreed length" },
  { label: "Revision round", description: "Additional revision round" },
];

/** Drops a standard description into the first empty line; the price stays yours to type. */
export default function LinePresets() {
  const fill = (description: string) => {
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[name^="line_desc_"]'));
    const target = inputs.find((input) => !input.value.trim());
    if (!target) return;
    target.value = description;
    const index = target.name.replace("line_desc_", "");
    const price = document.querySelector<HTMLInputElement>(`input[name="line_unit_${index}"]`);
    price?.focus();
  };
  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.6rem] tracking-[0.24em] uppercase">
      <span className="text-taupe/70">Quick add</span>
      {PRESETS.map((preset) => (
        <button key={preset.label} type="button" onClick={() => fill(preset.description)} className="text-champagne/80 transition-colors hover:text-champagne">
          + {preset.label}
        </button>
      ))}
    </div>
  );
}
