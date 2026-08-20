import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

/**
 * Shared repository-source reader for the `source`-substrate suites.
 *
 * Both the acquisition-surface guards and the positioning guards scan the same
 * files in the same way. Keeping one reader here means a scan can never pass in
 * one suite and miss a file in the other because the two walkers drifted.
 */

const SRC = join(process.cwd(), "src");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

/**
 * Comments legitimately name the retired flow (to explain why it is retired).
 * Identifier and route scans run against code only, so a doc comment cannot
 * fail them and cannot hide a real reference either.
 */
export function stripComments(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

export type SourceFile = {
  path: string;
  text: string;
  code: string;
  flat: string;
};

const sourceFiles = walk(SRC).filter((f) => /\.(ts|tsx|css)$/.test(f));

/**
 * Collapses every run of whitespace to a single space.
 *
 * JSX wraps prose across lines with leading indentation, so a sentence a
 * visitor reads as "not the clinical judgment" lives in the file as
 * "not the clinical\n              judgment". A phrase guard matched against
 * the raw text would miss it - which fails an honest surface, and worse, lets
 * a forbidden phrase slip past an absence scan purely by being wrapped.
 */
export function flatten(text: string): string {
  return text.replace(/\s+/g, " ");
}

export const sources: SourceFile[] = sourceFiles.map((path) => {
  const text = readFileSync(path, "utf8");
  return {
    path: relative(process.cwd(), path).split(sep).join("/"),
    text,
    code: stripComments(text),
    flat: flatten(text),
  };
});

export function read(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

/** A file's copy as a reader meets it: one line, single-spaced. */
export function prose(relativePath: string): string {
  return flatten(read(relativePath));
}

/** Every file whose text can reach a rendered page, comments included. */
export function findMatches(pattern: RegExp): string[] {
  return sources
    .filter(({ text }) => pattern.test(text))
    .map(({ path }) => path);
}

/** findMatches against unwrapped copy, for guards on whole phrases. */
export function findInProse(pattern: RegExp): string[] {
  return sources
    .filter(({ flat }) => pattern.test(flat))
    .map(({ path }) => path);
}

/** Same as findMatches, ignoring comments. */
export function findInCode(pattern: RegExp): string[] {
  return sources
    .filter(({ code }) => pattern.test(code))
    .map(({ path }) => path);
}

/**
 * Documents that steer future work rather than render to a visitor.
 *
 * The acceptance matrices are deliberately excluded: their "must not" columns
 * quote the retired vocabulary verbatim, which is the point of them. A scan
 * that included them could only be satisfied by a matrix that cannot say what
 * it forbids.
 */
export const GOVERNING_DOCS = ["README.md", "AGENTS.md"] as const;

/**
 * The sections that carry the pitch, in the order `src/app/page.tsx` composes
 * them. Team and Contact are landing sections too, but they state who we are
 * and how to reach us - holding them to "every section argues the clinic-first
 * position" would only force the position into copy that has no business
 * repeating it. They are scanned as prose surfaces below, so every claim guard
 * still reads them.
 */
export const LANDING_SECTIONS = [
  "src/components/landing/Hero.tsx",
  "src/components/landing/ValueCards.tsx",
  "src/components/landing/HowItWorks.tsx",
  "src/components/landing/WhyNatalyx.tsx",
  "src/components/landing/FAQ.tsx",
  "src/components/landing/CTABanner.tsx",
] as const;

/** Every surface a clinic visitor can read. */
export const PUBLIC_PROSE_SURFACES = [
  ...LANDING_SECTIONS,
  "src/components/landing/Team.tsx",
  "src/components/landing/Contact.tsx",
  "src/components/layout/Header.tsx",
  "src/components/layout/Footer.tsx",
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/clinic-interest/page.tsx",
  "src/components/clinic-interest/ClinicInterestForm.tsx",
  "src/components/clinic-interest/ClinicInterestSuccess.tsx",
] as const;

/** Escapes a copy fragment so it can be searched for as a literal. */
export function literal(fragment: string): RegExp {
  return new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
}
