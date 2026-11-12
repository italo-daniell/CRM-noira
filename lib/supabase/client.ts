import { createBrowserClient } from "@supabase/ssr";
import { projectUrl, publishableKey, authCookieOptions, authFetch } from "./config";

export function createClient() {
  // Keep the canonical project URL so auth cookies and PKCE verifier keys
  // match the server. Only the HTTP transport goes through our own origin.
  return createBrowserClient(projectUrl, publishableKey, {
    cookieOptions: authCookieOptions,
    global: {
      fetch: (input, init) => {
        const url = String(input);
        const target = typeof window !== "undefined" && url.startsWith(`${projectUrl}/auth/v1/`)
          ? `${window.location.origin}/api/supabase${url.slice(projectUrl.length)}`
          : input;
        return authFetch(target, init);
      },
    },
  });
}
