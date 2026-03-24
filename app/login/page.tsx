"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/studio";
  const error = searchParams.get("error") ?? undefined;
  const router = useRouter();
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Build Auth0 authorization URL
      const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
      const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
      const redirectUri = `${window.location.origin}/auth/callback`;
      
      if (!auth0Domain || !clientId) {
        setLocalError("Auth0 environment variables are not configured.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: "openid profile email",
        state: Math.random().toString(36).substring(7),
      });

      const authUrl = `https://${auth0Domain}/authorize?${params.toString()}`;
      window.location.href = authUrl;
    } catch (error) {
      setLocalError("Authentication failed. Please try again.");
      setLoading(false);
    }
  };

  const errorText = useMemo(() => {
    if (localError) return localError;
    if (!error) return null;
    if (error === "session_expired") return "Your session expired. Please sign in again.";
    return "Sign-in required.";
  }, [error, localError]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-10 text-white">
      {/* Background */}
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-40" />
      <div className="bg-noise absolute inset-0" />
      <motion.div
        className="absolute top-[-8%] right-[10%] w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,240,255,0.09) 0%, transparent 70%)", filter: "blur(72px)" }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[8%] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(138,43,226,0.1) 0%, transparent 68%)", filter: "blur(64px)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/[0.07] grid lg:grid-cols-[1.2fr_0.8fr]"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 100%)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
        }}
      >
        {/* Left — context panel */}
        <section className="border-b border-white/[0.06] lg:border-b-0 lg:border-r px-8 py-12 lg:px-12 lg:py-16">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-2.5 cursor-pointer mb-12"
            onClick={() => router.push("/")}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polygon points="12,2 20,7 20,17 12,22 4,17 4,7" stroke="#00F0FF" strokeWidth="1.5" strokeLinejoin="round" fill="none" opacity="0.92"/>
              <circle cx="12" cy="12" r="2.4" fill="#00F0FF" opacity="0.85"/>
              <line x1="12" y1="2" x2="12" y2="9.6" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.38"/>
              <line x1="20" y1="7" x2="14.1" y2="10.3" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.38"/>
              <line x1="20" y1="17" x2="14.1" y2="13.7" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.38"/>
              <line x1="12" y1="22" x2="12" y2="14.4" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.38"/>
              <line x1="4" y1="17" x2="9.9" y2="13.7" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.38"/>
              <line x1="4" y1="7" x2="9.9" y2="10.3" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.38"/>
            </svg>
            <span className="font-semibold text-lg tracking-tight select-none" style={{
              background: "linear-gradient(90deg, #FFFFFF 55%, rgba(0,240,255,0.75) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Archi.dev</span>
          </button>

          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full text-[#00F0FF] text-[10px] font-semibold uppercase tracking-[0.2em] mb-7 border border-white/[0.06]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-glow-cyan shrink-0" />
            Studio workspace
          </motion.span>

          <motion.h1
            initial={{ y: 24, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-gradient font-medium tracking-tighter leading-[0.9] mb-5"
            style={{ fontSize: "clamp(2.4rem, 4vw, 3.5rem)" }}
          >
            Back to your<br />workspace.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
            className="text-white/40 text-sm leading-7 max-w-xs mb-10"
          >
            Sign in to continue from your last architecture session — no configuration lost.
          </motion.p>

          <div className="space-y-2.5">
            {[
              { num: "01", text: "Continue from your last saved architecture and canvas layout.", accent: "#00F0FF" },
              { num: "02", text: "Secure authentication managed via Auth0.", accent: "#8A2BE2" },
              { num: "03", text: "Jump straight back into code generation and deployment.", accent: "#28C840" },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ x: -14, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.28 + i * 0.09, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3.5"
              >
                <span
                  className="text-[11px] font-bold font-mono mt-0.5 shrink-0 tabular-nums"
                  style={{ color: item.accent }}
                >
                  {item.num}
                </span>
                <span className="text-white/50 text-sm leading-relaxed">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Right — auth form */}
        <section className="flex items-center justify-center px-8 py-12 lg:px-10 lg:py-16">
          <motion.div
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="w-full"
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25 mb-1">
              Authentication
            </div>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">
              Sign in
            </h2>
            <p className="text-white/35 text-sm mb-8 leading-relaxed">
              We&apos;ll return you to your studio after authentication.
            </p>

            <motion.button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="shimmer-btn w-full rounded-2xl bg-white text-black py-3.5 text-sm font-semibold cursor-pointer flex items-center justify-center gap-3 disabled:opacity-55 transition-opacity"
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255,255,255,0.22)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-black/25 border-t-black animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#EB5424" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <path fill="#EB5424" d="M12 4v8l4 4"/>
                </svg>
              )}
              {loading ? "Signing in…" : "Continue with Auth0"}
            </motion.button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-white/20 text-xs">or</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-center">
              <p className="text-white/30 text-xs leading-relaxed">
                More auth methods coming soon — GitHub, email magic link.
              </p>
            </div>

            {errorText && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/[0.07] px-4 py-3 text-sm text-red-300/80"
              >
                {errorText}
              </motion.div>
            )}

            <p className="text-white/18 text-[11px] text-center mt-6 leading-relaxed">
              By signing in you agree to our{" "}
              <button type="button" className="underline underline-offset-2 hover:text-white/35 transition-colors">Terms</button>
              {" "}and{" "}
              <button type="button" className="underline underline-offset-2 hover:text-white/35 transition-colors">Privacy Policy</button>.
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-black text-white/30 text-sm">
        Loading…
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
