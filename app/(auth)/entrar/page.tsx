import { safeRedirectPath } from "../../../lib/auth";
import { AuthForm } from "../AuthForm";

type Props = { searchParams: Promise<{ redirecionar?: string; erro?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const query = await searchParams;
  return (
    <AuthForm
      mode="login"
      redirectTo={safeRedirectPath(query.redirecionar)}
      initialError={query.erro === "link-invalido" ? "O link é inválido ou expirou. Solicite um novo." : ""}
    />
  );
}
