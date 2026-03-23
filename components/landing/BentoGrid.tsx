"use client";
import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { Globe3D, type GlobeMarker } from "@/components/ui/3d-globe";

const globeMarkers: GlobeMarker[] = [
  { lat: 40.7128, lng: -74.006, src: "https://assets.aceternity.com/avatars/1.webp", label: "New York" },
  { lat: 51.5074, lng: -0.1278, src: "https://assets.aceternity.com/avatars/2.webp", label: "London" },
  { lat: 35.6762, lng: 139.6503, src: "https://assets.aceternity.com/avatars/3.webp", label: "Tokyo" },
  { lat: -33.8688, lng: 151.2093, src: "https://assets.aceternity.com/avatars/4.webp", label: "Sydney" },
  { lat: 48.8566, lng: 2.3522, src: "https://assets.aceternity.com/avatars/5.webp", label: "Paris" },
  { lat: 28.6139, lng: 77.209, src: "https://assets.aceternity.com/avatars/6.webp", label: "New Delhi" },
  { lat: 55.7558, lng: 37.6173, src: "https://assets.aceternity.com/avatars/7.webp", label: "Moscow" },
  { lat: -22.9068, lng: -43.1729, src: "https://assets.aceternity.com/avatars/8.webp", label: "Rio de Janeiro" },
  { lat: 31.2304, lng: 121.4737, src: "https://assets.aceternity.com/avatars/9.webp", label: "Shanghai" },
  { lat: 25.2048, lng: 55.2708, src: "https://assets.aceternity.com/avatars/10.webp", label: "Dubai" },
  { lat: -34.6037, lng: -58.3816, src: "https://assets.aceternity.com/avatars/11.webp", label: "Buenos Aires" },
  { lat: 1.3521, lng: 103.8198, src: "https://assets.aceternity.com/avatars/12.webp", label: "Singapore" },
  { lat: 37.5665, lng: 126.978, src: "https://assets.aceternity.com/avatars/13.webp", label: "Seoul" },
];
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
      visibleLines === 0 ? 400 : 280
    );
    return () => clearTimeout(id);
  }, [inView, visibleLines]);
  return (
    <div
      ref={ref}
      className="mt-6 rounded-xl overflow-hidden border border-white/[0.08] font-mono"
    >
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
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(400px circle at ${mouse.x}px ${mouse.y}px, ${accentColor}, transparent 65%)`,
        }}
      />
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
export default function BentoGrid() {
  return (
    <section className="py-32 px-6 md:px-16 xl:px-24 bg-black relative z-20">
      <div className="max-w-7xl mx-auto">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <SpotlightCard
            colSpan="md:col-span-3"
            accentColor="rgba(0,240,255,0.05)"
            className="overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="flex-1 shrink-0 max-w-sm">
                <div className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-[0.22em] mb-2">
                  Global
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  Deploy Anywhere, Instantly.
                </h3>
                <p className="text-sm text-white/40 mt-2 leading-relaxed">
                  Infrastructure available across every major region. Ship to the edge closest to your users — no extra config required.
                </p>
                <div className="mt-6 flex flex-col gap-2.5">
                  {["13 global regions", "Sub-50ms cold starts", "Automatic failover", "Zero-downtime deploys"].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-xs text-white/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full max-w-2xl -my-8 -mr-8">
                <Globe3D
                  markers={globeMarkers}
                  config={{
                    atmosphereColor: "#00F0FF",
                    atmosphereIntensity: 8,
                    showAtmosphere: true,
                    bumpScale: 5,
                    autoRotateSpeed: 0.3,
                    enableZoom: false,
                    enablePan: false,
                  }}
                  className="h-[380px]"
                />
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
