"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Check, Eye, EyeOff, LockKeyhole, Mail, MailCheck, RotateCcw, ShieldCheck } from "lucide-react";
import { authErrorMessage, safeRedirectPath } from "../../lib/auth";
import { createClient } from "../../lib/supabase/client";
import { ThemeToggle } from "../ThemeToggle";

type Mode = "login" | "signup" | "forgot" | "reset" | "confirm";
type Props = {
  mode: Mode;
  redirectTo: string;
  initialError?: string;
  confirmationState?: "pending" | "confirmed";
};

const copy: Record<Mode, { eyebrow: string; title: string; description: string; submit: string }> = {
  login: {
    eyebrow: "BEM-VINDO DE VOLTA",
    title: "Entre na sua conta",
    description: "Entre com seu e-mail e senha. O login não exige um novo e-mail a cada acesso.",
    submit: "Entrar",
  },
  signup: {
    eyebrow: "COMECE AGORA",
    title: "Crie sua conta NOIRA",
    description: "Configure seu espaço comercial e comece a organizar seus leads.",
    submit: "Criar conta",
  },
  forgot: {
    eyebrow: "RECUPERAR ACESSO",
    title: "Esqueceu sua senha?",
    description: "Informe seu e-mail e enviaremos um link seguro para criar uma nova senha.",
    submit: "Enviar link de recuperação",
  },
  reset: {
    eyebrow: "NOVA SENHA",
    title: "Redefina sua senha",
    description: "Escolha uma nova senha segura para voltar à sua conta.",
    submit: "Salvar nova senha",
  },
  confirm: {
    eyebrow: "CONFIRMAÇÃO DE E-MAIL",
    title: "Verifique sua caixa de entrada",
    description: "Se sua conta ainda estiver pendente, use o link de confirmação enviado ao seu e-mail. Confira também a pasta de spam.",
    submit: "Reenviar e-mail",
  },
};

function maskedEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "seu e-mail";
  return `${name.slice(0, 2)}${"•".repeat(Math.max(2, Math.min(6, name.length - 2)))}@${domain}`;
}

