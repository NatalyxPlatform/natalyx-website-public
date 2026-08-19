import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ClinicInterestLead } from "@/lib/leadDelivery";
import { LeadDeliveryError } from "@/lib/leadDelivery";
import { RATE_LIMIT_MAX_REQUESTS, resetRateLimit } from "@/lib/rateLimit";

// Hoisted so the vi.mock factory (which runs first) can reach it.
const { deliver } = vi.hoisted(() => ({
  deliver: vi.fn<(lead: ClinicInterestLead) => Promise<unknown>>(),
}));

vi.mock("@/lib/leadDelivery", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/leadDelivery")>();
  return { ...actual, deliverClinicInterestLead: deliver };
});

const { POST } = await import("@/app/api/clinic-interest/route");

const validBody = {
  clinic_name: "Bayview Fertility Center",
  contact_name: "Dana Reyes",
  work_email: "dana.reyes@bayview.example",
  phone: "+1 (415) 555-0142",
  consent_to_contact: true,
  website_url: "",
};

let ipCounter = 0;

function post(
  body: unknown,
  { ip, raw }: { ip?: string; raw?: string } = {}
): Request {
  ipCounter += 1;
  return new Request("https://natalyx.health/api/clinic-interest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip ?? `203.0.113.${ipCounter}`,
      "user-agent": "vitest",
    },
    body: raw ?? JSON.stringify(body),
  });
}

async function json(response: Response) {
  return (await response.json()) as {
    ok?: boolean;
    error?: string;
    fieldErrors?: Record<string, string>;
  };
}

beforeEach(() => {
  resetRateLimit();
  deliver.mockReset();
  // Production default: no server-side storage configured, so the browser
  // is asked to forward the lead to Web3Forms.
  deliver.mockResolvedValue({ delivered: [] });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/clinic-interest — happy path", () => {
  it("accepts a complete clinic submission", async () => {
    const response = await POST(post(validBody));
    expect(response.status).toBe(200);
    expect((await json(response)).ok).toBe(true);
    expect(deliver).toHaveBeenCalledTimes(1);
  });

  it("delivers exactly the clinic-oriented fields", async () => {
    await POST(post(validBody));
    const lead = deliver.mock.calls[0][0];
    expect(Object.keys(lead).sort()).toEqual([
      "clinic_name",
      "consent_to_contact",
      "contact_name",
      "lead_type",
      "phone",
      "phone_normalized",
      "referrer",
      "schema_version",
      "source",
      "user_agent",
      "work_email",
    ]);
    expect(lead.lead_type).toBe("clinic_interest");
    expect(lead.schema_version).toBe(1);
  });

  it("normalizes the email and phone that get delivered", async () => {
    await POST(
      post({
        ...validBody,
        work_email: "  Dana.Reyes@Bayview.EXAMPLE ",
        phone: " (415) 555-0142 ",
      })
    );
    const lead = deliver.mock.calls[0][0];
    expect(lead.work_email).toBe("dana.reyes@bayview.example");
    expect(lead.phone_normalized).toBe("4155550142");
  });
});

