"use client";
import { useRef } from "react";
import { motion, useSpring, useTransform, useScroll } from "framer-motion";
import { useRouter } from "next/navigation";

const footerLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Status", href: "/status" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
  { label: "Changelog", href: "/changelog" },
];
const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://twitter.com",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];
export default function CTAFooter() {
  const router = useRouter();
  const containerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-20%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const springConfig = { stiffness: 400, damping: 25, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.15);
    y.set((e.clientY - cy) * 0.15);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <footer ref={containerRef} className="relative flex min-h-[84vh] flex-col items-center justify-center overflow-hidden bg-black">
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle at center, rgba(0,240,255,0.15) 0%, rgba(138,43,226,0.05) 50%, transparent 100%)",
          y: backgroundY,
          opacity
        }}
      />
      <motion.video
        style={{ y: backgroundY, scale }}
        src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connections-loop-28828-large.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.25] mix-blend-screen pointer-events-none"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 20%, #000000 80%)",
        }}
      />
      <div className="bg-noise absolute inset-0 opacity-50" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {[320, 540, 760, 980, 1200, 1500].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border border-white/[0.03]"
            style={{
              width: size,
              height: size,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.02, 1],
            }}
            transition={{
              rotate: { duration: 150 + i * 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 8 + i, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <motion.div
              className="absolute top-0 left-1/2 w-1 h-1 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]"
              style={{ opacity: 0.3 + (i * 0.1) }}
            />
          </motion.div>
        ))}
      </div>
      <div className="relative z-10 flex-1 w-full max-w-7xl px-6 pt-28 pb-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex justify-center lg:justify-start"
        >
          <span className="glass-panel px-6 py-2.5 rounded-full text-[#00F0FF] text-xs font-semibold uppercase tracking-[0.25em] flex items-center gap-3 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-glow-cyan" />
            Start today
          </span>
        </motion.div>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="text-center lg:text-left">
            <motion.h2
              initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
              whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-white font-medium tracking-tighter leading-[0.9] mb-8"
              style={{
                fontSize: "clamp(3.6rem, 9vw, 8rem)",
                textShadow: "0 20px 60px rgba(0,0,0,0.5)"
              }}
            >
              Ready to
              <br />
              build for real?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
              className="mx-auto max-w-xl text-base leading-relaxed text-white/42 lg:mx-0"
            >
              Launch your first architecture in minutes, keep the code portable, and ship a backend that still makes sense three months later.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
              className="relative mt-8 flex flex-col items-center gap-6 lg:items-start"
            >
              <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-[60px] pointer-events-none lg:left-[34%]" />
              <motion.button
                ref={buttonRef}
                type="button"
                onClick={() => router.push("/login")}
                style={{ x, y }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="group relative overflow-hidden rounded-full bg-white px-10 py-5 text-lg font-bold text-black cursor-pointer select-none"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/20 to-[#8A2BE2]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <span className="relative z-10 flex items-center gap-3">
                  Start building for free
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
              <p className="text-white/40 text-base font-light tracking-wide">
                No credit card required <span className="mx-2 opacity-30">•</span> Deploy in 60 seconds
              </p>
              <motion.div
                className="glass-panel flex items-center gap-4 rounded-full px-6 py-3"
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <div className="flex -space-x-3">
                  {[
                    "bg-gradient-to-br from-cyan-400 to-blue-600",
                    "bg-gradient-to-br from-violet-400 to-purple-600",
                    "bg-gradient-to-br from-emerald-400 to-teal-600",
                    "bg-gradient-to-br from-orange-400 to-red-500",
                  ].map((gradient, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (i * 0.1) }}
                      className={`w-8 h-8 rounded-full border-2 border-black shadow-lg ${gradient}`}
                    />
                  ))}
                </div>
                <span className="text-white/40 text-sm">
                  Joined by <span className="text-white/80 font-semibold">3,200+</span> engineers this month
                </span>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
            className="studio-card-raised grid gap-4 rounded-[2rem] p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-white/35">Launch posture</div>
                <div className="mt-1 text-lg font-semibold text-white">Production-ready from day one</div>
              </div>
              <span className="studio-badge">No lock-in</span>
            </div>
            {[
              { label: "Deploy time", value: "60s", tone: "#00F0FF" },
              { label: "OpenAPI export", value: "Included", tone: "#8A2BE2" },
              { label: "Team collaboration", value: "Live", tone: "#28C840" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/[0.06] bg-black/30 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-white/55">{item.label}</span>
                  <span className="text-sm font-semibold" style={{ color: item.tone }}>{item.value}</span>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/32">What you leave with</div>
              <div className="mt-3 grid gap-2 text-sm text-white/60">
                <div>Typed backend scaffolding matched to your architecture</div>
                <div>Exportable specs, runtime logic, and deployment assets</div>
                <div>A workspace your team can iterate on instead of rewrite</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="w-full max-w-7xl px-6 pb-8 z-10 mt-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-6 text-white/40 text-sm"
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] inline-block animate-glow-cyan" />
            <span className="font-semibold text-white/60 tracking-wide">Archi.dev</span>
          </div>
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => router.push(link.href)}
                className="hover:text-white/70 transition-colors duration-300 cursor-pointer relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white/40 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <div className="w-px h-3.5 bg-white/10" />
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-white/30 hover:text-white/70 transition-colors duration-200"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <span className="text-xs">© {new Date().getFullYear()} Archi.dev. All rights reserved.</span>
        </motion.div>
      </div>
    </footer>
  );
}
