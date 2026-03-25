# Phase 1: UI/UX Overhaul - Research

**Researched:** 2026-03-25
**Domain:** React/Next.js UI component development — Cyber-Glass design system, framer-motion animations, @xyflow/react custom components, Tailwind CSS v4
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Design System Tokens (locked from globals.css)**
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

**Cyber-Glass Panel (locked from globals.css .cyber-glass)**
```css
background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0)) + rgba(7,11,18,0.68);
backdrop-filter: blur(22px);
border: 1px solid rgba(120,183,255,0.2);
box-shadow: 0 18px 42px rgba(0,0,0,0.44), 0 0 0 1px rgba(127,197,255,0.06);
```

**Typography (locked)**
- Headings/Display: Instrument Serif, italic, 400, tracking-tighter
- Body: Barlow, 400/600
- Technical/Mono labels: Geist Mono, 10px, uppercase, tracking-widest (0.2em)
- Display: `clamp(38px, 4vw, 56px)`, Instrument Serif
- Heading: 24–28px, Instrument Serif
- Body: 14–16px, Barlow
- Label: 12px, Barlow 600
- Technical: 10px, Geist Mono 600–700

**Color Usage (locked)**
- Cyan `#00F0FF` reserved for: logo strokes, API node borders, primary CTAs, input focus borders, studio generate button, Cmd+K accent, bento spotlight, animated edge pulse, node selection ring (API)
- Violet `#8A2BE2` reserved for: DB/AI node borders, auth background orb, node selection ring (DB/AI)
- Method colors: GET=`#60a5fa`, POST=`#4ade80`, PUT=`#facc15`, DELETE=`#ef4444`, PATCH=`#a78bfa`

**Animation Easing (locked)**
- Entrance/exit: `[0.16, 1, 0.3, 1]` cubic-bezier
- Hover transitions: `ease-out` 300ms
- Nav pill morph: borderRadius 0→999px, 400ms `[0.16,1,0.3,1]`
- Parallax/counters: 1800ms cubic ease-out

**Border Radius System (locked)**
- Nodes: 8px (existing code uses ~10px via `--radius`)
- Buttons/inputs: 10px
- Tab buttons: 12px
- Floating menus: 12px
- Bento cards: 24px
- Auth card: 32px
- Pills/badges: 999px

**Component File Paths (locked)**
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

**Copywriting (locked)**
- Landing CTA: "Start Building Free"
- Landing hero headline: "Build backends visually. Ship real code."
- Landing hero subhead: "Draw your architecture. Archi generates production-ready code, docs, and deployments in seconds."
- Navbar CTA: "Start free trial"
- Auth heading: "Back to your workspace."
- Auth subhead: "Sign in to continue from your last architecture session — no configuration lost."
- Command Palette placeholder: "Search for a node… (e.g. 'Postgres', 'REST API')"
- AI Copilot placeholder: "Ask AI to modify your canvas…"
- Studio empty: "Nothing here yet" / "Drag a node from the sidebar to begin, or press Cmd+K to search and place a component."

**Accessibility (locked)**
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

