import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const nextParam = requestUrl.searchParams.get("next") ?? "/studio";
  const safeRedirect = (() => {
    if (!nextParam) return "/studio";
    if (nextParam.startsWith("/")) return nextParam;
    try {
      const parsed = new URL(nextParam);
      if (parsed.origin === requestUrl.origin) {
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
    } catch {
      // ignore invalid URL
    }
    return "/studio";
  })();

  if (error) {
    const errorUrl = new URL("/login", requestUrl.origin);
    errorUrl.searchParams.set("error", "oauth_error");
    errorUrl.searchParams.set("error_description", error);
    errorUrl.searchParams.set("callbackUrl", safeRedirect);
    return NextResponse.redirect(errorUrl, { status: 303 });
  }

  if (!code) {
    const errorUrl = new URL("/login", requestUrl.origin);
    errorUrl.searchParams.set("error", "no_code");
    errorUrl.searchParams.set("callbackUrl", safeRedirect);
    return NextResponse.redirect(errorUrl, { status: 303 });
  }

  const redirectResponse = NextResponse.redirect(new URL(safeRedirect, requestUrl.origin), {
    status: 303,
  });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            redirectResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    const errorUrl = new URL("/login", requestUrl.origin);
    errorUrl.searchParams.set("error", "callback_error");
    errorUrl.searchParams.set("callbackUrl", safeRedirect);
    return NextResponse.redirect(errorUrl, { status: 303 });
  }

  return redirectResponse;
}
