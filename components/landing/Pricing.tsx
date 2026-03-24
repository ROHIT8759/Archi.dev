"use client";
import { motion } from "framer-motion";
import { Check, Sparkles, Shield, Crown } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for individuals and small projects",
    icon: Sparkles,
    features: [
      "Up to 5 active projects",
      "Basic node library",
      "Community support",
      "Export to Docker",
      "OpenAPI generation",
    ],
    highlighted: false,
    color: "#ffffff",
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For teams and growing businesses",
    icon: Shield,
    features: [
      "Unlimited active projects",
      "Advanced node library",
      "Priority support",
      "Multi-region deployment",
      "Team collaboration",
      "Custom integrations",
      "Advanced analytics",
      "SLA monitoring",
    ],
    highlighted: true,
    color: "#00F0FF",
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with custom needs",
    icon: Crown,
    features: [
      "Everything in Pro",
      "Custom node development",
      "Dedicated support",
      "On-premise deployment",
      "SSO & advanced security",
      "Custom training",
      "API access",
      "White-label options",
    ],
    highlighted: false,
    color: "#8A2BE2",
  },
];

function PricingCard({ plan, index }: { plan: typeof plans[0]; index: number }) {
  const Icon = plan.icon;

  if (plan.highlighted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl conic-border pricing-glow-ring"
        style={{ zIndex: 10 }}
        whileHover={{ y: -4, transition: { duration: 0.3 } }}
      >
        {/* Inner card */}
        <div
          className="relative rounded-2xl p-8 overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, rgba(0,240,255,0.09) 0%, rgba(138,43,226,0.05) 50%, rgba(0,0,0,0.9) 100%)",
            border: "1px solid rgba(0,240,255,0.18)",
          }}
        >
          {/* Top shimmer line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,240,255,0.6), rgba(138,43,226,0.4), transparent)",
            }}
          />

          {/* Inner glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,240,255,0.07), transparent 60%)",
            }}
          />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2"
          >
            <div
              className="px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{
                background: "linear-gradient(135deg, #00F0FF, #4ba8ff)",
                color: "#000",
                boxShadow: "0 0 24px rgba(0,240,255,0.4)",
              }}
            >
              {plan.badge}
            </div>
          </motion.div>

          {/* Header */}
          <div className="relative z-10 flex items-center gap-3 mb-6 mt-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(0,240,255,0.12)",
                border: "1px solid rgba(0,240,255,0.2)",
              }}
            >
              <Icon className="w-5 h-5" style={{ color: "#00F0FF" }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="text-[11px] text-white/35 mt-0.5">{plan.description}</p>
            </div>
          </div>

          {/* Price */}
          <div className="relative z-10 mb-7">
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-5xl font-bold"
                style={{
                  background: "linear-gradient(135deg, #ffffff, #b8deff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {plan.price}
              </span>
              {plan.period && (
                <span className="text-white/45 text-sm">{plan.period}</span>
              )}
            </div>
          </div>

          {/* Features */}
          <ul className="relative z-10 space-y-3 mb-8">
            {plan.features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.35 + i * 0.04 }}
                className="flex items-center gap-3 text-sm text-white/65"
              >
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(0,240,255,0.12)",
                    border: "1px solid rgba(0,240,255,0.25)",
                  }}
                >
                  <Check size={9} style={{ color: "#00F0FF" }} />
                </span>
                {feature}
              </motion.li>
            ))}
          </ul>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(0,240,255,0.35)" }}
            whileTap={{ scale: 0.98 }}
            className="relative z-10 w-full py-3.5 rounded-xl font-bold text-black text-sm shimmer-btn"
            style={{
              background: "linear-gradient(135deg, #00F0FF 0%, #4ba8ff 100%)",
            }}
          >
            Start Free Trial
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl p-8 glass-panel border border-white/[0.07] hover:border-white/[0.14] transition-all duration-500 group"
      whileHover={{ y: -2, transition: { duration: 0.25 } }}
    >
      {/* Top accent line on hover */}
      <div
        className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${plan.color}40, transparent)`,
        }}
      />

      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: `${plan.color}10`,
            border: `1px solid ${plan.color}20`,
          }}
        >
          <Icon
            className="w-5 h-5"
            style={{ color: plan.color === "#ffffff" ? "rgba(255,255,255,0.55)" : plan.color }}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
          <p className="text-[11px] text-white/32 mt-0.5">{plan.description}</p>
        </div>
      </div>

      <div className="mb-7">
        <div className="flex items-baseline gap-1.5">
          <span className="text-5xl font-bold text-white">{plan.price}</span>
          {plan.period && (
            <span className="text-white/40 text-sm">{plan.period}</span>
          )}
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 + i * 0.04 }}
            className="flex items-center gap-3 text-sm text-white/50"
          >
            <Check className="w-3.5 h-3.5 shrink-0" style={{ color: plan.color === "#ffffff" ? "rgba(255,255,255,0.35)" : plan.color }} />
            {feature}
          </motion.li>
        ))}
      </ul>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-white/[0.07] text-white hover:bg-white/[0.12] border border-white/[0.1] hover:border-white/[0.2]"
      >
        {plan.price === "$0" ? "Get Started Free" : "Contact Sales"}
      </motion.button>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section className="py-32 px-6 md:px-16 xl:px-24 bg-black relative">
      <div className="section-top-line" />

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/3 left-1/4 w-[700px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(0,240,255,0.055), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/5 w-[600px] h-[350px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(138,43,226,0.055), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="section-line-accent" />
            <p className="text-[#00F0FF] text-xs font-semibold uppercase tracking-[0.2em]">
              Pricing
            </p>
            <span className="section-line-accent" />
          </div>
          <h2
            className="text-gradient font-medium tracking-tighter leading-[0.87] mb-5"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
          >
            Simple, transparent
            <br />
            pricing.
          </h2>
          <p className="text-white/35 text-lg max-w-xl mx-auto leading-relaxed">
            Start free. Scale as you grow. No lock-in, ever.
          </p>
        </motion.div>

        {/* Cards grid — Pro card elevated */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-center">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-14"
        >
          <p className="text-white/32 text-sm">
            All plans include core features.{" "}
            <a href="#" className="text-[#00F0FF]/70 hover:text-[#00F0FF] transition-colors">
              View full comparison →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
