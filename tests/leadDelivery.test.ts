import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildClinicInterestLead,
  CLINIC_INTEREST_TABLE,
  deliverClinicInterestLead,
  LeadDeliveryConfigError,
  LeadDeliveryError,
  resolveDeliveryChannels,
  WEB3FORMS_FALLBACK_ACCESS_KEY,
  web3formsAccessKey,
} from "@/lib/leadDelivery";
import { clinicInterestSchema } from "@/lib/validation";

const supabaseEnv = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role",
};

/** Swapped per test so no suite ever reaches a real Supabase project. */
let supabaseInsert: (
  row: unknown
) => Promise<{ error: { message: string } | null }>;

const supabaseFrom = vi.fn((table: string) => ({
  insert: (row: unknown) => supabaseInsert(row),
  table,
}));

vi.mock("@/lib/supabase", () => ({
  getSupabaseAdmin: () => ({ from: supabaseFrom }),
}));

function parsed(overrides: Record<string, unknown> = {}) {
  const result = clinicInterestSchema.safeParse({
    clinic_name: "Bayview Fertility Center",
    contact_name: "Dana Reyes",
    work_email: "Dana.Reyes@Bayview.example",
    phone: "+1 (415) 555-0142",
    consent_to_contact: true,
    website_url: "",
    ...overrides,
  });
  if (!result.success) throw new Error("fixture failed validation");
  return result.data;
}

/** Exactly what may leave this application. */
const EXPECTED_LEAD_KEYS = [
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
];

const RETIRED_PARTICIPANT_KEYS = [
  "role",
  "role_value",
  "journey_stage",
  "preferred_contact",
  "notes",
  "country",
  "region",
];

