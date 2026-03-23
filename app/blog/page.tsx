"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import CTAFooter from "@/components/landing/CTAFooter";

type Category = "all" | "engineering" | "product" | "tutorial" | "company";

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All posts" },
  { id: "engineering", label: "Engineering" },
  { id: "product", label: "Product" },
  { id: "tutorial", label: "Tutorials" },
  { id: "company", label: "Company" },
];

const posts = [
  {
    slug: "building-a-production-api-in-60-seconds",
    title: "Building a production-ready API in 60 seconds with Archi.dev",
    excerpt: "We walk through the entire flow — from a blank canvas to a deployed Express API with Postgres — using nothing but the visual editor and one click.",
    category: "tutorial" as Category,
    accent: "#00F0FF",
    date: "Mar 20, 2026",
    readTime: "8 min read",
    featured: true,
    tags: ["tutorial", "API", "quickstart"],
    authorInitial: "S",
    authorName: "Sohom",
    authorGradient: "from-cyan-400 to-blue-600",
  },
  {
    slug: "how-we-built-the-ai-agent",
    title: "How we built the AI architecture agent on Gemma 3 12B",
    excerpt: "A deep dive into our prompt engineering approach, context window management, and how we keep the agent grounded to the canvas graph state.",
    category: "engineering" as Category,
    accent: "#8A2BE2",
    date: "Mar 14, 2026",
    readTime: "12 min read",
    featured: true,
    tags: ["AI", "engineering", "Gemma"],
    authorInitial: "A",
    authorName: "Archi Team",
    authorGradient: "from-violet-400 to-purple-600",
  },
  {
    slug: "v1-4-2-release-notes",
    title: "What's new in v1.4.2 — multi-step revisions and 23% faster generation",
    excerpt: "The AI agent can now iterate on parts of your architecture without resetting context. Plus significant generation speed improvements.",
    category: "product" as Category,
    accent: "#a78bfa",
    date: "Mar 21, 2026",
    readTime: "4 min read",
    featured: false,
    tags: ["release", "AI", "performance"],
    authorInitial: "A",
    authorName: "Archi Team",
    authorGradient: "from-violet-400 to-purple-600",
  },
  {
    slug: "prisma-schema-generation",
    title: "Generating Prisma schemas from visual database nodes",
    excerpt: "How Archi.dev maps your database canvas nodes to Prisma model definitions, including relation inference and type mapping.",
    category: "tutorial" as Category,
    accent: "#28C840",
    date: "Mar 10, 2026",
    readTime: "10 min read",
    featured: false,
    tags: ["Prisma", "tutorial", "database"],
    authorInitial: "S",
    authorName: "Sohom",
    authorGradient: "from-cyan-400 to-blue-600",
  },
  {
    slug: "blue-green-deployments-explained",
    title: "Zero-downtime deploys: how blue-green works on Archi.dev",
    excerpt: "A walkthrough of our deployment pipeline, how traffic is shifted between environments, and how to configure health checks and rollback thresholds.",
    category: "engineering" as Category,
    accent: "#00F0FF",
    date: "Feb 28, 2026",
    readTime: "7 min read",
    featured: false,
    tags: ["deployment", "infrastructure", "engineering"],
    authorInitial: "A",
    authorName: "Archi Team",
    authorGradient: "from-violet-400 to-purple-600",
  },
  {
    slug: "we-are-hiring",
    title: "We're building Archi.dev — and we're hiring",
    excerpt: "We're a small team obsessed with making backend architecture simple. If that excites you, we'd love to talk.",
    category: "company" as Category,
    accent: "#F5A623",
    date: "Feb 20, 2026",
    readTime: "3 min read",
    featured: false,
    tags: ["hiring", "team", "company"],
    authorInitial: "S",
    authorName: "Sohom",
    authorGradient: "from-cyan-400 to-blue-600",
  },
  {
    slug: "microservices-vs-monolith",
    title: "When to use microservices vs. a monolith — and how to visualise both",
    excerpt: "A framework-agnostic guide to architecture decisions, with examples of how each pattern maps to Archi.dev canvas topologies.",
    category: "engineering" as Category,
    accent: "#8A2BE2",
    date: "Feb 14, 2026",
    readTime: "9 min read",
    featured: false,
    tags: ["architecture", "engineering", "microservices"],
    authorInitial: "A",
    authorName: "Archi Team",
    authorGradient: "from-violet-400 to-purple-600",
  },
  {
    slug: "credit-system-design",
    title: "Designing a fair credit system for AI-heavy SaaS",
    excerpt: "The decisions behind Archi.dev's credit model — monthly grants, top-ups, team pooling, and how we prevent abuse without hurting legit users.",
    category: "product" as Category,
    accent: "#F5A623",
    date: "Jan 30, 2026",
    readTime: "6 min read",
    featured: false,
    tags: ["product", "pricing", "credits"],
    authorInitial: "S",
    authorName: "Sohom",
    authorGradient: "from-cyan-400 to-blue-600",
  },
];

