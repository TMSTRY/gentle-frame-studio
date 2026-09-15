import { saveScreeningAction } from "@/app/admin/screenings/actions";
import { buttonClass, Field, inputClass } from "@/components/portal/ui";
import type { ProjectFile, Screening } from "@/lib/portal/types";

interface ScreeningFormProps {
  projectId: string;
  screening?: Screening;
  defaultTitle: string;
  videos: ProjectFile[];
  images: ProjectFile[];
}

/** Create or edit a screening room (admin). */
export default function ScreeningForm({ projectId, screening, defaultTitle, videos, images }: ScreeningFormProps) {
  const selectClass = `${inputClass} cursor-pointer appearance-none bg-ink`;
  const prefix = screening ? `s-${screening.id.slice(0, 8)}-` : "s-new-";
  return (
    <form action={saveScreeningAction} className="grid max-w-3xl gap-6 border-t border-line pt-6 md:grid-cols-2">
      <input type="hidden" name="project_id" value={projectId} />
      {screening ? <input type="hidden" name="id" value={screening.id} /> : null}
      <Field label="Film from the vault" htmlFor={`${prefix}file`}>
        <select id={`${prefix}file`} name="file_id" defaultValue={screening?.file_id ?? ""} className={selectClass}>
          <option value="" className="bg-ink text-cream">None, I’ll paste a link</option>
          {videos.map((f) => (
            <option key={f.id} value={f.id} className="bg-ink text-cream">{f.name}</option>
          ))}
        </select>
      </Field>
      <Field label="Or a link (YouTube, Vimeo, mp4)" htmlFor={`${prefix}url`}>
        <input id={`${prefix}url`} name="external_url" type="url" defaultValue={screening?.external_url ?? ""} placeholder="https://…" className={inputClass} />
      </Field>
      <Field label="Title" htmlFor={`${prefix}title`}>
        <input id={`${prefix}title`} name="title" required minLength={2} defaultValue={screening?.title ?? defaultTitle} className={inputClass} />
      </Field>
      <Field label="Subtitle (e.g. 1948 · 2026)" htmlFor={`${prefix}subtitle`}>
        <input id={`${prefix}subtitle`} name="subtitle" defaultValue={screening?.subtitle ?? ""} className={inputClass} />
      </Field>
      <div className="md:col-span-2">
        <Field label="Dedication under the film (optional)" htmlFor={`${prefix}dedication`}>
          <textarea id={`${prefix}dedication`} name="dedication" rows={2} defaultValue={screening?.dedication ?? ""} placeholder="For everyone who was there, and everyone who couldn’t be." className={`${inputClass} resize-none leading-relaxed`} />
        </Field>
      </div>
      <Field label="Poster image from the vault (optional)" htmlFor={`${prefix}poster`}>
        <select id={`${prefix}poster`} name="poster_file_id" defaultValue={screening?.poster_file_id ?? ""} className={selectClass}>
          <option value="" className="bg-ink text-cream">None</option>
          {images.map((f) => (
            <option key={f.id} value={f.id} className="bg-ink text-cream">{f.name}</option>
          ))}
        </select>
      </Field>
      <Field label="Viewing code (optional, the family shares it)" htmlFor={`${prefix}code`}>
        <input id={`${prefix}code`} name="passcode" defaultValue={screening?.passcode ?? ""} autoComplete="off" placeholder="e.g. rudy2026" className={inputClass} />
      </Field>
      <Field label="Closes on (optional)" htmlFor={`${prefix}expires`}>
        <input id={`${prefix}expires`} name="expires_at" type="date" defaultValue={screening?.expires_at ? screening.expires_at.slice(0, 10) : ""} className={inputClass} />
      </Field>
      <label className="flex items-center gap-3 self-end pb-3 text-sm text-taupe">
        <input type="checkbox" name="allow_download" defaultChecked={screening ? screening.allow_download : true} className="h-4 w-4 accent-[#e6d5b3]" />
        Visitors may download the film
      </label>
      <div className="md:col-span-2 md:text-right">
        <button type="submit" className={buttonClass}>{screening ? "Save changes" : "Open a screening room"}</button>
      </div>
    </form>
  );
}
