import { AuthForm } from "../AuthForm";

export default function ForgotPasswordPage() {
  return <AuthForm mode="forgot" redirectTo="/redefinir-senha" />;
}