### Deferred Ideas (OUT OF SCOPE)
- Real AI copilot backend integration (wire UI only in this phase)
- Infinitely panning decorative React Flow canvas on auth page right side (PRD §2.2) — complex to implement, defer if time-constrained; static animated background is acceptable
- Magic links / passwordless email (PRD §2.2) — requires backend work, out of scope for this UI phase
- Customized Swagger UI / Redoc instance (PRD §2.5) — use custom-built docs components instead
- BYOK (Bring Your Own Key) tier UI for settings (PRD §2.6) — API key management UI is in scope, BYOK pricing tier is not
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| REQ-001 | Global Design System: Cyber-Glass aesthetic, pure black backgrounds, translucent panels, backdrop-blur-xl | CSS variables confirmed in globals.css; .cyber-glass, .glass-panel, .bento-card classes exist; @theme inline block confirms Tailwind v4 token wiring |
| REQ-002 | Typography Hierarchy: Instrument Serif headings, Barlow body, Geist Mono technical labels | All three fonts confirmed in layout.tsx via next/font/google with CSS variables --font-heading, --font-body, --font-geist-mono; body/h1-h6 base styles confirmed in globals.css |
| REQ-003 | Micro-Interactions: 300ms ease-out transitions, hover scale(1.02), glowing borders. 60fps using CSS transforms only | button transition already in globals.css base styles; framer-motion v12 confirmed; .ermiz-node hover pattern confirmed in globals.css |
| REQ-004 | Landing Page Navbar: transparent → .glass-panel pill on scroll >20px, hides/reveals on scroll | Navbar.tsx already implements scroll detection and framer-motion pill morph; needs threshold tweak from 20→50px and CTA text update |
| REQ-005 | Landing Page Hero: parallax + animated orbs + .text-gradient headline | Hero.tsx already imports useScroll, useTransform from framer-motion; containerRef exists; parallax wire-up needed |
| REQ-006 | Landing Page Bento Grid: mouse-tracking radial-gradient spotlight via --mx/--my | .magnetic-btn and .hover-trail classes with --mx/--my already in globals.css; BentoSpotlight component needs building |
| REQ-007 | Sticky Scroll Sequence: 300vh container, left text fades 3 states mapped to scrollYProgress | StickyScrollSequence is a new component; framer-motion useScroll + useTransform pattern; simulated React Flow canvas on right |
| REQ-008 | Magnetic CTA: framer-motion magnetic pull within 80px radius | MagneticCTA is a new component; mouse-offset-to-transform pattern; handleInteractiveMove already exists in StudioHeader |
| REQ-009 | Auth Pages: split-screen layout, OAuth buttons, floating label inputs, animated orbs | login/page.tsx is a single-panel; needs full split-screen rebuild; /signup route does not yet exist — must be created |
| REQ-010 | Dashboard Layout & Stats: stats row with cyber-glass cards, SVG circular progress ring, counter animation | dashboard/page.tsx exists but has basic structure; CreditRing is new; counter animation pattern already in Hero.tsx |
| REQ-011 | Dashboard Project Cards: .cyber-glass with colored top border, SVG mini-graph, status pill, hover spotlight | .status-pill and .status-dot confirmed in globals.css; ArchitectureThumbnail and TemplateCard are new components |
| REQ-012 | Dashboard Empty State: Instrument Serif .text-gradient heading, 3 template cards, cyan CTA | TemplateCard component needed; .text-gradient confirmed; dashboard/page.tsx needs conditional empty state branch |
| REQ-013 | Studio Canvas: .ermiz-node with colored top border, method badges, animated SVG edges | .ermiz-node fully confirmed in globals.css; ApiEndpointNode has inline styles to migrate; @keyframes edge-flow confirmed; AnimatedEdge is new |
| REQ-014 | Studio Command Palette & UX: Cmd+K modal, floating context menu, AI copilot pill | All three are new components; handleInteractiveMove pattern in StudioHeader; Zustand store must expose open state; WorkspaceCanvas integration required |
| REQ-015 | Docs, Settings & Component Inventory: three-pane docs, terminal credit ledger, API key field | docs/page.tsx has basic marketing page — needs full three-pane overhaul; settings/page.tsx exists but lacks CreditsLedger and ApiKeyField; 15 new + 7 upgraded components total |
</phase_requirements>

---

## Summary

This phase is a comprehensive UI overhaul of an existing Next.js 16 / React 19 codebase that already has most of the required CSS infrastructure in place. The `globals.css` file contains the complete Cyber-Glass design token system, all animation keyframes (`@keyframes edge-flow`, `@keyframes shimmer-slide`, `@keyframes workspace-fade-up`), and the utility classes (`.cyber-glass`, `.glass-panel`, `.bento-card`, `.ermiz-node`, `.magnetic-btn`, `.hover-trail`, `.sidebar-item`, `.status-pill`) that the new components must consume. framer-motion v12, @xyflow/react v12, Lenis v1, and Tailwind v4 are all confirmed installed.

The codebase is partially upgraded: `Navbar.tsx` already implements scroll detection and pill morph with the correct easing constant `[0.16, 1, 0.3, 1]`; `Hero.tsx` already imports `useScroll` and `useTransform`; `ApiEndpointNode.tsx` already has the `methodColors` map and 2px colored top border pattern but uses inline styles rather than the `.ermiz-node` class. The work is therefore upgrading existing components to spec and building 15 new components that integrate into existing page layouts.

The highest-complexity new components are: `CommandPalette` (Cmd+K keyboard shortcut + Zustand state + node spawning), `StickyScrollSequence` (300vh scroll container with 3-state text fade mapped to `scrollYProgress`), `AnimatedEdge` (custom `@xyflow/react` edge with SVG `stroke-dasharray` animation), and the Docs three-pane layout overhaul. The recommended wave order is: design system tokens and CSS audit first, then landing page, then auth/dashboard, then studio canvas components, then docs/settings.

**Primary recommendation:** Use the `.cyber-glass`, `.ermiz-node`, `.sidebar-item`, `.status-pill`, `.hover-trail` classes from globals.css as the compositional foundation for all new components. Never recreate backdrop-filter or border styles with inline CSS — use the established class system. New CSS additions in this phase should be minimal and go into `globals.css` under `@layer utilities`.

