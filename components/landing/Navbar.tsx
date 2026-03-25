"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type NavUser = {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

const navLinks = [
  { label: "Product", href: "/#product" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user as NavUser);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser((session?.user as NavUser) ?? null);
      setAvatarFailed(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
        setMobileOpen(false);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const indicatorLink = hoveredLink ?? activeLink;

  const userMeta = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const displayName =
    (typeof userMeta.full_name === "string" && userMeta.full_name) ||
    (typeof userMeta.name === "string" && userMeta.name) ||
    user?.email?.split("@")[0] ||
    "Account";
  const avatarUrl =
    (typeof userMeta.avatar_url === "string" && userMeta.avatar_url) ||
    (typeof userMeta.picture === "string" && userMeta.picture) ||
    "";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U";

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <motion.nav
          initial={false}
          animate={{
            maxWidth: scrolled ? "1000px" : "1280px",
            borderRadius: scrolled ? "999px" : "0px",
            y: hidden ? -100 : scrolled ? 16 : 0,
            opacity: hidden ? 0 : 1,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto w-full transition-colors duration-500 flex items-center justify-between px-6 py-4 ${
            scrolled
              ? "glass-panel shadow-2xl border border-white/10 backdrop-blur-md bg-black/40"
              : "bg-transparent"
          }`}
        >
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <polygon
                points="12,2 20,7 20,17 12,22 4,17 4,7"
                stroke="#00F0FF"
                strokeWidth="1.5"
                strokeLinejoin="round"
                fill="none"
                opacity="0.92"
              />
              <circle cx="12" cy="12" r="2.4" fill="#00F0FF" opacity="0.85" />
              <line x1="12" y1="2" x2="12" y2="9.6" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.38" />
              <line x1="20" y1="7" x2="14.1" y2="10.3" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.38" />
              <line x1="20" y1="17" x2="14.1" y2="13.7" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.38" />
              <line x1="12" y1="22" x2="12" y2="14.4" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.38" />
              <line x1="4" y1="17" x2="9.9" y2="13.7" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.38" />
              <line x1="4" y1="7" x2="9.9" y2="10.3" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.38" />
            </svg>
            <span
              className="font-semibold text-lg tracking-tight select-none"
              style={{
                background: "linear-gradient(90deg, #FFFFFF 55%, rgba(0,240,255,0.75) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Archi.dev
            </span>
          </button>

          {/* Nav links */}
          <div
            className="hidden md:flex items-center gap-8"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {navLinks.map(({ label, href }) => (
              <button
                key={label}
                type="button"
                className="relative text-white/60 hover:text-white transition-colors duration-200 text-sm font-medium py-1"
                onMouseEnter={() => setHoveredLink(label)}
                onClick={() => {
                  setActiveLink(label);
                  router.push(href);
                }}
              >
                {label}
                {indicatorLink === label && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, #00F0FF, transparent)",
                    }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right — auth-aware */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="hidden md:block text-white/55 hover:text-white transition-colors duration-200 text-sm font-medium cursor-pointer"
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/settings")}
                  className="navbar-account-avatar"
                  aria-label={`Account: ${displayName}`}
                  title={displayName}
                >
                  {avatarUrl && !avatarFailed ? (
                    <Image
                      src={avatarUrl}
                      alt={displayName}
                      width={32}
                      height={32}
                      onError={() => setAvatarFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[11px] font-bold text-white/80 select-none">
                      {initials}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="hidden md:block text-white/45 hover:text-white transition-colors duration-200 text-sm font-medium cursor-pointer"
                >
                  Sign in
                </button>
                <motion.button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="shimmer-btn bg-white text-black px-5 py-2 rounded-full text-sm font-semibold cursor-pointer"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 22px rgba(255,255,255,0.32)",
                  }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  Start free trial
                </motion.button>
              </>
            )}
            <button
              type="button"
              className="md:hidden p-1.5 text-white/60 hover:text-white transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[72px] left-4 right-4 z-40 glass-panel rounded-2xl p-6 md:hidden"
          >
            {navLinks.map(({ label, href }, i) => (
              <motion.button
                key={label}
                type="button"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="block w-full text-left text-white/70 hover:text-white py-3.5 text-base font-medium border-b border-white/[0.06] last:border-0 transition-colors"
                onClick={() => {
                  setActiveLink(label);
                  setMobileOpen(false);
                  router.push(href);
                }}
              >
                {label}
              </motion.button>
            ))}
            {user ? (
              <>
                <motion.button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    router.push("/dashboard");
                  }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-5 w-full bg-white/[0.08] border border-white/[0.1] text-white py-3 rounded-full text-sm font-semibold"
                >
                  Dashboard
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    router.push("/settings");
                  }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.27, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-2 w-full text-white/35 text-sm text-center py-1.5 hover:text-white/60 transition-colors"
                >
                  {displayName}
                </motion.button>
              </>
            ) : (
              <motion.button
                type="button"
                onClick={() => router.push("/login")}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 w-full bg-white text-black py-3 rounded-full text-sm font-semibold"
              >
                Start free trial
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
