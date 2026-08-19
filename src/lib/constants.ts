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

/**
 * Web3Forms must be called from the browser.
 *
 * Their free plan rejects server-to-server calls outright:
 *   403 "This method is not allowed. Use our API in client side or contact
 *        support with server IP address (Pro plan is required)"
 *
 * So email delivery is a client-side step. The server still validates,
 * rate-limits and honeypot-checks first, and tells the browser exactly what to
 * forward - the browser never composes the payload itself.
 *
 * The access key is public by Web3Forms' design (it is normally embedded in
 * client-side HTML) and names a destination inbox. `NEXT_PUBLIC_` is correct
 * here: this genuinely does belong in the browser bundle.
 */
export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ??
  "3bf87d87-e4b2-459a-aad2-549e24d5e1e2";

export const DEVELOPER_ACCESS_URL =
  process.env.NEXT_PUBLIC_DEVELOPER_ACCESS_URL ??
  "https://dev.app.natalyx.health/login";
