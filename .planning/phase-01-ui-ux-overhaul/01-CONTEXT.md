# Phase 1: UI/UX Overhaul — Context

**Gathered:** 2026-03-25
**Status:** Ready for planning
**Source:** PRD Express Path (UI-SPEC.md + PRD v1.0)

<domain>
## Phase Boundary

This phase implements the complete "Ultra-Premium Developer SaaS" visual identity for Archi.dev across all user-facing surfaces. Every page is overhauled with the Cyber-Glass aesthetic. The result is a production-ready UI matching Vercel/Linear/Stripe visual fidelity, with 15 new components and 7 upgraded components.

**In scope:**
- Global design system (tokens already in globals.css — confirm and extend)
- Landing page (navbar morph, hero parallax, bento spotlight, sticky scroll, magnetic CTA)
- Auth pages (/login, /signup) split-screen layout
- Dashboard (/dashboard) stats row, project cards grid, empty state
- Studio canvas (/studio, /studio/[project-id]) custom nodes, edges, command palette, context menu, AI copilot
- Docs (/docs/[project-id]) three-pane layout
- Settings (/settings) credit ledger, API key management

**Out of scope:**
- Backend API changes
- Database schema changes
- New authentication providers beyond existing GitHub/Google OAuth
- Real AI copilot logic (wire up UI shell only)

</domain>

<decisions>
## Implementation Decisions

All decisions below are LOCKED — sourced from the UI-SPEC.md design contract and PRD v1.0.

### Design System Tokens (locked from globals.css)
- Base background: `--background: #040507`
- Panel: `--panel: #0c1017`
- Floating: `--floating: #121923`
- Panel raised: `--panel-raised: #171f2c`
- Foreground: `--foreground: #eef4ff`
- Secondary: `--secondary: #c5d1e6`
- Muted: `--muted: #8e9ab2`
- Border: `--border: #1f2a3a`
- Border muted: `--border-muted: #27364b`
- Border strong: `--border-strong: #35506f`
- Primary: `--primary: #7fc5ff`
- Destructive: `--destructive: #ff6b82`
- Success: `--success: #3ad69f`
- Warning: `--warning: #ffbf5b`

### Cyber-Glass Panel (locked from globals.css .cyber-glass)
```css
background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0)) + rgba(7,11,18,0.68);
backdrop-filter: blur(22px);
border: 1px solid rgba(120,183,255,0.2);
box-shadow: 0 18px 42px rgba(0,0,0,0.44), 0 0 0 1px rgba(127,197,255,0.06);
```

### Typography (locked)
- Headings/Display: Instrument Serif, italic, 400, tracking-tighter
- Body: Barlow, 400/600
- Technical/Mono labels: Geist Mono, 10px, uppercase, tracking-widest (0.2em)
- Display: `clamp(38px, 4vw, 56px)`, Instrument Serif
- Heading: 24–28px, Instrument Serif
- Body: 14–16px, Barlow
- Label: 12px, Barlow 600
- Technical: 10px, Geist Mono 600–700

### Color Usage (locked)
- Cyan `#00F0FF` reserved for: logo strokes, API node borders, primary CTAs, input focus borders, studio generate button, Cmd+K accent, bento spotlight, animated edge pulse, node selection ring (API)
- Violet `#8A2BE2` reserved for: DB/AI node borders, auth background orb, node selection ring (DB/AI)
- Method colors: GET=`#60a5fa`, POST=`#4ade80`, PUT=`#facc15`, DELETE=`#ef4444`, PATCH=`#a78bfa`

### Animation Easing (locked)
- Entrance/exit: `[0.16, 1, 0.3, 1]` cubic-bezier
- Hover transitions: `ease-out` 300ms
- Nav pill morph: borderRadius 0→999px, 400ms `[0.16,1,0.3,1]`
- Parallax/counters: 1800ms cubic ease-out

### Border Radius System (locked)
- Nodes: 8px (but note existing code uses ~10px via `--radius`)
- Buttons/inputs: 10px
- Tab buttons: 12px
- Floating menus: 12px
- Bento cards: 24px
- Auth card: 32px
- Pills/badges: 999px

### Component File Paths (locked)
New components:
- `components/studio/CommandPalette.tsx`
- `components/studio/FloatingContextMenu.tsx`
- `components/studio/AiCopilotPill.tsx`
- `components/landing/BentoSpotlight.tsx`
- `components/landing/MagneticCTA.tsx`
- `components/landing/StickyScrollSequence.tsx`
- `components/canvas/edges/AnimatedEdge.tsx`
- `components/dashboard/ArchitectureThumbnail.tsx`
- `components/dashboard/CreditRing.tsx`
- `components/dashboard/TemplateCard.tsx`
- `components/settings/CreditsLedger.tsx`
- `components/settings/ApiKeyField.tsx`
- `components/docs/DocsSidebar.tsx`
- `components/docs/DocsEndpoint.tsx`
- `components/docs/DocsCodePanel.tsx`

