/**
 * Best-effort in-memory throttle for the public clinic-interest endpoint.
 *
 * Limitations, stated rather than papered over:
 * - Per process. A horizontally scaled or serverless deployment gets one
 *   counter per instance, so the effective limit is higher than the constant.
 * - The client address is taken from the hosting platform's forwarded headers.
 *   That is only trustworthy behind a proxy that overwrites them; a direct
 *   origin request can spoof `x-forwarded-for`.
 *
 * It exists because this application now owns a public POST endpoint that
 * relays to a delivery provider. It is a brake on casual abuse, not an
 * enforcement boundary.
 */
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
export const RATE_LIMIT_MAX_REQUESTS = 8;

const hits = new Map<string, number[]>();

export function clientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export function checkRateLimit(
  key: string,
  now: number = Date.now()
): RateLimitResult {
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  for (const [existingKey, timestamps] of hits) {
    const kept = timestamps.filter((t) => t > cutoff);
    if (kept.length === 0) hits.delete(existingKey);
    else hits.set(existingKey, kept);
  }

  const recent = hits.get(key) ?? [];
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldest = recent[0];
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000)
      ),
    };
  }

  hits.set(key, [...recent, now]);
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Test seam only. */
export function resetRateLimit(): void {
  hits.clear();
}
