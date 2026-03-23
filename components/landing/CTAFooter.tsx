"use client";

import { useRef } from "react";
import { motion, useSpring } from "framer-motion";

const footerLinks = ["Privacy", "Terms", "Status", "GitHub"];

export default function CTAFooter() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const springConfig = { stiffness: 200, damping: 18, mass: 0.6 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.28);
    y.set((e.clientY - cy) * 0.28);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <footer className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden border-t border-white/[0.07]">
      {/* Video BG — hue-rotated to green/teal */}
      <video
        src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connections-loop-28828-large.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.18] mix-blend-screen pointer-events-none"
        style={{ filter: "hue-rotate(90deg)" }}
      />

      {/* Radial vignette — black edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 55% at 50% 100%, transparent 0%, #000000 65%)",
        }}
      />

      {/* Grain noise */}
      <div className="bg-noise absolute inset-0" />

      {/* Decorative concentric rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {[320, 540, 760, 980, 1200].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              border: "1px solid rgba(0,240,255,0.045)",
            }}
            animate={{
              scale: [1, 1.015, 1],
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{
              duration: 5 + i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl w-full">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-[#00F0FF] text-xs font-semibold uppercase tracking-[0.2em] mb-8"
        >
          Start today
        </motion.p>

        {/* Main heading */}
        <motion.h2
          initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          viewport={{ once: true }}
          className="text-gradient font-medium tracking-tighter leading-[0.85] mb-14"
          style={{ fontSize: "clamp(4rem, 10vw, 10rem)" }}
        >
          Ready to build?
        </motion.h2>

        {/* CTA block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-5"
        >
          {/* Magnetic button */}
          <motion.button
            ref={buttonRef}
            type="button"
            style={{ x, y }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="bg-white text-black px-14 py-5 rounded-full text-lg font-semibold cursor-pointer select-none"
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 60px rgba(255,255,255,0.35)",
            }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            Start building for free →
          </motion.button>

          <p className="text-white/[0.22] text-sm">
            No credit card required · Deploy in 60 seconds
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-3 mt-1">
            <div className="flex -space-x-2">
              {[
                "bg-gradient-to-br from-cyan-400 to-blue-600",
                "bg-gradient-to-br from-violet-400 to-purple-600",
                "bg-gradient-to-br from-emerald-400 to-teal-600",
                "bg-gradient-to-br from-orange-400 to-red-500",
              ].map((gradient, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full border-2 border-black ${gradient}`}
                />
              ))}
            </div>
            <span className="text-white/35 text-xs">
              Joined by{" "}
              <span className="text-white/60 font-medium">3,200+</span>{" "}
              engineers this month
            </span>
          </div>
        </motion.div>

        {/* Footer nav */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          viewport={{ once: true }}
          className="mt-24 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4 text-white/25 text-xs"
        >
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] inline-block"
              style={{ boxShadow: "0 0 6px #00F0FF" }}
            />
            <span className="font-medium text-white/40">Archi.dev</span>
          </div>

          <div className="flex gap-6">
            {footerLinks.map((link) => (
              <button
                key={link}
                type="button"
                className="hover:text-white/55 transition-colors duration-200 cursor-pointer"
              >
                {link}
              </button>
            ))}
          </div>

          <span>© 2025 Archi.dev. All rights reserved.</span>
        </motion.div>
      </div>
    </footer>
  );
}