---

## Standard Stack

### Core (all confirmed installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | App Router pages, layouts, `dynamic()` for SSR exclusion | All pages use App Router; `dynamic(() => import(...), { ssr: false })` is required for @xyflow/react |
| React | 19.2.3 | Component model | Project standard |
| framer-motion | 12.38.0 | Scroll animations, layout transitions, entrance animations, magnetic effects | Already used in Navbar, Hero, login, dashboard, settings pages |
| @xyflow/react | 12.10.0 | Node-graph canvas, custom nodes, custom edges, handles | Core canvas engine |
| Tailwind CSS | 4 | Utility classes; CSS variable wiring via `@theme inline` | Project standard; v4 syntax confirmed in globals.css |
| Lenis | 1.3.20 | Smooth scroll on landing page | Already imported in docs/page.tsx as `ReactLenis` from `lenis/react` |
| Lucide React | 0.563.0 | Icons for nodes, buttons, settings fields | Project standard |
| Zustand | 5.0.11 | State for CommandPalette open/close, copilot expanded state | Already used for all studio state |
| clsx + tailwind-merge | 2.1.1 / 3.4.0 | Conditional class composition | Already available |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next/font/google` | (built-in) | Font loading for Instrument Serif, Barlow, Geist Mono | Already configured in layout.tsx — do not re-import fonts |
| `react/useReducedMotion` (framer-motion) | 12.x | Accessibility gate for animations | Wrap all framer-motion animations |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| framer-motion `useScroll` | Intersection Observer | framer-motion already in bundle; `useScroll` gives reactive `MotionValue` — use it |
| CSS `@keyframes` for edge animation | JS animation loop | CSS `@keyframes edge-flow` already declared — use it via SVG `animationName` |
| Zustand for CommandPalette state | React local state + prop drilling | Zustand already in store; CommandPalette needs to be triggered from StudioHeader and WorkspaceCanvas — zustand slice is cleaner |

**Installation:** No new dependencies required. All necessary packages are already installed.

---

## Architecture Patterns

### Recommended Project Structure (additions only)
```
components/
├── canvas/
│   └── edges/
│       └── AnimatedEdge.tsx        # NEW — custom @xyflow/react edge
├── dashboard/
│   ├── ArchitectureThumbnail.tsx   # NEW — SVG mini-graph
│   ├── CreditRing.tsx              # NEW — SVG circular progress
│   └── TemplateCard.tsx            # NEW — template card with glow border
├── docs/
│   ├── DocsSidebar.tsx             # NEW — 240px left nav
│   ├── DocsEndpoint.tsx            # NEW — center pane endpoint card
│   └── DocsCodePanel.tsx           # NEW — 340px right code panel
├── landing/
│   ├── BentoSpotlight.tsx          # NEW — mouse-tracking spotlight card
│   ├── MagneticCTA.tsx             # NEW — magnetic button section
│   └── StickyScrollSequence.tsx    # NEW — 300vh scroll container
├── settings/
│   ├── CreditsLedger.tsx           # NEW — terminal-style transaction list
│   └── ApiKeyField.tsx             # NEW — obscure/reveal/copy input
└── studio/
    ├── CommandPalette.tsx           # NEW — Cmd+K modal
    ├── FloatingContextMenu.tsx      # NEW — node right-click toolbar
    └── AiCopilotPill.tsx           # NEW — fixed bottom-center pill

app/
└── signup/
    └── page.tsx                     # NEW — /signup route (REQ-009)
```

### Pattern 1: CSS Class Composition over Inline Styles
**What:** Use `.cyber-glass`, `.ermiz-node`, `.hover-trail`, `.status-pill` classes from globals.css as the base; apply Tailwind utilities on top.
**When to use:** Every new component. Never recreate backdrop-filter, box-shadow, or border-radius values inline.
**Example:**
```tsx
// Source: globals.css .cyber-glass definition + observed Navbar.tsx pattern
<div className="cyber-glass rounded-xl p-4">
  {/* content */}
</div>
```

### Pattern 2: framer-motion Scroll Animations with useReducedMotion Gate
**What:** Use `useScroll` + `useTransform` for parallax; gate all animations with `useReducedMotion()`.
**When to use:** Hero parallax, StickyScrollSequence, any scroll-linked animation.
**Example:**
```tsx
// Source: Hero.tsx (existing) + framer-motion v12 API
"use client";
import { useScroll, useTransform, useReducedMotion } from "framer-motion";

