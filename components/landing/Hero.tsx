"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import LineWaves from "@/components/ui/LineWaves";

const stats = [
  { value: 10, suffix: "x", label: "Faster" },
  { value: 0, suffix: "%", label: "Lock-in" },
  { value: 100, suffix: "%", label: "Portable" },
  { value: 60, suffix: "s", label: "Deploy" },
];

function Counter({
  target,
  suffix,
  started,
}: {
  target: number;
  suffix: string;
  started: boolean;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let frame: number;
    const duration = 1800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, target]);
  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

/* ─── Live Architecture Preview ─── */
function ArchPreview() {
  const nodes = [
    { id: "api",   label: "API Gateway",   sub: ":3000",       x: "44%", y: "14%", color: "#00F0FF", delay: 0.2 },
    { id: "auth",  label: "Auth Service",  sub: "JWT · bcrypt", x: "66%", y: "43%", color: "#8A2BE2", delay: 0.35 },
    { id: "db",    label: "PostgreSQL",    sub: "v16 · Prisma", x: "10%", y: "55%", color: "#3ad69f", delay: 0.5 },
    { id: "cache", label: "Redis Cache",   sub: "TTL: 3600s",   x: "56%", y: "76%", color: "#ffbf5b", delay: 0.65 },
  ];

  return (
    <div className="card-premium relative rounded-2xl overflow-hidden scan-sweep">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-[#070d17]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-2 flex-1 text-[10px] text-white/25 font-mono select-none">
          archi.dev — canvas
        </span>
        <div className="flex items-center gap-1.5">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-[10px] text-[#00F0FF]/65 font-mono">4 services · live</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative h-[296px] bg-[#050a12]">
        {/* Dot grid */}
        <div className="absolute inset-0 bg-dots opacity-25" />
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(0,240,255,0.07), transparent 60%)",
          }}
        />

        {/* SVG connection lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 360 296"
          preserveAspectRatio="none"
        >
          {/* API → Auth */}
          <motion.line
            x1="158" y1="60" x2="250" y2="136"
            stroke="rgba(0,240,255,0.28)" strokeWidth="1.5"
            strokeDasharray="5 5"
            animate={{ strokeDashoffset: [20, 0] }}
            transition={{ duration: 1.0, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle
            r="3" fill="#00F0FF"
            animate={{ cx: [158, 250], cy: [60, 136], opacity: [0.9, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeIn", delay: 0.1 }}
          />

          {/* API → DB */}
          <motion.line
            x1="158" y1="60" x2="90" y2="168"
            stroke="rgba(58,214,159,0.28)" strokeWidth="1.5"
            strokeDasharray="5 5"
            animate={{ strokeDashoffset: [20, 0] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "linear", delay: 0.4 }}
          />
          <motion.circle
            r="3" fill="#3ad69f"
            animate={{ cx: [158, 90], cy: [60, 168], opacity: [0.9, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeIn", delay: 0.5 }}
          />

          {/* Auth → Cache */}
          <motion.line
            x1="250" y1="158" x2="222" y2="232"
            stroke="rgba(138,43,226,0.28)" strokeWidth="1.5"
            strokeDasharray="5 5"
            animate={{ strokeDashoffset: [20, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear", delay: 0.7 }}
          />

          {/* DB → Cache */}
          <motion.line
            x1="90" y1="196" x2="210" y2="238"
            stroke="rgba(255,191,91,0.18)" strokeWidth="1"
            strokeDasharray="3 7"
            animate={{ strokeDashoffset: [20, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "linear", delay: 1.1 }}
          />
        </svg>

        {/* Architecture node chips */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute"
            style={{ left: node.x, top: node.y }}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: node.delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="arch-node-chip"
              style={{
                borderColor: `${node.color}28`,
                background: `linear-gradient(135deg, ${node.color}0a, rgba(12,18,28,0.95))`,
              }}
            >
              <span
                className="w-2 h-2 rounded-[3px] shrink-0"
                style={{ background: node.color, boxShadow: `0 0 6px ${node.color}88` }}
              />
              <span style={{ color: `${node.color}dd` }}>{node.label}</span>
            </div>
            <div
              className="text-[8px] mt-0.5 font-mono text-center"
              style={{ color: "rgba(255,255,255,0.22)" }}
            >
              {node.sub}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Deploy status footer */}
      <div className="border-t border-white/[0.05] px-4 py-2.5 bg-[#050a12] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-[#28C840] shrink-0"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span className="text-[10px] font-mono text-white/32">
            <span className="text-[#28C840]/80">✓</span>{" "}
            Deployed to{" "}
            <span className="text-white/55">iad1</span>
            <span className="text-white/18 mx-1.5">·</span>
            <span className="text-[#00F0FF]/60">58s</span>
          </span>
        </div>
        <span className="text-[9px] font-mono text-white/18 tracking-wide">
          sha-a1b2c3d
        </span>
      </div>

      {/* Floating "generated" badge */}
      <motion.div
        className="absolute top-[52px] right-3"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <div
          className="text-[9px] font-mono font-bold px-2.5 py-1 rounded-full"
          style={{
            border: "1px solid rgba(58,214,159,0.25)",
            background: "rgba(58,214,159,0.08)",
            color: "rgba(58,214,159,0.8)",
          }}
        >
          AI-generated
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const primaryX = useMotionValue(0);
  const primaryY = useMotionValue(0);
  const secondaryX = useMotionValue(0);
  const secondaryY = useMotionValue(0);
  const primarySpringX = useSpring(primaryX, { stiffness: 220, damping: 20, mass: 0.3 });
  const primarySpringY = useSpring(primaryY, { stiffness: 220, damping: 20, mass: 0.3 });
  const secondarySpringX = useSpring(secondaryX, { stiffness: 220, damping: 20, mass: 0.3 });
  const secondarySpringY = useSpring(secondaryY, { stiffness: 220, damping: 20, mass: 0.3 });
  const statsInView = useInView(statsRef, { once: true });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  const applyTrail = (
    event: React.MouseEvent<HTMLButtonElement>,
    setX: (x: number) => void,
    setY: (y: number) => void,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    event.currentTarget.style.setProperty("--mx", `${x}px`);
    event.currentTarget.style.setProperty("--my", `${y}px`);
    setX((x - rect.width / 2) * 0.12);
    setY((y - rect.height / 2) * 0.12);
  };

  const resetMagnetic = (setX: (x: number) => void, setY: (y: number) => void) => {
    setX(0);
    setY(0);
  };

  return (
    <motion.section
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100vh] w-full flex flex-col justify-center bg-black overflow-hidden pb-28 md:pb-32"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <LineWaves
          speed={0.3}
          innerLineCount={32}
          outerLineCount={36}
          warpIntensity={1}
          rotation={-45}
          edgeFadeWidth={0}
          colorCycleSpeed={1}
          brightness={0.2}
          color1="#ffffff"
          color2="#00F0FF"
          color3="#8A2BE2"
          enableMouseInteraction={false}
        />
      </div>
      <div className="bg-grid absolute inset-0 pointer-events-none" />
      <div className="bg-noise absolute inset-0" />

      {/* Ambient glow orbs */}
      <motion.div
        className="absolute top-[15%] right-[12%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,240,255,0.11) 0%, transparent 68%)",
          filter: "blur(48px)",
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[8%] w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(138,43,226,0.11) 0%, transparent 68%)",
          filter: "blur(48px)",
        }}
        animate={{ scale: [1, 1.22, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        style={{ y }}
        className="relative z-10 px-6 md:px-16 xl:px-24 max-w-7xl mx-auto w-full pt-34 pb-44 md:pb-40"
      >
        <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-12 xl:gap-16 items-center">

          {/* ── Left column: content ── */}
          <div>
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-7"
            >
              <span className="eyebrow-badge">
                <span
                  className="flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold"
                  style={{ background: "rgba(0,240,255,0.12)", color: "#00F0FF" }}
                >
                  ✦
                </span>
                <span>Visual Backend Architecture Studio</span>
                <span style={{ color: "rgba(0,240,255,0.3)" }}>·</span>
                <span style={{ color: "rgba(0,240,255,0.55)" }}>v2.0</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl font-medium tracking-tight leading-[0.94] mb-6"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5.2rem)", color: "#fff" }}
            >
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="block"
              >
                Design the backend.
              </motion.span>
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="block"
              >
                Ship with{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #00F0FF 0%, #79b7ff 55%, #a78bfa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  confidence.
                </span>
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="max-w-xl text-base md:text-lg text-white/52 mb-10 leading-relaxed"
            >
              Model APIs, workflows, data, and infrastructure in one visual studio.
              Generate portable architecture artifacts and production-ready scaffolding
              without losing the system design behind your code.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <motion.button
                type="button"
                onClick={() => router.push("/login")}
                className="shimmer-btn magnetic-btn hover-trail bg-white text-black px-8 py-4 rounded-full text-base font-semibold cursor-pointer"
                style={{ x: primarySpringX, y: primarySpringY }}
                onMouseMove={(event) => applyTrail(event, primaryX.set, primaryY.set)}
                onMouseLeave={() => resetMagnetic(primaryX.set, primaryY.set)}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 36px rgba(255,255,255,0.38)",
                }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                Start building free
              </motion.button>
              <motion.button
                type="button"
                onClick={() => router.push("/login")}
                className="glass-panel magnetic-btn hover-trail flex items-center gap-3 px-8 py-4 rounded-full text-white/80 hover:text-white text-base font-medium cursor-pointer border border-white/[0.1] hover:border-white/[0.18] transition-colors"
                style={{ x: secondarySpringX, y: secondarySpringY }}
                onMouseMove={(event) => applyTrail(event, secondaryX.set, secondaryY.set)}
                onMouseLeave={() => resetMagnetic(secondaryX.set, secondaryY.set)}
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,255,255,0.05)" }}
                transition={{ duration: 0.2 }}
              >
                <span className="w-6 h-6 rounded-full bg-white/[0.08] flex items-center justify-center shrink-0">
                  <Play size={10} className="text-white/80 ml-0.5" fill="rgba(255,255,255,0.8)" />
                </span>
                Watch demo
              </motion.button>
            </motion.div>

            {/* Feature badges */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-2 mt-6"
            >
              {[
                "AI architecture guidance",
                "One-click runtime scaffolding",
                "Production-ready exports",
              ].map((chip, index) => (
                <motion.span
                  key={chip}
                  className="feature-badge-v2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.58 + index * 0.08, duration: 0.45 }}
                  whileHover={{ y: -1 }}
                >
                  {chip}
                </motion.span>
              ))}
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
              className="flex flex-wrap items-center gap-5 mt-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {[
                    "from-cyan-400 to-blue-500",
                    "from-violet-400 to-purple-600",
                    "from-emerald-400 to-teal-600",
                    "from-amber-400 to-orange-500",
                    "from-rose-400 to-pink-600",
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-full border-[2px] border-black bg-gradient-to-br ${gradient} shrink-0`}
                      style={{ zIndex: 5 - i }}
                    />
                  ))}
                </div>
                <span className="text-sm text-white/40">
                  <span className="text-white/72 font-semibold">3,200+</span>{" "}
                  engineers this month
                </span>
              </div>
              <div className="hidden md:block h-4 w-px bg-white/[0.12]" />
              <div className="flex items-center gap-1.5 text-sm text-white/35">
                <span className="tracking-tight" style={{ color: "#FFD700" }}>
                  ★★★★★
                </span>
                <span className="text-white/60 font-semibold">4.9</span>
                <span>/ 5 rating</span>
              </div>
            </motion.div>
          </div>

          {/* ── Right column: live arch preview ── */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 40, filter: "blur(20px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.0, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <ArchPreview />

            {/* Caption */}
            <motion.p
              className="mt-3 text-center text-[11px] text-white/22 font-mono tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              Live canvas · no YAML required
            </motion.p>
          </motion.div>

        </div>
      </motion.div>

      {/* Stats bar */}
      <div
        ref={statsRef}
        className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/[0.07]"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.07]">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.9 + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="px-6 py-6 text-center group"
            >
              <div
                className="text-2xl md:text-3xl font-semibold tracking-tighter stat-tabular"
                style={{
                  background:
                    i === 0
                      ? "linear-gradient(180deg, #00F0FF, rgba(0,240,255,0.55))"
                      : i === 1
                      ? "linear-gradient(180deg, #a78bfa, rgba(138,43,226,0.55))"
                      : i === 2
                      ? "linear-gradient(180deg, #34d399, rgba(40,200,64,0.55))"
                      : "linear-gradient(180deg, #fbbf24, rgba(245,166,35,0.55))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                <Counter
                  target={stat.value}
                  suffix={stat.suffix}
                  started={statsInView}
                />
              </div>
              <div className="text-[11px] text-white/35 mt-1 uppercase tracking-[0.15em] font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
