"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const steps = [
  {
    step: "01",
    eyebrow: "Sketch the system",
    title: "Map services, data, and traffic on one living canvas.",
    description:
      "Start with the architecture itself. Drop gateways, queues, databases, and workers into place and let the layout tell the story of how the backend should behave.",
    color: "#00F0FF",
    bullets: ["Multi-tab canvas", "Edge-aware nodes", "Shared graph state"],
    metrics: ["24 services", "6 events", "3 regions"],
  },
  {
    step: "02",
    eyebrow: "Generate the backbone",
    title: "Turn visual intent into contracts, code, and runtime scaffolding.",
    description:
      "As the graph sharpens, the platform fills in the heavy lifting: OpenAPI routes, Prisma models, runtime flows, and deployment-safe defaults.",
    color: "#8A2BE2",
    bullets: ["Typed APIs", "Database models", "AI-assisted workflows"],
    metrics: ["142 endpoints", "98% typed", "0 glue code"],
  },
  {
    step: "03",
    eyebrow: "Ship with confidence",
    title: "Promote the stack with observability baked in from the first deploy.",
    description:
      "Push to production with region-aware rollout, health checks, and a status layer that makes releases feel calm instead of risky.",
    color: "#28C840",
    bullets: ["Blue-green rollout", "Health checks", "Realtime status"],
    metrics: ["13 regions", "99.98% uptime", "41ms p95"],
  },
];


