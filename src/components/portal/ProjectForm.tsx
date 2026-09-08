import { createProjectAction, updateProjectAction } from "@/app/admin/actions";
import { buttonClass, Field, inputClass } from "@/components/portal/ui";
import { PROJECT_STATUSES, SERVICES, SERVICE_LABEL, STATUS_LABEL } from "@/lib/portal/labels";
import type { Project } from "@/lib/portal/types";

interface ProjectFormProps {
  project?: Project;
  clients: { id: string; name: string; company: string | null }[];
  defaultClientId?: string;
}

/** Create or edit a project. Status lives here too — one place to move a project along. */
export default function ProjectForm({ project, clients, defaultClientId }: ProjectFormProps) {
  const editing = Boolean(project);
  const selectClass = `${inputClass} cursor-pointer appearance-none bg-ink`;
  return (
    <form action={editing ? updateProjectAction : createProjectAction} className="max-w-2xl">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <div className="grid gap-8 md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="Title" htmlFor="title">
            <input id="title" name="title" required minLength={2} defaultValue={project?.title ?? ""} className={inputClass} />
          </Field>
        </div>
        <Field label="Client" htmlFor="client_id">
          <select id="client_id" name="client_id" required defaultValue={project?.client_id ?? defaultClientId ?? ""} className={selectClass}>
            <option value="" disabled className="bg-ink text-cream">
              Choose a client…
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id} className="bg-ink text-cream">
                {client.name}
                {client.company ? ` — ${client.company}` : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Service" htmlFor="service">
          <select id="service" name="service" defaultValue={project?.service ?? "memorial_film"} className={selectClass}>
            {SERVICES.map((service) => (
              <option key={service} value={service} className="bg-ink text-cream">
                {SERVICE_LABEL[service]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status" htmlFor="status">
          <select id="status" name="status" defaultValue={project?.status ?? "inquiry"} className={selectClass}>
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status} className="bg-ink text-cream">
                {STATUS_LABEL[status]}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-6">
          <Field label="Start" htmlFor="start_date">
            <input id="start_date" name="start_date" type="date" defaultValue={project?.start_date ?? ""} className={`${inputClass} [color-scheme:dark]`} />
          </Field>
          <Field label="Due" htmlFor="due_date">
            <input id="due_date" name="due_date" type="date" defaultValue={project?.due_date ?? ""} className={`${inputClass} [color-scheme:dark]`} />
          </Field>
        </div>
      </div>

      <div className="mt-8">
        <Field label="Description (visible to the client)" htmlFor="description">
          <textarea id="description" name="description" rows={4} defaultValue={project?.description ?? ""} className={`${inputClass} resize-none leading-relaxed`} />
        </Field>
      </div>

      <div className="mt-12">
        <button type="submit" className={buttonClass}>
          {editing ? "Save changes" : "Create project"}
        </button>
      </div>
    </form>
  );
}
