"use client";

import { purgeAction, restoreAction, trashAction } from "@/app/admin/trash/actions";
import { ghostButtonClass } from "@/components/portal/ui";

interface TrashButtonProps {
  kind: "client" | "project" | "document";
  id: string;
  mode: "trash" | "restore" | "purge";
  label: string;
  confirmText?: string;
}

const ACTIONS = { trash: trashAction, restore: restoreAction, purge: purgeAction };

/** Move to trash, restore, or purge; the destructive ones ask first. */
export default function TrashButton({ kind, id, mode, label, confirmText }: TrashButtonProps) {
  return (
    <form
      action={ACTIONS[mode]}
      onSubmit={(event) => {
        if (confirmText && !window.confirm(confirmText)) event.preventDefault();
      }}
    >
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={`${ghostButtonClass} ${mode === "purge" ? "hover:text-gold" : ""}`}>
        {label}
      </button>
    </form>
  );
}
