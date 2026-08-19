import "@testing-library/jest-dom/vitest";

/**
 * No test may make a real network request.
 *
 * This matters more than usual here: Web3Forms is now always a resolved
 * delivery channel, so a delivery test that forgets to stub `fetch` would post
 * a lead to the live inbox. Tests that need `fetch` stub it explicitly with
 * `vi.stubGlobal`; `vi.unstubAllGlobals` restores this guard, not the real one.
 */
globalThis.fetch = (async (input: RequestInfo | URL) => {
  throw new Error(
    `Unstubbed network request in a test: ${String(
      input instanceof Request ? input.url : input
    )}. Stub fetch with vi.stubGlobal("fetch", ...) instead.`
  );
}) as typeof fetch;
