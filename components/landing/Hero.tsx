"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Play, ChevronDown } from "lucide-react";
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
  const statsInView = useInView(statsRef, { once: true });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const scrollIndicatorOpacity = useTransform(
    scrollYProgress,
    [0, 0.12],
    [1, 0]
  );
  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] w-full flex flex-col justify-center bg-black overflow-hidden pb-28 md:pb-32"
    >
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
      <motion.div
        className="absolute top-[15%] right-[12%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,240,255,0.11) 0%, transparent 68%)",
          filter: "blur(48px)",
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[8%] w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(138,43,226,0.11) 0%, transparent 68%)",
          filter: "blur(48px)",
        }}
        animate={{ scale: [1, 1.22, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5,
        }}
      />
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 px-6 md:px-16 xl:px-24 max-w-7xl mx-auto w-full pt-36 pb-52 md:pb-44"
      >
        <motion.div
          initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block mb-10"
        >
          <motion.span
            className="glass-panel px-5 py-2 rounded-full text-sm text-white/70 font-medium tracking-wide inline-flex items-center gap-2"
            animate={{
              boxShadow: [
                "0 0 0px rgba(0,240,255,0)",
                "0 0 22px rgba(0,240,255,0.22)",
                "0 0 0px rgba(0,240,255,0)",
              ],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] inline-block"
              style={{ boxShadow: "0 0 6px #00F0FF" }}
            />
            The platform for backend architects
          </motion.span>
        </motion.div>
        <motion.h1
          initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-gradient font-medium tracking-tighter leading-[0.85] mb-10"
          style={{ fontSize: "clamp(4rem, 10vw, 11rem)" }}
        >
          The canvas
          <br />
          to ship.
        </motion.h1>
        <motion.p
          initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="max-w-2xl text-xl text-white/55 mb-12 leading-relaxed"
        >
          Your AI-native toolkit to stop writing boilerplate.
          <br />
          Design visually. Deploy instantly.
        </motion.p>
        <motion.div
          initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="flex flex-wrap items-center gap-4"
        >
          <motion.button
            type="button"
            onClick={() => router.push("/login")}
            className="bg-white text-black px-8 py-4 rounded-full text-base font-semibold cursor-pointer"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(255,255,255,0.35)",
            }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Start building free
          </motion.button>
          <motion.button
            type="button"
            onClick={() => router.push("/login")}
            className="glass-panel flex items-center gap-3 px-8 py-4 rounded-full text-white text-base font-medium cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Play
              size={15}
              className="text-white/70"
              fill="rgba(255,255,255,0.7)"
            />
            Watch demo
          </motion.button>
        </motion.div>
      </motion.div>
      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-white/25" />
        </motion.div>
      </motion.div>
      <div
        ref={statsRef}
        className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/[0.07]"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-4 divide-x divide-white/[0.07]">
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
                className="text-2xl md:text-3xl font-semibold tracking-tighter"
                style={{
                  background:
                    i === 0
                      ? "linear-gradient(180deg, #00F0FF, rgba(0,240,255,0.6))"
                      : "linear-gradient(180deg, #FFFFFF, rgba(255,255,255,0.5))",
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
    </section>
  );
}
