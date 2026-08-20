import { describe, expect, it } from "vitest";
import {
  CLINIC_INTEREST_DESCRIPTION,
  CLINIC_INTEREST_TITLE,
  DEFAULT_SITE_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SOCIAL_DESCRIPTION,
  buildStructuredData,
  resolveSiteUrl,
} from "@/lib/positioning";
import {
  GOVERNING_DOCS,
  LANDING_SECTIONS,
  PUBLIC_PROSE_SURFACES,
  findInProse,
  findMatches,
  literal,
  prose,
  read,
  sources,
} from "./helpers/sources";

/**
 * Guards for docs/acceptance-all-surrogacy-positioning.md.
 *
 * The site sells one thing: an operational layer fertility clinics use to run
 * *every* surrogacy journey through their own workflow. Two failure modes are
 * possible, and each absence guard below is paired with a presence guard so
 * both are caught:
 *
 *   - the scope narrows back to known-surrogate / bring-your-own cases, or
 *   - the copy is stripped until it no longer says anything at all.
 *
 * A repo-wide "string X is absent" assertion is only worth having if putting X
 * back fails it. These were mutation-tested; see the matrix.
 */

/**
 * Prose that a visitor, a crawler, or a future agent can actually read.
 * Unwrapped, because JSX splits sentences across lines and a phrase guard
 * matched against raw text would miss the wrapped half.
 */
const proseSurfaces = () =>
  PUBLIC_PROSE_SURFACES.map((path) => ({ path, text: prose(path) }));

const landingProse = () =>
  LANDING_SECTIONS.map((path) => prose(path)).join(" ");

const governingDocs = () =>
  GOVERNING_DOCS.map((path) => ({ path, text: prose(path) }));

const faqProse = () => prose("src/components/landing/FAQ.tsx");

/**
 * Splits copy into sentences and keeps only those that *assert* the pattern.
 *
 * A blunt "the word `marketplace` appears nowhere" ban is unusable here, and
 * not because it is inconvenient: the FAQ has to deny being a marketplace, and
 * AGENTS.md/README.md have to forbid becoming one. A vocabulary ban fires on
 * the denial and the prohibition - the two sentences most worth keeping - while
 * saying nothing about whether the claim itself was made.
 *
 * So the unit is the sentence, and a negated or prohibitive sentence is not a
 * claim. The known gap: a genuine claim that happens to carry a negation
 * elsewhere in the same sentence ("integrates with your EHR, no setup needed")
 * slips through. ANCHORED_CLAIMS below covers the shapes worth catching
 * regardless, and both directions are asserted rather than assumed.
 */
function assertingSentences(text: string, pattern: RegExp): string[] {
  return text
    .split(/(?<=[.:;!?])\s+/)
    .filter((sentence) => pattern.test(sentence))
    .filter(
      (sentence) =>
        !/\b(not|never|no|nor|without|avoid|refrain|forbid\w*|cannot|retired)\b/i.test(
          sentence
        )
    );
}

/** Every surface a claim could be made on: rendered copy and the docs alike. */
const claimSurfaces = () => [...proseSurfaces(), ...governingDocs()];

function claimOffenders(pattern: RegExp): string[] {
  return claimSurfaces()
    .filter(({ text }) => assertingSentences(text, pattern).length > 0)
    .map(({ path }) => path);
}

