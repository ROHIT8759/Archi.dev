"use client";
import { motion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import Navbar from "@/components/landing/Navbar";
import CTAFooter from "@/components/landing/CTAFooter";
import { Shield, Eye, Lock, Database, Globe, Mail } from "lucide-react";

const sections = [
  {
    icon: Eye,
    title: "Information We Collect",
    accent: "#00F0FF",
    content: [
      {
        subtitle: "Account data",
        body: "When you create an account via Google OAuth, we receive your name, email address, and profile picture from your Google account. We store only what's necessary to operate the service.",
      },
      {
        subtitle: "Usage data",
        body: "We collect information about how you interact with the platform — canvas operations, node counts, generation requests, and feature usage. This data is aggregated and used to improve the product.",
      },
      {
        subtitle: "Technical data",
        body: "IP address, browser type, device type, and session identifiers are logged for security, debugging, and fraud prevention purposes.",
      },
    ],
  },
  {
    icon: Database,
    title: "How We Use Your Data",
    accent: "#8A2BE2",
    content: [
      {
        subtitle: "To provide the service",
        body: "Your architecture diagrams, generated code, and workspace state are stored to allow you to resume work across sessions. This data is never shared with third parties.",
      },
      {
        subtitle: "To improve Archi.dev",
        body: "Anonymised usage patterns inform product decisions — which features are used most, where users get stuck, and how generation quality can be improved.",
      },
      {
        subtitle: "To communicate with you",
        body: "We send transactional emails (generation complete, credit warnings) and, if you opt in, product updates. You can unsubscribe from non-transactional emails at any time.",
      },
    ],
  },
  {
    icon: Lock,
    title: "Data Security",
    accent: "#28C840",
    content: [
      {
        subtitle: "Encryption",
        body: "All data is encrypted in transit via TLS 1.3 and at rest via AES-256. Auth tokens are stored in HTTP-only cookies to prevent XSS access.",
      },
      {
        subtitle: "Authentication",
        body: "We use Supabase as our auth provider. Passwords are never stored — authentication is delegated to your chosen OAuth provider (currently Google).",
      },
      {
        subtitle: "Access controls",
        body: "Workspace data is scoped to your user account. Our engineering team cannot access your canvas or generated code without your explicit consent.",
      },
    ],
  },
  {
    icon: Globe,
    title: "Third-Party Services",
    accent: "#F5A623",
    content: [
      {
        subtitle: "Supabase",
        body: "Handles authentication and the primary database. Supabase is SOC 2 Type II compliant and hosted on AWS infrastructure.",
      },
      {
        subtitle: "Google (OAuth & Gemini)",
        body: "Used for sign-in and AI code generation. When you use Google sign-in, Google's privacy policy applies to that authentication flow.",
      },
      {
        subtitle: "Vercel",
        body: "Our deployment platform. Request logs are retained for 30 days for debugging purposes.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Your Rights",
    accent: "#00F0FF",
    content: [
      {
        subtitle: "Data access & export",
        body: "You can request a full export of your data at any time by emailing privacy@archi.dev. We'll respond within 30 days.",
      },
      {
        subtitle: "Data deletion",
        body: "Deleting your account via Settings → Security permanently removes all your data from our systems within 30 days.",
      },
      {
        subtitle: "GDPR & CCPA",
        body: "If you are an EU or California resident, you have additional rights including the right to rectification and the right to opt out of data sale (we do not sell data).",
      },
    ],
  },
  {
    icon: Mail,
    title: "Contact",
    accent: "#8A2BE2",
    content: [
      {
        subtitle: "Privacy questions",
        body: "For any privacy-related questions, data requests, or concerns, contact us at privacy@archi.dev. We aim to respond within 5 business days.",
      },
      {
        subtitle: "Policy updates",
        body: "If we make material changes to this policy, we'll notify you via email and show an in-app notice at least 14 days before the changes take effect.",
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <ReactLenis root>
      <main className="bg-black min-h-screen overflow-x-hidden">
        <Navbar />

        {/* Hero */}
        <section className="relative pt-40 pb-16 px-6 overflow-hidden">
          <div className="section-top-line" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(138,43,226,0.06) 0%, transparent 65%)" }}
          />
          <div className="bg-grid absolute inset-0 pointer-events-none opacity-30" />

          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 glass-panel px-5 py-2 rounded-full text-[#8A2BE2] text-xs font-semibold uppercase tracking-[0.2em] border border-white/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A2BE2]" style={{ boxShadow: "0 0 8px rgba(138,43,226,0.8)" }} />
                Legal
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: 24, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-gradient font-medium tracking-tighter leading-[0.9] mb-5"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
            >
              Privacy Policy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-white/40 text-base max-w-xl mx-auto leading-relaxed"
            >
              Last updated <span className="text-white/65">March 24, 2026</span>. We take your privacy seriously — here&apos;s exactly what we collect and why.
            </motion.p>
          </div>
        </section>

        {/* Content */}
        <section className="px-6 pb-28 md:px-16 xl:px-24">
          <div className="max-w-4xl mx-auto space-y-6">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                  className="bento-card rounded-2xl p-7 relative overflow-hidden group"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{ background: `radial-gradient(400px circle at 30% 50%, ${section.accent}0a, transparent 70%)` }}
                  />

                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${section.accent}18` }}
                    >
                      <Icon size={16} style={{ color: section.accent }} />
                    </div>
                    <h2 className="text-white font-semibold text-lg tracking-tight">{section.title}</h2>
                  </div>

                  <div className="space-y-5">
                    {section.content.map((item) => (
                      <div key={item.subtitle} className="pl-4 border-l-2" style={{ borderColor: `${section.accent}30` }}>
                        <div className="text-white/75 text-sm font-semibold mb-1.5">{item.subtitle}</div>
                        <p className="text-white/40 text-sm leading-relaxed">{item.body}</p>
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
              <p className="text-white/30 text-sm leading-relaxed">
                This policy applies to archi.dev and all related services. By using Archi.dev, you agree to this policy.
                <br />For questions: <span className="text-[#00F0FF]/70">privacy@archi.dev</span>
              </p>
            </motion.div>
          </div>
        </section>

        <CTAFooter />
      </main>
    </ReactLenis>
  );
}
