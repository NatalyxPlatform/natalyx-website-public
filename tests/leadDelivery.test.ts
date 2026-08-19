import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildClinicInterestLead,
  CLINIC_INTEREST_TABLE,
  deliverClinicInterestLead,
  isLogOnlyMode,
  resolveDeliveryChannels,
} from "@/lib/leadDelivery";
import {
  resolveWeb3FormsAccessKey,
  WEB3FORMS_BUILTIN_ACCESS_KEY,
} from "@/lib/constants";
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
  it("resolves no server channel when nothing is configured", () => {
    // Legitimate: email delivery happens in the browser, because Web3Forms
    // rejects server-to-server calls on the free plan.
    expect(resolveDeliveryChannels({})).toEqual([]);
  });

  it("never lists web3forms as a server channel", () => {
    for (const env of [
      {},
      { WEB3FORMS_ACCESS_KEY: "key" },
      { ...supabaseEnv, WEB3FORMS_ACCESS_KEY: "key" },
    ]) {
      expect(resolveDeliveryChannels(env)).not.toContain("web3forms");
    }
  });

  it("uses supabase when both supabase variables are present", () => {
    expect(resolveDeliveryChannels(supabaseEnv)).toEqual(["supabase"]);
  });

  it("ignores a half-configured supabase", () => {
    expect(
      resolveDeliveryChannels({ SUPABASE_URL: "https://example.supabase.co" })
    ).toEqual([]);
  });

  it("uses the log channel only when explicitly asked", () => {
    expect(resolveDeliveryChannels({ LEAD_DELIVERY_MODE: "log" })).toEqual([
      "log",
    ]);
    expect(resolveDeliveryChannels({ LEAD_DELIVERY_MODE: "" })).toEqual([]);
  });
});

describe("resolveWeb3FormsAccessKey", () => {
  it.each([undefined, "", "   ", "\t\n"])(
    "falls back to the built-in key for %j",
    (value) => {
      // `??` would pass a blank key through and fail every submission.
      expect(resolveWeb3FormsAccessKey(value)).toBe(
        WEB3FORMS_BUILTIN_ACCESS_KEY
      );
    }
  );

  it("uses a real override, trimmed", () => {
    expect(resolveWeb3FormsAccessKey("  other-key  ")).toBe("other-key");
  });
});

describe("isLogOnlyMode", () => {
  it("is true only for an explicit log mode", () => {
    expect(isLogOnlyMode({ LEAD_DELIVERY_MODE: "log" })).toBe(true);
    expect(isLogOnlyMode({})).toBe(false);
    expect(isLogOnlyMode({ LEAD_DELIVERY_MODE: "" })).toBe(false);
    expect(isLogOnlyMode(supabaseEnv)).toBe(false);
  });
});

describe("test harness safety", () => {
  it("blocks any unstubbed network request", async () => {
    // Nothing in the test suite may reach the network. tests/setup.ts enforces
    // it; this asserts the guard is actually in place.
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
  it("is a no-op when no server channel is configured", async () => {
    // Not an error: the browser still delivers by email afterwards.
    await expect(
      deliverClinicInterestLead(buildClinicInterestLead(parsed()), {})
    ).resolves.toEqual({ delivered: [], failures: [] });
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

  it("reports a supabase failure without throwing", async () => {
    // Storage must never fail the submission: the browser still has to deliver
    // the lead by email. An optional dependency taking down the primary path is
    // the outage this design exists to prevent.
    supabaseInsert = vi.fn(async () => ({ error: { message: "db down" } }));
    const outcome = await deliverClinicInterestLead(
      buildClinicInterestLead(parsed()),
      supabaseEnv
    );
    expect(outcome.delivered).toEqual([]);
    expect(outcome.failures).toEqual([
      { channel: "supabase", reason: "db down" },
    ]);
  });

  it("never throws, whatever the storage layer does", async () => {
    supabaseInsert = vi.fn(async () => {
      throw new Error("connection reset");
    });
    await expect(
      deliverClinicInterestLead(buildClinicInterestLead(parsed()), supabaseEnv)
    ).resolves.toMatchObject({ delivered: [] });
  });

});
