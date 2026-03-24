"use client";
import { motion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import type { LucideIcon } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import CTAFooter from "@/components/landing/CTAFooter";

type PolicyItem = {
  subtitle: string;
  body: string;
};

type PolicySection = {
  icon: LucideIcon;
  title: string;
  accent: string;
  content: readonly PolicyItem[];
};

type PolicyPageProps = {
  badgeLabel: string;
  badgeAccent: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: readonly PolicySection[];
  closingText: React.ReactNode;
};

export default function PolicyPage({
  badgeLabel,
  badgeAccent,
  title,
  description,
  lastUpdated,
  sections,
  closingText,
}: PolicyPageProps) {
  return (
    <ReactLenis root>
      <main className="bg-black min-h-screen overflow-x-hidden">
        <Navbar />
        <section className="relative overflow-hidden px-6 pt-40 pb-16">
          <div className="section-top-line" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${badgeAccent}12 0%, transparent 65%)`,
            }}
          />
          <div className="bg-grid absolute inset-0 pointer-events-none opacity-30" />
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6"
            >
              <span
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] glass-panel"
                style={{ color: badgeAccent }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: badgeAccent, boxShadow: `0 0 10px ${badgeAccent}` }}
                />
                {badgeLabel}
              </span>
            </motion.div>
            <motion.h1
              initial={{ y: 24, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-gradient mb-5 font-medium tracking-tighter leading-[0.9]"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="mx-auto max-w-2xl text-base leading-relaxed text-white/40"
            >
              Last updated <span className="text-white/65">{lastUpdated}</span>. {description}
            </motion.p>
          </div>
        </section>
        <section className="px-6 pb-28 md:px-16 xl:px-24">
          <div className="mx-auto max-w-4xl space-y-6">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                  className="bento-card group relative overflow-hidden rounded-2xl p-7"
                >
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(400px circle at 30% 50%, ${section.accent}0a, transparent 70%)`,
                    }}
                  />
                  <div className="mb-6 flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${section.accent}18` }}
                    >
                      <Icon size={16} style={{ color: section.accent }} />
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight text-white">{section.title}</h2>
                  </div>
                  <div className="space-y-5">
                    {section.content.map((item) => (
                      <div
                        key={item.subtitle}
                        className="border-l-2 pl-4"
                        style={{ borderColor: `${section.accent}30` }}
                      >
                        <div className="mb-1.5 text-sm font-semibold text-white/75">{item.subtitle}</div>
                        <p className="text-sm leading-relaxed text-white/40">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bento-card rounded-2xl p-6 text-center"
            >
              <div className="text-sm leading-relaxed text-white/30">{closingText}</div>
            </motion.div>
          </div>
        </section>
        <CTAFooter />
      </main>
    </ReactLenis>
  );
}