describe("P9 — no public surface limits Natalyx to bring-your-own cases", () => {
  it.each([
    ["BYOS", /\bBYOS\b/i],
    ["bring your own", /bring[\s-]your[\s-]own/i],
    ["known surrogate", /known[\s-]surrogate/i],
    ["known carrier", /known[\s-]carrier/i],
    ["already found your surrogate", /already found your (surrogate|carrier)/i],
  ])("no rendered surface says %s", (_label, pattern) => {
    expect(findInProse(pattern)).toEqual([]);
  });

  it.each([
    ["BYOS", /\bBYOS\b/i],
    ["bring your own", /bring[\s-]your[\s-]own/i],
    ["known surrogate", /known[\s-]surrogate/i],
    ["known carrier", /known[\s-]carrier/i],
  ])("no governing doc says %s", (_label, pattern) => {
    // A doc that still frames the product as bring-your-own steers the next
    // change straight back into the position this work removed.
    expect(
      governingDocs()
        .filter(({ text }) => pattern.test(text))
        .map(({ path }) => path)
    ).toEqual([]);
  });

  it.each([
    ["wedge framing", /\bwedge\b/i],
    ["proof-case framing", /proof case/i],
    ["proving it first", /proving it (there )?first/i],
    ["scope caveat", /not the limit of the company/i],
  ])("carries no %s that re-narrows the product", (_label, pattern) => {
    const offenders = [
      ...findInProse(pattern),
      ...governingDocs()
        .filter(({ text }) => pattern.test(text))
        .map(({ path }) => path),
    ];
    expect(offenders).toEqual([]);
  });
});

describe("P1, P2 — the hero commits to every surrogacy journey", () => {
  const hero = () => prose("src/components/landing/Hero.tsx");

  it("headlines one clinic-led workflow for every surrogacy journey", () => {
    const text = hero();
    expect(text).toMatch(/every surrogacy journey/i);
    expect(text).toMatch(/clinic-led workflow/i);
  });

  it("keeps addressing fertility clinics", () => {
    expect(hero()).toMatch(/For fertility clinics/i);
  });

  it("describes the operational layer, not a search for a carrier", () => {
    const text = hero();
    expect(text).toMatch(/operational layer/i);
    // The four coordination areas the matrix requires the hero to name.
    for (const area of [
      /carriers?/i,
      /intended parents/i,
      /appointments/i,
      /records/i,
      /handoffs/i,
    ]) {
      expect(text, String(area)).toMatch(area);
    }
  });

  it("still says the product is not generally available", () => {
    expect(`${hero()}${faqProse()}`).toMatch(
      /not generally available|Not generally/i
    );
  });
});

describe("P3 — the problem section explains journey origin, not a niche", () => {
  const why = () => prose("src/components/landing/WhyNatalyx.tsx");

  it("names the origins a journey can have", () => {
    const text = why();
    expect(text).toMatch(/already know/i);
    expect(text).toMatch(/agency/i);
    expect(text).toMatch(/clinic (approves|has approved)/i);
  });

  it("says the operational journey lands on the clinic regardless", () => {
    expect(why()).toMatch(/whether/i);
    expect(why()).toMatch(/clinic/i);
  });

  it("no longer explains Natalyx by the absence of an agency", () => {
    expect(why()).not.toMatch(/no agency in the middle/i);
  });

  it("describes fitting the clinic's operation, not replacing it", () => {
    expect(why()).toMatch(/extension of (your|the) clinic/i);
  });
});

describe("P4 — the mission section is origin-agnostic", () => {
  const value = () => prose("src/components/landing/ValueCards.tsx");

  it("describes a surrogacy journey generically", () => {
    expect(value()).toMatch(/a surrogacy journey/i);
  });

  it("positions Natalyx underneath the clinic's own workflow", () => {
    expect(value()).toMatch(/operational layer/i);
    expect(value()).toMatch(/clinic/i);
  });

  it("says integration with existing systems is intent, not fact", () => {
    expect(value()).toMatch(
      /(designed|built) to[\s\S]{0,120}(connect|fit)[\s\S]{0,80}systems/i
    );
  });
});