const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
const prefersReduced = useReducedMotion();
const translateY = useTransform(scrollYProgress, [0, 1], prefersReduced ? ["0%", "0%"] : ["0%", "25%"]);
```

### Pattern 3: --mx/--my CSS Custom Property Mouse Tracking
**What:** On `onMouseMove`, set `--mx` and `--my` CSS properties on the element; radial-gradient in CSS reads these.
**When to use:** BentoSpotlight cards (bento spotlight), MagneticCTA (magnetic pull), hover-trail on project cards.
**Example:**
```tsx
// Source: handleInteractiveMove already in StudioHeader.tsx; .hover-trail class in globals.css
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
};

// In JSX:
<div className="hover-trail bento-card" onMouseMove={handleMouseMove}>
```

### Pattern 4: @xyflow/react Custom Edge with SVG Stroke-Dasharray
**What:** Custom edge component that renders an SVG `<path>` with `stroke-dasharray` and applies `@keyframes edge-flow`.
**When to use:** `AnimatedEdge.tsx` for all API→DB connections in the studio canvas.
**Example:**
```tsx
// Source: @xyflow/react v12 custom edge pattern + globals.css @keyframes edge-flow
import { BaseEdge, EdgeProps, getBezierPath } from "@xyflow/react";

export function AnimatedEdge({ sourceX, sourceY, targetX, targetY, selected, ...props }: EdgeProps) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });
  return (
    <path
      d={edgePath}
      stroke={selected ? "var(--primary)" : "var(--muted)"}
      strokeWidth={selected ? 2.5 : 1.8}
      strokeDasharray="6 3"
      style={{
        animation: "edge-flow 0.6s linear infinite",
        fill: "none",
      }}
    />
  );
}
```

### Pattern 5: SVG Circular Progress Ring
**What:** SVG `<circle>` element with `stroke-dasharray` computed from circumference * percentage.
**When to use:** `CreditRing.tsx` for the dashboard credit stat card.
**Example:**
```tsx
// Source: Standard SVG pattern; described in CONTEXT.md specifics
const radius = 28;
const circumference = 2 * Math.PI * radius;
const dashArray = `${circumference * percentage} ${circumference}`;

<svg width="72" height="72" viewBox="0 0 72 72">
  {/* Track */}
  <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
  {/* Fill */}
  <circle
    cx="36" cy="36" r={radius}
    fill="none"
    stroke="var(--primary)"
    strokeWidth="4"
    strokeDasharray={dashArray}
    strokeLinecap="round"
    transform="rotate(-90 36 36)"
    style={{ transition: "stroke-dasharray 1.8s cubic-bezier(0.16, 1, 0.3, 1)" }}
  />
</svg>
```

### Pattern 6: Keyboard Shortcut Hook (Cmd+K)
**What:** `useEffect` with `keydown` listener; gate on `(e.metaKey || e.ctrlKey) && e.key === "k"`.
**When to use:** StudioHeader.tsx to open CommandPalette; CommandPalette to close on Escape.
**Example:**
```tsx
// Source: Standard keyboard hook pattern for Next.js App Router client components
useEffect(() => {
  const handleKey = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setCommandPaletteOpen(true);
    }
  };
  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, []);
```

### Pattern 7: Zustand Slice for UI Overlay State
**What:** Add `commandPaletteOpen`, `setCommandPaletteOpen`, `copilotExpanded`, `setCopilotExpanded` to the existing `useStore` in `store/useStore.ts`.
**When to use:** CommandPalette and AiCopilotPill need to be triggered from StudioHeader (separate component tree branch from WorkspaceCanvas).
**Recommendation:** Add to existing Zustand store rather than creating a new store — the store already manages all studio UI state (`apiTableModalNodeId`, `focusNodeId`, etc.).

### Pattern 8: next/dynamic for React Flow Components
**What:** Always wrap @xyflow/react components in `dynamic(() => import(...), { ssr: false })`.
**When to use:** WorkspaceCanvas already does this for `FlowCanvas`. New canvas-integrated components like `CommandPalette` rendered inside the canvas container do not need it separately — they inherit SSR exclusion from being rendered under the dynamic-imported tree. However, if `CommandPalette` is rendered in `StudioHeader` (outside FlowCanvas), it does not need dynamic import as it contains no React Flow imports.

### Anti-Patterns to Avoid
- **Recreating design tokens as inline hex values:** Every color, spacing, and shadow is in CSS variables. Using `#040507` hardcoded instead of `var(--background)` creates maintenance debt.
- **Building backdrop-filter outside .cyber-glass / .glass-panel:** These classes already include `webkit` prefixes. Always use the class.
- **Adding animation keyframes to component files:** All keyframes belong in `globals.css`. The `@keyframes edge-flow` is already there.
- **Forgetting `"use client"` directive:** framer-motion, useEffect, useRef, useScroll all require client components. Every new interactive component needs `"use client"` at the top.
- **Mounting @xyflow/react on server:** Always use `dynamic(() => import(...), { ssr: false })` for any component importing from `@xyflow/react`.
- **Using `export default` for new components:** Project convention is named exports. Use `export function ComponentName()` or `export const ComponentName = memo(...)`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Smooth scrolling | Custom scroll event throttle | `ReactLenis` from `lenis/react` | Already imported in docs/page.tsx; handles momentum, easing, and mobile |
| Scroll-linked animation values | `window.scrollY` in useEffect | `framer-motion useScroll + useTransform` | Returns reactive `MotionValue` — no manual state updates, no re-render per frame |
| Graph layout | Manual node positioning | `autoLayoutNodes` from `lib/studio/auto-layout.ts` | Dagre-based; already used in store |
| Edge path calculation | Manual cubic bezier math | `getBezierPath` / `getSmoothStepPath` from `@xyflow/react` | Handles all handle positions, curvature options |
| CSS class concatenation | String template literals | `clsx` + `tailwind-merge` (`cn()` pattern) | Handles conditional classes and Tailwind class conflicts |
| Reduced motion check | `window.matchMedia("(prefers-reduced-motion)")` | `useReducedMotion()` from `framer-motion` | Reactive; updates if user changes OS preference |
| Icon sprites | Custom SVG components | `lucide-react` | Already installed; tree-shakeable; consistent 1px stroke |

