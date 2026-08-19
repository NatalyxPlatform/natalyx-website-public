/** Where every acquisition CTA on the public site points. */
export const CLINIC_INTEREST_PATH = "/clinic-interest";

/** Server route that accepts clinic-interest submissions. */
export const CLINIC_INTEREST_ENDPOINT = "/api/clinic-interest";

/**
 * Lead discriminators. These travel with every delivered record so clinic
 * interest can never be confused with the historical participant leads
 * captured by the retired `/signup` flow.
 */
export const CLINIC_INTEREST_LEAD_TYPE = "clinic_interest";
export const CLINIC_INTEREST_SCHEMA_VERSION = 1;
export const CLINIC_INTEREST_SOURCE = "website_clinic_interest";

export const CONTACT_EMAIL = "hello@natalyx.health";

export const DEVELOPER_ACCESS_URL =
  process.env.NEXT_PUBLIC_DEVELOPER_ACCESS_URL ??
  "https://dev.app.natalyx.health/login";
