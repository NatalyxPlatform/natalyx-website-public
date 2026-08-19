import { NextResponse } from "next/server";
import {
  buildClinicInterestLead,
  deliverClinicInterestLead,
  LeadDeliveryConfigError,
} from "@/lib/leadDelivery";
import { checkRateLimit, clientIpFromHeaders } from "@/lib/rateLimit";
import { clinicInterestSchema } from "@/lib/validation";

export const runtime = "nodejs";

const GENERIC_FAILURE =
  "We could not record your request just now. Please try again in a moment.";

type SuccessBody = { ok: true };
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

  try {
    await deliverClinicInterestLead(lead);
  } catch (error) {
    // Never echo contact details into the log.
    console.error(
      "[clinic-interest] delivery failed",
      error instanceof Error ? `${error.name}: ${error.message}` : "unknown error"
    );
    return failure(
      error instanceof LeadDeliveryConfigError ? 500 : 502,
      GENERIC_FAILURE
    );
  }

  return NextResponse.json<SuccessBody>({ ok: true }, { status: 200 });
}
