import { NextResponse } from "next/server";
import {
  buildClinicInterestLead,
  deliverClinicInterestLead,
  type ClinicInterestLead,
} from "@/lib/leadDelivery";
import { checkRateLimit, clientIpFromHeaders } from "@/lib/rateLimit";
import { clinicInterestSchema } from "@/lib/validation";

export const runtime = "nodejs";

const GENERIC_FAILURE =
  "We could not record your request just now. Please try again in a moment.";

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

  let recordedServerSide = false;
  try {
    const { delivered } = await deliverClinicInterestLead(lead);
    recordedServerSide = delivered.includes("log");
  } catch (error) {
    // Never echo contact details into the log.
    console.error(
      "[clinic-interest] server-side storage failed",
      error instanceof Error ? `${error.name}: ${error.message}` : "unknown error"
    );
    return failure(502, GENERIC_FAILURE);
  }

  // In log mode the lead is already recorded and nothing should leave the
  // machine, so the browser is given nothing to forward.
  return NextResponse.json<SuccessBody>(
    recordedServerSide ? { ok: true } : { ok: true, forward: lead },
    { status: 200 }
  );
}
