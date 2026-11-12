// The publishable key is intentionally safe for browser use. Keeping the
// project values as fallbacks makes Sites builds reliable even when public
// runtime variables are injected after the client bundle is generated.
export const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  || "https://omzlxuzswxlixjjvexcx.supabase.co";
export const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9temx4dXpzd3hsaXhqanZleGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTA4NjMsImV4cCI6MjA3OTgyNjg2M30.TvI5VTcL99kqZQVAYsvhkUjRm9uT7qqqFjSXeH8TQA0";


// Stable across the canonical project URL and the same-origin auth proxy.
export const authCookieName = `sb-${new URL(projectUrl).hostname.split(".")[0]}-auth-token`;

export const authCookieOptions = { name: authCookieName, path: "/", sameSite: "lax" as const };

export async function authFetch(input: RequestInfo | URL, init?: RequestInit) {
  const timeout = AbortSignal.timeout(12_000);
  const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
  return fetch(input, { ...init, signal });
}
