import { safeRedirectPath } from "../../../lib/auth";
import { AuthForm } from "../AuthForm";

type Props = { searchParams: Promise<{ estado?: string; next?: string }> };

export default async function ConfirmEmailPage({ searchParams }: Props) {
  const query = await searchParams;
  return (
    <AuthForm
      mode="confirm"
      redirectTo={safeRedirectPath(query.next)}
      confirmationState={query.estado === "confirmado" ? "confirmed" : "pending"}
    />
  );
}
