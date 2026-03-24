"use client";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "We shipped a fully-typed REST API with Postgres and auth in 40 minutes. What used to take a full sprint is now an afternoon.",
    author: "Marcus Chen",
    role: "Staff Engineer",
    company: "Vercel",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=128&h=128&q=80",
    avatarAlt: "Portrait of Marcus Chen",
    gradient: "from-cyan-400 to-blue-600",
    accent: "#00F0FF",
    stat: { value: "3.2×", label: "faster deploys" },
  },
  {
    quote:
      "The AI agent understood our microservices graph on the first try. The OpenAPI spec it generated was cleaner than anything our team had written.",
    author: "Priya Rajan",
    role: "Backend Lead",
    company: "Stripe",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=128&h=128&q=80",
    avatarAlt: "Portrait of Priya Rajan",
    gradient: "from-violet-400 to-purple-600",
    accent: "#8A2BE2",
    stat: { value: "98%", label: "type coverage" },
  },
  {
    quote:
      "Blue-green rollouts, health checks, SLA tracking — all baked in before our first push to production. This is what DevOps should feel like.",
    author: "Leon Hartmann",
    role: "Platform Engineer",
    company: "Shopify",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&w=128&h=128&q=80",
    avatarAlt: "Portrait of Leon Hartmann",
    gradient: "from-emerald-400 to-teal-600",
    accent: "#28C840",
    stat: { value: "99.98%", label: "uptime" },
  },
  {
    quote:
      "I exported a Dockerfile and Prisma schema in one click, then pushed the same architecture to three regions — no YAML files touched.",
    author: "Camille Torres",
    role: "Founding Engineer",
    company: "Linear",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&w=128&h=128&q=80",
    avatarAlt: "Portrait of Camille Torres",
    gradient: "from-orange-400 to-red-500",
    accent: "#F5A623",
    stat: { value: "13", label: "regions live" },
  },
  {
    quote:
      "Our team onboarded in 20 minutes. The shared canvas means everyone — from PM to backend — can see exactly what's being built.",
    author: "Ryo Tanaka",
    role: "CTO",
    company: "Loom",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=128&h=128&q=80",
    avatarAlt: "Portrait of Ryo Tanaka",
    gradient: "from-pink-400 to-rose-600",
    accent: "#FF6BAE",
    stat: { value: "5×", label: "team velocity" },
  },
  {
    quote:
      "We replaced four internal tooling repos with one Archi.dev workspace. Architecture reviews that took 3 hours now take 30 minutes.",
    author: "Sofia Adekunle",
    role: "Engineering Manager",
    company: "Notion",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&w=128&h=128&q=80",
    avatarAlt: "Portrait of Sofia Adekunle",
    gradient: "from-sky-400 to-indigo-600",
    accent: "#00F0FF",
    stat: { value: "−80%", label: "review time" },
  },
];

const statsRow = [
  { value: "3,200+", label: "engineers onboarded this month", accent: "#00F0FF" },
  { value: "4.9 / 5", label: "average product rating", accent: "#8A2BE2" },
  { value: "142k+", label: "endpoints generated daily", accent: "#28C840" },
];

function StarRow({ color }: { color: string }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill={color}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div
      className="testimonial-card-premium relative flex-shrink-0 w-[320px] md:w-[350px] mx-3 rounded-2xl p-5 select-none group"
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.025)",
        "--card-accent-gradient": `linear-gradient(90deg, transparent, ${t.accent}55, transparent)`,
      } as React.CSSProperties}
    >
      {/* Ambient radial glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(260px circle at 25% 0%, ${t.accent}0d, transparent 65%)`,
        }}
      />

      {/* Hover glow border */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 0 1px ${t.accent}20`,
        }}
      />

      <div className="relative z-10">
        <StarRow color={t.accent} />

        <p className="text-white/52 text-sm leading-relaxed mb-5 line-clamp-3 italic">
          &ldquo;{t.quote}&rdquo;
        </p>

        {/* Separator */}
        <div
          className="mb-4 h-px w-full"
          style={{
            background: `linear-gradient(90deg, ${t.accent}20, transparent)`,
          }}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              role="img"
              aria-label={t.avatarAlt}
              className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${t.avatarUrl})`,
                boxShadow: `0 0 0 2px ${t.accent}30`,
              }}
            />
            <div>
              <div className="text-white/82 text-xs font-semibold">{t.author}</div>
              <div className="text-white/30 text-[10px] mt-0.5">
                {t.role}
                <span className="mx-1 opacity-50">·</span>
                {t.company}
              </div>
            </div>
          </div>

          <div
            className="text-right flex-shrink-0 ml-3 pl-3"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="text-sm font-bold leading-none tabular-nums"
              style={{ color: t.accent }}
            >
              {t.stat.value}
            </div>
            <div className="text-white/25 text-[9px] uppercase tracking-[0.16em] mt-0.5">
              {t.stat.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
  duration = 30,
}: {
  items: (typeof testimonials)[number][];
  reverse?: boolean;
  duration?: number;
}) {
  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <motion.div
        className="flex py-2"
        style={{ width: "max-content" }}
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.author}-${i}`} t={t} />
        ))}
      </motion.div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-black py-24 relative overflow-hidden">
      <div className="section-top-line" />

      {/* Ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(0,240,255,0.03) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 xl:px-24 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="section-line-accent" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#00F0FF]">
              Social proof
            </p>
          </div>
          <h2
            className="text-gradient font-medium leading-[0.95] tracking-tighter"
            style={{ fontSize: "clamp(2.2rem, 4vw, 4rem)" }}
          >
            Trusted by engineers
            <br className="hidden md:block" /> who ship.
          </h2>
        </motion.div>
      </div>

      {/* Dual marquee */}
      <div className="space-y-4">
        <MarqueeRow items={testimonials.slice(0, 3)} duration={28} />
        <MarqueeRow items={testimonials.slice(3, 6)} reverse duration={35} />
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-6 md:px-16 xl:px-24 mt-14"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-white/[0.07]"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          {statsRow.map((s, i) => (
            <div
              key={s.label}
              className="bg-black px-6 py-6 text-center flex flex-col items-center justify-center gap-2 group relative overflow-hidden"
            >
              {/* Hover top line */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{
                  background: `linear-gradient(90deg, transparent, ${s.accent}55, transparent)`,
                }}
              />

              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="text-2xl font-bold tracking-tight tabular-nums"
                style={{ color: s.accent }}
              >
                {s.value}
              </motion.span>
              <span className="text-white/30 text-[10px] uppercase tracking-[0.2em]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
