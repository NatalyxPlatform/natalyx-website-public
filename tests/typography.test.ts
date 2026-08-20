import { describe, expect, it } from "vitest";
import { findInCode, read, sources } from "./helpers/sources";

/**
 * One typeface, site-wide.
 *
 * Headings and body copy are distinguished by size, weight and colour - never
 * by family. The site previously loaded a display serif and applied it heading
 * by heading with `font-serif`, which is why removing it meant touching a
 * dozen components: the second family in the theme made every new heading a
 * fresh opportunity to reintroduce it. The token is gone, so `font-serif` is
 * now an undefined utility that silently does nothing, and these guards make
 * that failure loud instead.
 */

/** A Tailwind text-size utility: a named step, or an arbitrary value. */
const SIZED = /\btext-(xs|sm|base|lg|[2-9]?xl|\[)/;

describe("the site renders in a single typeface", () => {
  it("defines exactly one font family token", () => {
    const theme = read("src/app/globals.css");
    const families = [...theme.matchAll(/--font-[a-z]+:/g)].map((m) => m[0]);
    expect(families).toEqual(["--font-sans:"]);
  });

  it("no longer defines a serif family", () => {
    expect(read("src/app/globals.css")).not.toMatch(/--font-serif/);
    expect(read("src/app/globals.css")).not.toMatch(/Fraunces/i);
  });

  it("applies no font-family utility outside the body element", () => {
    // `font-serif` would now resolve to nothing at all, so a heading carrying
    // it would look correct in review and be silently unstyled in the browser.
    // Scanned as code: the CSS comment recording why the token went is not a
    // reintroduction of it.
    expect(findInCode(/\bfont-serif\b/)).toEqual([]);

    // The family is set once, on <body>, and inherited from there.
    const utilityUsers = sources
      .filter(({ code }) => /className="[^"]*\bfont-sans\b/.test(code))
      .map(({ path }) => path);
    expect(utilityUsers).toEqual(["src/app/layout.tsx"]);
  });

  it("requests only the one family from the font provider", () => {
    const layout = read("src/app/layout.tsx");
    const families = [...layout.matchAll(/family=([A-Za-z+]+)/g)].map(
      (m) => m[1]
    );
    expect(families).toEqual(["DM+Sans"]);
  });

  it("keeps size, weight and colour doing the work headings need", () => {
    // The guard above only proves the family is uniform. If it were satisfied
    // by flattening every heading to body text, the hierarchy would be gone.
    const headings = sources
      .filter(({ path }) => /^src\/(components|app)\//.test(path))
      .flatMap(({ text }) => [...text.matchAll(/<h[1-3]\s[^>]*>/g)])
      .map((m) => m[0]);

    expect(headings.length).toBeGreaterThan(4);
    for (const heading of headings) {
      expect(heading, heading).toMatch(SIZED);
      expect(heading, heading).toMatch(/font-(medium|semibold|bold)/);
    }
  });
});
