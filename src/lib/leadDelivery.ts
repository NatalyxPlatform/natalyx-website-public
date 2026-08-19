import {
  CLINIC_INTEREST_LEAD_TYPE,
  CLINIC_INTEREST_SCHEMA_VERSION,
  CLINIC_INTEREST_SOURCE,
} from "./constants";
import { getSupabaseAdmin } from "./supabase";
import { normalizePhone, type ClinicInterestParsed } from "./validation";

/**
 * Clinic-interest leads live in their own table. The historical participant
 * leads captured by the retired `/signup` flow stay in
 * `marketing_private.public_interest_leads` and are never rewritten, merged, or
 * reinterpreted as clinic submissions.
 */
export const CLINIC_INTEREST_TABLE = "clinic_interest_leads";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

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
    referrer: meta.referrer?.slice(0, 500) ?? null,
  };
}

export type DeliveryChannelName = "supabase" | "web3forms" | "log";

export class LeadDeliveryConfigError extends Error {
  constructor() {
    super(
      "No clinic-interest delivery channel is configured. Set SUPABASE_URL + " +
        "SUPABASE_SERVICE_ROLE_KEY, or WEB3FORMS_ACCESS_KEY, or " +
        "LEAD_DELIVERY_MODE=log for local development."
    );
    this.name = "LeadDeliveryConfigError";
  }
}

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
 * `LEAD_DELIVERY_MODE=log` is an explicit local/preview escape hatch: it keeps
 * the whole submission path real while sending nothing to a third party. It is
 * never the default, so an unconfigured deployment fails loudly instead of
 * silently accepting leads it cannot deliver.
 */
export function resolveDeliveryChannels(env: Env = process.env): DeliveryChannelName[] {
  if (env.LEAD_DELIVERY_MODE === "log") {
    return ["log"];
  }

  const channels: DeliveryChannelName[] = [];
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    channels.push("supabase");
  }
  if (env.WEB3FORMS_ACCESS_KEY) {
    channels.push("web3forms");
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

async function deliverToSupabase(lead: ClinicInterestLead): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from(CLINIC_INTEREST_TABLE)
    .upsert(lead, { onConflict: "work_email", ignoreDuplicates: true });

  if (error) {
    throw new Error(error.message);
  }
}

async function deliverToWeb3Forms(
  lead: ClinicInterestLead,
  accessKey: string
): Promise<void> {
  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: "New Natalyx clinic interest registration",
      from_name: "Natalyx website",
      ...lead,
    }),
  });

  const payload = (await response
    .json()
    .catch(() => ({ success: false }))) as { success?: boolean; message?: string };

  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? `HTTP ${response.status}`);
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
  });
}

/**
 * Delivers to every configured channel. Succeeds when at least one channel
 * accepts the lead; throws when none is configured or all of them fail, so the
 * route can never report success for a lead that went nowhere.
 */
export async function deliverClinicInterestLead(
  lead: ClinicInterestLead,
  env: Env = process.env
): Promise<{ delivered: DeliveryChannelName[] }> {
  const channels = resolveDeliveryChannels(env);
  if (channels.length === 0) {
    throw new LeadDeliveryConfigError();
  }

  const delivered: DeliveryChannelName[] = [];
  const failures: { channel: DeliveryChannelName; reason: string }[] = [];

  for (const channel of channels) {
    try {
      if (channel === "supabase") {
        await deliverToSupabase(lead);
      } else if (channel === "web3forms") {
        await deliverToWeb3Forms(lead, env.WEB3FORMS_ACCESS_KEY as string);
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
