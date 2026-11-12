import { DIRECT_ACCESS } from "../../lib/app-mode";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (DIRECT_ACCESS) return children;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/entrar?redirecionar=/dashboard");
  return children;
}