Upgraded components:
- `components/landing/Navbar.tsx` — pill threshold 20px→50px, hide-on-scroll-down
- `components/landing/Hero.tsx` — parallax translateY on scrollYProgress
- `components/landing/BentoGrid.tsx` — BentoSpotlight integration
- `components/canvas/nodes/ApiEndpointNode.tsx` — lucide icons, .ermiz-node class, cyber-glass selection
- `components/canvas/nodes/DatabaseNode.tsx` — violet top border, .ermiz-node pattern
- `components/studio/StudioHeader.tsx` — Cmd+K trigger, copilot toggle
- `components/studio/WorkspaceCanvas.tsx` — integrate CommandPalette, AiCopilotPill, FloatingContextMenu

### Page-Specific Contracts (locked from UI-SPEC.md)

**Landing Navbar:** transparent → .glass-panel pill at scroll >20px, floated y:+16px, hide on scroll down >100px, reveal on scroll up. CTA: white pill `scale(1.05)`, glow on hover.

**Landing Hero:** .bg-grid + .bg-noise + 2 animated orbs. Headline: .text-gradient, Instrument Serif, parallax Y 0→25% on scroll. Entrance: y:24 opacity:0 blur:8px → clear 800ms.

**Bento Grid:** `--mx`/`--my` CSS custom props tracking cursor. Radial-gradient spotlight on each card. No scale on hover (spotlight is the reveal).

**Sticky Scroll Sequence:** 300vh container, left text fades 3 states mapped to scrollYProgress, right shows simulated React Flow canvas.

**Magnetic CTA:** framer-motion cursor tracking within 80px radius. scale(1.03), glow intensifies on hover.

**Auth Layout:** `lg:grid-cols-[1.2fr_0.8fr]` max-w-5xl. Left: Instrument Serif heading, eyebrow (Geist Mono 10px cyan), feature cards (.bg-white/[0.025]). Right: Google (white shimmer), GitHub (dark border), email input with floating label + cyan focus. Background: .bg-grid + .bg-noise + animated orbs (cyan 520×520 blur:72 8s loop, violet 420×420 blur:64 10s loop).

**Dashboard Stats Row:** 4 .cyber-glass mini-cards. SVG circular progress ring for credits (stroke-dasharray animated). Counter 1800ms cubic.

**Dashboard Project Cards:** .cyber-glass + 2px colored top border matching project tab. SVG mini-graph thumbnail (ArchitectureThumbnail). Status pill. Hover: scale(1.02), spotlight trail.

**Dashboard Empty State:** "Start your first architecture" Instrument Serif .text-gradient. 3 template cards. Cyan "Start from template" CTA pill.

**Studio Node:** `.ermiz-node` class, min-width 220px, borderRadius 10px, 2px top border (cyan=API, violet=DB), Geist Mono 10px type label, method badge colored per HTTP verb. Selected: `border-color: var(--primary)`, `box-shadow: 0 0 0 1px var(--primary)` + --shadow-float.

**Animated Edges:** SVG stroke-dasharray + @keyframes edge-flow (dashoffset 0→-20). Resting: var(--muted) 1.8px. Selected: var(--primary) 2.5px. Pulse on API→DB paths.

**Command Palette:** .cyber-glass centered modal, max-w-lg. Input: 16px Barlow, border-b 2px #00F0FF on focus. Results: 44px rows, Geist Mono 10px type + 14px Barlow name. Entrance: y:-8 opacity:0 scale:0.97 → 220ms.

**Floating Context Menu:** appears above node `translateY(-calc(100% + 8px))`. .cyber-glass borderRadius 12px. [Edit][Duplicate][Connect][Delete] 32×32px icon buttons.

**AI Copilot Pill:** fixed bottom-center, 16px from bottom. .cyber-glass borderRadius 999px. min-width 320px, expands to 560px on focus. Cyan submit button with pulse when loading.

**Docs Three-Pane:** left nav 240px, center flex-1, right code panel 340px. All var(--panel) bg. Left: Geist Mono 10px section headers, .sidebar-item rows. Center: method badge + Geist Mono route. "Try it out" .cyber-glass pill cyan glow on hover. Right: .studio-card bg, language tabs Geist Mono 10px, Geist Mono 12px syntax-highlighted code, copy button 32×32px.

**Settings Credit Ledger:** .studio-card borderRadius 16px. Geist Mono 11px rows: `[timestamp] — [action] — [amount]`. max 320px with scrollbar.

