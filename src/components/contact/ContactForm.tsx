"use client";

import { useActionState, useEffect, useState } from "react";
import { sendContactMessage, type ContactState } from "@/app/actions/contact";
import type { ContactFormCopy, ContactLang, ContactVariant } from "@/content/contact";
import { site } from "@/content/site";

interface ContactFormProps {
  variant: ContactVariant;
  lang: ContactLang;
  copy: ContactFormCopy;
}

const field =
  "w-full border-b border-line bg-transparent py-3 text-[0.95rem] font-light text-cream placeholder:text-taupe/60 transition-colors duration-500 focus:border-champagne focus:outline-none";
const label = "mb-1 block text-[0.62rem] tracking-[0.28em] text-taupe uppercase";
// Frosted plate: the mark keeps breathing behind it, and it deepens
// a touch on hover or while a field has focus, so the text reads.
const plate =
  "relative mx-auto w-full max-w-xl rounded-2xl border border-line bg-ink/35 px-7 py-9 backdrop-blur-[6px] transition-[background-color,border-color] duration-700 hover:bg-ink/55 focus-within:border-champagne/30 focus-within:bg-ink/60 md:px-11 md:py-11";

/**
 * Editorial contact form: underlined fields, one quiet button. The
 * memorial variant drops the topic picker and asks, gently, about a
 * date. Success replaces the form with a short acknowledgement.
 */
export default function ContactForm({ variant, lang, copy }: ContactFormProps) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContactMessage, {
    status: "idle",
  });
  // Set after mount so server and client markup match; 0 skips the timing check.
  const [renderedAt, setRenderedAt] = useState(0);
  useEffect(() => setRenderedAt(Date.now()), []);

  if (state.status === "sent") {
    return (
      <div className={`${plate} text-center`} role="status" aria-live="polite">
        <p className="font-display text-3xl font-medium text-cream italic">{copy.success.title}</p>
        <p className="mt-5 text-sm leading-relaxed text-taupe">{copy.success.body}</p>
      </div>
    );
  }

  return (
    <form action={action} className={`${plate} text-left`} noValidate={false}>
      <input type="hidden" name="variant" value={variant} />
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="ts" value={renderedAt} />
      {/* Honeypot — invisible to people, irresistible to bots */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <label htmlFor={`${variant}-name`} className={label}>
            {copy.name}
          </label>
          <input id={`${variant}-name`} name="name" type="text" required minLength={2} autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor={`${variant}-email`} className={label}>
            {copy.email}
          </label>
          <input id={`${variant}-email`} name="email" type="email" required autoComplete="email" className={field} />
        </div>
      </div>

      {copy.topic && copy.topicOptions ? (
        <div className="mt-8">
          <label htmlFor={`${variant}-topic`} className={label}>
            {copy.topic}
          </label>
          <select
            id={`${variant}-topic`}
            name="topic"
            defaultValue={copy.topicOptions[0]}
            className={`${field} cursor-pointer appearance-none bg-ink`}
          >
            {copy.topicOptions.map((option) => (
              <option key={option} value={option} className="bg-ink text-cream">
                {option}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {copy.date ? (
        <div className="mt-8">
          <label htmlFor={`${variant}-date`} className={label}>
            {copy.date}
          </label>
          <input id={`${variant}-date`} name="date" type="text" placeholder={copy.datePlaceholder} className={field} />
        </div>
      ) : null}

      <div className="mt-8">
        <label htmlFor={`${variant}-message`} className={label}>
          {copy.message}
        </label>
        <textarea
          id={`${variant}-message`}
          name="message"
          required
          minLength={2}
          rows={4}
          placeholder={copy.messagePlaceholder}
          className={`${field} resize-none leading-relaxed`}
        />
      </div>

      {state.status === "error" ? (
        <p className="mt-6 text-sm text-gold" role="alert">
          {copy.error}
        </p>
      ) : null}

      <div className="mt-12 flex flex-col items-center gap-6 text-center">
        <button
          type="submit"
          disabled={pending}
          className="inline-block rounded-full border border-champagne/50 px-10 py-5 text-[0.7rem] tracking-[0.3em] text-champagne uppercase transition-colors duration-500 hover:bg-champagne hover:text-ink disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? copy.sending : copy.submit}
        </button>
        <p className="text-[0.66rem] tracking-[0.24em] text-taupe uppercase">
          {copy.orWrite}{" "}
          <a href={`mailto:${site.email}`} className="link-line text-cream/70">
            {site.email}
          </a>
        </p>
      </div>
    </form>
  );
}