beforeEach(() => {
  supabaseFrom.mockClear();
  supabaseInsert = async () => {
    throw new Error("supabase channel not configured for this test");
  };
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("buildClinicInterestLead", () => {
  it("emits exactly the clinic-oriented payload keys", () => {
    const lead = buildClinicInterestLead(parsed());
    expect(Object.keys(lead).sort()).toEqual(EXPECTED_LEAD_KEYS);
  });

  it.each(RETIRED_PARTICIPANT_KEYS)(
    "never carries retired participant field %s",
    (field) => {
      const lead = buildClinicInterestLead(parsed());
      expect(lead).not.toHaveProperty(field);
    }
  );

  it("cannot be widened by extra keys on the parsed body", () => {
    const widened = {
      ...parsed(),
      role: "gestational_surrogate",
      notes: "patient has a history of",
    } as ReturnType<typeof parsed>;
    const lead = buildClinicInterestLead(widened);
    expect(Object.keys(lead).sort()).toEqual(EXPECTED_LEAD_KEYS);
  });

  it("stamps the lead type, schema version and source", () => {
    const lead = buildClinicInterestLead(parsed());
    expect(lead.lead_type).toBe("clinic_interest");
    expect(lead.schema_version).toBe(1);
    expect(lead.source).toBe("website_clinic_interest");
  });

  it("carries a normalized phone alongside what was typed", () => {
    const lead = buildClinicInterestLead(parsed());
    expect(lead.phone).toBe("+1 (415) 555-0142");
    expect(lead.phone_normalized).toBe("+14155550142");
  });

  it("lower-cases the delivered email", () => {
    expect(buildClinicInterestLead(parsed()).work_email).toBe(
      "dana.reyes@bayview.example"
    );
  });

  it("truncates request metadata and defaults it to null", () => {
    const withMeta = buildClinicInterestLead(parsed(), {
      userAgent: "x".repeat(900),
      referrer: null,
    });
    expect(withMeta.user_agent).toHaveLength(500);
    expect(withMeta.referrer).toBeNull();
  });

  it("stores only the origin and path of the referrer", () => {
    const lead = buildClinicInterestLead(parsed(), {
      referrer:
        "https://natalyx.health/clinic-interest?role=gestational_surrogate&utm=x#frag",
    });
    expect(lead.referrer).toBe("https://natalyx.health/clinic-interest");
  });

  it.each([
    "not a url",
    "javascript:alert(1)",
    "",
  ])("drops an unusable referrer %j rather than storing it", (referrer) => {
    expect(buildClinicInterestLead(parsed(), { referrer }).referrer).toBeNull();
  });

  it("targets the clinic table, never the historical participant table", () => {
    expect(CLINIC_INTEREST_TABLE).toBe("clinic_interest_leads");
    expect(CLINIC_INTEREST_TABLE).not.toBe("public_interest_leads");
  });
});

describe("resolveDeliveryChannels", () => {
  it("delivers via web3forms even with no configuration at all", () => {
    // The point of the built-in access key: an unconfigured deployment still
    // delivers leads instead of dropping them.
    expect(resolveDeliveryChannels({})).toEqual(["web3forms"]);
  });

  it.each([
    ["empty", {}],
    ["half-configured supabase", { SUPABASE_URL: "https://example.supabase.co" }],
    ["unrelated variables only", { NODE_ENV: "production" }],
  ])("never resolves an empty channel list (%s)", (_label, env) => {
    expect(resolveDeliveryChannels(env).length).toBeGreaterThan(0);
  });

  it("adds supabase when both supabase variables are present", () => {
    expect(
      resolveDeliveryChannels({
        SUPABASE_URL: "https://example.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY: "service-role",
      })
    ).toEqual(["supabase", "web3forms"]);
  });

  it("ignores a half-configured supabase", () => {
    expect(
      resolveDeliveryChannels({ SUPABASE_URL: "https://example.supabase.co" })
    ).toEqual(["web3forms"]);
  });

  it("uses the log channel only when explicitly asked", () => {
    expect(resolveDeliveryChannels({ LEAD_DELIVERY_MODE: "log" })).toEqual([
      "log",
    ]);
    expect(resolveDeliveryChannels({ LEAD_DELIVERY_MODE: "" })).toEqual([
      "web3forms",
    ]);
  });

  it("never falls back to the log channel when real channels are configured", () => {
    expect(
      resolveDeliveryChannels({ WEB3FORMS_ACCESS_KEY: "key" })
    ).not.toContain("log");
  });
});

describe("web3formsAccessKey", () => {
  it("uses the built-in key when the environment sets none", () => {
    expect(web3formsAccessKey({})).toBe(WEB3FORMS_FALLBACK_ACCESS_KEY);
  });

  it("lets the environment override the destination without a code change", () => {
    expect(web3formsAccessKey({ WEB3FORMS_ACCESS_KEY: "override" })).toBe(
      "override"
    );
  });

  it("ignores an empty override rather than sending to nowhere", () => {
    expect(web3formsAccessKey({ WEB3FORMS_ACCESS_KEY: "" })).toBe(
      WEB3FORMS_FALLBACK_ACCESS_KEY
    );
  });

  it("sends the resolved key to the provider", async () => {
    const fetchMock = vi.fn<
      (url: string, init: RequestInit) => Promise<Response>
    >(async () =>
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await deliverClinicInterestLead(buildClinicInterestLead(parsed()), {});
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.access_key).toBe(WEB3FORMS_FALLBACK_ACCESS_KEY);
  });
});

describe("test harness safety", () => {
  it("blocks any unstubbed network request", async () => {
    // Web3Forms is now always a resolved channel, so a delivery test that
    // forgot to stub fetch would post a lead to the live inbox. tests/setup.ts
    // makes that impossible; this asserts the guard is actually in place.
    await expect(fetch("https://api.web3forms.com/submit")).rejects.toThrow(
      /Unstubbed network request/
    );
  });

  it("leaves the guard in place after a test stubs and unstubs fetch", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("ok")));
    vi.unstubAllGlobals();
    await expect(fetch("https://api.web3forms.com/submit")).rejects.toThrow(
      /Unstubbed network request/
    );
  });
});

