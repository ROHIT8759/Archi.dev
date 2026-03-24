"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { useRouter } from "next/navigation";
import {
  Search, BookOpen, Code2, Zap, Globe, Shield,
  Terminal, Layers, ArrowRight, FileText, GitBranch, Cpu,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import CTAFooter from "@/components/landing/CTAFooter";

const docCategories = [
  {
    icon: BookOpen,
    eyebrow: "Start here",
    title: "Getting Started",
    description: "Install Archi.dev, configure your workspace, and deploy your first backend in under 5 minutes.",
    links: ["Quickstart guide", "Core concepts", "First deployment", "Workspace layout"],
    accent: "#00F0FF",
    badge: "Start here",
    span: "xl:col-span-2",
  },
  {
    icon: Layers,
    eyebrow: "Architecture",
    title: "Canvas & Nodes",
    description: "Master the visual canvas. Learn about every node type, edge behavior, and how the graph maps to real infrastructure.",
    links: ["Node types overview", "Edge rules", "Service boundaries", "Canvas keybindings"],
    accent: "#8A2BE2",
  },
  {
    icon: Code2,
    eyebrow: "Generation",
    title: "Code Generation",
    description: "Understand how Archi.dev turns your diagram into OpenAPI specs, Prisma models, and runtime scaffolding.",
    links: ["Generation pipeline", "OpenAPI output", "Prisma schemas", "Custom templates"],
    accent: "#00F0FF",
  },
  {
    icon: Zap,
    eyebrow: "AI",
    title: "AI Agent",
    description: "Use natural language to build and modify architecture. The AI agent understands your canvas context.",
    links: ["Prompt guide", "Agent capabilities", "Context window", "Rate limits"],
    accent: "#8A2BE2",
  },
  {
    icon: Terminal,
    eyebrow: "Deploy",
    title: "Deploy & Export",
    description: "Push to production with Dockerfile, docker-compose, or ZIP exports. Region-aware with health checks.",
    links: ["One-click deploy", "Export formats", "Environment config", "Region selection"],
    accent: "#28C840",
  },
  {
    icon: Globe,
    eyebrow: "Infrastructure",
    title: "Global Regions",
    description: "Deploy to 13 global regions. Configure failover, latency routing, and zero-downtime rollouts.",
    links: ["Region map", "Failover rules", "Blue-green deploys", "Health checks"],
    accent: "#00F0FF",
  },
  {
    icon: Shield,
    eyebrow: "Security",
    title: "Auth, Legal & Trust",
    description: "Built-in Supabase auth integration, public legal pages, visible contact routes, and the core trust signals expected on a production website.",
    links: ["Auth setup", "Privacy policy", "Terms of service", "Public website checklist"],
    accent: "#8A2BE2",
  },
  {
    icon: FileText,
    eyebrow: "Reference",
    title: "API Reference",
    description: "Complete REST API reference for the Archi.dev platform API, webhooks, and event system.",
    links: ["REST endpoints", "Webhooks", "Event types", "SDK reference"],
    accent: "#F5A623",
  },
  {
    icon: GitBranch,
    eyebrow: "Collaboration",
    title: "Teams & Workspaces",
    description: "Share workspaces, manage roles, and collaborate on architecture with your engineering team.",
    links: ["Invite members", "Role permissions", "Shared canvases", "Version history"],
    accent: "#8A2BE2",
  },
  {
    icon: Cpu,
    eyebrow: "Runtime",
    title: "Runtime & Testing",
    description: "Run, test, and validate your generated code directly from the canvas before deploying.",
    links: ["Runtime sandbox", "Test runner", "Passthrough proxy", "Log streaming"],
    accent: "#00F0FF",
  },
];

const quickLinks = [
  { label: "Quickstart", href: "/docs" },
  { label: "Canvas keybindings", href: "/docs" },
  { label: "Export formats", href: "/docs" },
  { label: "AI prompting guide", href: "/docs" },
  { label: "Refund policy", href: "/refund-policy" },
  { label: "Cancellation policy", href: "/cancellation-policy" },
  { label: "Shipping policy", href: "/shipping-policy" },
  { label: "Contact support", href: "/contact" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
];

const changelogItems = [
  { version: "v1.4.2", date: "Mar 2026", note: "AI Agent now supports multi-step architecture revisions." },
  { version: "v1.4.0", date: "Mar 2026", note: "Gemma 3 12B model integration for faster generation." },
  { version: "v1.3.5", date: "Feb 2026", note: "Blue-green deployment rollout support added." },
];

function DocCard({
  cat,
  index,
}: {
  cat: (typeof docCategories)[number];
  index: number;
}) {
  const Icon = cat.icon;
  const isAccentCyan = cat.accent === "#00F0FF";
  const isAccentPurple = cat.accent === "#8A2BE2";
  const isAccentGreen = cat.accent === "#28C840";

  const iconBg = isAccentCyan
    ? "bg-[#00F0FF]/10"
    : isAccentPurple
    ? "bg-[#8A2BE2]/10"
    : isAccentGreen
    ? "bg-[#28C840]/10"
    : "bg-[#F5A623]/10";

  const iconColor = isAccentCyan
    ? "text-[#00F0FF]"
    : isAccentPurple
    ? "text-[#8A2BE2]"
    : isAccentGreen
    ? "text-[#28C840]"
    : "text-[#F5A623]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className={`bento-card rounded-2xl p-6 group relative overflow-hidden cursor-pointer ${cat.span ?? ""}`}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      {/* Hover spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{ background: `radial-gradient(300px circle at 50% 50%, ${cat.accent}12, transparent 70%)` }}
      />

      {cat.badge && (
        <div className="absolute top-4 right-4">
          <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-black bg-[#00F0FF]">
            {cat.badge}
          </span>
        </div>
      )}

      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
        <Icon size={17} className={iconColor} />
      </div>

      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-1.5" style={{ color: cat.accent }}>
        {cat.eyebrow}
      </div>
      <h3 className="text-white font-semibold text-base tracking-tight mb-2">{cat.title}</h3>
      <p className="text-white/40 text-xs leading-relaxed mb-5">{cat.description}</p>

      <ul className="space-y-1.5">
        {cat.links.map((link) => (
          <li key={link} className="flex items-center gap-2 text-xs text-white/45 group-hover:text-white/65 transition-colors duration-200">
            <ArrowRight size={10} className={`${iconColor} shrink-0 opacity-60`} />
            {link}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function DocsPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = docCategories.filter(
    (c) =>
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.links.some((l) => l.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <ReactLenis root>
      <main className="bg-black min-h-screen overflow-x-hidden">
        <Navbar />

        {/* Hero */}
        <section className="relative pt-40 pb-20 px-6 overflow-hidden">
          <div className="section-top-line" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,240,255,0.05) 0%, transparent 65%)" }}
          />
          <div className="bg-grid absolute inset-0 pointer-events-none opacity-40" />

          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 glass-panel px-5 py-2 rounded-full text-[#00F0FF] text-xs font-semibold uppercase tracking-[0.2em] border border-white/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-glow-cyan" />
                Documentation
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: 28, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-gradient font-medium tracking-tighter leading-[0.9] mb-5"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
            >
              Everything you<br />need to build.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-white/40 text-lg max-w-xl mx-auto leading-relaxed mb-10"
            >
              Guides, references, and tutorials for every part of the Archi.dev platform.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
              className="relative max-w-xl mx-auto"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search documentation…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full glass-panel border border-white/[0.09] rounded-full pl-11 pr-5 py-4 text-white text-sm placeholder:text-white/22 focus:outline-none focus:border-[#00F0FF]/35 focus:shadow-[0_0_0_3px_rgba(0,240,255,0.07)] transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors text-xs"
                >
                  ✕
                </button>
              )}
            </motion.div>

            {/* Quick links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38 }}
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-5"
            >
              <span className="text-white/18 text-xs">Popular:</span>
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => router.push(link.href)}
                  className="text-white/35 hover:text-white/65 text-xs transition-colors border-b border-white/[0.1] hover:border-white/25 pb-px"
                >
                  {link.label}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Categories grid */}
        <section className="px-6 pb-24 md:px-16 xl:px-24">
          <div className="max-w-7xl mx-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-24 text-white/22 text-sm">
                No results for &ldquo;{search}&rdquo;
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {filtered.map((cat, i) => (
                  <DocCard key={cat.title} cat={cat} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Changelog strip */}
        <section className="px-6 pb-28 md:px-16 xl:px-24 relative">
          <div className="section-top-line" />
          <div className="max-w-7xl mx-auto pt-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="section-line-accent" />
              <p className="text-[#00F0FF] text-xs font-semibold uppercase tracking-[0.2em]">Changelog</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {changelogItems.map((item, i) => (
                <motion.div
                  key={item.version}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                  className="bento-card rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold font-mono text-[#00F0FF]">{item.version}</span>
                    <span className="text-[10px] text-white/25 uppercase tracking-[0.15em]">{item.date}</span>
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed">{item.note}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTAFooter />
      </main>
    </ReactLenis>
  );
}