export default function BlogPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filtered = activeCategory === "all"
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  const featured = posts.filter((p) => p.featured);
  const regular = filtered.filter((p) => !p.featured || activeCategory !== "all");
  const showFeatured = activeCategory === "all";

  return (
    <ReactLenis root>
      <main className="bg-black min-h-screen overflow-x-hidden">
        <Navbar />

        {/* Hero */}
        <section className="relative pt-40 pb-16 px-6 overflow-hidden">
          <div className="section-top-line" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,240,255,0.05) 0%, transparent 65%)" }}
          />
          <div className="bg-grid absolute inset-0 pointer-events-none opacity-30" />

          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 glass-panel px-5 py-2 rounded-full text-[#00F0FF] text-xs font-semibold uppercase tracking-[0.2em] border border-white/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-glow-cyan" />
                Blog
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: 24, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-gradient font-medium tracking-tighter leading-[0.9] mb-5"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
            >
              Ideas & updates<br />from the team.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-white/40 text-base max-w-md mx-auto leading-relaxed"
            >
              Engineering deep-dives, product releases, and tutorials from the people building Archi.dev.
            </motion.p>
          </div>
        </section>

        {/* Category filter */}
        <section className="px-6 md:px-16 xl:px-24 pb-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-xs font-semibold px-4 py-2 rounded-full transition-all cursor-pointer border ${
                    activeCategory === cat.id
                      ? "bg-white/[0.08] border-white/[0.15] text-white"
                      : "border-white/[0.06] text-white/35 hover:text-white/60 hover:bg-white/[0.03]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured posts */}
        {showFeatured && (
          <section className="px-6 pb-10 md:px-16 xl:px-24">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <span className="section-line-accent" />
                <h2 className="text-white/50 text-xs font-semibold uppercase tracking-[0.2em]">Featured</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featured.map((post, i) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                    className="bento-card rounded-2xl p-6 group cursor-pointer relative overflow-hidden"
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    onClick={() => router.push(`/blog/${post.slug}`)}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                      style={{ background: `radial-gradient(350px circle at 50% 50%, ${post.accent}0d, transparent 70%)` }}
                    />

                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
                        style={{ color: post.accent, backgroundColor: `${post.accent}15` }}
                      >
                        {post.category}
                      </span>
                      <span className="text-white/20 text-xs">·</span>
                      <span className="text-white/25 text-xs">{post.date}</span>
                    </div>

                    <h3 className="text-white font-semibold text-lg tracking-tight leading-snug mb-3">{post.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-6">{post.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${post.authorGradient} flex items-center justify-center text-xs font-bold text-white`}>
                          {post.authorInitial}
                        </div>
                        <div>
                          <div className="text-white/55 text-xs font-medium">{post.authorName}</div>
                          <div className="text-white/25 text-[11px] flex items-center gap-1">
                            <Clock size={9} /> {post.readTime}
                          </div>
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: post.accent }}
                      >
                        Read more <ArrowRight size={11} />
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Post grid */}
        <section className="px-6 pb-28 md:px-16 xl:px-24 relative">
          {showFeatured && <div className="section-top-line" />}
          <div className="max-w-7xl mx-auto pt-12">
            {showFeatured && (
              <div className="flex items-center gap-3 mb-6">
                <span className="section-line-accent" />
                <h2 className="text-white/50 text-xs font-semibold uppercase tracking-[0.2em]">All posts</h2>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-24 text-white/20 text-sm flex flex-col items-center gap-3">
                <BookOpen size={24} className="text-white/15" />
                No posts in this category yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {(showFeatured ? posts.filter((p) => !p.featured) : filtered).map((post, i) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
                    className="bento-card rounded-2xl p-5 group cursor-pointer relative overflow-hidden"
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    onClick={() => router.push(`/blog/${post.slug}`)}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                      style={{ background: `radial-gradient(300px circle at 50% 50%, ${post.accent}0a, transparent 70%)` }}
                    />

                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
                        style={{ color: post.accent, backgroundColor: `${post.accent}15` }}
                      >
                        {post.category}
                      </span>
                    </div>

                    <h3 className="text-white font-semibold text-sm tracking-tight leading-snug mb-2">{post.title}</h3>
                    <p className="text-white/35 text-xs leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${post.authorGradient} flex items-center justify-center text-[10px] font-bold text-white`}>
                          {post.authorInitial}
                        </div>
                        <span className="text-white/30 text-[11px] flex items-center gap-1">
                          <Clock size={9} /> {post.readTime}
                        </span>
                      </div>
                      <span className="text-white/20 text-[11px]">{post.date}</span>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        <CTAFooter />
      </main>
    </ReactLenis>
  );
}
