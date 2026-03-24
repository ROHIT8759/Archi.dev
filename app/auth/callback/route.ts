import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const error = requestUrl.searchParams.get("error");
  const next = requestUrl.searchParams.get("next") ?? "/studio";

  // Handle Auth0 errors
  if (error) {
    const errorUrl = new URL("/login", requestUrl.origin);
    errorUrl.searchParams.set("error", "auth_error");
    errorUrl.searchParams.set("error_description", error);
    errorUrl.searchParams.set("callbackUrl", next);
    return NextResponse.redirect(errorUrl, { status: 303 });
  }

  if (!code) {
    const errorUrl = new URL("/login", requestUrl.origin);
    errorUrl.searchParams.set("error", "no_code");
    errorUrl.searchParams.set("callbackUrl", next);
    return NextResponse.redirect(errorUrl, { status: 303 });
  }

  try {
    // Exchange Auth0 code for tokens
    const tokenUrl = `https://${process.env.AUTH0_BASE_URL}/oauth/token`;
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.AUTH0_CLIENT_ID!,
        client_secret: process.env.AUTH0_CLIENT_SECRET!,
        code,
        redirect_uri: `${requestUrl.origin}/auth/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for tokens");
    }

    const tokens = await tokenResponse.json();

    // Get user info from Auth0
    const userInfoUrl = `https://${process.env.AUTH0_BASE_URL}/userinfo`;
    const userInfoResponse = await fetch(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error("Failed to get user info");
    }

    const userInfo = await userInfoResponse.json();

    // Store user session in Supabase
    const redirectResponse = NextResponse.redirect(new URL(next, requestUrl.origin), { status: 303 });
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
              redirectResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Create or update user in Supabase
    const { error: userError } = await supabase.from("users").upsert({
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      avatar: userInfo.picture,
      auth_provider: "auth0",
      last_sign_in: new Date().toISOString(),
    });

    if (userError) {
      console.error("Error upserting user:", userError);
    }

    // User is authenticated, redirect to next page
    return redirectResponse;
  } catch (error) {
    console.error("Auth0 callback error:", error);
    const errorUrl = new URL("/login", requestUrl.origin);
    errorUrl.searchParams.set("error", "callback_error");
    errorUrl.searchParams.set("callbackUrl", next);
    return NextResponse.redirect(errorUrl, { status: 303 });
  }
}
