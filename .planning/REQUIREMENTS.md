# Requirements

**Project:** Archi.dev
**Source:** PRD v1.0 — UI/UX Enhancement
**Date:** 2026-03-25

---

## Phase 1 Requirements

### REQ-001 — Global Design System
Apply "Cyber-Glass" aesthetic universally: pure black backgrounds (#040507), translucent panels (bg-white/5), backdrop-blur-xl, border-white/10. All CSS variables confirmed in globals.css.

### REQ-002 — Typography Hierarchy
Instrument Serif (headings, italic 400), Barlow (body 400/600), Geist Mono (technical labels 10px uppercase tracking-widest). All fonts confirmed in globals.css.

### REQ-003 — Micro-Interactions
Every interactive element: 300ms ease-out transition, hover scale(1.02), glowing border reveals. 60fps minimum. CSS transforms only on hot paths.

### REQ-004 — Landing Page Navbar
Transparent → floating .glass-panel pill on scroll >20px. Hides on scroll down >100px, reveals on scroll up. Framer-motion layoutId nav underline.

### REQ-005 — Landing Page Hero
Parallax hero with animated cyan/violet orbs. .text-gradient headline translates on scroll. Entrance: y:24 opacity:0 blur:8px → clear at 800ms.

### REQ-006 — Landing Page Bento Grid
4-col desktop, mouse-tracking radial-gradient spotlight via --mx/--my CSS props on each card. .bento-card class.

### REQ-007 — Landing Page Sticky Scroll Sequence
300vh container. Left text fades "Draw Nodes" → "AI Scaffolds" → "Deploy" mapped to scrollYProgress. Right shows simulated React Flow canvas with nodes appearing at scroll thresholds.

### REQ-008 — Landing Page Magnetic CTA
Full-width footer section, cyan bottom-glow radial gradient. "Start Building" button: framer-motion magnetic pull within 80px radius.

### REQ-009 — Authentication Pages
Split-screen lg:grid-cols-[1.2fr_0.8fr]. Left: Instrument Serif heading, eyebrow badge, feature list. Right: OAuth buttons (Google white shimmer, GitHub dark), floating label inputs, cyan focus border. Animated cyan/violet orbs in background.

### REQ-010 — Dashboard Layout & Stats
Thin collapsed left-rail or floating top-bar navigation. Stats row: 4 cyber-glass mini-cards. Animated SVG circular progress ring for credit limit. Counter animation on mount (1800ms).

### REQ-011 — Dashboard Project Cards
Grid of .cyber-glass cards with 2px colored top border. SVG mini-graph thumbnail (ArchitectureThumbnail component). Status pill + dot. Hover: scale(1.02), border brightens, spotlight trail.

### REQ-012 — Dashboard Empty State
"Start your first architecture" heading (Instrument Serif, .text-gradient). 3 template cards (RAG Pipeline, SaaS Auth, E-commerce API) with category-colored glow borders. Cyan CTA pill button.

### REQ-013 — Studio Canvas & Custom Nodes
ArchitectureNode: .ermiz-node base, 2px colored top border (Cyan=API, Violet=DB), Geist Mono type label, method badges. Animated SVG edges with stroke-dasharray pulse. Custom handles.

### REQ-014 — Studio Command Palette & UX
Cmd+K: .cyber-glass modal, blur backdrop, cyan focus border. Entrance animation. Floating context menu above nodes: [Edit][Duplicate][Connect][Delete] in .cyber-glass toolbar. AI Copilot pill: fixed bottom-center, expands on focus.

### REQ-015 — Docs, Settings & Component Inventory
Docs: three-pane layout, dark-themed, "Try it out" glow button, syntax-highlighted code + copy. Settings: terminal-style credit ledger (Geist Mono), API key obscure/reveal/copy, inline destructive confirmation. All 15 new + 7 upgraded components from component inventory built.