**Key insight:** The CSS infrastructure in `globals.css` is the real "design system library" for this project. Classes like `.cyber-glass`, `.ermiz-node`, `.hover-trail`, `.studio-card`, `.status-pill` and all their hover/selected states are pre-built and battle-tested. Building equivalent styles from scratch would introduce subtle differences and break visual consistency.

---

## Common Pitfalls

### Pitfall 1: Geist Mono CSS Variable Name Mismatch
**What goes wrong:** Components try to use `font-family: var(--font-geist-mono)` but the Tailwind `@theme inline` block does not expose this token — it exposes `--font-heading` and `--font-body`. The Geist Mono variable is loaded by `next/font` as `--font-geist-mono` on the `<html>` element but is not in the `@theme` block.
**Why it happens:** `app/layout.tsx` loads Geist Mono with `variable: "--font-geist-mono"` but the `@theme inline` block in globals.css only declares `--font-heading` and `--font-body`.
**How to avoid:** Reference Geist Mono as `fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace"` in inline styles, or add it to the `@theme inline` block. Do not use a Tailwind `font-mono` class expecting Geist Mono — it will fall back to system monospace.
**Warning signs:** Technical labels (10px UPPERCASE) rendering in system monospace instead of Geist Mono.

### Pitfall 2: framer-motion Layout Animations and React Flow Conflicts
**What goes wrong:** Using `motion.div` with `layout` prop inside a React Flow custom node causes React Flow's internal positioning to conflict with framer-motion's layout projection.
**Why it happens:** React Flow uses absolute positioning and transforms for nodes; framer-motion's layout projection also manipulates transforms.
**How to avoid:** Do not use the `layout` prop inside custom node components. Use `layoutId` only for elements outside the canvas (like the nav underline in Navbar.tsx). Inside nodes, use CSS transitions (`transition: transform 0.15s ease`) rather than framer-motion animations.
**Warning signs:** Nodes jump to wrong positions after selection; handles misalign on interaction.

### Pitfall 3: backdrop-filter Performance on the Studio Canvas
**What goes wrong:** Applying `.cyber-glass` (backdrop-filter: blur(22px)) to many overlapping elements inside the canvas degrades to sub-30fps on mid-range hardware.
**Why it happens:** Each backdrop-filter element triggers a separate composite layer. React Flow already creates layers for each node.
**How to avoid:** Apply `.cyber-glass` only to overlay elements rendered ABOVE the canvas (CommandPalette, FloatingContextMenu, AiCopilotPill) — not to nodes themselves. Nodes use `.ermiz-node` which has no backdrop-filter; the selected state uses a plain border + box-shadow.
**Warning signs:** Canvas FPS drops when multiple nodes are selected and a menu is open.

### Pitfall 4: The /signup Route Does Not Exist
**What goes wrong:** REQ-009 requires an auth split-screen layout at both `/login` and `/signup`. The `/signup` route does not yet exist — there is no `app/signup/page.tsx`.
**Why it happens:** The codebase only has a single `/login` page; OAuth-only auth means registration happens through the same flow.
**How to avoid:** Create `app/signup/page.tsx` that renders the same split-screen layout as `/login` but with "Create account" copy. Since auth is OAuth-only, the actual sign-up flow goes through the same Supabase OAuth handler — the page is a UI difference only.
**Warning signs:** Linking "Sign up" from the landing page results in a 404.

