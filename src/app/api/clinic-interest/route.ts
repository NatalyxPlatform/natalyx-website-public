import { NextResponse } from "next/server";
import {
  buildClinicInterestLead,
  deliverClinicInterestLead,
  isLogOnlyMode,
  type ClinicInterestLead,
} from "@/lib/leadDelivery";
import { checkRateLimit, clientIpFromHeaders } from "@/lib/rateLimit";
import { clinicInterestSchema } from "@/lib/validation";

export const runtime = "nodejs";

/**
 * `forward` is the record the browser must POST to Web3Forms, whose free plan
 * refuses server-to-server calls. The server still owns validation and builds
 * the payload; the browser only relays it, so it cannot widen or alter what is
 * sent. Absent when there is nothing to forward - a honeypot hit, or
 * LEAD_DELIVERY_MODE=log, where the lead is recorded server-side instead.
 */
type SuccessBody = { ok: true; forward?: ClinicInterestLead };
type FailureBody = {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string>;
};

function failure(
  status: number,
  error: string,
  fieldErrors?: Record<string, string>,
  headers?: HeadersInit
): NextResponse<FailureBody> {
  return NextResponse.json<FailureBody>(
    fieldErrors ? { ok: false, error, fieldErrors } : { ok: false, error },
    { status, headers }
  );
}

export async function POST(
  request: Request
): Promise<NextResponse<SuccessBody | FailureBody>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return failure(400, "Malformed request body.");
  }

  const rate = checkRateLimit(clientIpFromHeaders(request.headers));
  if (!rate.allowed) {
    return failure(
      429,
      "Too many requests from this connection. Please try again later.",
      undefined,
      { "Retry-After": String(rate.retryAfterSeconds) }
    );
  }

  // Honeypot first, so a bot never learns which field gave it away.
  const honeypot =
    body && typeof body === "object"
      ? (body as Record<string, unknown>).website_url
      : undefined;
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    // Looks normal to the bot, forwards nothing, sends no email.
    return NextResponse.json<SuccessBody>({ ok: true }, { status: 200 });
  }

  const parsed = clinicInterestSchema.safeParse(body);
  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;
    const fieldErrors: Record<string, string> = {};
    for (const [field, messages] of Object.entries(flattened)) {
      if (messages && messages.length > 0) fieldErrors[field] = messages[0];
    }
    return failure(
      400,
      "Please correct the highlighted fields.",
      fieldErrors
    );
  }

  const lead = buildClinicInterestLead(parsed.data, {
    userAgent: request.headers.get("user-agent"),
    referrer: request.headers.get("referer"),
  });

  // Storage is supplementary and must never block the email: an optional
  // dependency failing the primary delivery path is the outage this design
  // exists to avoid.
  //
  // Only channel names are logged. A provider error message can carry the
  // submitted data verbatim - a Postgres unique violation, for instance, quotes
  // the offending value - so the reason stays out of our logs. The provider's
  // own dashboard has the detail.
  try {
    const { failures } = await deliverClinicInterestLead(lead);
    if (failures.length > 0) {
      console.error(
        "[clinic-interest] server-side storage failed for channel(s):",
        failures.map((f) => f.channel).join(", ")
      );
    }
  } catch {
    // deliverClinicInterestLead is contracted not to throw. If it ever does,
    // that is a storage bug - still not a reason to withhold the email.
    console.error("[clinic-interest] server-side storage threw unexpectedly");
  }

  // Gated on the environment, never on whether the log write succeeded: a
  // failed log must not fall through to emailing a real lead during testing.
  return NextResponse.json<SuccessBody>(
    isLogOnlyMode() ? { ok: true } : { ok: true, forward: lead },
    { status: 200 }
  );
}
