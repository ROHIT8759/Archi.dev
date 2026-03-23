# Codebase Structure

**Analysis Date:** 2026-03-23

## Directory Layout

```
project-root/
├── app/                           # Next.js app router pages and API routes
│   ├── api/                       # Server API route handlers
│   │   ├── agent/                 # Agent workspace API
│   │   ├── copilot/               # AI copilot endpoint
│   │   ├── credits/               # Credit balance and usage endpoints
│   │   ├── document-sets/         # Document collection management
│   │   ├── documents/             # User document CRUD
│   │   ├── fix-hint/              # Validation hint suggestions
│   │   ├── gen/                   # Code generation (Gemini/Groq)
│   │   ├── openapi/               # OpenAPI spec export
│   │   ├── payments/              # Payment processing (dummy)
│   │   ├── run/                   # Code execution/testing runtime
│   │   └── runtime/               # Runtime environment setup
│   ├── auth/                      # Authentication routes (callback, logout)
│   ├── login/                     # Login page
│   ├── studio/                    # Main studio application page
│   ├── layout.tsx                 # Root layout wrapper (fonts, metadata)
│   ├── page.tsx                   # Landing page
│   └── globals.css                # Global styles
├── components/                    # React UI components (organized by domain)
│   ├── canvas/                    # Graph visualization and editing
│   │   ├── nodes/                 # Node type components (Process, Database, API, Infra)
│   │   ├── edges/                 # Edge/connection renderers
│   │   ├── FlowCanvas.tsx         # Main ReactFlow container
│   │   └── ContextMenu.tsx        # Right-click node menu
│   ├── studio/                    # Studio workspace components
│   │   ├── StudioHeader.tsx       # Top toolbar (tabs, buttons, user menu)
│   │   ├── StudioLayout.tsx       # Layout wrapper
│   │   ├── StudioWorkspace.tsx    # Tab router
│   │   ├── WorkspaceCanvas.tsx    # Canvas + panels container
│   │   ├── AgentWorkspace.tsx     # Agent tab UI
│   │   ├── GenCodeModal.tsx       # Validation issues and language picker modal
│   │   ├── ApiTableModal.tsx      # API table/endpoint designer modal
│   │   ├── TestPanel.tsx          # Code testing and runtime UI
│   │   ├── StudioFooter.tsx       # Bottom status bar
│   │   └── config.ts              # Constants and configuration
│   ├── panels/                    # Property inspector panels for nodes
│   │   ├── database/              # Database-specific sub-panels
│   │   │   ├── BackupSection.tsx
│   │   │   ├── MigrationsSection.tsx
│   │   │   ├── MonitoringSection.tsx
│   │   │   ├── SecuritySection.tsx
│   │   │   └── [other sections]
│   │   ├── DatabaseERDViewer.tsx  # Entity-relationship diagram
│   │   ├── DatabaseQueryBuilder.tsx
│   │   └── DatabaseSchemaDesigner.tsx
│   └── landing/                   # Marketing landing page
│       ├── Navbar.tsx
│       ├── Hero.tsx
│       ├── BentoGrid.tsx
│       ├── ScrollSequence.tsx
│       └── CTAFooter.tsx
├── lib/                           # Shared business logic and utilities
│   ├── api/                       # API-related utilities
│   │   └── openapi-generator.ts   # OpenAPI spec builder
│   ├── schema/                    # Data type definitions
│   │   ├── node.ts                # Discriminated union types for all node kinds
│   │   └── graph.ts               # ProcessGraph and related types
│   ├── studio/                    # Studio-specific logic
│   │   ├── graph-templates.ts     # Preset graphs and workspace templates
│   │   └── auto-layout.ts         # Graph layout algorithm (dagre-based)
│   ├── database/                  # Database-related utilities
│   ├── runtime/                   # Runtime execution utilities
│   ├── test-env/                  # Test environment setup
│   ├── supabase/                  # Supabase client config
│   ├── arch-validator/            # Architecture validation rules
│   ├── templates/                 # Code generation templates
│   ├── validate-architecture.ts   # Pre-generation validation checks
│   ├── db-health-checker.ts       # Database connectivity checks
│   ├── credit.ts                  # Credit balance calculations
│   ├── cost-estimator.ts          # Credit cost estimation for generation
│   └── prisma.ts                  # Prisma client singleton
├── store/                         # Zustand state management
│   └── useStore.ts                # Graph, tab, UI, and validation state
├── prisma/                        # Database schema and migrations
│   └── schema.prisma              # Prisma ORM schema (User, Credits, Documents)
├── public/                        # Static assets
│   └── logo.svg
├── scripts/                       # Utility scripts
│   └── runtime-queue-worker.mjs   # Background job worker for code execution
├── middleware.ts                  # Next.js authentication middleware
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript compiler options
├── vitest.config.ts               # Unit test framework config
├── playwright.config.ts           # E2E test framework config
├── package.json                   # Dependencies and scripts
└── README.md                      # Project documentation
```