### Pitfall 5: Tailwind v4 Utility Generation for Custom Values
**What goes wrong:** Tailwind v4 no longer supports `tailwind.config.js` — configuration goes into `globals.css` via `@theme inline`. Arbitrary values like `grid-cols-[1.2fr_0.8fr]` and `clamp(38px,4vw,56px)` as inline Tailwind classes work in v4 JIT but need `var()` form to pick up CSS variables.
**Why it happens:** Tailwind v4's JIT is more strict about dynamic class names; classes referencing CSS variables require the `var()` syntax in utility classes.
**How to avoid:** For one-off layout values (`lg:grid-cols-[1.2fr_0.8fr]`) use inline Tailwind arbitrary syntax. For values that should be theme tokens, add them to the `@theme inline` block in globals.css.
**Warning signs:** Custom grid columns not applying; CSS variable references in class names silently failing.

### Pitfall 6: Lenis and framer-motion Scroll Interaction
**What goes wrong:** `useScroll` from framer-motion observes `window.scrollY` by default. With Lenis active, the native scroll position may differ from Lenis's virtual scroll position, causing parallax offsets to be wrong.
**Why it happens:** Lenis intercepts wheel/touch events and applies its own easing, but sets the actual window scroll position. framer-motion's `useScroll` reads the native position — they should align, but Lenis's `smoothWheel` option can cause one-frame lag.
**How to avoid:** Initialize Lenis with `smoothWheel: true` (default) and `syncToNative: false`. If parallax feels laggy, set `smooth: false` for the landing page sections with heavy scroll animations, keeping smooth scroll only for the narrative scroll sections.
**Warning signs:** Parallax elements feel "sticky" or lag behind the scroll position by one easing cycle.

### Pitfall 7: CommandPalette Node Spawning Requires Canvas Context
**What goes wrong:** CommandPalette calls `addNode` from the Zustand store, but nodes require a valid React Flow instance to get a canvas-relative position. Spawning a node at a fixed position (e.g., `{x:0, y:0}`) results in the node appearing at the top-left of the canvas rather than the viewport center.
**Why it happens:** React Flow positions nodes in canvas space; the viewport offset and zoom level affect where a given canvas coordinate appears on screen.
**How to avoid:** Use the React Flow `useReactFlow()` hook (specifically `screenToFlowPosition`) to convert the viewport center to canvas coordinates. This hook must be called inside a component that is a descendant of `<ReactFlow>`. Either pass the conversion function as a prop to CommandPalette or invoke it from within WorkspaceCanvas before calling `addNode`.
**Warning signs:** New nodes spawned from Cmd+K always appear at (0,0) on the canvas regardless of viewport position.

---

## Code Examples

Verified patterns from codebase investigation:

### Animated Edge (AnimatedEdge.tsx pattern)
```tsx
// Source: @xyflow/react v12 EdgeProps API + @keyframes edge-flow in globals.css
import { EdgeProps, getBezierPath } from "@xyflow/react";

export function AnimatedEdge({
  sourceX, sourceY, sourcePosition,
  targetX, targetY, targetPosition,
  selected,
}: EdgeProps) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  return (
    <g>
      {/* Shadow/glow path for selected state */}
      {selected && (
        <path
          d={edgePath}
          stroke="var(--primary)"
          strokeWidth={6}
          strokeOpacity={0.15}
          fill="none"
        />
      )}
      {/* Animated dash path */}
      <path
        d={edgePath}
        stroke={selected ? "var(--primary)" : "var(--muted)"}
        strokeWidth={selected ? 2.5 : 1.8}
        strokeDasharray="6 3"
        style={{ animationName: "edge-flow", animationDuration: "0.6s", animationTimingFunction: "linear", animationIterationCount: "infinite" }}
        fill="none"
      />
    </g>
  );
}
```

### Bento Spotlight Mouse Tracking
```tsx
// Source: .hover-trail and .magnetic-btn classes confirmed in globals.css lines 545-585
// Source: handleInteractiveMove pattern confirmed in StudioHeader.tsx lines 41-50
function BentoCard({ children }: { children: React.ReactNode }) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  return (
    <div
      className="hover-trail bento-card rounded-3xl p-6 cursor-default"
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
}
```

