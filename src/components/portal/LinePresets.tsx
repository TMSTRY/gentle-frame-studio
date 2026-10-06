"use client";

type PresetLang = "nl" | "en";

interface Preset {
  label: string;
  en: string;
  nl: string;
}

interface PresetGroup {
  group: string;
  items: Preset[];
}

/**
 * Standard quote lines, grouped by the kind of work. The button labels are
 * admin-only and stay English; the description lands verbatim on the client's
 * quote or invoice, so it follows the client's language.
 */
const PRESETS: PresetGroup[] = [
  {
    group: "Film",
    items: [
      { label: "Rush · 72 h", en: "Rush delivery: ceremony version within 72 hours", nl: "Spoedlevering: versie voor de plechtigheid binnen 72 uur" },
      { label: "USB keepsake", en: "Keepsake: the film on a USB stick in a linen box, delivered by post", nl: "Aandenken: de film op een USB-stick in een linnen doosje, per post bezorgd" },
      { label: "QR cards", en: "Printed cards with a QR code to the private screening room (25 pieces)", nl: "Gedrukte kaartjes met een QR-code naar de privé-bioscoopzaal (25 stuks)" },
      { label: "Extra minute", en: "Additional film minute beyond the agreed length", nl: "Extra filmminuut boven de afgesproken lengte" },
      { label: "Revision round", en: "Additional revision round", nl: "Extra correctieronde" },
    ],
  },
  {
    group: "Video & motion",
    items: [
      { label: "Extra format", en: "Additional cut in another format or aspect ratio (square, vertical or story)", nl: "Extra versie in een ander formaat of een andere beeldverhouding (vierkant, verticaal of story)" },
      { label: "Subtitles", en: "Subtitles in one additional language", nl: "Ondertitels in één extra taal" },
      { label: "Voice-over", en: "Voice-over, recorded and mixed", nl: "Voice-over, opgenomen en gemixt" },
      { label: "Revision round", en: "Additional revision round", nl: "Extra correctieronde" },
    ],
  },
  {
    group: "Web & apps",
    items: [
      { label: "Extra page", en: "Additional page, written, designed and built", nl: "Extra pagina, geschreven, ontworpen en gebouwd" },
      { label: "Content migration", en: "Content migration: texts and images carried over from the current site", nl: "Inhoud overzetten: teksten en beelden overgenomen van de huidige site" },
      { label: "Hosting & care · year", en: "Hosting, domain and care for one year: updates, backups and small changes", nl: "Hosting, domein en onderhoud voor één jaar: updates, back-ups en kleine aanpassingen" },
      { label: "Training session", en: "Training session: updating the site or app yourself (one hour)", nl: "Opleidingsmoment: zelf de site of app aanpassen (één uur)" },
    ],
  },
  {
    group: "Any project",
    items: [
      { label: "Rush", en: "Rush delivery: first version within 72 hours", nl: "Spoedlevering: eerste versie binnen 72 uur" },
      { label: "Revision round", en: "Additional revision round", nl: "Extra correctieronde" },
    ],
  },
];

interface LinePresetsProps {
  /** The client's language: the description is written in it. */
  lang: PresetLang;
}

/** Drops a standard description into the first empty line; the price stays yours to type. */
export default function LinePresets({ lang }: LinePresetsProps) {
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
    <div className="mb-4 flex flex-col gap-y-2 text-[0.6rem] tracking-[0.24em] uppercase">
      <span className="text-taupe/70">Quick add · {lang === "nl" ? "Dutch" : "English"} lines</span>
      {PRESETS.map((group) => (
        <div key={group.group} className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-taupe/70">{group.group}</span>
          {group.items.map((preset) => (
            <button key={`${group.group}-${preset.label}`} type="button" onClick={() => fill(lang === "nl" ? preset.nl : preset.en)} className="text-champagne/80 transition-colors hover:text-champagne">
              + {preset.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
