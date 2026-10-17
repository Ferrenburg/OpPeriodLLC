"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { ContactOption, FieldErrors } from "@/lib/contact";

type Props = {
  options: ContactOption[];
  email: string;
  // Set when Turnstile is turned on.
  turnstileSiteKey?: string;
};

type Result = { ok: true } | { ok: false; error: string; fieldErrors?: FieldErrors };

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: { sitekey: string; theme?: string }) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

const input =
  "mt-2 block w-full rounded-sm border-2 border-line bg-bg px-4 py-3 text-lg text-fg focus:border-fg focus:outline-none aria-invalid:border-accent";

// The inputs are never reset or re-rendered on an error, so whatever someone
// typed stays put until the message actually goes through.
export function ContactForm({ options, email, turnstileSiteKey }: Props) {
  const form = useRef<HTMLFormElement>(null);
  const select = useRef<HTMLSelectElement>(null);
  const alert = useRef<HTMLDivElement>(null);
  const done = useRef<HTMLDivElement>(null);
  const turnstileBox = useRef<HTMLDivElement>(null);
  const turnstileId = useRef<string | undefined>(undefined);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // ?project=<slug> preselects the dropdown. Read after load so the page can
  // stay static, and only if the visitor hasn't already picked something.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("project");
    const el = select.current;
    if (wanted && el && el.selectedIndex === 0 && options.some((o) => o.value === wanted)) el.value = wanted;
  }, [options]);

  useEffect(() => {
    if (sent) done.current?.focus();
  }, [sent]);

  // After a failed send, move focus to the first bad field, or to the error
  // message, so keyboard and screen reader users land on what needs fixing.
  useEffect(() => {
    if (!error) return;
    const firstBad = Object.keys(fieldErrors)[0];
    if (firstBad) form.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
    else alert.current?.focus();
  }, [error, fieldErrors]);

  useEffect(() => {
    return () => {
      if (turnstileId.current) window.turnstile?.remove(turnstileId.current);
    };
  }, []);

  function renderTurnstile() {
    if (!turnstileSiteKey || !turnstileBox.current || !window.turnstile) return;
    if (turnstileId.current) window.turnstile.remove(turnstileId.current);
    turnstileId.current = window.turnstile.render(turnstileBox.current, { sitekey: turnstileSiteKey, theme: "light" });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    setFieldErrors({});

    let result: Result;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
      });
      result = (await response.json()) as Result;
    } catch {
      result = {
        ok: false,
        error: `Couldn't reach the server. Check your connection and try again, or email ${email}.`,
      };
    }

    setSending(false);
    if (result.ok) {
      setSent(true);
      return;
    }
    setError(result.error);
    setFieldErrors(result.fieldErrors ?? {});
    // Turnstile tokens work once, so get a fresh one for the next try.
    if (turnstileId.current) window.turnstile?.reset(turnstileId.current);
  }

  if (sent) {
    return (
      <div ref={done} tabIndex={-1} role="status" className="border-l-4 border-accent-fill bg-surface p-6 focus:outline-none">
        <p className="font-display text-3xl font-bold uppercase italic">Message sent</p>
        <p className="mt-2 text-lg">Thanks for reaching out. We&apos;ll get back to you at the email you gave us.</p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setError(null);
          }}
          className="mt-4 font-semibold text-accent underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  const describe = (field: keyof FieldErrors) => (fieldErrors[field] ? `${field}-error` : undefined);
  const fieldError = (field: keyof FieldErrors) =>
    fieldErrors[field] && (
      <p id={`${field}-error`} className="mt-2 font-semibold text-accent">
        {fieldErrors[field]}
      </p>
    );

  return (
    <form ref={form} onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div ref={alert} tabIndex={-1} role="alert" className="border-l-4 border-accent-fill bg-surface p-4 font-semibold focus:outline-none">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="font-semibold">
            Name
          </label>
          <input id="name" name="name" type="text" required maxLength={100} autoComplete="name"
            aria-invalid={!!fieldErrors.name} aria-describedby={describe("name")} className={input} />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
          <input id="email" name="email" type="email" required maxLength={254} autoComplete="email"
            aria-invalid={!!fieldErrors.email} aria-describedby={describe("email")} className={input} />
          {fieldError("email")}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="font-semibold">
            Phone <span className="font-normal text-muted">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel"
            aria-invalid={!!fieldErrors.phone} aria-describedby={describe("phone")} className={input} />
          {fieldError("phone")}
        </div>
        <div>
          <label htmlFor="project" className="font-semibold">
            What&apos;s this about?
          </label>
          <select ref={select} id="project" name="project" defaultValue={options[0]?.value}
            aria-invalid={!!fieldErrors.project} aria-describedby={describe("project")} className={input}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldError("project")}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="font-semibold">
          Message
        </label>
        <textarea id="message" name="message" required rows={6} maxLength={5000}
          aria-invalid={!!fieldErrors.message} aria-describedby={describe("message")} className={input} />
        {fieldError("message")}
      </div>

      {/* Honeypot. Hidden from people and screen readers; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {turnstileSiteKey && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onReady={renderTurnstile}
          />
          <div ref={turnstileBox} />
        </>
      )}

      <button
        type="submit"
        disabled={sending}
        className="inline-flex min-h-12 items-center justify-center rounded-sm bg-accent-fill px-8 font-display text-lg font-semibold uppercase italic tracking-wide text-white hover:bg-accent-fill-hover disabled:opacity-60"
      >
        {sending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