describe("POST /api/clinic-interest — what the browser must forward", () => {
  it("hands back the built lead for the browser to relay", async () => {
    const response = await POST(post(validBody));
    const body = (await response.json()) as {
      ok: boolean;
      forward?: Record<string, unknown>;
    };
    expect(body.ok).toBe(true);
    expect(Object.keys(body.forward ?? {}).sort()).toEqual([
      "clinic_name",
      "consent_to_contact",
      "contact_name",
      "lead_type",
      "phone",
      "phone_normalized",
      "referrer",
      "schema_version",
      "source",
      "user_agent",
      "work_email",
    ]);
  });

  it("forwards the same record it handed to server-side storage", async () => {
    const response = await POST(post(validBody));
    const body = (await response.json()) as { forward?: unknown };
    expect(body.forward).toEqual(deliver.mock.calls[0][0]);
  });

  it("forwards nothing on a honeypot hit, so no email is sent", async () => {
    const response = await POST(
      post({ ...validBody, website_url: "http://spam.example" })
    );
    const body = (await response.json()) as { ok: boolean; forward?: unknown };
    expect(body.ok).toBe(true);
    expect(body.forward).toBeUndefined();
  });

  it("forwards nothing in log mode, so nothing leaves the machine", async () => {
    deliver.mockResolvedValue({ delivered: ["log"] });
    const response = await POST(post(validBody));
    const body = (await response.json()) as { ok: boolean; forward?: unknown };
    expect(body.ok).toBe(true);
    expect(body.forward).toBeUndefined();
  });

  it("forwards when only storage-less delivery ran", async () => {
    deliver.mockResolvedValue({ delivered: [] });
    const response = await POST(post(validBody));
    const body = (await response.json()) as { forward?: unknown };
    expect(body.forward).toBeDefined();
  });

  it.each([
    "role",
    "role_value",
    "journey_stage",
    "notes",
  ])("never forwards retired participant field %s", async (field) => {
    const response = await POST(post({ ...validBody, [field]: "intended_parent" }));
    const body = (await response.json()) as { forward?: Record<string, unknown> };
    expect(body.forward).not.toHaveProperty(field);
  });
});

describe("POST /api/clinic-interest — required fields", () => {
  it.each([
    ["clinic_name", "Clinic name is required"],
    ["contact_name", "Your name is required"],
    ["work_email", "Work email is required"],
    ["phone", "Phone number is required"],
  ])("refuses a submission missing %s and delivers nothing", async (field, message) => {
    const response = await POST(post({ ...validBody, [field]: "" }));
    expect(response.status).toBe(400);
    const body = await json(response);
    expect(body.ok).toBe(false);
    expect(body.fieldErrors?.[field]).toBe(message);
    expect(deliver).not.toHaveBeenCalled();
  });

  it("refuses a submission without consent", async () => {
    const response = await POST(
      post({ ...validBody, consent_to_contact: false })
    );
    expect(response.status).toBe(400);
    expect(deliver).not.toHaveBeenCalled();
  });

  it.each(["nope", "a@b", "dana reyes@bayview.example"])(
    "refuses invalid email %j on the server even if a client skipped it",
    async (work_email) => {
      const response = await POST(post({ ...validBody, work_email }));
      expect(response.status).toBe(400);
      expect((await json(response)).fieldErrors?.work_email).toBe(
        "Enter a valid work email address"
      );
      expect(deliver).not.toHaveBeenCalled();
    }
  );

  it.each(["12", "abc", "1234567890123456"])(
    "refuses invalid phone %j on the server",
    async (phone) => {
      const response = await POST(post({ ...validBody, phone }));
      expect(response.status).toBe(400);
      expect((await json(response)).fieldErrors?.phone).toBeDefined();
      expect(deliver).not.toHaveBeenCalled();
    }
  );

  it("refuses a malformed body", async () => {
    const response = await POST(post(null, { raw: "{not json" }));
    expect(response.status).toBe(400);
    expect(deliver).not.toHaveBeenCalled();
  });
});

describe("POST /api/clinic-interest — retired participant fields", () => {
  it.each([
    "role",
    "role_value",
    "journey_stage",
    "preferred_contact",
    "notes",
    "country",
    "region",
  ])("strips %s rather than delivering it", async (field) => {
    await POST(post({ ...validBody, [field]: "intended_parent" }));
    expect(deliver).toHaveBeenCalledTimes(1);
    expect(deliver.mock.calls[0][0]).not.toHaveProperty(field);
  });

  it("never lets a retired role reach the lead through the Referer header", async () => {
    const request = new Request("https://natalyx.health/api/clinic-interest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "203.0.113.200",
        referer: "https://natalyx.health/clinic-interest?role=gestational_surrogate",
      },
      body: JSON.stringify(validBody),
    });
    await POST(request);

    const lead = deliver.mock.calls[0][0];
    expect(lead.referrer).not.toContain("role=");
    expect(lead.referrer).not.toContain("gestational_surrogate");
  });

  it.each([
    "intended_parent",
    "gestational_surrogate",
    "donor",
    "not_sure",
  ])("no retired identifier %s appears anywhere in the delivered lead", async (identifier) => {
    const request = new Request("https://natalyx.health/api/clinic-interest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "203.0.113.201",
        referer: `https://natalyx.health/clinic-interest?role=${identifier}&utm_source=x`,
        "user-agent": "vitest",
      },
      body: JSON.stringify({ ...validBody, role: identifier }),
    });
    await POST(request);

    expect(JSON.stringify(deliver.mock.calls[0][0])).not.toContain(identifier);
  });

  it("accepts the submission without a role field at all", async () => {
    const response = await POST(post(validBody));
    expect(response.status).toBe(200);
    expect(JSON.stringify(deliver.mock.calls[0][0])).not.toContain(
      "gestational_surrogate"
    );
  });
});