function StepOneVisual() {
  const nodes = [
    { label: "Gateway", x: "10%", y: "18%", color: "#00F0FF", latency: "12ms" },
    { label: "Auth", x: "68%", y: "14%", color: "#8A2BE2", latency: "8ms" },
    { label: "Queue", x: "12%", y: "66%", color: "#F5A623", latency: "3ms" },
    { label: "Postgres", x: "70%", y: "64%", color: "#28C840", latency: "21ms" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[#05070d]">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(255,255,255,0.85) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* Ambient glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Outer orbit ring */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/[0.12]"
        animate={{ scale: [0.94, 1.06, 0.94], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Center hub */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[5rem] w-[5rem] -translate-x-1/2 -translate-y-1/2 rounded-[1.25rem] border border-cyan-400/30 bg-cyan-400/[0.07] backdrop-blur-sm"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-2 rounded-[0.75rem] border border-cyan-300/20 flex items-center justify-center">
          <span className="text-[8px] font-bold uppercase tracking-widest text-cyan-400/60">Core</span>
        </div>
      </motion.div>

      {/* Animated connection paths */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 520" preserveAspectRatio="none">
        {/* Gateway → Core */}
        <motion.path
          d="M130 105 C260 160, 320 200, 400 260"
          fill="none" stroke="#00F0FF" strokeWidth="1.5" strokeDasharray="5 7"
          animate={{ strokeDashoffset: [0, -24] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
        {/* Auth → Core */}
        <motion.path
          d="M590 85 C510 150, 460 200, 400 260"
          fill="none" stroke="#8A2BE2" strokeWidth="1.5" strokeDasharray="5 7"
          animate={{ strokeDashoffset: [0, -24] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: 0.3 }}
        />
        {/* Queue → Core */}
        <motion.path
          d="M130 360 C240 320, 320 300, 400 260"
          fill="none" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="5 7"
          animate={{ strokeDashoffset: [0, -24] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: 0.6 }}
        />
        {/* Postgres → Core */}
        <motion.path
          d="M590 355 C510 310, 460 290, 400 260"
          fill="none" stroke="#28C840" strokeWidth="1.5" strokeDasharray="5 7"
          animate={{ strokeDashoffset: [0, -24] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: 0.9 }}
        />
        {/* Cross connections — subtle */}
        <motion.path
          d="M130 105 C260 80, 450 80, 590 85"
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"
          strokeDasharray="4 10"
          animate={{ strokeDashoffset: [0, -28] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M130 360 C260 390, 450 390, 590 355"
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"
          strokeDasharray="4 10"
          animate={{ strokeDashoffset: [0, 28] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* Node cards */}
      {nodes.map((node, index) => (
        <motion.div
          key={node.label}
          className="absolute rounded-2xl border border-white/[0.09] bg-black/60 px-3.5 py-2.5 backdrop-blur-xl"
          style={{ left: node.x, top: node.y }}
          animate={{ y: [0, index % 2 === 0 ? -8 : 8, 0] }}
          transition={{ duration: 4.5 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: node.color, boxShadow: `0 0 10px ${node.color}` }}
            />
            <span className="text-[11px] font-medium tracking-wide text-white/80">{node.label}</span>
          </div>
          <div
            className="mt-1 text-[9px] font-mono pl-[18px]"
            style={{ color: `${node.color}80` }}
          >
            {node.latency}
          </div>
        </motion.div>
      ))}

      {/* Live traffic badge */}
      <motion.div
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/50 px-3 py-1.5 backdrop-blur-sm"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#28C840]" style={{ boxShadow: "0 0 8px #28C840" }} />
        <span className="text-[10px] font-medium text-white/50 uppercase tracking-[0.15em]">Live traffic</span>
      </motion.div>
    </div>
  );
}

function StepTwoVisual() {
  const codeLines = [
    "router.post('/api/users', async (req, res) => {",
    "  const user = await prisma.user.create({",
    "    data: req.body,",
    "  });",
    "  return res.status(201).json(user);",
    "});",
  ];

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[#07040d]">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(138,43,226,0.16),transparent_48%)]"
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="grid h-full gap-3 p-4 md:p-6 md:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[1.5rem] border border-white/[0.08] bg-black/30 p-5">
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/30">
            Generated outputs
          </p>
          <div className="mt-4 space-y-3">
            {[
              { label: "openapi.json", color: "#00F0FF" },
              { label: "schema.prisma", color: "#8A2BE2" },
              { label: "deploy.yaml", color: "#28C840" },
              { label: "runtime.worker.ts", color: "#F5A623" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.35 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                  <span className="text-sm text-white/75">{item.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#090909] p-5 font-mono text-[12px] text-white/55">
          <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/30">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8A2BE2]" />
            Runtime scaffold
          </div>
          <div className="space-y-2">
            <div className="text-[#00F0FF]">{'import { PrismaClient } from "@prisma/client";'}</div>
            <div className="text-[#00F0FF]">{'import { Router } from "express";'}</div>
            <div className="h-px w-full bg-white/[0.06]" />
            {codeLines.map((line, index) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.06, duration: 0.28 }}
                viewport={{ once: true }}
              >
                {line}
              </motion.div>
            ))}
          </div>
          <motion.div
            className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-[#8A2BE2]/12 to-transparent"
            animate={{ top: ["-30%", "110%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}

function StepThreeVisual() {
  const services = [
    { label: "Gateway", status: "Serving", color: "#00F0FF" },
    { label: "Workers", status: "Healthy", color: "#28C840" },
    { label: "Database", status: "Replicated", color: "#8A2BE2" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[#030704]">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,200,64,0.18),transparent_60%)]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex h-full items-center justify-center p-6">
        <div className="w-full max-w-xl overflow-hidden rounded-[1.7rem] border border-white/[0.08] bg-black/45 shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/32">
              rollout status
            </span>
          </div>

          <div className="space-y-4 p-6">
            {services.map((service, index) => (
              <motion.div
                key={service.label}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.35 }}
                viewport={{ once: true }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: service.color, boxShadow: `0 0 12px ${service.color}` }}
                    />
                    <span className="text-sm font-medium text-white/85">
                      {service.label}
                    </span>
                  </div>
                  <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75" style={{ backgroundColor: `${service.color}20` }}>
                    {service.status}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: ["0%", "100%"] }}
                    transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0.8, delay: index * 0.15 }}
                    style={{
                      background: `linear-gradient(90deg, ${service.color}, rgba(255,255,255,0.86))`,
                    }}
                  />
                </div>
              </motion.div>
            ))}

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
              <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-white/30">
                <span>Traffic migration</span>
                <span>100%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#28C840] to-[#C7FFD0]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 0.8 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileStepCard({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  const Visual = [StepOneVisual, StepTwoVisual, StepThreeVisual][index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      className="rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-5"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-full border border-white/[0.08] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: step.color }}>
          Step {step.step}
        </div>
        <div className="h-px flex-1 bg-white/[0.07]" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.24em]" style={{ color: step.color }}>
        {step.eyebrow}
      </p>
      <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white">
        {step.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white/48">
        {step.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {step.bullets.map((bullet) => (
          <span
            key={bullet}
            className="rounded-full border border-white/[0.08] bg-black/25 px-3 py-1 text-[11px] text-white/55"
          >
            {bullet}
          </span>
        ))}
      </div>
      <div className="relative mt-5 h-[18rem] overflow-hidden rounded-[1.6rem] border border-white/[0.06]">
        <Visual />
      </div>
    </motion.div>
  );
}

export default function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.33) setActiveIndex(0);
    else if (latest < 0.66) setActiveIndex(1);
    else setActiveIndex(2);
  });

  const Visual = [StepOneVisual, StepTwoVisual, StepThreeVisual][activeIndex];

  return (
    <section id="solutions" className="relative px-4 sm:px-6 py-16 md:py-20 md:px-16 xl:px-24">
      <div className="section-top-line" />
      
      {/* Mobile view */}
      <div className="mx-auto max-w-7xl md:hidden">
        <div className="mb-12 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="section-line-accent" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#00F0FF]">
              Workflow
            </p>
          </div>
          <h2 className="text-gradient text-[clamp(2.4rem,4.6vw,4.4rem)] font-medium leading-[0.94] tracking-tighter">
            Three steps.<br />Zero boilerplate.
          </h2>
        </div>
        <div className="grid gap-6">
          {steps.map((step, index) => (
            <MobileStepCard key={step.step} step={step} index={index} />
          ))}
        </div>
      </div>

      {/* Desktop Sticky View */}
      <div ref={containerRef} className="hidden md:block h-[300vh] relative w-full max-w-7xl mx-auto">
        <div className="sticky top-0 h-screen flex items-center justify-between gap-12 py-20">
          
          {/* Left Text Sequence */}
          <div className="w-1/2 flex flex-col justify-center h-full relative">
            <div className="flex items-center gap-3 mb-4 absolute top-[10%]">
              <span className="section-line-accent" />
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#00F0FF]">
                Workflow
              </p>
            </div>
            
            <div className="relative w-full h-[60%] flex items-center">
              {steps.map((step, i) => (
                <motion.div
                  key={step.step}
                  className="absolute inset-0 flex flex-col justify-center"
                  initial={false}
                  animate={{ 
                    opacity: activeIndex === i ? 1 : 0,
                    y: activeIndex === i ? 0 : (activeIndex > i ? -40 : 40),
                    filter: activeIndex === i ? "blur(0px)" : "blur(8px)",
                    pointerEvents: activeIndex === i ? "auto" : "none"
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-full border border-white/[0.08] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: step.color }}>
                      Step {step.step}
                    </div>
                  </div>
                  <h3 className="text-[3rem] tracking-tighter font-semibold leading-tight text-white mb-6">
                    {step.title}
                  </h3>
                  <p className="text-lg leading-relaxed text-white/50 max-w-lg mb-8">
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.bullets.map((bullet) => (
                      <span
                        key={bullet}
                        className="rounded-full border border-white/[0.08] bg-black/25 px-4 py-2 text-[12px] text-white/60"
                      >
                        {bullet}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Visual sequence */}
          <div className="w-1/2 h-[75vh] flex flex-col justify-center relative">
            <motion.div 
              className="absolute inset-0 w-full h-full rounded-[2rem] border border-white/[0.06] overflow-hidden cyber-glass"
              layoutId="visual-container"
            >
              <Visual />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}