/**
 * The site's positioning, defined once.
 *
 * The same sentence has to reach four places - the page description, the Open
 * Graph card, the Twitter card and the JSON-LD graph. Written inline in
 * `layout.tsx` it was already duplicated, and each copy was free to drift into
 * describing a different product from the one the page shows. Metadata that
 * contradicts the visible copy is the failure this module exists to prevent,
 * so `layout.tsx` composes from here and holds no positioning literal of its
 * own.
 *
 * What the strings must mean is fixed by
 * docs/acceptance-all-surrogacy-positioning.md, and guarded by
 * tests/positioning.test.ts:
 *
 *   - Natalyx is an operational layer for fertility clinics, whose customer is
 *     the clinic and no one else.
 *   - It applies to every surrogacy journey a clinic runs, however the carrier
 *     entered it. No journey-origin qualifier belongs in this file.
 *   - Nothing here may claim adoption, deployment, integration or readiness
 *     that the repository cannot evidence. Capability is stated as intent.
 */

export const SITE_NAME = "Natalyx";

export const DEFAULT_SITE_URL = "https://natalyx.health";

/** One resolver, so metadataBase and the JSON-LD graph can never disagree. */
export function resolveSiteUrl(value?: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed.replace(/\/+$/, "") : DEFAULT_SITE_URL;
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

/** Page title, OG title and Twitter title are deliberately the same string. */
export const SITE_TITLE =
  "Natalyx — Clinic-led coordination for every surrogacy journey";

export const SITE_DESCRIPTION =
  "Natalyx automates the manual relay a surrogacy agency runs by hand — " +
  "patient preparation, appointments, records, provider handoffs and shared " +
  "journey context — so fertility clinics can coordinate surrogacy journeys " +
  "through their own workflow, however the carrier entered the journey. " +
  "Outside providers still take part; the clinic stays the coordinating " +
  "center, and the clinic and its providers keep full administrative control.";

/** Shorter, for cards where only the first two lines survive the crop. */
export const SOCIAL_DESCRIPTION =
  "Run every surrogacy journey through one clinic-led workflow. Natalyx " +
  "automates the agency's manual coordination so the journey runs through " +
  "the practice the patient already trusts, rather than an intermediary. " +
  "Register your clinic's interest.";

export const CLINIC_INTEREST_TITLE = "Register your clinic's interest — Natalyx";

export const CLINIC_INTEREST_DESCRIPTION =
  "Tell Natalyx about your clinic. Natalyx automates the agency's manual " +
  "coordination and keeps surrogacy journeys running through the clinic: " +
  "four details, no patient information.";

/**
 * Structured data for the landing page.
 *
 * Deliberately narrow. It states who Natalyx is for and what it is, and
 * nothing a crawler could read as a claim we cannot support - no `offers`, no
 * `aggregateRating`, no `review`, no customer count. The description is the
 * same string the page renders in its meta tags, so a crawler and a reader
 * cannot be told two different positions.
 */
export function buildStructuredData(siteUrl: string = SITE_URL) {
  const organizationId = `${siteUrl}/#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        url: siteUrl,
        logo: `${siteUrl}/natalyx_primary_logo.png`,
        description: SITE_DESCRIPTION,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#software`,
        name: SITE_NAME,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: SITE_DESCRIPTION,
        provider: { "@id": organizationId },
        audience: {
          "@type": "Audience",
          audienceType: "Fertility clinics",
        },
      },
    ],
  };
}
