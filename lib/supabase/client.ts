import { createBrowserClient } from "@supabase/ssr";

// The publishable key is intentionally safe for browser use. Keeping the
// project values as fallbacks makes Sites builds reliable even when public
// runtime variables are injected after the client bundle is generated.
const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  || "https://omzlxuzswxlixjjvexcx.supabase.co";
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9temx4dXpzd3hsaXhqanZleGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTA4NjMsImV4cCI6MjA3OTgyNjg2M30.TvI5VTcL99kqZQVAYsvhkUjRm9uT7qqqFjSXeH8TQA0";

export function createClient() {
  // Route browser authentication through the Site's own origin. This avoids
  // login failures when a visitor's DNS provider temporarily caches a paused
  // Supabase project as unavailable after the project has been restored.
  const browserProjectUrl = typeof window === "undefined"
    ? projectUrl
    : `${window.location.origin}/api/supabase`;

  return createBrowserClient(browserProjectUrl, publishableKey);
}
