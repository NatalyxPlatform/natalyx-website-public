import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findInProse, prose, read } from "./helpers/sources";

/**
 * Guards for the team and contact sections (matrix rows T1-T6).
 *
 * Both sections publish facts about real people taken from the clinic pitch
 * deck, so the risk here is not tone - it is publishing something the deck
 * does not say, or publishing someone who was deliberately left off. Names,
 * titles and education are asserted verbatim, and the excluded material is
 * asserted absent from the whole site rather than from these two files.
 */

const TEAM = "src/components/landing/Team.tsx";

const FOUNDERS = [
  {
    name: "Allen Cioaca",
    title: "Founder/CEO",
    education:
      "UCLA BA Economics & Psychology, University of Oxford MS Modelling for Global Health.",
    photo: "public/team/allen-cioaca.jpg",
    phone: "(858) 925-3525",
    tel: "+18589253525",
    email: "allen@natalyx.health",
  },
  {
    name: "Luke Rhodes",
    title: "Co-Founder/CTO",
    education:
      "UCL BS Populations Health Sciences, University of Oxford MS Modelling for Global Health.",
    photo: "public/team/luke-rhodes.jpg",
    phone: "(609) 309-2170",
    tel: "+16093092170",
    email: "luke@natalyx.health",
  },
];

describe("T1 — the team section lists exactly the two founders", () => {
  it.each(FOUNDERS)("names $name with their title and education", (founder) => {
    const team = prose(TEAM);
    expect(team).toContain(founder.name);
    expect(team).toContain(founder.title);
    expect(team).toContain(founder.education);
  });

  it("lists nobody else", () => {
    const team = read(TEAM);
    const names = [...team.matchAll(/name: "([^"]+)"/g)].map((m) => m[1]);
    expect(names).toEqual(FOUNDERS.map((f) => f.name));
  });

  it("keeps the rest of the deck's team slide off the public site", () => {
    // Deliberately scanned site-wide: leaving someone off this section but
    // naming them in a footer or metadata would be the same disclosure.
    for (const excluded of ["Alan Zhao", "Thomas Hall", "Skyler Noble"]) {
      expect(findInProse(new RegExp(excluded, "i")), excluded).toEqual([]);
    }
  });
});

describe("T2 — each founder card carries a real photo", () => {
  it.each(FOUNDERS)("$name has an image file committed", (founder) => {
    const path = join(process.cwd(), founder.photo);
    expect(existsSync(path), founder.photo).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(1024);
  });

  it.each(FOUNDERS)("$name's card renders that file", (founder) => {
    const webPath = founder.photo.replace(/^public/, "");
    expect(read(TEAM)).toContain(webPath);
  });

  it("gives every photo a describing alt attribute", () => {
    const team = read(TEAM);
    // An empty alt would be right for decoration; a person's photo is content.
    expect(team).not.toMatch(/alt=""/);
    expect(team).toMatch(/alt=\{`\$\{founder\.name\}, \$\{founder\.title\}`\}/);
  });

  it("serves the photos without depending on the image optimizer", () => {
    // These broke in exactly this way: the optimizer route is a runtime
    // dependency, and where it is absent - a static export, or a host that
    // does not provide it - /_next/image 404s and every avatar falls back to
    // its alt text while the rest of the page renders perfectly. At 88px the
    // optimizer saves a couple of kilobytes; it is not worth that failure.
    expect(read(TEAM)).toMatch(/\bunoptimized\b/);
  });

  it.each(FOUNDERS)("$name's file is small enough to serve raw", (founder) => {
    // Without the optimizer the browser downloads this file as-is, so the
    // source has to be sized for the card rather than for an archive.
    expect(statSync(join(process.cwd(), founder.photo)).size).toBeLessThan(
      60 * 1024
    );
  });
});

describe("T3 — each founder card carries the deck's contact details", () => {
  it.each(FOUNDERS)("shows $name's phone and email", (founder) => {
    const team = prose(TEAM);
    expect(team).toContain(founder.name);
    expect(team).toContain(founder.phone);
    expect(team).toContain(founder.email);
  });

  it.each(FOUNDERS)("$name's tel: link matches the number shown", (founder) => {
    const team = read(TEAM);
    expect(team).toContain(founder.tel);
    // A tel: link that dials a different number from the one displayed is a
    // silent wrong-number bug that no visual check would catch.
    expect(founder.tel.replace(/\D/g, "")).toBe(
      `1${founder.phone.replace(/\D/g, "")}`
    );
  });

  it("makes both reachable as links, not as plain text", () => {
    const team = read(TEAM);
    expect(team).toMatch(/href=\{`mailto:\$\{founder\.email\}`\}/);
    expect(team).toMatch(/href=\{`tel:\$\{founder\.tel\}`\}/);
  });

  it("tells senders to keep patient and case information out", () => {
    // Carried over from the standalone contact section it replaced: opening a
    // direct channel without this line is what invites case detail by email.
    expect(prose(TEAM)).toMatch(
      /keep patient, medical, legal, and case information out/i
    );
  });
});

describe("T4 — no commercial figures reach the public site", () => {
  it.each([
    ["a revenue-per-case figure", /\$\s?\d+\s?[Kk]\b/],
    ["a currency amount", /\$\s?\d[\d,]*(\.\d+)?/],
    ["per-case pricing", /per[- ]case\b[^.]{0,20}\$/i],
    ["a pricing section", /\b(pricing|price point|cost per)\b/i],
  ])("publishes no %s", (_label, pattern) => {
    expect(findInProse(pattern)).toEqual([]);
  });
});

describe("T5 — the team section is composed into the page", () => {
  it("renders in the landing composition", () => {
    expect(read("src/app/page.tsx")).toMatch(/<Team \/>/);
  });

  it("has an addressable section id and heading", () => {
    expect(read(TEAM)).toMatch(/id="team"/);
    expect(read(TEAM)).toMatch(/aria-labelledby="team-heading"/);
  });

  it("leaves no dangling reference to the removed contact section", () => {
    // The section merged into the founder cards. A footer link to #contact
    // would now scroll nowhere, which no unit test would otherwise notice.
    expect(existsSync(join(process.cwd(), "src/components/landing/Contact.tsx")))
      .toBe(false);
    expect(read("src/components/layout/Footer.tsx")).not.toMatch(/#contact/);
    expect(read("src/app/page.tsx")).not.toMatch(/Contact/);
  });
});

describe("T6 — the team section makes no claim beyond the deck", () => {
  it.each([
    ["employment or client claims", /\b(formerly|ex-|previously at|advisor to)\b/i],
    ["credential inflation", /\b(Dr\.|MD|PhD|Professor)\b/],
    ["clinical authority", /\b(clinician|physician|medical director)\b/i],
  ])("adds no %s", (_label, pattern) => {
    expect(prose(TEAM)).not.toMatch(pattern);
  });
});
