"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error") ?? undefined;
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    const supabaseClient = getSupabaseBrowserClient();
    if (!supabaseClient) {
      setLocalError("Supabase environment variables are not configured.");
      return;
    }
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(callbackUrl)}`;
    const { error: authError } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (authError) {
      setLocalError(authError.message);
    }
  };

  const errorText = useMemo(() => {
    if (localError) return localError;
    if (!error) return null;
    if (error === "session_expired") return "Your session expired. Please sign in again.";
    return "Sign-in required.";
  }, [error, localError]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(121,183,255,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(58,214,159,0.12),transparent_28%)]" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(8,16,28,0.78)] shadow-[0_30px_90px_rgba(3,8,18,0.5)] backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
        <section className="border-b border-white/10 px-8 py-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
            Archi.dev Studio
          </div>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight text-white lg:text-5xl">
            Step back into your backend workspace.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 lg:text-base">
            Sign in with Google to restore your saved studio session, continue modeling APIs and data flows, and generate code from the same architecture canvas.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              Continue from your last saved architecture and layout.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              Keep auth tokens in HTTP-only cookies managed through Supabase.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              Jump straight back into code generation, testing, and iteration.
            </div>
          </div>
        </section>

        <section className="flex items-center px-8 py-10 lg:px-10 lg:py-14">
          <div className="w-full rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Authentication
            </div>
            <h2 className="text-2xl font-semibold text-white">Sign in with Google</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              We&apos;ll return you to your workspace after authentication.
            </p>
            <button
              onClick={handleLogin}
              className="mt-6 w-full rounded-2xl border border-sky-300/30 bg-[linear-gradient(135deg,rgba(121,183,255,0.95),rgba(77,147,255,0.85))] px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_16px_34px_rgba(77,147,255,0.35)] transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Sign in with Google
            </button>
            <div className="mt-4 text-xs leading-6 text-slate-400">
              Callback: <span className="text-slate-200">{callbackUrl}</span>
            </div>
            {errorText && (
              <div className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {errorText}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
