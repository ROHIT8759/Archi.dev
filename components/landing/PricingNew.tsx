"use client";
import { motion } from "framer-motion";
import { Check, Zap, Users, Sparkles, Crown, Shield } from "lucide-react";

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
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-2xl p-8 ${
        plan.highlighted
          ? "bg-gradient-to-b from-[#00F0FF]/10 to-[#00F0FF]/5 border-2 border-[#00F0FF]/30 shadow-2xl shadow-[#00F0FF]/20"
          : "glass-panel border border-white/[0.06] hover:border-white/[0.12]"
      } transition-all duration-500`}
    >
      {plan.highlighted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-[#00F0FF] text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em]">
            {plan.badge}
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          plan.highlighted ? "bg-[#00F0FF]/20" : "bg-white/[0.1]"
        }`}>
          <Icon className={`w-5 h-5 ${plan.highlighted ? "text-[#00F0FF]" : "text-white/60"}`} />
        </div>
        <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">{plan.price}</span>
          {plan.period && (
            <span className="text-white/60">{plan.period}</span>
          )}
        </div>
        <p className="text-white/40 text-sm mt-2">{plan.description}</p>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 + i * 0.05 }}
            className="flex items-center gap-3 text-sm text-white/60"
          >
            <Check className="w-4 h-4 text-[#00F0FF] flex-shrink-0" />
            {feature}
          </motion.li>
        ))}
      </ul>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
          plan.highlighted
            ? "bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 shadow-lg shadow-[#00F0FF]/30"
            : "bg-white/10 text-white hover:bg-white/20 border border-white/[0.20]"
        }`}
      >
        {plan.price === "$0" ? "Get Started" : plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
      </motion.button>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section className="py-32 px-6 md:px-16 xl:px-24 bg-black relative">
      <div className="section-top-line" />
      
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#00F0FF]/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#8A2BE2]/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="section-line-accent" />
            <p className="text-[#00F0FF] text-xs font-semibold uppercase tracking-[0.2em]">
              Pricing
            </p>
          </div>
          <h2
            className="text-gradient font-medium tracking-tighter leading-[0.87] mb-5"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
          >
            Simple, transparent
            <br />
            pricing.
          </h2>
          <p className="text-white/35 text-lg max-w-2xl mx-auto leading-relaxed">
            Choose the plan that fits your needs. Start free and scale as you grow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-white/40 text-sm">
            All plans include core features. 
            <a href="#" className="text-[#00F0FF] hover:text-[#00F0FF]/80 transition-colors ml-1">
              View full comparison →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
