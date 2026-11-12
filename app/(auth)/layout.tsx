import { redirect } from "next/navigation";
import { DIRECT_ACCESS } from "../../lib/app-mode";
import "../auth.css";

export const dynamic = "force-dynamic";

export default function AuthenticationLayout({ children }: { children: React.ReactNode }) {
  if (DIRECT_ACCESS) redirect("/dashboard");
  return children;
}
