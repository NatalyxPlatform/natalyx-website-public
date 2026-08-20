import { describe, expect, it } from "vitest";
import {
  findInCode,
  findMatches,
  prose,
  read,
  sources,
} from "./helpers/sources";

/**
 * The repository reader lives in ./helpers/sources so this suite and the
 * positioning suite walk the same files the same way. Two private walkers
 * could pass here while missing a file there, and the absence guards below are
 * only as good as the file list they run over.
 */

/** Files that exist to bring visitors into the interest flow. */
const ACQUISITION_SURFACES = [
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/components/landing/Hero.tsx",
  "src/components/landing/ValueCards.tsx",
  "src/components/landing/HowItWorks.tsx",
  "src/components/landing/WhyNatalyx.tsx",
  "src/components/landing/FAQ.tsx",
  "src/components/landing/CTABanner.tsx",
  "src/components/layout/Header.tsx",
  "src/components/layout/Footer.tsx",
  "src/app/clinic-interest/page.tsx",
];

describe("no retired participant acquisition path survives", () => {
  it("links to the retired /signup route nowhere in the app", () => {
    // src/middleware.ts must name /signup: it is the redirect source, not a
    // link. Anywhere else is a live participant entry point.
    expect(
      findInCode(/["'`]\/signup/).filter((p) => p !== "src/middleware.ts")
    ).toEqual([]);
  });

  it("has no role-preselection links", () => {
    expect(findInCode(/\?role=/)).toEqual([]);
  });

  it.each([
    "intended_parent",
    "gestational_surrogate",
    "not_sure",
    "role_value",
    "journey_stage",
    "preferred_contact",
    "ROLE_OPTIONS",
    "JOURNEY_STAGE_OPTIONS",
    "PREFERRED_CONTACT_OPTIONS",
  ])("carries no retired participant identifier %s", (identifier) => {
    expect(findInCode(new RegExp(identifier))).toEqual([]);
  });

  it("keeps exactly one interest form component", () => {
    const forms = sources.filter(({ path }) => /Form\.tsx$/.test(path));
    expect(forms.map((f) => f.path)).toEqual([
      "src/components/clinic-interest/ClinicInterestForm.tsx",
    ]);
  });

  it("keeps exactly one interest page and one submission endpoint", () => {
    const pages = sources
      .filter(({ path }) => /^src\/app\/.*page\.tsx$/.test(path))
      .map((f) => f.path)
      .sort();
    expect(pages).toEqual([
      "src/app/clinic-interest/page.tsx",
      "src/app/page.tsx",
    ]);

    const routes = sources
      .filter(({ path }) => /^src\/app\/.*route\.ts$/.test(path))
      .map((f) => f.path);
    expect(routes).toEqual(["src/app/api/clinic-interest/route.ts"]);
  });

  it("redirects the stale /signup link permanently, without its query", () => {
    const middleware = read("src/middleware.ts");
    expect(middleware).toMatch(/matcher:\s*"\/signup"/);
    expect(middleware).toMatch(/pathname = "\/clinic-interest"/);
    expect(middleware).toMatch(/url\.search = ""/);
    expect(middleware).toMatch(/308/);

    // A config redirect would forward ?role=... into the clinic flow.
    expect(read("next.config.ts")).not.toMatch(/async redirects\(/);
  });

  it("never calls Web3Forms from server code", () => {
    // Web3Forms rejects server-to-server calls (403, free plan). The browser
    // must be the caller; the server route must never try. Comments explaining
    // that are fine, so this scans code only.
    expect(findInCode(/api\.web3forms\.com/)).toEqual(["src/lib/constants.ts"]);
    for (const path of [
      "src/lib/leadDelivery.ts",
      "src/app/api/clinic-interest/route.ts",
    ]) {
      const code = sources.find((f) => f.path === path)?.code ?? "";
      expect(code, path).not.toMatch(/web3forms/i);
    }
  });

  it("keeps the browser a relay, never the author of the payload", () => {
    // The browser sends what the server handed it. If a client component could
    // build the lead itself, server-side validation would be bypassable.
    const form = read("src/components/clinic-interest/ClinicInterestForm.tsx");
    expect(form).not.toMatch(/leadDelivery|buildClinicInterestLead/);
    expect(form).toMatch(/data\.forward/);
  });

  it("holds the access key in one place, marked client-visible", () => {
    // Public by Web3Forms' design and genuinely needed in the browser, so
    // NEXT_PUBLIC_ is correct here - but it must not be duplicated around.
    expect(findMatches(/3bf87d87-e4b2-459a-aad2-549e24d5e1e2/)).toEqual([
      "src/lib/constants.ts",
    ]);
    expect(read("src/lib/constants.ts")).toMatch(
      /NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY/
    );
  });
});

describe("acquisition copy speaks to clinics", () => {
  it.each([
    ["Register interest", /Register interest/i],
    ["Join the waitlist", /waitlist/i],
    ["Get started", /Get started/i],
    ["Join as ...", /Join as\b/i],
    ["You are on the list", /on the list/i],
    ["Sign up", /\bSign ?up\b/i],
  ])("uses no participant CTA copy: %s", (_label, pattern) => {
    const offenders = sources
      .filter(({ path }) => ACQUISITION_SURFACES.includes(path))
      .filter(({ text }) => pattern.test(text))
      .map(({ path }) => path);
    expect(offenders).toEqual([]);
  });

  it.each([
    "src/components/landing/Hero.tsx",
    "src/components/landing/CTABanner.tsx",
    "src/components/layout/Footer.tsx",
  ])("%s carries the clinic CTA", (path) => {
    expect(read(path)).toMatch(/Register your clinic&apos;s interest/);
  });

  it("the header CTA is clinic-directed", () => {
    expect(read("src/components/layout/Header.tsx")).toMatch(
      /Register your clinic/
    );
  });

  it.each(ACQUISITION_SURFACES.filter((p) => /landing|layout\/|clinic-interest/.test(p)))(
    "%s routes CTAs through the shared clinic-interest path",
    (path) => {
      const text = read(path);
      const hasCta = /Register your clinic/.test(text);
      if (hasCta) {
        expect(text).toMatch(/CLINIC_INTEREST_PATH|ClinicInterestForm/);
      }
    }
  );

  it("nav anchors point at the clinic sections that exist", () => {
    const anchors = new Set<string>();
    for (const path of [
      "src/components/layout/Header.tsx",
      "src/components/layout/Footer.tsx",
    ]) {
      for (const match of read(path).matchAll(/href="\/#([a-z-]+)"/g)) {
        anchors.add(match[1]);
      }
    }

    const ids = new Set<string>();
    for (const { text } of sources) {
      for (const match of text.matchAll(/\bid="([a-z-]+)"/g)) {
        ids.add(match[1]);
      }
    }

    expect([...anchors].sort()).toEqual([
      "faq",
      "for-clinics",
      "how-it-works",
      "team",
    ]);
    for (const anchor of anchors) {
      expect(ids.has(anchor), `#${anchor} has no matching section id`).toBe(
        true
      );
    }
  });
});

describe("metadata describes clinic-first infrastructure", () => {
  // What the metadata *says* is asserted against the exported values in
  // tests/positioning.test.ts (P12/P13). What this suite still owns is that no
  // retired acquisition positioning survives in it, and that the page composes
  // the strings instead of holding a second copy free to drift.
  const metadataSources = () => [
    { path: "src/lib/positioning.ts", text: prose("src/lib/positioning.ts") },
    { path: "src/app/layout.tsx", text: prose("src/app/layout.tsx") },
    {
      path: "src/app/clinic-interest/page.tsx",
      text: prose("src/app/clinic-interest/page.tsx"),
    },
  ];

  it.each([
    /fertility agency/i,
    /ART marketplace/i,
    /marketplace/i,
    /Register interest in Natalyx/i,
  ])("drops the stale positioning %s", (pattern) => {
    expect(
      metadataSources()
        .filter(({ text }) => pattern.test(text))
        .map(({ path }) => path)
    ).toEqual([]);
  });

  it("fills every title and description slot from the shared definition", () => {
    const layout = read("src/app/layout.tsx");
    // Page title, OG title, Twitter title.
    expect(layout.match(/title: SITE_TITLE/g)).toHaveLength(3);
    // Page description, plus the OG and Twitter card descriptions.
    expect(layout).toMatch(/description: SITE_DESCRIPTION/);
    expect(layout.match(/description: SOCIAL_DESCRIPTION/g)).toHaveLength(2);
  });

  it("the interest page metadata is clinic-facing", () => {
    const page = read("src/app/clinic-interest/page.tsx");
    expect(page).toMatch(/title: CLINIC_INTEREST_TITLE/);
    expect(page).toMatch(/description: CLINIC_INTEREST_DESCRIPTION/);
  });
});

describe("claims stay inside what the repository can support", () => {
  it.each([
    ["PHI readiness", /PHI[-\s]?ready/i],
    ["HIPAA compliance", /HIPAA[-\s]?compliant/i],
    ["clinical validation", /clinically[-\s]validated/i],
    ["FDA clearance", /FDA[-\s]?(approved|cleared)/i],
    [
      "existing clinic adoption",
      /partner clinics|clinics (already )?(use|rely on|trust)\b|used by (fertility )?clinics|our clinics|customers use/i,
    ],
    ["general availability", /\bis generally available\b/i],
    ["EMR/EHR integration", /(integrat\w+)[^.]{0,40}\b(EMR|EHR)\b/i],
    ["replacing professionals", /replaces?\s+(your\s+)?(staff|coordinators|lawyers|attorneys|doctors)/i],
    ["deciding for clinicians", /(we|natalyx)\s+(decides?|approves?|determines? eligibility)/i],
  ])("makes no claim of %s", (_label, pattern) => {
    expect(findMatches(pattern)).toEqual([]);
  });

  it("names no clinic as an existing customer", () => {
    expect(findMatches(/\b(Kaiser|CCRM|Shady Grove|Boston IVF|RMA)\b/)).toEqual(
      []
    );
  });

  it("states that the product is not generally available", () => {
    // Phrasing moved to the FAQ ("has not launched publicly"); the claim did
    // not move. Either form satisfies this, absence of both does not.
    const hero = read("src/components/landing/Hero.tsx");
    const faq = read("src/components/landing/FAQ.tsx");
    expect(`${hero}${faq}`).toMatch(/not generally available|haven't launched publicly|have not launched publicly/i);
  });

  it("says the clinic and its providers stay authoritative", () => {
    const landing = sources
      .filter(({ path }) => path.startsWith("src/components/landing/"))
      .map(({ text }) => text)
      .join("\n");
    expect(landing).toMatch(/authoritative/i);
    expect(landing).toMatch(
      /does not make clinical, legal, insurance, psychological, or eligibility determinations/i
    );
  });
});

describe("the agent docs match the delivery behaviour", () => {
  // Docs contradicting code caused real defects repeatedly on this branch, and
  // AGENTS.md steers future work - a stale rule here can reintroduce an outage.
  const docs = () => `${read("AGENTS.md")}
${read("README.md")}`;

  it("never claims a storage failure answers 502", () => {
    expect(docs()).not.toMatch(/every channel failing raises/i);
    expect(docs()).not.toMatch(/route answers 502/i);
    expect(read("src/app/api/clinic-interest/route.ts")).not.toMatch(/502/);
  });

  it("states the three failure cases the code actually implements", () => {
    const agents = read("AGENTS.md");
    expect(agents).toMatch(/optional storage fails/i);
    expect(agents).toMatch(/still returns `forward`/i);
    expect(agents).toMatch(/Web3Forms rejects/i);
    expect(agents).toMatch(/LEAD_DELIVERY_MODE=log/);
  });

  it("keeps the browser-delivery rule that the outage taught", () => {
    expect(read("AGENTS.md")).toMatch(
      /Email delivery is a browser step, and must stay one/i
    );
  });
});

describe("the form discloses what happens to the details", () => {
  it("says what is stored, why, and that processors are involved", () => {
    const form = read("src/components/clinic-interest/ClinicInterestForm.tsx");
    expect(form).toMatch(/stored so we can contact your clinic/i);
    expect(form).toMatch(/email and database providers/i);
    expect(form).toMatch(/not used for anything else/i);
  });
});

describe("participant education is preserved where it explains the journey", () => {
  it("still explains who takes part in the journey", () => {
    // The FAQ used to define one journey type, because the product was scoped
    // to it. The scope is now every journey the clinic runs, and the breadth
    // claim itself is asserted on the hero, the problem section and the
    // metadata (positioning P6). What the FAQ still owes a clinic reader is
    // who is involved - participants stay named here rather than being
    // stripped out as the copy narrowed to the buyer.
    const faq = prose("src/components/landing/FAQ.tsx");
    expect(faq).toMatch(/intended parents/i);
    expect(faq).toMatch(/gestational carrier/i);
  });

  it("still names the participants in the coordination copy", () => {
    const landing = sources
      .filter(({ path }) => path.startsWith("src/components/landing/"))
      .map(({ text }) => text)
      .join("\n");
    expect(landing).toMatch(/intended parents/i);
    expect(landing).toMatch(/gestational carrier/i);
  });

  it("does not address participants as the audience being sold to", () => {
    for (const path of ACQUISITION_SURFACES) {
      const text = read(path);
      expect(text, path).not.toMatch(/I'm an Intended Parent/i);
      expect(text, path).not.toMatch(/becoming a Gestational Carrier/i);
      expect(text, path).not.toMatch(/I'm interested in being a Donor/i);
    }
  });
});

describe("historical participant leads are preserved", () => {
  const legacyTable = "supabase/migrations/20260418000000_public_interest_leads.sql";
  const legacyDonor =
    "supabase/migrations/20260426000000_add_donor_role_to_public_interest_leads.sql";
  const clinicTable =
    "supabase/migrations/20260819000000_clinic_interest_leads.sql";

  it("leaves the historical migrations intact", () => {
    expect(read(legacyTable)).toMatch(
      /create table if not exists marketing_private\.public_interest_leads/
    );
    expect(read(legacyDonor)).toMatch(/'intended_parent', 'gestational_surrogate', 'donor', 'not_sure'/);
  });

  it("stores clinic leads in their own table", () => {
    expect(read(clinicTable)).toMatch(
      /create table if not exists marketing_private\.clinic_interest_leads/
    );
  });

  it("never rewrites, drops or re-keys the historical table", () => {
    const migration = read(clinicTable).toLowerCase();
    for (const destructive of [
      "drop table",
      "delete from",
      "update marketing_private.public_interest_leads",
      "alter table marketing_private.public_interest_leads",
      "insert into marketing_private.public_interest_leads",
    ]) {
      expect(migration).not.toContain(destructive);
    }
  });

  it("keeps the two lead populations explicitly distinguishable", () => {
    const migration = read(clinicTable);
    expect(migration).toMatch(/lead_type text not null default 'clinic_interest'/);
    expect(migration).toMatch(/schema_version integer not null default 1/);
    expect(migration).toMatch(/comment on table marketing_private\.public_interest_leads/);
  });

  it("does not claim a lead_type column the historical table lacks", () => {
    // The historical table genuinely has no such column.
    expect(read(legacyTable)).not.toMatch(/lead_type/);

    for (const doc of [clinicTable, "README.md", "AGENTS.md"]) {
      expect(read(doc), doc).not.toMatch(
        /both (tables )?carry an explicit lead_type/i
      );
    }
  });

  it("does not claim database-enforced immutability it has not implemented", () => {
    const migration = read(clinicTable);
    // "Read-only" reads as an enforced guarantee; nothing enforces it.
    expect(migration).not.toMatch(/Read-only:/);
    expect(migration).toMatch(/not enforced in the database/i);
    expect(read("AGENTS.md")).toMatch(/no database\s+rule enforces it/i);
  });

  it("stores clinic leads append-only", () => {
    const migration = read(clinicTable);
    expect(migration).toMatch(/append-only/);
    expect(migration).not.toMatch(/work_email text not null unique/);
    expect(read("src/lib/leadDelivery.ts")).not.toMatch(/ignoreDuplicates/);
    expect(read("src/lib/leadDelivery.ts")).toMatch(/\.insert\(lead\)/);
  });

  it("writes only to the clinic table from application code", () => {
    expect(findInCode(/public_interest_leads/)).toEqual([]);
    expect(read("src/lib/leadDelivery.ts")).toMatch(
      /CLINIC_INTEREST_TABLE = "clinic_interest_leads"/
    );
  });
});
