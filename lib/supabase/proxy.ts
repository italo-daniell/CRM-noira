import { DIRECT_ACCESS } from "../app-mode";
import { projectUrl, publishableKey, authCookieOptions, authFetch } from "./config";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/entrar",
  "/criar-conta",
  "/confirmar-email",
  "/recuperar-senha",
  "/redefinir-senha",
  "/auth",
];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) =>
    route === "/" ? pathname === "/" : pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (DIRECT_ACCESS) {
    const authPages = ["/entrar", "/criar-conta", "/recuperar-senha", "/redefinir-senha", "/confirmar-email"];
    if (authPages.includes(pathname)) return NextResponse.redirect(new URL("/dashboard", request.url));
    const openResponse = NextResponse.next({ request });
    openResponse.headers.set("Cache-Control", "private, no-store");
    return openResponse;
  }
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    projectUrl,
    publishableKey,
    {
      cookieOptions: authCookieOptions,
      global: { fetch: authFetch },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const authenticated = Boolean(data?.claims);
  const { search } = request.nextUrl;

  if (!authenticated && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.search = "";
    url.searchParams.set("redirecionar", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (authenticated && ["/entrar", "/criar-conta"].includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  response.headers.set("Cache-Control", "private, no-store");
  if (!authenticated && isPublicRoute(pathname)) return response;
  return response;
}