### Navbar Pill Morph (existing pattern, confirmed)
```tsx
// Source: Navbar.tsx lines 89-102 — already implemented correctly
<motion.nav
  animate={{
    maxWidth: scrolled ? "1000px" : "1280px",
    borderRadius: scrolled ? "999px" : "0px",
    y: hidden ? -100 : scrolled ? 16 : 0,
    opacity: hidden ? 0 : 1,
  }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  className={scrolled ? "glass-panel shadow-2xl" : "bg-transparent"}
>
```
**Upgrade needed:** Change `setScrolled(currentScrollY > 20)` to `setScrolled(currentScrollY > 50)` per spec.

### Counter Animation (reusable from Hero.tsx)
```tsx
// Source: Hero.tsx lines 15-46 — confirmed working pattern
// The Counter component in Hero.tsx uses requestAnimationFrame with cubic ease-out
// Reuse this exact pattern for dashboard stat counters — do not reimpliment.
```

### ermiz-node Class Usage Pattern
```tsx
// Source: .ermiz-node, .ermiz-node.selected, .ermiz-node-header, .ermiz-node-type in globals.css lines 394-454
// The .ermiz-node class handles: border, borderRadius, boxShadow, transition, hover translateY, selected ring
// ApiEndpointNode must migrate from inline styles to use these classes.
export const ApiEndpointNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={`ermiz-node ${selected ? "selected" : ""}`} style={{ minWidth: 220 }}>
      {/* 2px top accent border */}
      <div style={{ height: 2, background: "#00F0FF", boxShadow: "0 0 14px #00F0FF80" }} />
      <div className="ermiz-node-header">
        <span className="ermiz-node-type">API ENDPOINT</span>
        {/* ... */}
      </div>
    </div>
  );
});
```

### Tailwind v4 @theme Inline Extension
```css
/* Source: globals.css lines 104-118 — confirmed Tailwind v4 theme extension pattern */
/* To add new tokens, extend the existing @theme inline block in globals.css */
@theme inline {
  --font-geist-mono: var(--font-geist-mono); /* expose for Tailwind font-geist-mono utility */
  /* add new tokens here */
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` for theme | `@theme inline` in globals.css | Tailwind v4 (2024) | No config file; theme tokens declared in CSS |
| `framer-motion` v10 `motion.div layout` | v12 unchanged API but `AnimatePresence` mode prop required | v11→v12 | `AnimatePresence` `mode="wait"` for sequential exits |
| `@xyflow/react` `EdgeLabelRenderer` | v12 unchanged | stable | Custom edge labels use `EdgeLabelRenderer` portal |
| `next/font` with `display: swap` default | v13+ `display: optional` recommended for LCP | Next.js 13+ | Set `display: "optional"` in font configs to avoid layout shift |

**Deprecated/outdated:**
- `reactflow` package: Replaced by `@xyflow/react` — project already uses the correct package.
- `lenis/dist/lenis.mjs` import: Import via `lenis/react` for the `ReactLenis` wrapper — docs/page.tsx already does this correctly.

---

## Open Questions

1. **Does `app/signup/page.tsx` need to be created, or should `/login` handle both flows?**
   - What we know: REQ-009 specifies `(/login, /signup)` split-screen layout; only `/login` exists.
   - What's unclear: Whether `/signup` should be a separate page or a tab within `/login`.
   - Recommendation: Create a separate `app/signup/page.tsx` sharing the same layout shell as login but with "Create account" copy. Since auth is OAuth-only there is no actual difference in the form — it's a copywriting/UX distinction. Mark as Claude's discretion to implement as a shared `AuthLayout` component.

2. **How should ArchitectureThumbnail generate SVG geometry?**
   - What we know: CONTEXT.md says "generate simplified SVG geometry (boxes + lines) from project node positions, no need for full React Flow render." Dashboard data in `dashboard/page.tsx` uses static mock data (not fetched from store).
   - What's unclear: Whether thumbnails should reflect actual project graphs from localStorage/API, or be purely decorative per-project static patterns.
   - Recommendation: For Phase 1, use simplified static SVG geometry with 3-5 hardcoded box+line layouts that vary by project type (API=horizontal line of boxes, DB=tree structure). Dynamic thumbnails from live graph data are a post-Phase-1 enhancement.

3. **CommandPalette: Zustand slice in `useStore` or separate store?**
   - What we know: `useStore` already manages all studio UI state; zustand v5 is installed.
   - Recommendation: Add `commandPaletteOpen: boolean`, `setCommandPaletteOpen: (v: boolean) => void` to the existing `useStore` in `store/useStore.ts`. Do not create a separate store — keeping all studio UI state co-located follows the existing pattern.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 |
| Config file | `vitest.config.ts` |
| Quick run command | `npm test` |
| Full suite command | `npm run test:coverage` |
| E2E command | `npm run test:e2e` |