describe("deliverClinicInterestLead", () => {
  it("keeps the config guard for a future conditional fallback", () => {
    // Unreachable today by construction; asserted so the guard is not quietly
    // deleted as dead code.
    expect(new LeadDeliveryConfigError()).toBeInstanceOf(Error);
    expect(new LeadDeliveryConfigError().name).toBe("LeadDeliveryConfigError");
  });

  it("throws when the only configured channel fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 500 }))
    );
    await expect(
      deliverClinicInterestLead(buildClinicInterestLead(parsed()), {
        WEB3FORMS_ACCESS_KEY: "key",
      })
    ).rejects.toBeInstanceOf(LeadDeliveryError);
  });

  it("throws when the provider answers 200 with success:false", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ success: false, message: "bad key" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
      )
    );
    await expect(
      deliverClinicInterestLead(buildClinicInterestLead(parsed()), {
        WEB3FORMS_ACCESS_KEY: "key",
      })
    ).rejects.toBeInstanceOf(LeadDeliveryError);
  });

  it("delivers the exact lead payload to the provider", async () => {
    const fetchMock = vi.fn<
      (url: string, init: RequestInit) => Promise<Response>
    >(async () =>
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await deliverClinicInterestLead(buildClinicInterestLead(parsed()), {
      WEB3FORMS_ACCESS_KEY: "key",
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    for (const field of RETIRED_PARTICIPANT_KEYS) {
      expect(body).not.toHaveProperty(field);
    }
    expect(Object.keys(body).sort()).toEqual(
      [...EXPECTED_LEAD_KEYS, "access_key", "from_name", "subject"].sort()
    );
  });

  it("logs a redacted record on the log channel", async () => {
    const info = vi
      .spyOn(console, "info")
      .mockImplementation(() => {}) as unknown as {
      mock: { calls: [string, Record<string, unknown>][] };
    };
    await deliverClinicInterestLead(buildClinicInterestLead(parsed()), {
      LEAD_DELIVERY_MODE: "log",
    });

    const record = info.mock.calls[0][1] as Record<string, unknown>;
    expect(record.fields).toEqual(EXPECTED_LEAD_KEYS);
    expect(JSON.stringify(record)).not.toContain("role=");
    expect(record.work_email).toBe("d***@bayview.example");
    expect(record.phone).toBe("***42");
    expect(JSON.stringify(record)).not.toContain("dana.reyes@bayview.example");
    expect(JSON.stringify(record)).not.toContain("Dana Reyes");
    expect(JSON.stringify(record)).not.toContain("14155550142");
  });

  it("inserts into the clinic table via supabase", async () => {
    const insert = vi.fn<(row: unknown) => Promise<{ error: null }>>(
      async () => ({ error: null })
    );
    supabaseInsert = insert;

    const result = await deliverClinicInterestLead(
      buildClinicInterestLead(parsed()),
      supabaseEnv
    );

    expect(supabaseFrom).toHaveBeenCalledWith("clinic_interest_leads");
    expect(supabaseFrom).not.toHaveBeenCalledWith("public_interest_leads");
    expect(
      Object.keys(insert.mock.calls[0][0] as Record<string, unknown>).sort()
    ).toEqual(EXPECTED_LEAD_KEYS);
    expect(result.delivered).toEqual(["supabase"]);
  });

  it("appends a repeat submission instead of silently discarding it", async () => {
    const rows: unknown[] = [];
    supabaseInsert = async (row) => {
      rows.push(row);
      return { error: null };
    };

    await deliverClinicInterestLead(buildClinicInterestLead(parsed()), supabaseEnv);
    await deliverClinicInterestLead(
      buildClinicInterestLead(parsed({ phone: "+1 (415) 555 0199" })),
      supabaseEnv
    );

    // Same address, corrected phone: both must be recorded, because the page
    // told the sender both times that the submission was received.
    expect(rows).toHaveLength(2);
    expect((rows[0] as { phone_normalized: string }).phone_normalized).toBe(
      "+14155550142"
    );
    expect((rows[1] as { phone_normalized: string }).phone_normalized).toBe(
      "+14155550199"
    );
  });

  it("still succeeds when one of two channels fails", async () => {
    supabaseInsert = vi.fn(async () => ({ error: { message: "db down" } }));
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
      )
    );
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await deliverClinicInterestLead(
      buildClinicInterestLead(parsed()),
      { ...supabaseEnv, WEB3FORMS_ACCESS_KEY: "key" }
    );

    expect(result.delivered).toEqual(["web3forms"]);
    expect(warn).toHaveBeenCalled();
  });

  it("throws when both configured channels fail", async () => {
    supabaseInsert = vi.fn(async () => ({ error: { message: "db down" } }));
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 500 }))
    );

    await expect(
      deliverClinicInterestLead(buildClinicInterestLead(parsed()), {
        ...supabaseEnv,
        WEB3FORMS_ACCESS_KEY: "key",
      })
    ).rejects.toBeInstanceOf(LeadDeliveryError);
  });
});
