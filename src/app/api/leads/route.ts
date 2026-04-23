import { NextRequest, NextResponse } from "next/server";
import { leadFormSchema } from "@/lib/validation";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  // Honeypot check: silent success if the hidden field is filled.
  if (
    body &&
    typeof body === "object" &&
    "website_url" in body &&
    body.website_url
  ) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // Validate and transform
  const result = leadFormSchema.safeParse(body);

  if (!result.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join(".") || "root";
      if (!errors[field]) errors[field] = [];
      errors[field].push(issue.message);
    }
    return NextResponse.json(
      { success: false, errors },
      { status: 400 }
    );
  }

  const { website_url: _hp, journey_stage, preferred_contact, ...data } =
    result.data;

  // Normalise optional enum/string fields — convert empty strings to null
  const payload = {
    ...data,
    journey_stage: journey_stage || null,
    preferred_contact: preferred_contact || null,
    notes: data.notes || null,
    phone: data.phone || null,
    country: data.country || null,
    region: data.region || null,
    user_agent: request.headers.get("user-agent"),
    referrer: request.headers.get("referer"),
    source: "website" as const,
  };

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("public_interest_leads")
      .insert(payload);

    if (error) {
      // Postgres unique violation on email + role. Treat duplicates as success
      // so people are not blocked by repeated interest submissions.
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: true,
            duplicate: true,
          },
          { status: 200 }
        );
      }

      console.error("[leads] Supabase insert error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Something went wrong. Please try again or contact us directly.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[leads] Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong. Please try again or contact us directly.",
      },
      { status: 500 }
    );
  }
}

// Reject all non-POST methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
