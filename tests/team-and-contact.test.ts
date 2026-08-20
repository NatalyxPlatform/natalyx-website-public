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
const CONTACT = "src/components/landing/Contact.tsx";

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
});

describe("T3 — the contact section publishes the deck's contact details", () => {
  it.each(FOUNDERS)("shows $name's phone and email", (founder) => {
    const contact = prose(CONTACT);
    expect(contact).toContain(founder.name);
    expect(contact).toContain(founder.phone);
    expect(contact).toContain(founder.email);
  });

  it.each(FOUNDERS)("$name's tel: link matches the number shown", (founder) => {
    const contact = read(CONTACT);
    expect(contact).toContain(founder.tel);
    // A tel: link that dials a different number from the one displayed is a
    // silent wrong-number bug that no visual check would catch.
    expect(founder.tel.replace(/\D/g, "")).toBe(
      `1${founder.phone.replace(/\D/g, "")}`
    );
  });

  it("tells senders to keep patient and case information out", () => {
    expect(prose(CONTACT)).toMatch(
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

describe("T5 — both sections are composed into the page", () => {
  it("renders them in the landing composition", () => {
    const page = read("src/app/page.tsx");
    expect(page).toMatch(/<Team \/>/);
    expect(page).toMatch(/<Contact \/>/);
  });

  it("gives each an addressable section id and heading", () => {
    expect(read(TEAM)).toMatch(/id="team"/);
    expect(read(TEAM)).toMatch(/aria-labelledby="team-heading"/);
    expect(read(CONTACT)).toMatch(/id="contact"/);
    expect(read(CONTACT)).toMatch(/aria-labelledby="contact-heading"/);
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
