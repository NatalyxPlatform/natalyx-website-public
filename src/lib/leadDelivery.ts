import {
  CLINIC_INTEREST_LEAD_TYPE,
  CLINIC_INTEREST_SCHEMA_VERSION,
  CLINIC_INTEREST_SOURCE,
} from "./constants";
import { getSupabaseAdmin } from "./supabase";
import {
  normalizePhone,
  sanitizeReferrer,
  type ClinicInterestParsed,
} from "./validation";

/**
 * Clinic-interest leads live in their own table. The historical participant
 * leads captured by the retired `/signup` flow stay in
 * `marketing_private.public_interest_leads` and are never rewritten, merged, or
 * reinterpreted as clinic submissions.
 */
export const CLINIC_INTEREST_TABLE = "clinic_interest_leads";


export type ClinicInterestLead = {
  clinic_name: string;
  contact_name: string;
  work_email: string;
  phone: string;
  phone_normalized: string;
  consent_to_contact: boolean;
  lead_type: typeof CLINIC_INTEREST_LEAD_TYPE;
  schema_version: number;
  source: string;
  user_agent: string | null;
  referrer: string | null;
};

export type LeadRequestMetadata = {
  userAgent?: string | null;
  referrer?: string | null;
};

/**
 * The exact record that leaves this application. Deliberately built from named
 * fields rather than spreading the parsed body, so a field added to the client
 * form can never reach delivery without passing through here.
 */
export function buildClinicInterestLead(
  parsed: ClinicInterestParsed,
  meta: LeadRequestMetadata = {}
): ClinicInterestLead {
  return {
    clinic_name: parsed.clinic_name,
    contact_name: parsed.contact_name,
    work_email: parsed.work_email,
    phone: parsed.phone,
    phone_normalized: normalizePhone(parsed.phone),
    consent_to_contact: parsed.consent_to_contact,
    lead_type: CLINIC_INTEREST_LEAD_TYPE,
    schema_version: CLINIC_INTEREST_SCHEMA_VERSION,
    source: CLINIC_INTEREST_SOURCE,
    user_agent: meta.userAgent?.slice(0, 500) ?? null,
    referrer: sanitizeReferrer(meta.referrer),
  };
}

/**
 * Channels this server can actually reach.
 *
 * Web3Forms is deliberately absent: their free plan rejects server-to-server
 * calls (403 "Use our API in client side"), so email delivery happens in the
 * browser after this route validates. See src/lib/constants.ts.
 */
export type DeliveryChannelName = "supabase" | "log";

export class LeadDeliveryError extends Error {
  constructor(readonly failures: { channel: DeliveryChannelName; reason: string }[]) {
    super(
      `Every configured delivery channel failed: ${failures
        .map((f) => `${f.channel} (${f.reason})`)
        .join(", ")}`
    );
    this.name = "LeadDeliveryError";
  }
}

type Env = Record<string, string | undefined>;

/**
 * Server-side storage channels. May legitimately be empty: email delivery is
 * the browser's job now, so a deployment with no Supabase still works.
 *
 * `LEAD_DELIVERY_MODE=log` is an explicit local escape hatch. It both records
 * the lead server-side and suppresses the browser's Web3Forms call, so the
 * whole path can be exercised without sending anything to a third party.
 */
export function resolveDeliveryChannels(env: Env = process.env): DeliveryChannelName[] {
  if (env.LEAD_DELIVERY_MODE === "log") {
    return ["log"];
  }

  const channels: DeliveryChannelName[] = [];
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    channels.push("supabase");
  }
  return channels;
}

function redactEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  return `${local.slice(0, 1)}***@${domain}`;
}

function redactPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length <= 2 ? "***" : `***${digits.slice(-2)}`;
}

/**
 * Append-only: every accepted submission becomes a row. Dropping a repeat
 * submission would discard a corrected phone number, or a second clinic
 * registered from one address, while the page told the sender it was recorded.
 * De-duplication belongs to whoever reads these leads.
 */
async function deliverToSupabase(lead: ClinicInterestLead): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from(CLINIC_INTEREST_TABLE).insert(lead);

  if (error) {
    throw new Error(error.message);
  }
}


/**
 * Logs enough to prove the pipeline ran and which fields it carried, without
 * writing full contact details to the server log.
 */
function deliverToLog(lead: ClinicInterestLead): void {
  console.info("[clinic-interest] lead accepted", {
    fields: Object.keys(lead).sort(),
    lead_type: lead.lead_type,
    schema_version: lead.schema_version,
    source: lead.source,
    clinic_name: lead.clinic_name,
    contact_name_present: lead.contact_name.length > 0,
    work_email: redactEmail(lead.work_email),
    phone: redactPhone(lead.phone_normalized),
    consent_to_contact: lead.consent_to_contact,
    // Sanitized to origin + path, so this carries no query data and no PII.
    referrer: lead.referrer,
  });
}

/**
 * Runs every configured server-side channel.
 *
 * Storage is best-effort and never decides the outcome of a submission: the
 * authoritative delivery is the browser's Web3Forms call, and the form only
 * reports success once that succeeds. Throws only when channels were
 * configured and every one of them failed, so a broken Supabase is still
 * surfaced rather than swallowed.
 */
export async function deliverClinicInterestLead(
  lead: ClinicInterestLead,
  env: Env = process.env
): Promise<{ delivered: DeliveryChannelName[] }> {
  const channels = resolveDeliveryChannels(env);
  if (channels.length === 0) {
    return { delivered: [] };
  }

  const delivered: DeliveryChannelName[] = [];
  const failures: { channel: DeliveryChannelName; reason: string }[] = [];

  for (const channel of channels) {
    try {
      if (channel === "supabase") {
        await deliverToSupabase(lead);
      } else {
        deliverToLog(lead);
      }
      delivered.push(channel);
    } catch (error) {
      failures.push({
        channel,
        reason: error instanceof Error ? error.message : "unknown error",
      });
    }
  }

  if (delivered.length === 0) {
    throw new LeadDeliveryError(failures);
  }

  if (failures.length > 0) {
    console.warn(
      "[clinic-interest] partial delivery",
      failures.map((f) => `${f.channel}: ${f.reason}`)
    );
  }

  return { delivered };
}
