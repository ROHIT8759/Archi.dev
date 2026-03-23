"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

/* ── Typewriter Terminal ───────────────────────────── */
const terminalLines = [
  { text: "$ archi deploy --env production", color: "rgba(255,255,255,0.28)" },
  { text: "✓ Building Docker image…", color: "#00F0FF" },
  { text: "  → Layers cached (12/12)", color: "rgba(255,255,255,0.45)" },
  { text: "✓ Pushing to registry…", color: "#00F0FF" },
  { text: "  → archi.dev/app:sha-a1b2c3d", color: "rgba(255,255,255,0.45)" },
  { text: "✓ Deploying to edge…", color: "#00F0FF" },
  { text: "✓ Live  https://api.yourdomain.com", color: "#28C840" },
  { text: "  Deploy complete in 58s", color: "rgba(255,255,255,0.22)" },
];

function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!inView || visibleLines >= terminalLines.length) return;
    const id = setTimeout(
      () => setVisibleLines((v) => v + 1),
      // first line faster, rest staggered
      visibleLines === 0 ? 400 : 280
    );
    return () => clearTimeout(id);
  }, [inView, visibleLines]);

  return (
    <div
      ref={ref}
      className="mt-6 rounded-xl overflow-hidden border border-white/[0.08] font-mono"
    >
      {/* macOS chrome */}
      <div className="bg-[#141414] px-4 py-2.5 flex items-center gap-2 border-b border-white/[0.06]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-3 text-[11px] text-white/30 select-none">
          archi.dev — deploy
        </span>
      </div>

      <div className="bg-[#070707] p-4 text-[12px] space-y-1.5 leading-relaxed min-h-[148px]">
        {terminalLines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            style={{ color: line.color }}
          >
            {line.text}
          </motion.div>
        ))}
        {visibleLines < terminalLines.length && inView && (
          <motion.span
            className="inline-block w-[7px] h-[14px] rounded-[1px]"
            style={{ background: "#00F0FF" }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
}

/* ── Dockerfile visual ─────────────────────────────── */
function DockerVisual() {
  const lines = [
    { text: "FROM node:20-alpine", color: "#00F0FF" },
    { text: "WORKDIR /app", color: "rgba(255,255,255,0.48)" },
    { text: "COPY package*.json ./", color: "rgba(255,255,255,0.48)" },
    { text: "RUN npm ci --omit=dev", color: "rgba(255,255,255,0.48)" },
    { text: "COPY . .", color: "rgba(255,255,255,0.48)" },
    { text: "EXPOSE 3000", color: "rgba(255,255,255,0.48)" },
    { text: 'CMD ["node", "index.js"]', color: "#28C840" },
  ];

  return (
    <div className="mt-5 rounded-lg border border-white/[0.08] bg-[#070707] p-4 font-mono text-[11px] space-y-1.5 leading-relaxed overflow-hidden">
      {lines.map((l, i) => (
        <motion.div
          key={l.text}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          viewport={{ once: true }}
          style={{ color: l.color }}
        >
          {l.text}
        </motion.div>
      ))}
    </div>
  );
}

/* ── Swagger mock ──────────────────────────────────── */
function SwaggerMock() {
  const endpoints = [
    { method: "GET", path: "/api/v1/users", color: "#61affe" },
    { method: "POST", path: "/api/v1/users", color: "#49cc90" },
    { method: "PUT", path: "/api/v1/users/{id}", color: "#fca130" },
    { method: "DELETE", path: "/api/v1/users/{id}", color: "#f93e3e" },
    { method: "GET", path: "/api/v1/orders", color: "#61affe" },
    { method: "POST", path: "/api/v1/orders", color: "#49cc90" },
  ];

  return (
    <div className="mt-5 space-y-1.5 font-mono text-[11px]">
      {endpoints.map((ep, i) => (
        <motion.div
          key={`${ep.method}-${ep.path}`}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.055, duration: 0.3 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 rounded-md px-3 py-2 border border-white/[0.05] group"
          style={{ background: "rgba(255,255,255,0.025)" }}
          whileHover={{ background: "rgba(255,255,255,0.04)" }}
        >
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded min-w-[48px] text-center shrink-0"
            style={{
              color: ep.color,
              backgroundColor: `${ep.color}1A`,
            }}
          >
            {ep.method}
          </span>
          <span className="text-white/45 group-hover:text-white/60 transition-colors">
            {ep.path}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Spotlight card ────────────────────────────────── */
function SpotlightCard({
  children,
  colSpan = "",
  className = "",
  accentColor = "rgba(0,240,255,0.07)",
}: {
  children: ReactNode;
  colSpan?: string;
  className?: string;
  accentColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`glass-panel rounded-3xl p-8 group relative overflow-hidden cursor-default ${colSpan} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-60px" }}
    >
      {/* Mouse-tracked spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(400px circle at ${mouse.x}px ${mouse.y}px, ${accentColor}, transparent 65%)`,
        }}
      />

      {/* Hover border glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: `inset 0 0 0 1px ${accentColor.replace("0.07", "0.25")}`,
        }}
      />

      {children}
    </motion.div>
  );
}

/* ── Section ───────────────────────────────────────── */
export default function BentoGrid() {
  return (
    <section className="py-32 px-6 md:px-16 xl:px-24 bg-black relative z-20">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-[#00F0FF] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Platform
          </p>
          <h2
            className="text-gradient font-medium tracking-tighter leading-[0.87]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
          >
            Visually construct
            <br />
            the impossible.
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 — Terminal (span 2) */}
          <SpotlightCard
            colSpan="md:col-span-2"
            accentColor="rgba(0,240,255,0.07)"
          >
            <div className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-[0.22em] mb-2">
              Deploy
            </div>
            <h3 className="text-xl font-semibold text-white tracking-tight">
              True One-Click Deployments.
            </h3>
            <p className="text-sm text-white/40 mt-2 leading-relaxed">
              From canvas to production in under 60 seconds. No YAML, no config
              hell — just ship.
            </p>
            <Terminal />
          </SpotlightCard>

          {/* Card 2 — AI with looping video bg */}
          <SpotlightCard accentColor="rgba(138,43,226,0.09)">
            <video
              src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screens-41716-large.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-[0.18] mix-blend-luminosity pointer-events-none"
            />
            <div className="relative z-10">
              <div className="text-[10px] font-bold text-[#8A2BE2] uppercase tracking-[0.22em] mb-2">
                AI
              </div>
              <h3 className="text-xl font-semibold text-white tracking-tight">
                AI Agent Workflows.
              </h3>
              <p className="text-sm text-white/40 mt-2 leading-relaxed">
                Let AI scaffold your entire architecture from a single natural
                language prompt.
              </p>
              <div className="mt-6 space-y-3">
                {["Understand intent", "Plan architecture", "Generate code", "Deploy"].map(
                  (step, i) => (
                    <motion.div
                      key={step}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.3 + i * 0.07,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      viewport={{ once: true }}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
                        style={{
                          border: "1px solid rgba(138,43,226,0.5)",
                          color: "#8A2BE2",
                        }}
                      >
                        {i + 1}
                      </div>
                      <span className="text-xs text-white/50">{step}</span>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </SpotlightCard>

          {/* Card 3 — No lock-in */}
          <SpotlightCard accentColor="rgba(255,255,255,0.04)">
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.22em] mb-2">
              Export
            </div>
            <h3 className="text-xl font-semibold text-white tracking-tight">
              No Lock-in.
            </h3>
            <p className="text-sm text-white/40 mt-2 leading-relaxed">
              Export clean Dockerfiles and JSON configs. Your architecture, your
              infrastructure, forever.
            </p>
            <DockerVisual />
          </SpotlightCard>

          {/* Card 4 — OpenAPI (span 2) */}
          <SpotlightCard
            colSpan="md:col-span-2"
            accentColor="rgba(0,240,255,0.06)"
          >
            <div className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-[0.22em] mb-2">
              API
            </div>
            <h3 className="text-xl font-semibold text-white tracking-tight">
              Auto-Generated OpenAPI.
            </h3>
            <p className="text-sm text-white/40 mt-2 leading-relaxed">
              Every node generates a fully-typed, Swagger-ready API spec. Zero
              effort, full coverage.
            </p>
            <SwaggerMock />
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
