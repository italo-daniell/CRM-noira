export function safeRedirectPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  try {
    const url = new URL(value, "https://noira.local");
    if (url.origin !== "https://noira.local") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function authErrorMessage(error: { code?: string; message?: string } | null) {
  if (!error) return "Não foi possível concluir. Tente novamente.";
  const code = error.code || "";
  const message = (error.message || "").toLowerCase();

  if (code === "invalid_credentials" || message.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }
  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar.";
  }
  if (code === "user_already_exists" || message.includes("already registered")) {
    return "Já existe uma conta com este e-mail.";
  }
  if (code === "email_address_not_authorized" || message.includes("email address not authorized")) {
    return "O envio de confirmação ainda não está habilitado para este e-mail. Fale com o administrador da NOIRA.";
  }
  if (code === "weak_password" || message.includes("password should be")) {
    return "Crie uma senha com pelo menos 8 caracteres.";
  }
  if (code === "over_email_send_rate_limit" || code === "over_request_rate_limit" || message.includes("rate limit")) {
    return "Muitas tentativas seguidas. Aguarde um pouco e tente novamente.";
  }
  if (code === "same_password" || message.includes("different from the old password")) {
    return "A nova senha deve ser diferente da senha atual.";
  }
  if (message.includes("expired") || message.includes("invalid token") || message.includes("pkce")) {
    return "Este link expirou ou já foi usado. Solicite um novo link.";
  }
  if (code === "unexpected_failure" || message.includes("sending confirmation") || message.includes("sending recovery")) {
    return "Não foi possível enviar o e-mail. Tente novamente mais tarde; se persistir, o administrador deve verificar o serviço de envio.";
  }
  if (message.includes("timeout") || message.includes("abort") || message.includes("lock")) {
    return "A conexão demorou mais que o esperado. Tente novamente em instantes.";
  }
  if (code === "service_unavailable" || message.includes("network") || message.includes("fetch")) {
    return "O serviço de autenticação está temporariamente indisponível. Tente novamente em instantes.";
  }
  return "Não foi possível concluir. Revise os dados e tente novamente.";
}
