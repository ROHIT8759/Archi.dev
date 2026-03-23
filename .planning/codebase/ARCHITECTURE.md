# Architecture

**Analysis Date:** 2026-03-23

## Pattern Overview

**Overall:** Client-Server with Visual Design Canvas and AI-Powered Code Generation

This is a Next.js 16 full-stack application (codename "ermiz-studio" or "Archi.dev") that implements a visual backend architecture builder and code generator. The architecture follows a **modular layer pattern** with clear separation between:
- **Presentation Layer**: React components rendering a visual graph editor (using ReactFlow)
- **Business Logic Layer**: State management (Zustand) and validation rules
- **API Layer**: Next.js API routes handling code generation, authentication, and data persistence
- **Data Layer**: PostgreSQL via Prisma ORM for user data and credits

**Key Characteristics:**
- Graph-based visual representation of architecture components (nodes and edges)
- Multi-tab workspace supporting different architecture aspects (API, database, functions, agents)
- Real-time validation before code generation
- AI-powered code generation via Gemini and Groq APIs
- Middleware-enforced authentication with Supabase
- Client-side persistence with localStorage for graph state

## Layers

**Presentation / Frontend (Client):**
- Purpose: React components that render the visual studio interface and graph canvas
- Location: `components/`, `app/page.tsx`, `app/studio/page.tsx`
- Contains: React components, hooks (useStore), UI panels, modals
- Depends on: Zustand store, validation library, React libraries (@xyflow/react, framer-motion, lucide-react)
- Used by: Browser client making API calls to backend

**State Management (Client):**
- Purpose: Centralized state for graph data, UI state, validation issues, and user info
- Location: `store/useStore.ts`
- Contains: Zustand store with graph manipulation methods, tab management, node/edge CRUD operations
- Depends on: @xyflow/react types, schema definitions, auto-layout utilities
- Used by: All React components and pages

**Validation Layer (Client & Pre-Generation):**
- Purpose: Pre-generation architecture validation before sending to code generation API
- Location: `lib/validate-architecture.ts`
- Contains: Validation checks (no empty canvas, connected nodes, labeled blocks, API endpoints with bindings, etc.)
- Depends on: @xyflow/react types
- Used by: Studio page for passive validation, GenCodeModal for pre-submission checks

**API Layer (Server):**
- Purpose: Handle code generation, authentication, data persistence, and external integrations
- Location: `app/api/`
- Contains: Route handlers for gen, copilot, runtime, credits, documents, auth, etc.
- Depends on: Gemini SDK, Groq SDK, Prisma, Supabase, JSZip for ZIP generation
- Used by: Frontend pages via fetch, external services via webhooks

**Database/Data Layer:**
- Purpose: Persistent storage of user accounts, credit balance, documents, and document sets
- Location: `prisma/schema.prisma`
- Contains: User, CreditBalance, CreditTransaction, Document, DocumentSet models
- Depends on: PostgreSQL
- Used by: API routes for user data, credits tracking, document persistence

**Authentication & Session (Middleware):**
- Purpose: Enforce authentication for protected routes, manage session state
- Location: `middleware.ts`
- Contains: Supabase SSR client setup, auth checks, public path allowlist
- Depends on: @supabase/ssr, Supabase client
- Used by: All requests matching the matcher pattern

## Data Flow

**Graph Editing Flow:**

1. User creates/edits nodes and edges in the visual canvas (`components/canvas/FlowCanvas.tsx`)
2. ReactFlow emits changes → `useStore` methods (`onNodesChange`, `onEdgesChange`, `onConnect`)
3. Zustand updates store → triggers re-renders of affected components
4. Store state persists to localStorage when user saves via `handleSaveChanges`
5. Validation runs passively on every graph change via `validateArchitecture(graphs)`

**Code Generation Flow:**

1. User clicks "Generate Code" → `handleGenerateCodeClick` in studio page
2. `validateArchitecture()` runs, collects errors/warnings
3. If errors exist, `GenCodeModal` blocks generation with clickable error list
4. User confirms and selects language (JavaScript/Python) → `handleGenerateCode`
5. All graph tabs exported via `exportGraphs()` (all nodes and edges merged)
6. Request sent to `/api/gen` with merged graphs, tech stack metadata, language
7. Backend uses Gemini (with fallback to Groq) to generate code from graph JSON
8. Response is a ZIP file downloaded to client

**Authentication & User Data Flow:**

1. Middleware checks session on every request via Supabase
2. Public paths (`/login`, `/auth/callback`, `/`) bypass auth
3. User authenticates via Google OAuth → Supabase → redirects to `/auth/callback`
4. Session cookie set → user can access `/studio` and API endpoints
5. Studio page fetches user info via `supabaseClient.auth.getUser()`
6. Credits fetched from `/api/credits` endpoint, synced to local state

**State Management:**

The `useStore` is the single source of truth for:
- `graphs`: Record mapping each tab (api, database, functions, agent) to its graph state
- `nodes`, `edges`: Derived from current active tab's graph
- `validationIssues`: Live list of validation errors/warnings for highlighting nodes
- `focusNodeId`: Node to pan-to and highlight when user clicks an error
- `apiTableModalNodeId`: Which node's database editor is open

All state changes are synchronous (Zustand actions), no async middleware. Persistence is manual via `localStorage.setItem` when save is triggered.

