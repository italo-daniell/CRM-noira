"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { Check, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { authErrorMessage } from "../../lib/auth";
import { createClient } from "../../lib/supabase/client";
import { ThemeToggle } from "../ThemeToggle";

type Mode = "login" | "signup" | "forgot" | "reset";
type Props = { mode: Mode; redirectTo: string; initialError?: string };

const copy: Record<Mode, { eyebrow: string; title: string; description: string; submit: string }> = {
  login: {
    eyebrow: "BEM-VINDO DE VOLTA",
    title: "Entre na sua conta",
    description: "Acesse suas conversas, contatos e oportunidades em um só lugar.",
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
};

export function AuthForm({ mode, redirectTo, initialError = "" }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryReady, setRecoveryReady] = useState(mode !== "reset");
  const current = copy[mode];

  useEffect(() => {
    if (mode !== "reset") return;
    const supabase = createClient();
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setRecoveryReady(Boolean(data.session));
      if (!data.session) setError("Abra novamente o link seguro enviado ao seu e-mail.");
    });
    return () => {
      active = false;
    };
  }, [mode]);

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
    if ((mode === "login" || mode === "signup" || mode === "reset") && password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if ((mode === "signup" || mode === "reset") && password !== confirmation) {
      setError("As senhas não são iguais.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    try {
      if (mode === "login") {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
        window.location.assign(redirectTo);
        return;
      }

      if (mode === "signup") {
        const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: callback },
        });
        if (signupError) throw signupError;
        if (data.session) {
          window.location.assign(redirectTo);
          return;
        }
        setSuccess("Conta criada. Enviamos um e-mail para você confirmar o acesso.");
      }

      if (mode === "forgot") {
        const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
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
        window.setTimeout(() => window.location.assign(redirectTo), 1200);
      }
    } catch (caught) {
      setError(authErrorMessage(caught as { code?: string; message?: string }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <header className="auth-topbar">
        <a href="/" className="auth-brand" aria-label="NOIRA — página inicial">
          <Image src="/noira-logo.jfif" alt="" width={38} height={38} priority unoptimized />
          <span>NOIRA</span>
        </a>
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

            {success ? (
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
                    <div><LockKeyhole aria-hidden="true" /><input name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Mínimo de 8 caracteres" disabled={loading || !recoveryReady} required /><button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff /> : <Eye />}</button></div>
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
                <button className="auth-submit" type="submit" disabled={loading || !recoveryReady}>
                  {loading ? <><span className="auth-spinner" /> Aguarde…</> : current.submit}
                </button>
              </>
            )}

            <footer className="auth-card-footer">
              {mode === "login" && <span>Ainda não tem uma conta? <a href="/criar-conta">Criar conta</a></span>}
              {mode === "signup" && <span>Já possui uma conta? <a href="/entrar">Entrar</a></span>}
              {(mode === "forgot" || mode === "reset") && <a href="/entrar">Voltar para o login</a>}
            </footer>
          </form>
        </div>
      </section>
    </main>
  );
}
