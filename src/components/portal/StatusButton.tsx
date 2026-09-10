"use client";

import { setDocumentStatusAction } from "@/app/admin/documents/actions";
import { ghostButtonClass } from "@/components/portal/ui";
import type { DocumentStatus } from "@/lib/portal/labels";

interface StatusButtonProps {
  id: string;
  status: DocumentStatus;
  label: string;
  /** When set, the browser asks this before submitting. */
  confirmText?: string;
}

/** One-click status change; destructive ones ask first. */
export default function StatusButton({ id, status, label, confirmText }: StatusButtonProps) {
  return (
    <form
      action={setDocumentStatusAction}
      onSubmit={(event) => {
        if (confirmText && !window.confirm(confirmText)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className={ghostButtonClass}>
        {label}
      </button>
    </form>
  );
}