## Key Abstractions

**ProcessGraph:**
- Purpose: Represents a complete graph of architecture nodes and edges for one tab
- Location: `lib/schema/graph.ts`
- Pattern: TypeScript interface with nodes and edges arrays
- Used in: Store, templates, import/export, validation

**NodeData:**
- Purpose: Type-safe metadata for different node kinds (process, database, API, infra, etc.)
- Location: `lib/schema/node.ts`
- Pattern: Discriminated union types; `kind` field determines structure
- Examples: `ProcessNode { kind: "process", label, inputs, outputs, steps }`, `DatabaseNode { kind: "database", label, tables, relationships }`

**ValidationIssue:**
- Purpose: Structured error/warning data with optional node references for UI highlighting
- Location: `lib/validate-architecture.ts`
- Pattern: `{ severity: "error" | "warning", title, detail?, nodeId? }`
- Used in: GenCodeModal for displaying issues, PropertyInspector for field highlighting

**WorkspaceTab:**
- Purpose: Type-safe union of the four architecture aspects
- Location: `lib/studio/graph-templates.ts`
- Pattern: `"api" | "database" | "functions" | "agent"`
- Used in: Store, components, routing, persistence

**StudioUser:**
- Purpose: Minimal user type from Supabase auth, extended with local metadata
- Location: `components/studio/StudioHeader.tsx`
- Pattern: Email, name, user_metadata, identities from Supabase user object
- Used in: Header for display, API calls with auth context

## Entry Points

**Landing Page:**
- Location: `app/page.tsx`
- Triggers: Root route `/` accessed by unauthenticated users
- Responsibilities: Show marketing landing with Navbar, Hero, BentoGrid, ScrollSequence, CTAFooter

**Studio Page (Main Application):**
- Location: `app/studio/page.tsx`
- Triggers: Route `/studio` accessed by authenticated users (enforced by middleware)
- Responsibilities: Initialize studio workspace, load graphs from localStorage, render tabs, manage generation/auth flows, handle validation

**Auth Callback:**
- Location: `app/auth/callback/route.ts`
- Triggers: OAuth provider redirect after login
- Responsibilities: Exchange auth code for session, redirect to `/studio`

**Auth Logout:**
- Location: `app/auth/logout/route.ts`
- Triggers: User clicks logout
- Responsibilities: Revoke Supabase session, clear cookies

**Code Generation API:**
- Location: `app/api/gen/route.ts`
- Triggers: POST from studio page with graph + language
- Responsibilities: Validate request, call Gemini/Groq for code generation, return ZIP file, track quota errors

**Credits API:**
- Location: `app/api/credits/route.ts` (GET) and `app/api/credits/use/route.ts` (POST)
- Triggers: Studio fetches credit balance, code generation API deducts credits
- Responsibilities: Query/update CreditBalance in Prisma, enforce monthly free grant reset

**OpenAPI Export:**
- Location: `app/api/openapi/route.ts`
- Triggers: User clicks "Export OpenAPI"
- Responsibilities: Convert API graph to OpenAPI 3.0 spec, return as ZIP

**Test Panel:**
- Location: `app/api/run/[...path]/route.ts` (backend runtime)
- Triggers: User runs test requests in TestPanel component
- Responsibilities: Execute generated code in isolated runtime environment

## Error Handling

**Strategy:** Defensive client-side validation paired with graceful API error handling

**Patterns:**

1. **Pre-Generation Validation (Client):** Before sending to `/api/gen`, `validateArchitecture()` blocks invalid states (empty canvas, orphaned nodes, missing labels, no API endpoints, etc.)

2. **API Error Responses:** Each API route returns structured JSON with `error` and optional `retryAfter` fields:
   ```
   { error: "...", retryAfter?: number }
   ```

3. **Quota Handling:** `/api/gen` detects Gemini quota exhaustion (429 status), parses `retryAfter` header, shows retry countdown in UI

4. **Fallback Strategy:** `/api/gen` rotates through multiple Gemini API keys, falls back to Groq model if all quota-exhausted

5. **Async Error Containment:** Try-catch blocks in components silence storage errors (localStorage quota full) rather than crashing UI

6. **Network Resilience:** Supabase auth calls catch and suppress network errors; session check allows request through on failure (page/API handles auth separately)

## Cross-Cutting Concerns

**Logging:**
- Console logs in studio page and `/api/gen` trace code generation pipeline (debug-friendly)
- No structured logging framework; logs are developer-facing

**Validation:**
- Centralized `validateArchitecture()` called passively every graph change and before generation
- Issues stored in Zustand, displayed in GenCodeModal and passively in status bar

**Authentication:**
- Supabase middleware enforces session on all routes except public paths
- Frontend syncs auth state on mount and subscribes to `onAuthStateChange`
- Each API call uses session context (Prisma queries filtered by `userId` from session)

**State Persistence:**
- Graph state saved to localStorage key `"graphs:state"` when user clicks Save
- Active tab saved to localStorage to restore on reload
- Credits fetched from API on auth state change (not cached)

**Code Generation:**
- Prompt engineering handles graph JSON → code synthesis via Gemini/Groq
- Multi-language support (JavaScript/Python) controlled by metadata in request
- ZIP generation via JSZip library in-memory on backend

---

*Architecture analysis: 2026-03-23*
