const SUPABASE_ORIGIN = process.env.NEXT_PUBLIC_SUPABASE_URL
  || "https://omzlxuzswxlixjjvexcx.supabase.co";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyAuth(request: Request, context: RouteContext) {
  const { path } = await context.params;

  if (path[0] !== "auth" || path[1] !== "v1") {
    return Response.json({ message: "Rota não permitida." }, { status: 404 });
  }

  const requestUrl = new URL(request.url);
  const target = new URL(path.map(encodeURIComponent).join("/"), `${SUPABASE_ORIGIN}/`);
  target.search = requestUrl.search;

  const headers = new Headers(request.headers);
  for (const name of [
    "host",
    "cookie",
    "origin",
    "referer",
    "content-length",
    "accept-encoding",
  ]) {
    headers.delete(name);
  }

  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer(),
      redirect: "manual",
    });

    const responseHeaders = new Headers(upstream.headers);
    for (const name of ["content-length", "content-encoding", "transfer-encoding", "set-cookie"]) {
      responseHeaders.delete(name);
    }
    responseHeaders.set("cache-control", "no-store");

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      {
        code: "service_unavailable",
        message: "Authentication service unavailable",
      },
      {
        status: 503,
        headers: { "cache-control": "no-store" },
      },
    );
  }
}

export const GET = proxyAuth;
export const POST = proxyAuth;
export const PUT = proxyAuth;
export const PATCH = proxyAuth;
export const DELETE = proxyAuth;
