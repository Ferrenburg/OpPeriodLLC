import { company } from "@/lib/brand";
import {
  GENERAL,
  contactSchema,
  fieldErrorsFrom,
  getContactOptions,
  rateLimited,
  resolveRecipient,
  sendContactEmail,
  verifyTurnstile,
} from "@/lib/contact";

const fallback = `Something went wrong on our end and your message wasn't sent. Please try again in a few minutes, or email ${company.email} directly.`;

function clientIp(request: Request): string {
  return request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "That request didn't look right. Please try again." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) },
      { status: 400 },
    );
  }
  const input = parsed.data;

  // A filled honeypot means a bot. Pretend it worked so it doesn't retry.
  if (input.website) return Response.json({ ok: true });

  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return Response.json(
      {
        ok: false,
        error: `That's a lot of messages in a short time. Please wait a few minutes, or email ${company.email}.`,
      },
      { status: 429 },
    );
  }

  try {
    if (!(await verifyTurnstile(input["cf-turnstile-response"], ip))) {
      return Response.json(
        { ok: false, error: "The spam check didn't go through. Please complete it and send again." },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("[contact] Turnstile check failed", error);
    return Response.json({ ok: false, error: fallback }, { status: 502 });
  }

  // An unknown project (an old link, or a retired project) goes to the general inbox.
  const known = getContactOptions().some((option) => option.value === input.project);
  const { to, projectName } = resolveRecipient(known ? input.project : GENERAL);
  if (!to) {
    console.error("[contact] CONTACT_EMAIL_DEFAULT is not set");
    return Response.json({ ok: false, error: fallback }, { status: 500 });
  }

  try {
    await sendContactEmail(input, to, projectName);
  } catch (error) {
    console.error("[contact] Sending failed", error);
    return Response.json({ ok: false, error: fallback }, { status: 502 });
  }

  return Response.json({ ok: true });
}
