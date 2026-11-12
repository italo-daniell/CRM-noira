import { projectUrl, publishableKey, authCookieOptions, authFetch } from "./config";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    projectUrl,
    publishableKey,
    {
      cookieOptions: authCookieOptions,
      global: { fetch: authFetch },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components cannot write cookies. A proxy can refresh
            // sessions later when authentication is enabled.
          }
        },
      },
    },
  );
}