describe("P5 — how-it-works keeps the five coordination areas", () => {
  const how = () => prose("src/components/landing/HowItWorks.tsx");

  it.each([
    ["shared journey context", /journey context/i],
    ["participant preparation", /preparation/i],
    ["provider handoffs", /handoffs/i],
    ["records and appointments", /records and appointments/i],
    ["clinic-branded contact", /clinic-branded|clinic&apos;s name|clinic's name/i],
  ])("still covers %s", (_label, pattern) => {
    expect(how()).toMatch(pattern);
  });

  it("keeps clinical judgment outside the product", () => {
    expect(how()).toMatch(/not the clinical judgment/i);
    expect(how()).toMatch(/authoritative/i);
  });
});

describe("P6, P7, P8 — the FAQ answers scope, matching and clinic systems", () => {
  const faq = () => prose("src/components/landing/FAQ.tsx");

  it("answers which journeys are supported with all of them", () => {
    const text = faq();
    expect(text).toMatch(/[Ww]hich surrogacy journeys/);
    expect(text).toMatch(/all of the ones your clinic runs/i);
  });

  it("no longer defines the product by one journey type", () => {
    expect(faq()).not.toMatch(/What is a known/i);
    expect(faq()).not.toMatch(/only for known/i);
  });

  it("states plainly that Natalyx does not match or recruit carriers", () => {
    const text = faq();
    expect(text).toMatch(/does not (source|match|recruit)/i);
    expect(text).toMatch(/\bmatch\b/i);
    expect(text).toMatch(/not a consumer[\s\S]{0,30}marketplace/i);
  });

  it("describes clinic systems as forward-looking only", () => {
    const text = faq();
    expect(text).toMatch(/designed to fit into clinic operations/i);
    expect(text).toMatch(/as integrations are enabled/i);
    expect(text).toMatch(/not a replacement for your EHR/i);
  });

  it("keeps the professional-authority answer intact", () => {
    expect(faq()).toMatch(
      /does not make clinical, legal, insurance, psychological, or eligibility determinations/i
    );
  });
});

describe("P10 — Natalyx is never positioned as a marketplace or agency", () => {
  const surfaces = () => [
    ...proseSurfaces(),
    ...governingDocs(),
  ];

  /**
   * Anchored on an affirmative subject, deliberately.
   *
   * The site and its docs have to be able to *deny* being a marketplace, and
   * AGENTS.md/README.md have to be able to forbid becoming one. A bare
   * /marketplace/ ban would fire on "Natalyx is not a marketplace" and on "do
   * not position Natalyx as a matching marketplace" - forbidding the
   * disclaimer rather than the claim.
   */
  const MARKETPLACE_CLAIMS: [string, RegExp][] = [
    [
      "marketplace identity",
      /\bNatalyx (is|becomes|will be) an? [^.]{0,40}\b(marketplace|matching (service|platform)|agency)\b/i,
    ],
    [
      "marketplace self-description",
      /\bthe (surrogacy |carrier |fertility )?marketplace\b/i,
    ],
    [
      "sourcing carriers",
      /\bwe (match|source|recruit|screen|rank|vet)\b[^.]{0,40}\b(surrogates?|carriers?)\b/i,
    ],
    [
      "finding a carrier for someone",
      /\b(find|match)e?s? (you|your patients|intended parents) an? (surrogate|carrier)/i,
    ],
    [
      "browsing or ranking carriers",
      /\b(browse|search|shortlist|ranked list)\b[^.]{0,30}\b(surrogates?|carriers?)\b/i,
    ],
  ];

  it.each(MARKETPLACE_CLAIMS)("asserts no %s", (_label, pattern) => {
    expect(
      surfaces()
        .filter(({ text }) => pattern.test(text))
        .map(({ path }) => path)
    ).toEqual([]);
  });

  it("permits the denial the FAQ makes and the prohibition the docs state", () => {
    // Guard sanity: if these sentences trip the guards above, the guards are
    // banning the disclaimer instead of the claim, and every "asserts no ..."
    // result above is meaningless.
    const allowed = [
      "Natalyx is not a consumer surrogacy marketplace and does not match, source or recruit carriers.",
      "Never present Natalyx as a matching marketplace or as an online agency.",
    ];
    for (const sentence of allowed) {
      for (const [label, pattern] of MARKETPLACE_CLAIMS) {
        expect(sentence, label).not.toMatch(pattern);
      }
    }
  });

  it("still catches the claim itself", () => {
    // And if these pass the guards, the guards catch nothing at all.
    const claims = [
      "Natalyx is a surrogacy marketplace for intended parents.",
      "We match intended parents with carriers.",
      "Browse available carriers in your area.",
    ];
    for (const claim of claims) {
      expect(
        MARKETPLACE_CLAIMS.some(([, pattern]) => pattern.test(claim)),
        claim
      ).toBe(true);
    }
  });
});

describe("P11 — the clinic is consistently the coordinating center", () => {
  it.each(LANDING_SECTIONS)("%s addresses the clinic", (path) => {
    expect(prose(path)).toMatch(/clinic/i);
  });

  it("states the clinic-led / centre claim on the main surfaces", () => {
    const centred =
      /clinic-led|coordinating cent(er|re)|clinic stays|clinic remains|at the cent(er|re)|clinic&apos;s own workflow|clinic's own workflow/i;
    for (const path of [
      "src/components/landing/Hero.tsx",
      "src/components/landing/WhyNatalyx.tsx",
      "src/components/landing/ValueCards.tsx",
    ]) {
      expect(prose(path), path).toMatch(centred);
    }
  });

  it("keeps the clinic and its providers authoritative", () => {
    expect(landingProse()).toMatch(/authoritative/i);
  });

  it("still explains the journey to a clinic rather than deleting participants", () => {
    const text = landingProse();
    expect(text).toMatch(/intended parents/i);
    expect(text).toMatch(/gestational carrier/i);
  });
});

describe("P15, P16 — interest page, nav and footer are clinic-first", () => {
  it("the clinic-interest page carries no origin qualifier", () => {
    const page = prose("src/app/clinic-interest/page.tsx");
    expect(page).toMatch(/clinic/i);
    expect(page).not.toMatch(/known[\s-]surrogate/i);
  });

  it("the footer tagline describes running journeys through the clinic", () => {
    const footer = prose("src/components/layout/Footer.tsx");
    expect(footer).toMatch(/surrogacy journeys/i);
    expect(footer).toMatch(/clinic/i);
  });

  it("offers no participant destination in nav or footer", () => {
    for (const path of [
      "src/components/layout/Header.tsx",
      "src/components/layout/Footer.tsx",
    ]) {
      const text = prose(path);
      expect(text, path).not.toMatch(/for (intended parents|surrogates|carriers)/i);
      expect(text, path).not.toMatch(/\?role=/);
    }
  });
});

/**
 * Claims the repository cannot evidence.
 *
 * Checked per sentence and only where the sentence *asserts* the thing: the
 * FAQ has to be able to say "it is not a replacement for your EHR", and
 * AGENTS.md has to be able to say that "integrated with your EHR" is not
 * accurate. Banning the vocabulary would delete exactly those sentences.
 */
const UNSUPPORTED_CLAIMS: [string, RegExp][] = [
  [
    "existing clinic customers",
    /\b(trusted by|used by|partner(ed)? with)\b[^.]{0,30}\bclinics\b/i,
  ],
  [
    "clinic adoption",
    /\b(our clinics|join(ing)?\s+\d+\s+clinics|\d+\s+clinics\s+(already|use|trust))\b/i,
  ],
  ["a named clinic customer", /\b(Kaiser|CCRM|Shady Grove|Boston IVF|RMA)\b/],
  [
    "completed EHR integration",
    /\b(fully|already|now|today)\b[^.]{0,30}\bintegrat(ed|es)\b/i,
  ],
  [
    "universal EHR integration",
    /\bintegrat(ed|es)\s+with\s+(your|our|every|all|any)\b/i,
  ],
  [
    "an integration verb beside EMR/EHR",
    /(integrat\w+)[^.]{0,40}\b(EMR|EHR)\b/i,
  ],
  [
    "EHR replacement",
    /\breplaces?\s+(your|the)\s+(EMR|EHR|electronic health record)/i,
  ],
  [
    "guaranteed automation",
    /\b(fully automat|automatically handles|zero (manual )?work)/i,
  ],
  [
    "clinical decision-making",
    /\b(we|natalyx)\s+(decides?|approves?|determines? eligibility)/i,
  ],
  ["PHI readiness", /PHI[-\s]?ready/i],
  ["HIPAA compliance", /HIPAA[-\s]?compliant/i],
  ["clinical validation", /clinically[-\s]validated/i],
  [
    "real participant use",
    /\b(participants|carriers|intended parents) (already )?use (it|Natalyx)\b/i,
  ],
];

describe("P20 — no claim the repository cannot support", () => {
  it.each(UNSUPPORTED_CLAIMS)("makes no claim of %s", (_label, pattern) => {
    expect(claimOffenders(pattern)).toEqual([]);
  });

  it("still lets the site and the docs deny each claim", () => {
    // Guard sanity, one direction: if a denial trips a guard, that guard is
    // deleting the disclaimer rather than catching the claim.
    const denials = [
      "It is not a replacement for your EHR.",
      "We are not claiming a completed connection to any particular system today.",
      "Natalyx is designed to connect with existing clinic systems as integrations are enabled.",
      "Do not claim PHI readiness, clinical validation, or existing partner clinics.",
      "\"integrated with your EHR\" is not accurate, and Natalyx never replaces the EHR.",
      "Natalyx is not generally available yet.",
    ];
    for (const sentence of denials) {
      for (const [label, pattern] of UNSUPPORTED_CLAIMS) {
        expect(assertingSentences(sentence, pattern), label).toEqual([]);
      }
    }
  });

  it("still catches each claim when it is actually asserted", () => {
    // Guard sanity, the other direction: a guard that cannot fire is not a
    // guard, and every empty result above would mean nothing.
    const claims: [string, string][] = [
      ["existing clinic customers", "Natalyx is trusted by leading fertility clinics."],
      ["clinic adoption", "Join 40 clinics already coordinating with Natalyx."],
      ["a named clinic customer", "Read the CCRM case study."],
      ["completed EHR integration", "Natalyx is fully integrated with the systems you run."],
      ["universal EHR integration", "Natalyx integrates with your EHR out of the box."],
      ["an integration verb beside EMR/EHR", "Live integration with every major EHR."],
      ["EHR replacement", "Natalyx replaces your EHR."],
      ["guaranteed automation", "Coordination is fully automated end to end."],
      ["clinical decision-making", "Natalyx determines eligibility for every carrier."],
      ["PHI readiness", "The platform is PHI-ready today."],
      ["HIPAA compliance", "Natalyx is HIPAA-compliant."],
      ["clinical validation", "A clinically-validated coordination workflow."],
      ["real participant use", "Thousands of intended parents use Natalyx."],
    ];
    for (const [label, claim] of claims) {
      const pattern = UNSUPPORTED_CLAIMS.find(([l]) => l === label)?.[1];
      expect(pattern, `no guard named ${label}`).toBeDefined();
      expect(assertingSentences(claim, pattern!), claim).not.toEqual([]);
    }
  });
});

describe("P21 — capability is stated as intent, not as fact", () => {
  it("uses built-to / designed-to wording for what does not exist yet", () => {
    const text = landingProse();
    expect(text).toMatch(/\b(built to|designed to)\b/i);
  });

  it.each([
    ["clinics use it", /\bclinics (already )?(use|rely on|trust)\b/i],
    ["our clinics", /\bour clinics\b/i],
    ["generally available", /\bis generally available\b/i],
  ])("avoids present-tense adoption wording: %s", (_label, pattern) => {
    expect(findInProse(pattern)).toEqual([]);
  });
});

describe("P22 — participants are people, never supply", () => {
  const DEHUMANISING: [string, RegExp][] = [
    [
      "carrier inventory",
      /\b(surrogate|carrier)s?\b[^.]{0,25}\b(inventory|stock|pipeline)\b/i,
    ],
    [
      "supply of carriers",
      /\b(inventory|supply|pool|capacity) of (surrogates?|carriers?)\b/i,
    ],
    [
      "allocating carriers",
      /\b(allocat|assign)\w*\s+an?\s+(surrogate|carrier)\b/i,
    ],
  ];

  it.each(DEHUMANISING)("never frames carriers as %s", (_label, pattern) => {
    expect(claimOffenders(pattern)).toEqual([]);
  });

  it("still lets the docs forbid the framing, and still catches it", () => {
    expect(
      assertingSentences(
        "They are people in a journey, never capacity, supply or inventory.",
        DEHUMANISING[0][1]
      )
    ).toEqual([]);
    expect(
      assertingSentences("Our carrier inventory refreshes weekly.", DEHUMANISING[0][1])
    ).not.toEqual([]);
    expect(
      assertingSentences("A deep pool of carriers in every region.", DEHUMANISING[1][1])
    ).not.toEqual([]);
  });
});

describe("P17 — no participant interest registration is offered", () => {
  it("keeps exactly one interest form and one interest page", () => {
    expect(
      sources.filter(({ path }) => /Form\.tsx$/.test(path)).map((f) => f.path)
    ).toEqual(["src/components/clinic-interest/ClinicInterestForm.tsx"]);

    expect(
      sources
        .filter(({ path }) => /^src\/app\/.*page\.tsx$/.test(path))
        .map((f) => f.path)
        .sort()
    ).toEqual(["src/app/clinic-interest/page.tsx", "src/app/page.tsx"]);
  });

  it.each([
    ["surrogate signup", /surrogate (sign[\s-]?up|registration|interest form)/i],
    ["intended-parent interest", /intended[\s-]parent (interest|registration|sign[\s-]?up)/i],
    ["participant waitlist", /(join|register)[^.]{0,30}\b(waitlist|as a (surrogate|carrier|donor))/i],
  ])("offers no %s", (_label, pattern) => {
    expect(
      [...proseSurfaces(), ...governingDocs()]
        .filter(({ text }) => pattern.test(text))
        .map(({ path }) => path)
    ).toEqual([]);
  });
});

describe("P24 — the governing docs describe the intended position", () => {
  it("AGENTS.md scopes the product to all surrogacy journeys", () => {
    const agents = prose("AGENTS.md");
    expect(agents).toMatch(/surrogacy journeys/i);
    expect(agents).toMatch(/however (a|the) carrier (entered|joined)/i);
    expect(agents).toMatch(/clinic/i);
  });

  it("README.md states the clinic-led, origin-agnostic position", () => {
    const readme = prose("README.md");
    expect(readme).toMatch(/clinic-led|clinic remains|coordinating cent(er|re)/i);
    expect(readme).toMatch(/surrogacy journeys/i);
  });

  it("both still forbid participant acquisition", () => {
    for (const { path, text } of governingDocs()) {
      expect(text, path).toMatch(/clinic/i);
    }
    expect(prose("AGENTS.md")).toMatch(/do not reintroduce/i);
  });
});

describe("P12 — metadata says what the page says", () => {
  it("names the clinic in every title the page emits", () => {
    expect(SITE_TITLE).toMatch(/clinic/i);
    expect(CLINIC_INTEREST_TITLE).toMatch(/clinic/i);
  });

  it.each([
    ["site description", () => SITE_DESCRIPTION],
    ["social description", () => SOCIAL_DESCRIPTION],
    ["interest-page description", () => CLINIC_INTEREST_DESCRIPTION],
  ])("%s is clinic-first and origin-agnostic", (_label, get) => {
    const text = get();
    expect(text).toMatch(/clinic/i);
    expect(text).toMatch(/surrogacy journe/i);
    expect(text).not.toMatch(/known[\s-]surrogate/i);
    expect(text).not.toMatch(/bring[\s-]your[\s-]own/i);
    expect(text).not.toMatch(/\bBYOS\b/i);
  });

  it("the site description carries the clinic-centre claim", () => {
    expect(SITE_DESCRIPTION).toMatch(
      /coordinating cent(er|re)|clinic stays|clinic-led/i
    );
  });

  it("makes no claim the rest of the suite forbids", () => {
    for (const [label, pattern] of UNSUPPORTED_CLAIMS) {
      for (const text of [
        SITE_TITLE,
        SITE_DESCRIPTION,
        SOCIAL_DESCRIPTION,
        CLINIC_INTEREST_TITLE,
        CLINIC_INTEREST_DESCRIPTION,
      ]) {
        expect(assertingSentences(text, pattern), `${label}: ${text}`).toEqual(
          []
        );
      }
    }
  });
});

describe("P13 — structured data matches the visible positioning", () => {
  const graph = () => buildStructuredData("https://natalyx.health");

  it("is emitted on the page as JSON-LD", () => {
    const layout = read("src/app/layout.tsx");
    expect(layout).toMatch(/application\/ld\+json/);
    expect(layout).toMatch(/buildStructuredData/);
  });

  it("serialises to valid JSON with the schema.org context", () => {
    const parsed = JSON.parse(JSON.stringify(graph())) as Record<
      string,
      unknown
    >;
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(Array.isArray(parsed["@graph"])).toBe(true);
  });

  it("describes an organisation, a site and a business application", () => {
    const types = graph()["@graph"].map((node) => node["@type"]);
    expect(types).toEqual(["Organization", "WebSite", "SoftwareApplication"]);
  });

  it("names fertility clinics as the audience", () => {
    const software = graph()["@graph"].find(
      (node) => node["@type"] === "SoftwareApplication"
    ) as { audience?: { audienceType?: string }; applicationCategory?: string };
    expect(software?.audience?.audienceType).toMatch(/fertility clinics/i);
    expect(software?.applicationCategory).toBe("BusinessApplication");
  });

  it("tells a crawler exactly what it tells a reader", () => {
    for (const node of graph()["@graph"]) {
      const description = (node as { description?: string }).description;
      if (description !== undefined) expect(description).toBe(SITE_DESCRIPTION);
    }
  });

  it("asserts nothing the page does not show", () => {
    const serialised = JSON.stringify(graph());
    for (const forbidden of [
      "aggregateRating",
      "review",
      "offers",
      "price",
      "numberOfEmployees",
      "customer",
    ]) {
      expect(serialised, forbidden).not.toContain(forbidden);
    }
  });

  it("escapes a script terminator rather than trusting the content", () => {
    // Static today, but the escape is what makes that safe to stop checking.
    expect(read("src/app/layout.tsx")).toMatch(/\\u003c/);
  });
});

describe("P14 — the positioning strings have one definition", () => {
  it("lives only in src/lib/positioning.ts", () => {
    expect(findMatches(literal(SITE_DESCRIPTION.slice(0, 60)))).toEqual([
      "src/lib/positioning.ts",
    ]);
    expect(findMatches(literal(SITE_TITLE))).toEqual(["src/lib/positioning.ts"]);
  });

  it("is composed, never redefined, by the pages that emit it", () => {
    for (const path of [
      "src/app/layout.tsx",
      "src/app/clinic-interest/page.tsx",
    ]) {
      const text = read(path);
      expect(text, path).toMatch(/from "@\/lib\/positioning"/);
      // A string literal here is a second definition free to drift.
      expect(text, path).not.toMatch(/\btitle:\s*"/);
      expect(text, path).not.toMatch(/\bdescription:\s*"/);
    }
  });

  it("resolves one site URL for metadataBase and the JSON-LD alike", () => {
    expect(resolveSiteUrl(undefined)).toBe(DEFAULT_SITE_URL);
    expect(resolveSiteUrl("   ")).toBe(DEFAULT_SITE_URL);
    expect(resolveSiteUrl("https://example.test/")).toBe("https://example.test");
  });
});