**Settings API Key:** `type="password"` default. Eye toggle 32×32px lucide Eye/EyeOff. Copy button 32×32px. Input focus: `var(--primary)` border, `0 0 0 4px rgba(121,183,255,0.14)` shadow.

### Copywriting (locked from UI-SPEC.md)
- Landing CTA: "Start Building Free"
- Landing hero headline: "Build backends visually. Ship real code."
- Landing hero subhead: "Draw your architecture. Archi generates production-ready code, docs, and deployments in seconds."
- Navbar CTA: "Start free trial"
- Auth heading: "Back to your workspace."
- Auth subhead: "Sign in to continue from your last architecture session — no configuration lost."
- Command Palette placeholder: "Search for a node… (e.g. 'Postgres', 'REST API')"
- AI Copilot placeholder: "Ask AI to modify your canvas…"
- Studio empty: "Nothing here yet" / "Drag a node from the sidebar to begin, or press Cmd+K to search and place a component."

### Accessibility (locked)
- Touch targets: 44×44px minimum for all icon-only buttons
- Focus rings: 2px var(--primary) outline, offset 2px, 4px rgba(121,183,255,0.14) shadow
- Reduced motion: wrap framer-motion in `useReducedMotion()` check
- Command palette: closes on Escape, keyboard navigable
- All icon-only buttons: aria-label required

### Claude's Discretion
- Wave breakdown (which new components to build in parallel vs sequentially)
- File path of pages to update (must discover from codebase)
- Test structure and coverage strategy
- State management approach for CommandPalette (zustand slice vs local state)
- How to generate SVG thumbnails in ArchitectureThumbnail (simplified static geometry vs dynamic from project data)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Contract
- `.planning/phase-01-ui-ux-overhaul/01-UI-SPEC.md` — Complete visual and interaction spec for all pages; governing document for this phase

### Codebase Analysis
- `.planning/codebase/STACK.md` — Technology stack (Next.js 16, React 19, Tailwind v4, framer-motion v12, @xyflow/react v12, shadcn/ui)
- `.planning/codebase/ARCHITECTURE.md` — Application architecture and file structure
- `.planning/codebase/CONVENTIONS.md` — Coding conventions and patterns
- `.planning/codebase/STRUCTURE.md` — Directory structure and component organization

### Key Source Files (executor must read before touching)
- `app/globals.css` — CSS variables, .cyber-glass, .glass-panel, .bg-grid, .ermiz-node, .sidebar-item, .bento-card, .status-pill, animation keyframes
- `components/landing/Navbar.tsx` — Current navbar implementation (upgrade target)
- `components/landing/Hero.tsx` — Current hero (upgrade target)
- `components/landing/BentoGrid.tsx` — Current bento grid (upgrade target)
- `components/canvas/nodes/ApiEndpointNode.tsx` — Current API node (upgrade target, min-width 220px confirmed)
- `components/canvas/nodes/DatabaseNode.tsx` — Current DB node (upgrade target)
- `components/studio/StudioHeader.tsx` — Current studio header (upgrade target)
- `components/studio/WorkspaceCanvas.tsx` — Current canvas wrapper (integration target, left sidebar 236px, inspector 320px confirmed)

</canonical_refs>

<specifics>
## Specific Ideas

- The `@xyflow/react` custom edge uses `stroke-dasharray` animation — the `@keyframes edge-flow` is already declared in globals.css
- The `.magnetic-btn` class with `--mx`/`--my` CSS custom props pattern is already in globals.css
- Lenis v1 is already installed — use for smooth scroll on landing page
- framer-motion `layoutId="nav-underline"` for nav link hover indicator
- `useReducedMotion()` from framer-motion for accessibility gate
- ArchitectureThumbnail: generate simplified SVG geometry (boxes + lines) from project node positions, no need for full React Flow render
- SVG circular progress ring: `stroke-dasharray = circumference * percentage, circumference` on a `<circle>` element

</specifics>

<deferred>
## Deferred Ideas

- Real AI copilot backend integration (wire UI only in this phase)
- Infinitely panning decorative React Flow canvas on auth page right side (PRD §2.2) — complex to implement, defer if time-constrained; static animated background is acceptable
- Magic links / passwordless email (PRD §2.2) — requires backend work, out of scope for this UI phase
- Customized Swagger UI / Redoc instance (PRD §2.5) — use custom-built docs components instead
- BYOK (Bring Your Own Key) tier UI for settings (PRD §2.6) — API key management UI is in scope, BYOK pricing tier is not

</deferred>

---

*Phase: 01-ui-ux-overhaul*
*Context gathered: 2026-03-25 via PRD Express Path (UI-SPEC.md)*
