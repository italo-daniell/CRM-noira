import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { safeRedirectPath } from "../../../lib/auth";
import { createClient } from "../../../lib/supabase/server";

const OTP_TYPES = new Set<EmailOtpType>([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const requestedType = url.searchParams.get("type");
  const type = requestedType && OTP_TYPES.has(requestedType as EmailOtpType)
    ? requestedType as EmailOtpType
    : null;
  const flow = url.searchParams.get("flow");
  const next = safeRedirectPath(url.searchParams.get("next"));
  const supabase = await createClient();
  let authenticated = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    authenticated = !error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    authenticated = !error;
  }

  if (authenticated) {
    if (flow === "recovery" || type === "recovery" || next.startsWith("/redefinir-senha")) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
    const confirmedUrl = new URL("/confirmar-email", url.origin);
    confirmedUrl.searchParams.set("estado", "confirmado");
    confirmedUrl.searchParams.set("next", next);
    return NextResponse.redirect(confirmedUrl);
  }

  const errorUrl = new URL("/entrar", url.origin);
  errorUrl.searchParams.set("erro", "link-invalido");
  return NextResponse.redirect(errorUrl);
}
