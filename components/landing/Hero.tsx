"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
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
    motionX: MotionValue<number>,
    motionY: MotionValue<number>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    event.currentTarget.style.setProperty("--mx", `${x}px`);
    event.currentTarget.style.setProperty("--my", `${y}px`);
    motionX.set((x - rect.width / 2) * 0.12);
    motionY.set((y - rect.height / 2) * 0.12);
  };

  const resetMagnetic = (motionX: MotionValue<number>, motionY: MotionValue<number>) => {
    motionX.set(0);
    motionY.set(0);
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
        <div className="max-w-3xl">

          {/* ── Left column: content ── */}
          <div>
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
                onMouseMove={(event) => applyTrail(event, primaryX, primaryY)}
                onMouseLeave={() => resetMagnetic(primaryX, primaryY)}
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
                onMouseMove={(event) => applyTrail(event, secondaryX, secondaryY)}
                onMouseLeave={() => resetMagnetic(secondaryX, secondaryY)}
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
