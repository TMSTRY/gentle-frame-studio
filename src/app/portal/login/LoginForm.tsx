"use client";

import { useActionState } from "react";
import { sendMagicLink, type LoginState } from "@/app/portal/actions";

const initial: LoginState = { status: "idle" };

export default function LoginForm({ next, linkError }: { next: string; linkError: boolean }) {
  const [state, action, pending] = useActionState(sendMagicLink, initial);

  if (state.status === "sent") {
    return (
      <div className="border-t border-line pt-8">
        <p className="font-display text-2xl text-cream italic">Check your inbox.</p>
        <p className="mt-4 text-sm leading-relaxed text-taupe">
          If <span className="text-cream/80">{state.email}</span> is known to us, a sign-in link is on its way.
          It works once and expires after an hour.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="border-t border-line pt-8">
      <input type="hidden" name="next" value={next} />
      <label htmlFor="email" className="text-eyebrow block">
        Your email address
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
      {linkError ? (
        <p className="mt-4 text-sm text-gold">That link has expired or was already used, request a new one.</p>
      ) : null}
      {state.status === "error" ? <p className="mt-4 text-sm text-gold">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-10 inline-block rounded-full border border-champagne/50 px-8 py-4 text-[0.68rem] tracking-[0.3em] text-champagne uppercase transition-colors duration-500 hover:bg-champagne hover:text-ink disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send me a sign-in link"}
      </button>
      <p className="mt-6 text-xs leading-relaxed text-taupe">
        No password needed. We email you a one-time link.
        <br />
        <span className="text-taupe/80">Geen wachtwoord nodig, je krijgt een eenmalige inloglink per e-mail.</span>
      </p>
    </form>
  );
}