## Directory Purposes

**app/**
- Purpose: Next.js App Router pages and API routes
- Contains: Page components, layout wrappers, API handlers, authentication flows
- Key files: `page.tsx` (landing), `studio/page.tsx` (main app), `layout.tsx` (root wrapper)

**app/api/**
- Purpose: Backend API endpoints handling code generation, user data, and integrations
- Contains: Route handlers for gen, copilot, runtime, credits, documents, auth
- Key files: `gen/route.ts` (Gemini code gen), `credits/route.ts` (balance), `runtime/start/route.ts` (executor)

**components/**
- Purpose: React UI components organized by functional domain
- Contains: Presentational components, hooks, modals, panels
- Key files: `canvas/FlowCanvas.tsx` (graph editor), `studio/StudioHeader.tsx` (toolbar), `studio/GenCodeModal.tsx` (validation modal)

**components/canvas/**
- Purpose: Graph visualization using ReactFlow
- Contains: Node and edge components, context menu, canvas container
- Key files: `nodes/ProcessNode.tsx`, `nodes/DatabaseNode.tsx`, `edges/StepEdge.tsx`

**components/studio/**
- Purpose: Main application workspace UI
- Contains: Layout, header, workspace container, modals for code gen and API design
- Key files: `StudioWorkspace.tsx` (tab router), `WorkspaceCanvas.tsx` (canvas + panels)

**components/panels/**
- Purpose: Node property inspector panels (right sidebar when node is selected)
- Contains: Database sub-panels (backup, migrations, monitoring, etc.), schema designer, query builder
- Key files: `DatabaseSchemaDesigner.tsx`, `DatabaseERDViewer.tsx`

**lib/schema/**
- Purpose: Type-safe definitions for graph data structures
- Contains: Node discriminated union (all node kinds), graph interface
- Key files: `node.ts` (80+ lines defining ProcessNode, DatabaseNode, ApiEndpointNode, etc.), `graph.ts`

**lib/studio/**
- Purpose: Studio-specific utilities (templates, layout)
- Contains: Graph presets (blank, hello_world_api), auto-layout algorithm
- Key files: `graph-templates.ts` (workspace template definitions)

**lib/supabase/**
- Purpose: Supabase authentication client setup
- Contains: Server and client Supabase initialization
- Key files: `client.ts` (createClient for browser)

**store/**
- Purpose: Centralized state management via Zustand
- Contains: State for graphs, active tab, nodes, edges, validation issues, UI modals
- Key files: `useStore.ts` (900+ lines; single global store)

**prisma/**
- Purpose: Database schema and ORM configuration
- Contains: PostgreSQL schema, migrations
- Key files: `schema.prisma` (User, CreditBalance, Document, DocumentSet models)

## Key File Locations

**Entry Points:**
- `app/page.tsx`: Landing page (public, no auth required)
- `app/studio/page.tsx`: Main studio application (auth required, handles all user interactions)
- `app/auth/callback/route.ts`: OAuth callback handler
- `app/auth/logout/route.ts`: Logout handler

**Configuration:**
- `tsconfig.json`: TypeScript compiler and path alias (@/* → root)
- `next.config.ts`: Next.js framework configuration
- `vitest.config.ts`: Unit test runner config
- `middleware.ts`: Authentication and session middleware (executed on every request)

**Core Logic:**
- `store/useStore.ts`: Zustand store (all graph state, mutations, and derived state)
- `lib/validate-architecture.ts`: Pre-generation validation checks
- `lib/schema/node.ts`: Node type definitions (ProcessNode, DatabaseNode, ApiEndpointNode, InfraNode, etc.)
- `lib/schema/graph.ts`: Graph interface (nodes array, edges array)

**Testing:**
- `playwright.config.ts`: E2E test configuration
- Tests follow pattern `*.test.ts` or `*.spec.ts` (co-located with source files)

## Naming Conventions

**Files:**
- React components: PascalCase (e.g., `ProcessNode.tsx`, `StudioHeader.tsx`)
- Utilities and hooks: camelCase (e.g., `useStore.ts`, `auto-layout.ts`)
- Types/schemas: camelCase (e.g., `graph.ts`, `node.ts`)
- API routes: `route.ts` in segment directory (e.g., `app/api/gen/route.ts`)

**Directories:**
- Functional domains: lowercase (e.g., `canvas`, `studio`, `panels`, `api`)
- Feature-specific: lowercase (e.g., `database`, `runtime`, `supabase`)

**Components:**
- Functional components: PascalCase `export default function NameComponent() { ... }`
- Props interfaces: `${ComponentName}Props` (e.g., `ProcessNodeProps`)
- Internal helpers: camelCase with `handle` prefix for event handlers (e.g., `handleNodeClick`)

**Store Actions & Selectors:**
- Zustand actions: camelCase verb phrases (e.g., `setActiveTab`, `updateNodeData`, `addNode`, `deleteNode`)
- Selector usage: Direct destructure from `useStore` hook

**API Routes:**
- Request handlers: `export async function POST(req: NextRequest) { ... }`
- Response format: JSON with `{ data: ... }` or `{ error: ... }`
- Error status codes: 400 (validation), 401 (auth), 429 (quota), 500 (server)

## Where to Add New Code

**New Feature (backend code generation or integration):**
- Primary code: `app/api/[feature]/route.ts` (new API endpoint)
- Types: `lib/schema/[feature].ts` (if introducing new data structures)
- Tests: `app/api/[feature]/route.test.ts` (alongside route handler)
- Example: Adding webhook support → `app/api/webhook/route.ts`, `lib/schema/webhook-event.ts`

**New Component/Module (UI or canvas node):**
- Component implementation: `components/[domain]/[ComponentName].tsx`
- Styles: Co-located inline styles or Tailwind classes
- Props: Define `${ComponentName}Props` interface above component
- Example: Adding a new node type → `components/canvas/nodes/[NewType]Node.tsx`
- Hook into store: Use `useStore` selector at component top

**Utilities and Helpers:**
- Shared helpers: `lib/[domain]/[utility-name].ts`
- Constants: Top of file or `components/studio/config.ts` for UI constants
- Validation rules: Extend `lib/validate-architecture.ts`
- Example: Database health check → `lib/database/health-check.ts`

**Database Models & Migrations:**
- Schema changes: Edit `prisma/schema.prisma`
- Run: `npm run prisma:generate` to update Prisma client types
- Migrations: `npm run prisma:migrate` (auto-creates migrations)

**Tests:**
- Unit tests: `[file].test.ts` co-located with source
- E2E tests: `tests/e2e/[feature].test.ts` (if organized separately)
- Run: `npm test` (vitest), `npm run test:e2e` (playwright)

## Special Directories

**.next/**
- Purpose: Next.js build output and cache
- Generated: Yes (on `npm run build`)
- Committed: No (in .gitignore)

**.planning/**
- Purpose: GSD planning documents (this file, CONCERNS.md, etc.)
- Generated: No (manually or by GSD tools)
- Committed: Yes (versioned planning docs)

**.qodo/, .zencoder/, .zenflow/**
- Purpose: Workflow automation tool directories
- Generated: Yes (by workflow engines)
- Committed: No (likely in .gitignore)

**prisma/migrations/**
- Purpose: Database migration history
- Generated: Yes (by `prisma migrate dev`)
- Committed: Yes (version control migration sequence)

**node_modules/**
- Purpose: Installed npm dependencies
- Generated: Yes
- Committed: No

**public/**
- Purpose: Static assets served by Next.js
- Contains: Logo, favicon, images
- Key files: `logo.svg`

---

*Structure analysis: 2026-03-23*
