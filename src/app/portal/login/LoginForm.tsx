"use client";

import { useActionState } from "react";
import { sendMagicLink, type LoginState } from "@/app/portal/actions";
import { ui, type PortalLang } from "@/lib/portal/i18n";

const initial: LoginState = { status: "idle" };

export default function LoginForm({ next, linkError, lang }: { next: string; linkError: boolean; lang: PortalLang }) {
  const [state, action, pending] = useActionState(sendMagicLink, initial);
  const t = ui(lang).login;

  if (state.status === "sent") {
    return (
      <div className="border-t border-line pt-8">
        <p className="font-display text-2xl text-cream italic">{t.checkInbox}</p>
        <p className="mt-4 text-sm leading-relaxed text-taupe">{t.sentBody(state.email ?? "")}</p>
      </div>
    );
  }

  return (
    <form action={action} className="border-t border-line pt-8">
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="lang" value={lang} />
      <label htmlFor="email" className="text-eyebrow block">
        {t.emailLabel}
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        defaultValue={state.email}
        placeholder="name@example.com"
        className="mt-4 w-full border-b border-champagne/40 bg-transparent py-3 font-light text-cream placeholder:text-taupe/60 focus:border-champagne focus:outline-none"
      />
      {linkError ? <p className="mt-4 text-sm text-gold">{t.expired}</p> : null}
      {state.status === "error" ? <p className="mt-4 text-sm text-gold">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-10 inline-block rounded-full border border-champagne/50 px-8 py-4 text-[0.68rem] tracking-[0.3em] text-champagne uppercase transition-colors duration-500 hover:bg-champagne hover:text-ink disabled:opacity-50"
      >
        {pending ? t.sending : t.send}
      </button>
      <p className="mt-6 text-xs leading-relaxed text-taupe">{t.noPassword}</p>
    </form>
  );
}