describe("POST /api/clinic-interest — spam and abuse controls", () => {
  it("answers a honeypot submission normally but delivers nothing", async () => {
    const response = await POST(
      post({ ...validBody, website_url: "http://spam.example" })
    );
    expect(response.status).toBe(200);
    expect(await json(response)).toEqual({ ok: true });
    expect(deliver).not.toHaveBeenCalled();
  });

  it("throttles repeated submissions from one address", async () => {
    const ip = "198.51.100.7";
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i += 1) {
      const allowed = await POST(post(validBody, { ip }));
      expect(allowed.status).toBe(200);
    }

    const blocked = await POST(post(validBody, { ip }));
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(deliver).toHaveBeenCalledTimes(RATE_LIMIT_MAX_REQUESTS);
  });

  it("keeps separate budgets per client address", async () => {
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i += 1) {
      await POST(post(validBody, { ip: "198.51.100.8" }));
    }
    const other = await POST(post(validBody, { ip: "198.51.100.9" }));
    expect(other.status).toBe(200);
  });

  it("reads the client address from the first x-forwarded-for entry", async () => {
    const chain = "198.51.100.10, 10.0.0.1, 10.0.0.2";
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i += 1) {
      await POST(post(validBody, { ip: chain }));
    }
    const blocked = await POST(post(validBody, { ip: "198.51.100.10" }));
    expect(blocked.status).toBe(429);
  });
});

describe("POST /api/clinic-interest — failures never become success", () => {
  it("answers 502 when server-side storage fails", async () => {
    deliver.mockRejectedValue(
      new LeadDeliveryError([{ channel: "supabase", reason: "db down" }])
    );
    const response = await POST(post(validBody));
    expect(response.status).toBe(502);
    expect((await json(response)).ok).toBe(false);
  });

  it("never returns ok:true on a delivery failure", async () => {
    deliver.mockRejectedValue(new Error("boom"));
    const response = await POST(post(validBody));
    expect(response.ok).toBe(false);
    expect((await json(response)).ok).not.toBe(true);
  });

  it("does not log submitted contact details when delivery fails", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    deliver.mockRejectedValue(new Error("boom"));
    await POST(post(validBody));

    const logged = JSON.stringify(errorLog.mock.calls);
    expect(logged).not.toContain("dana.reyes@bayview.example");
    expect(logged).not.toContain("4155550142");
    expect(logged).not.toContain("Dana Reyes");
  });

  it("puts contact details only inside `forward`, never elsewhere", async () => {
    // The success response legitimately carries the payload: it is the
    // submitter's own data, going back to their own browser to be relayed.
    // Nothing else in the body may contain it, and no failure response may.
    const ok = await POST(post(validBody));
    const body = (await ok.json()) as Record<string, unknown>;
    const { forward, ...rest } = body;
    expect(forward).toBeDefined();
    expect(JSON.stringify(rest)).not.toContain("bayview.example");

    deliver.mockRejectedValue(new Error("boom"));
    const failed = await POST(post(validBody));
    expect(JSON.stringify(await json(failed))).not.toContain("bayview.example");
  });
});
