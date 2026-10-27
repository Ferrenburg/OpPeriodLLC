import "server-only";

import { z } from "zod";
import { company } from "./brand";
import { getListedProjects } from "./projects";

export const GENERAL = "general";

export type ContactOption = { value: string; label: string };

// "General / OpPeriod" first, then every listed project in its usual order.
export function getContactOptions(): ContactOption[] {
  return [
    { value: GENERAL, label: `General / ${company.name}` },
    ...getListedProjects().map((project) => ({ value: project.slug, label: project.name })),
  ];
}

const text = (max: number, label: string) =>
  z
    .string(`${label} is required.`)
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} is too long (${max} characters max).`);

export const contactSchema = z.object({
  name: text(100, "Name"),
  email: z
    .string("Email is required.")
    .trim()
    .min(1, "Email is required.")
    .max(254, "That email address is too long.")
    .pipe(z.email("Enter a valid email address, like name@example.com.")),
  phone: z
    .string()
    .trim()
    .max(40, "That phone number is too long.")
    .regex(/^[0-9+().\-\sxX]*$/, "Use only numbers, spaces, and ( ) + - in the phone number.")
    .optional()
    .default(""),
  project: z.string().default(GENERAL),
  message: text(5000, "Message"),
  // Honeypot: hidden from people, filled in by bots.
  website: z.string().optional().default(""),
  "cf-turnstile-response": z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type FieldErrors = Partial<Record<"name" | "email" | "phone" | "project" | "message", string>>;

export function fieldErrorsFrom(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof FieldErrors;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

// Projects with contactEmailKey: BOX_ALARM send to CONTACT_EMAIL_BOX_ALARM.
// Everything else, including a key whose variable isn't set, goes to
// CONTACT_EMAIL_DEFAULT.
export function resolveRecipient(projectSlug: string): { to: string | undefined; projectName: string } {
  const project = getListedProjects().find((p) => p.slug === projectSlug);
  const specific = project?.contactEmailKey ? process.env[`CONTACT_EMAIL_${project.contactEmailKey}`] : undefined;
  return {
    to: specific || process.env.CONTACT_EMAIL_DEFAULT,
    projectName: project?.name ?? company.name,
  };
}

// Basic per-IP limit. It lives in memory, so each Vercel instance keeps its
// own count and a cold start resets it. It slows down a single noisy sender;
// Turnstile is the real protection against bots.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

export function rateLimited(ip: string, now = Date.now()): boolean {
  const hits = (recent.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    recent.set(ip, hits);
    return true;
  }
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear(); // keep memory bounded
  return false;
}

// Turnstile turns on when both keys are set in the environment.
export function turnstileSiteKey(): string | undefined {
  return process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY
    ? process.env.TURNSTILE_SITE_KEY
    : undefined;
}

export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  if (!turnstileSiteKey()) return true;
  if (!token) return false;
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token, remoteip: ip }),
  });
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function sendContactEmail(input: ContactInput, to: string, projectName: string): Promise<void> {
  const subject = `[${projectName}] New message from ${oneLine(input.name)}`;
  const text = [
    `New message from the ${company.url.replace("https://", "")} contact form.`,
    "",
    `About: ${projectName}`,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "(not given)"}`,
    "",
    "Message:",
    input.message,
    "",
    "Hit reply to answer them directly.",
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      // Local development: print instead of sending.
      console.info(`[contact] RESEND_API_KEY not set, so not sending.\nTo: ${to}\nSubject: ${subject}\n\n${text}`);
      return;
    }
    throw new Error("RESEND_API_KEY is not set");
  }

  const from = process.env.CONTACT_FROM_EMAIL;
  if (!from) throw new Error("CONTACT_FROM_EMAIL is not set");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: input.email, subject, text }),
  });
  if (!response.ok) {
    throw new Error(`Resend returned ${response.status}: ${await response.text()}`);
  }
}
