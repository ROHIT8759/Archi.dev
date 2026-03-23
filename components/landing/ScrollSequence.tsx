"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Draw Nodes\non the Canvas.",
    description:
      "Drag-and-drop services, databases, queues, and APIs onto a shared canvas. Archi.dev understands your intent from the layout.",
    color: "#00F0FF",
  },
  {
    step: "02",
    title: "AI Scaffolds\nthe Architecture.",
    description:
      "Our AI analyzes your visual graph and generates production-grade code, API contracts, and infrastructure configs instantly.",
    color: "#8A2BE2",
  },
  {
    step: "03",
    title: "Deploy to\nProduction.",
    description:
      "One click ships your entire stack. Blue-green deploys, instant rollbacks, and live observability — all included.",
    color: "#28C840",
  },
];

const videoSources = [
  "https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connections-loop-28828-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screens-41716-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connections-loop-28828-large.mp4",
];

function stepTextOpacity(
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"],
  index: number
) {
  const fadeInStart = index / 3;
  const peakStart = fadeInStart + 0.06;
  const peakEnd = (index + 1) / 3 - 0.06;
  const fadeOutEnd = (index + 1) / 3;
  const end = index === 2 ? 1.0 : fadeOutEnd;
  return useTransform(
    scrollYProgress,
    [fadeInStart, peakStart, peakEnd, end],
    [0, 1, 1, index === 2 ? 1 : 0]
  );
}

function stepTextY(
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"],
  index: number
) {
  const fadeInStart = index / 3;
  const peakStart = fadeInStart + 0.06;
  const peakEnd = (index + 1) / 3 - 0.06;
  const fadeOutEnd = index === 2 ? 1.0 : (index + 1) / 3;
  return useTransform(
    scrollYProgress,
    [fadeInStart, peakStart, peakEnd, fadeOutEnd],
    [18, 0, 0, index === 2 ? 0 : -18]
  );
}

function stepVideoOpacity(
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"],
  index: number
) {
  const fadeInStart = Math.max(0, index / 3 - 0.05);
  const peakStart = index / 3 + 0.05;
  const peakEnd = (index + 1) / 3 - 0.05;
  const fadeOutEnd = (index + 1) / 3 + 0.05;
  return useTransform(
    scrollYProgress,
    [fadeInStart, peakStart, peakEnd, Math.min(1, fadeOutEnd)],
    [index === 0 ? 1 : 0, 1, 1, index === 2 ? 1 : 0]
  );
}

function stepBarScale(
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"],
  index: number
) {
  const start = index / 3;
  const end = (index + 1) / 3;
  return useTransform(scrollYProgress, [start, end], [0, 1]);
}

export default function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const textOpacities = steps.map((_, i) => stepTextOpacity(scrollYProgress, i));
  const textYOffsets = steps.map((_, i) => stepTextY(scrollYProgress, i));
  const videoOpacities = videoSources.map((_, i) =>
    stepVideoOpacity(scrollYProgress, i)
  );
  const barScales = steps.map((_, i) => stepBarScale(scrollYProgress, i));

  return (
    <section ref={containerRef} className="h-[400vh] relative bg-black">
      <div className="sticky top-0 h-[100vh] flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 xl:px-24 gap-12 overflow-hidden">

        {/* Left — progressive text with Y parallax */}
        <div className="flex-1 max-w-sm lg:max-w-md relative">
          {/* Vertical step progress bar */}
          <div className="absolute -left-8 top-0 bottom-0 hidden lg:flex flex-col justify-center gap-0 py-4">
            {steps.map((step, i) => (
              <div key={step.step} className="flex items-start gap-2 flex-1 min-h-0">
                <div className="flex flex-col items-center h-full">
                  {/* Dot */}
                  <motion.div
                    className="w-2 h-2 rounded-full shrink-0 mt-1"
                    style={{ backgroundColor: step.color }}
                    animate={{}}
                  >
                    <motion.div
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: step.color, opacity: textOpacities[i] }}
                    />
                  </motion.div>
                  {/* Bar */}
                  {i < steps.length - 1 && (
                    <div className="flex-1 w-px bg-white/[0.06] relative overflow-hidden mt-1">
                      <motion.div
                        className="absolute top-0 left-0 right-0 origin-top"
                        style={{
                          backgroundColor: step.color,
                          scaleY: barScales[i],
                          height: "100%",
                          opacity: 0.6,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Text panels */}
          <div className="relative h-52 lg:h-64">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                style={{ opacity: textOpacities[i], y: textYOffsets[i] }}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <div
                  className="text-[11px] font-bold uppercase tracking-[0.25em] mb-5"
                  style={{ color: step.color }}
                >
                  Step {step.step}
                </div>
                <h2
                  className="text-white font-medium tracking-tighter leading-[0.88] mb-6"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3.8rem)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {step.title}
                </h2>
                <p className="text-white/45 text-base leading-relaxed max-w-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — crossfading videos */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="aspect-video rounded-2xl border border-white/[0.12] shadow-[0_0_100px_rgba(0,240,255,0.08)] overflow-hidden relative bg-black">
            {videoSources.map((src, i) => (
              <motion.div
                key={src + i}
                style={{ opacity: videoOpacities[i] }}
                className="absolute inset-0"
              >
                <video
                  src={src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={
                    i === 1
                      ? { filter: "hue-rotate(270deg) saturate(0.65)" }
                      : {}
                  }
                />
                {/* Per-step color overlay */}
                <div
                  className="absolute inset-0 mix-blend-overlay opacity-[0.18]"
                  style={{
                    background: [
                      "linear-gradient(135deg, #00F0FF40, transparent)",
                      "linear-gradient(135deg, #8A2BE240, transparent)",
                      "linear-gradient(135deg, #28C84040, transparent)",
                    ][i],
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Step indicator track */}
          <div className="flex justify-center gap-4 mt-5">
            {steps.map((step, i) => (
              <div key={step.step} className="relative h-1 w-16 rounded-full bg-white/[0.08] overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    backgroundColor: step.color,
                    scaleX: barScales[i],
                    transformOrigin: "left",
                    opacity: 0.75,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