export function AuthForm({
  mode,
  redirectTo,
  initialError = "",
  confirmationState = "pending",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryReady, setRecoveryReady] = useState(mode !== "reset");
  const [pendingEmail, setPendingEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const destination = safeRedirectPath(redirectTo);

  useEffect(() => {
    try { setPendingEmail(window.sessionStorage.getItem("noira:pending-email") || ""); } catch { /* Storage may be disabled. */ }
  }, []);

  useEffect(() => {
    if (!resendCooldown) return;
    const timer = window.setTimeout(() => setResendCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  function rememberEmail(email: string) {
    setPendingEmail(email);
    try { window.sessionStorage.setItem("noira:pending-email", email); } catch { /* Do not block auth. */ }
  }
  const [showConfirmationLink, setShowConfirmationLink] = useState(false);
  const current = copy[mode];

  useEffect(() => {
    if (mode !== "reset") return;
    const supabase = createClient();
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setRecoveryReady(Boolean(data.session));
      if (!data.session) setError("Abra novamente o link seguro enviado ao seu e-mail.");
    }).catch((caught) => {
      if (active) setError(authErrorMessage(caught));
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setRecoveryReady(true);
        setError("");
      }
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [mode]);

  async function resendConfirmation() {
    if (loading || resendCooldown) return;
    if (!/^\S+@\S+\.\S+$/.test(pendingEmail.trim())) {
      setError("Volte à criação de conta e informe seu e-mail novamente.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const callback = `${window.location.origin}/auth/callback?flow=signup&next=${encodeURIComponent(destination)}`;
      const { error: resendError } = await createClient().auth.resend({
        type: "signup",
        email: pendingEmail.trim().toLowerCase(),
        options: { emailRedirectTo: callback },
      });
      if (resendError) throw resendError;
      setSuccess("Solicitação recebida. Se a conta aguarda confirmação, confira seu e-mail e o spam. Se já confirmou, entre com sua senha.");
      setResendCooldown(60);
    } catch (caught) {
      setError(authErrorMessage(caught as { code?: string; message?: string }));
    } finally {
      setLoading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    const confirmation = String(form.get("confirmation") || "");

    setError("");
    setSuccess("");

    if (mode !== "reset" && !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Informe um e-mail válido.");
      return;
    }
    if ((mode === "signup" || mode === "reset") && password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if ((mode === "signup" || mode === "reset") && password !== confirmation) {
      setError("As senhas não são iguais.");
      return;
    }

    if (mode === "login" && !password) {
      setError("Informe sua senha.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      if (mode === "login") {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
        if (!data.session) throw { code: "service_unavailable" };
        window.location.assign(destination);
        return;
      }

      if (mode === "signup") {
        const callback = `${window.location.origin}/auth/callback?flow=signup&next=${encodeURIComponent(destination)}`;
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: callback },
        });
        if (signupError) throw signupError;
        if (data.user?.identities?.length === 0) {
          setError("Se você já possui conta, entre com sua senha ou use Esqueci minha senha. Para uma conta pendente, reenvie a confirmação.");
          rememberEmail(email);
          setShowConfirmationLink(true);
          return;
        }
        if (data.session) {
          window.location.assign(destination);
          return;
        }
        rememberEmail(email);
        window.location.assign(`/confirmar-email?estado=pendente&next=${encodeURIComponent(destination)}`);
        return;
      }

      if (mode === "forgot") {
        const callback = `${window.location.origin}/auth/callback?flow=recovery&next=${encodeURIComponent(destination)}`;
        const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: callback,
        });
        if (recoveryError) throw recoveryError;
        setSuccess("Se este e-mail estiver cadastrado, você receberá um link seguro em instantes.");
      }

      if (mode === "reset") {
        const { error: resetError } = await supabase.auth.updateUser({ password });
        if (resetError) throw resetError;
        setSuccess("Senha alterada com sucesso. Redirecionando para sua conta…");
        window.setTimeout(() => window.location.assign(destination), 1200);
      }
    } catch (caught) {
      const authError = caught as { code?: string; message?: string };
      if (mode === "login" && authError.code === "email_not_confirmed") {
        rememberEmail(email);
        setPendingEmail(email);
        setShowConfirmationLink(true);
      }
      setError(authErrorMessage(authError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <header className="auth-topbar">
        <Link href="/" className="auth-brand" aria-label="NOIRA — página inicial">
          <Image src="/noira-logo.jfif" alt="" width={38} height={38} priority unoptimized />
          <span>NOIRA</span>
        </Link>
        <ThemeToggle placement="site" />
      </header>

      <section className="auth-layout">
        <div className="auth-story" aria-hidden="true">
          <span className="auth-story-badge"><ShieldCheck /> Acesso protegido</span>
          <h2>Seu comercial organizado, seguro e sempre acessível.</h2>
          <p>A NOIRA mantém cada conversa, contato e oportunidade conectados à sua equipe.</p>
          <div className="auth-story-card">
            <span><Check /> Sessão mantida com segurança</span>
            <span><Check /> Proteção das áreas internas</span>
            <span><Check /> Experiência clara em qualquer tela</span>
          </div>
        </div>

        <div className="auth-card-wrap">
          <form className="auth-card" onSubmit={submit} noValidate>
            <span className="auth-eyebrow">{current.eyebrow}</span>
            <h1>{current.title}</h1>
            <p>{current.description}</p>

            {mode === "confirm" && confirmationState === "confirmed" ? (
              <div className="auth-confirm-panel">
                <span className="auth-confirm-icon"><MailCheck /></span>
                <div className="auth-success auth-success-block" role="status">
                  <span><Check /></span>
                  <div><b>E-mail confirmado</b><p>Sua conta está pronta. Você já pode continuar para a área interna.</p></div>
                </div>
                <a className="auth-submit auth-action-link" href={redirectTo}>Continuar para o dashboard</a>
              </div>
            ) : mode === "confirm" ? (
              <div className="auth-confirm-panel">
                <span className="auth-confirm-icon"><MailCheck /></span>
                <p className="auth-confirm-email">Confirmação para <b>{pendingEmail ? maskedEmail(pendingEmail) : "o e-mail cadastrado"}</b>.</p>
                <label className="auth-field"><span>E-mail da conta</span><div><Mail aria-hidden="true" /><input type="email" autoComplete="email" value={pendingEmail} onChange={(event) => setPendingEmail(event.target.value)} disabled={loading} /></div></label>
                {success && (
                  <div className="auth-success" role="status">
                    <span><Check /></span>
                    <div><b>Tudo certo</b><p>{success}</p></div>
                  </div>
                )}
                {error && <div className="auth-error" role="alert">{error}</div>}
                <button className="auth-submit" type="button" onClick={resendConfirmation} disabled={loading || resendCooldown > 0}>
                  {loading ? <><span className="auth-spinner" /> Enviando…</> : <><RotateCcw /> {resendCooldown ? `Aguarde ${resendCooldown}s` : "Reenviar e-mail"}</>}
                </button>
              </div>
            ) : success ? (
              <div className="auth-success" role="status">
                <span><Check /></span>
                <div><b>Tudo certo</b><p>{success}</p></div>
              </div>
            ) : (
              <>
                {mode !== "reset" && (
                  <label className="auth-field">
                    <span>E-mail</span>
                    <div><Mail aria-hidden="true" /><input name="email" type="email" autoComplete="email" placeholder="voce@empresa.com.br" disabled={loading} required /></div>
                  </label>
                )}

                {(mode === "login" || mode === "signup" || mode === "reset") && (
                  <label className="auth-field">
                    <span>{mode === "reset" ? "Nova senha" : "Senha"}</span>
                    <div><LockKeyhole aria-hidden="true" /><input name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder={mode === "login" ? "Digite sua senha" : "Mínimo de 8 caracteres"} disabled={loading || !recoveryReady} required /><button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff /> : <Eye />}</button></div>
                  </label>
                )}

                {(mode === "signup" || mode === "reset") && (
                  <label className="auth-field">
                    <span>Confirmar senha</span>
                    <div><LockKeyhole aria-hidden="true" /><input name="confirmation" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Digite a senha novamente" disabled={loading || !recoveryReady} required /></div>
                  </label>
                )}

                {mode === "login" && <a className="auth-forgot" href="/recuperar-senha">Esqueci minha senha</a>}
                {error && <div className="auth-error" role="alert">{error}</div>}
                {showConfirmationLink && (
                  <a className="auth-inline-action" href={`/confirmar-email?estado=pendente&next=${encodeURIComponent(destination)}`}>
                    Reenviar confirmação de e-mail
                  </a>
                )}
                <button className="auth-submit" type="submit" disabled={loading || !recoveryReady}>
                  {loading ? <><span className="auth-spinner" /> Aguarde…</> : current.submit}
                </button>
              </>
            )}

            <footer className="auth-card-footer">
              {mode === "login" && <span>Ainda não tem uma conta? <a href="/criar-conta">Criar conta</a></span>}
              {mode === "signup" && <span>Já possui uma conta? <a href="/entrar">Entrar</a></span>}
              {(mode === "forgot" || mode === "reset") && <a href="/entrar">Voltar para o login</a>}
              {mode === "confirm" && <span>Já confirmou? <a href={`/entrar?redirecionar=${encodeURIComponent(destination)}`}>Entrar na conta</a></span>}
            </footer>
          </form>
        </div>
      </section>
    </main>
  );
}