**Note:** Vitest is configured for `environment: "node"` with test files in `tests/unit/**/*.test.ts`. The existing tests cover API route logic (`api-gen.test.ts`, `validate-architecture.test.ts`) not UI components. UI component testing with jsdom is not currently configured.

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| REQ-001 | CSS variables and classes present in globals.css | Manual visual | n/a | N/A — CSS audit, not unit testable |
| REQ-003 | Micro-interactions at 60fps (CSS transforms only) | Manual visual/Playwright | `npm run test:e2e` | ❌ Wave 0 |
| REQ-004 | Navbar scroll state changes at 50px threshold | Unit (DOM) | `npm test` | ❌ Wave 0 |
| REQ-006 | --mx/--my properties set on mouse move | Unit (DOM) | `npm test` | ❌ Wave 0 |
| REQ-009 | Auth page renders split-screen layout | Playwright smoke | `npm run test:e2e` | ❌ Wave 0 |
| REQ-010 | CreditRing renders correct stroke-dasharray | Unit (jsdom) | `npm test` | ❌ Wave 0 |
| REQ-013 | AnimatedEdge renders path with stroke-dasharray | Unit (jsdom) | `npm test` | ❌ Wave 0 |
| REQ-014 | Cmd+K opens CommandPalette, Escape closes it | Unit (DOM) | `npm test` | ❌ Wave 0 |
| REQ-015 | ApiKeyField toggles between password/text type | Unit (DOM) | `npm test` | ❌ Wave 0 |

**Important:** Most REQ-001 to REQ-015 are visual/interaction requirements. The most valuable automated tests for this phase are: keyboard interaction tests (Cmd+K, Escape, arrow navigation in CommandPalette), SVG geometry correctness (CreditRing dasharray math, AnimatedEdge path rendering), and Playwright smoke tests confirming page layouts render without errors.

### Sampling Rate
- **Per task commit:** `npm test` (unit tests only, ~2s)
- **Per wave merge:** `npm run test:coverage`
- **Phase gate:** Full suite green + manual visual review before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/unit/components/CommandPalette.test.tsx` — covers REQ-014 keyboard interactions
- [ ] `tests/unit/components/CreditRing.test.tsx` — covers REQ-010 SVG math
- [ ] `tests/unit/components/ApiKeyField.test.tsx` — covers REQ-015 toggle behavior
- [ ] `vitest.config.ts` — add `environment: "jsdom"` for DOM-based component tests, or create a separate `vitest.ui.config.ts`
- [ ] Install `@testing-library/react` and `@testing-library/user-event` if DOM testing is desired
- [ ] `tests/e2e/auth-layout.spec.ts` — covers REQ-009 split-screen smoke test
- [ ] `tests/e2e/command-palette.spec.ts` — covers REQ-014 E2E keyboard flow

---

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis — `app/globals.css` (all CSS classes and keyframes confirmed)
- Direct codebase analysis — `components/landing/Navbar.tsx` (scroll detection and framer-motion pattern confirmed)
- Direct codebase analysis — `components/landing/Hero.tsx` (useScroll/useTransform imports confirmed)
- Direct codebase analysis — `components/canvas/nodes/ApiEndpointNode.tsx` (ermiz-node upgrade target confirmed)
- Direct codebase analysis — `components/studio/StudioHeader.tsx` (--mx/--my pattern confirmed)
- Direct codebase analysis — `components/studio/WorkspaceCanvas.tsx` (default widths 236px/320px confirmed)
- Direct codebase analysis — `app/layout.tsx` (font variable names confirmed)
- Direct codebase analysis — `vitest.config.ts` (test infrastructure confirmed)
- Direct codebase analysis — `.planning/phases/01-ui-ux-overhaul/01-UI-SPEC.md` (design contract confirmed)
- Direct codebase analysis — `app/dashboard/page.tsx`, `app/docs/page.tsx`, `app/settings/page.tsx`, `app/login/page.tsx` (current page states confirmed)

### Secondary (MEDIUM confidence)
- `.planning/codebase/STACK.md` — package versions (last verified 2026-03-23; versions match package.json)
- `.planning/codebase/ARCHITECTURE.md` — Zustand store patterns and data flow

### Tertiary (LOW confidence)
- None — all findings verified directly against source files

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages confirmed in package.json and imported in source files
- Architecture patterns: HIGH — patterns extracted directly from existing working code
- Pitfalls: HIGH — all pitfalls identified from direct code inspection (Geist Mono variable, existing API node inline styles, missing /signup route)
- Test infrastructure: MEDIUM — vitest config confirmed; jsdom environment and @testing-library not yet configured; E2E tests need creation

**Research date:** 2026-03-25
**Valid until:** 2026-04-25 (stable libraries; Tailwind v4 and framer-motion v12 APIs are stable)
