"use client";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, ArrowUp } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "/pricing" },
    { name: "API", href: "#api" },
    { name: "Documentation", href: "#docs" },
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Careers", href: "#careers" },
    { name: "Contact", href: "#contact" },
  ],
  legal: [
    { name: "Privacy", href: "#privacy" },
    { name: "Terms", href: "#terms" },
    { name: "Security", href: "#security" },
    { name: "Compliance", href: "#compliance" },
  ],
};

const socialLinks = [
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "GitHub", href: "#", icon: Github },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "Email", href: "#", icon: Mail },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="text-white/40 hover:text-white/80 transition-colors duration-200 text-sm"
    >
      {children}
    </motion.a>
  );
}

function SocialIcon({ href, icon: Icon, name }: { href: string; icon: any; name: string }) {
  return (
    <motion.a
      href={href}
      aria-label={name}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="w-10 h-10 rounded-full glass-panel border border-white/[0.06] flex items-center justify-center text-white/60 hover:text-white hover:border-white/[0.20] transition-all duration-300"
    >
      <Icon className="w-4 h-4" />
    </motion.a>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black border-t border-white/[0.06] overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#00F0FF]/3 blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-[#8A2BE2]/3 blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 xl:px-24 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 rounded-full bg-[#00F0FF] opacity-20 animate-pulse" />
                  <div className="relative w-8 h-8 rounded-full bg-[#00F0FF]/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[#00F0FF]" />
                  </div>
                </div>
                <span className="font-semibold text-lg tracking-tight text-white">
                  Archi.dev
                </span>
              </div>
              
              <p className="text-white/40 leading-relaxed mb-6 max-w-sm">
                Visual backend architecture platform. Design, generate, and ship production-ready systems in minutes, not weeks.
              </p>

              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <SocialIcon key={social.name} {...social} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links sections */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-white font-semibold text-sm uppercase tracking-[0.15em] mb-4">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <FooterLink href={link.href}>{link.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-white/[0.06]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div className="text-white/40 text-sm">
              © {currentYear} Archi.dev. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              <FooterLink href="#privacy">Privacy</FooterLink>
              <FooterLink href="#terms">Terms</FooterLink>
              <FooterLink href="#security">Security</FooterLink>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Back to top button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full glass-panel border border-white/[0.06] flex items-center justify-center text-white/60 hover:text-white hover:border-white/[0.20] transition-all duration-300 z-50"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
}
