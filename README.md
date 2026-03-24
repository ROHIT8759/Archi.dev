# Archi.dev

Archi.dev is a visual backend architecture studio for designing APIs, workflows, infrastructure, and agent-oriented execution graphs before writing code.

It combines a multi-tab canvas, deterministic graph models, architecture validation, optional AI-assisted graph generation, OpenAPI export, and runtime simulation in a single Next.js application.

![Preview](public/preview.png)

## Overview

Archi.dev is built around a simple idea: backend systems should be modeled explicitly.

Instead of burying architecture inside scattered source files, the studio lets you define:

- APIs and contracts
- background and synchronous processes
- database and infrastructure capabilities
- service boundaries
- agent execution plans and graph patches

The visual workspace is backed by structured graph data, not opaque editor state.

## Core Features

### Multi-tab backend workspace

The studio is split into focused tabs:

- `api`
- `database`
- `functions`
- `agent`

Each tab has its own graph while still participating in a shared system model.

### Canvas-based architecture modeling

You can compose systems using React Flow nodes for:

- API bindings
- processes and workflows
- databases and queues
- infrastructure blocks
- service boundaries
- API endpoint references

### Passive architecture validation

The app continuously validates the workspace and surfaces:

- node-level validation badges
- architecture warnings and errors
- generation-readiness checks before code export

### OpenAPI and docs export

The studio can export the current API graph as:

- `openapi.json`
- `api-docs.md`

These are bundled into a downloadable ZIP via `/api/openapi`.

### Agent workspace

The agent tab can:

- inspect the full workspace graph collection
- generate an execution plan
- summarize architecture state
- optionally apply agent-oriented graph patches

### AI-assisted graph generation

Canvas Copilot can generate or extend architecture graphs from prompts using the existing graph context.

### Runtime simulation

The project includes runtime APIs to load active graphs and execute runtime requests against the modeled system.

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- React Flow (`@xyflow/react`)
- Zustand
- Tailwind CSS v4
- Lucide React

### Backend

- Next.js App Router route handlers
- Prisma ORM
- PostgreSQL
- Supabase Auth
- Zod validation

### AI / generation

- Google GenAI SDK
- Groq SDK
- JSZip

### Testing

- Vitest
- Playwright

## Project Structure

```text
app/                 Next.js App Router pages and route handlers
components/          Canvas, studio, landing, and panel UI
lib/                 Runtime logic, schemas, API generators, utilities
store/               Zustand graph/workspace state
prisma/              Prisma schema
public/              Static assets
scripts/             Helper scripts
tests/               Unit and e2e tests
doc/                 Product and architecture notes
```

## Key Routes

### App pages

- `/`
- `/studio`
- `/login`

### API routes

- `/api/copilot`
- `/api/openapi`
- `/api/agent`
- `/api/gen`
- `/api/runtime/start`
- `/api/runtime/stream`
- `/api/run/[...path]`
- `/api/documents`
- `/api/document-sets`
- `/api/credits`

## Local Development

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL
- Supabase project for auth

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env` file and configure the required values.

Typical variables used by the app include:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
FREE_RESET_DAY_OF_MONTH=1
```

For Google OAuth via Supabase, configure the Google provider in your Supabase dashboard and ensure your callback URL includes:

```bash
http://localhost:3000/auth/callback
```

No app-level Auth0 or NextAuth configuration is required.

### Prisma setup

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

### Start development server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:watch
npm run test:coverage
npm run test:e2e
npm run test:e2e:ui
npm run prisma:generate
npm run prisma:migrate -- --name <migration_name>
npm run runtime:worker
```

## Build Notes

Production builds use:

```bash
next build --webpack
```

The project was switched to the webpack build path because the default Turbopack build path was unstable in this Windows environment.

## Authentication

Authentication is handled with Supabase.

- browser auth uses a lazy Supabase client getter
- server auth uses SSR-aware Supabase helpers
- protected routes rely on middleware/session checks
- Google is the only enabled OAuth provider
- OAuth credentials are managed in the Supabase dashboard
- `/login` triggers Google OAuth sign-in
- `/auth/callback` exchanges the auth code and restores the session

## Public Legal & Billing Pages

The marketing site now exposes the core public-facing compliance pages often required for payment gateway review and user trust:

- `/privacy`
- `/terms`
- `/refund-policy`
- `/cancellation-policy`
- `/shipping-policy`
- `/contact`

These pages are linked from the landing site footer and CTA footer.

## Public Website Readiness Checklist

- ensure the website exposes public policy pages before submitting for payment gateway review
- ensure privacy and terms pages are reachable from the footer on all marketing/legal pages
- ensure contact information is visible on the public website
- verify page content matches your real business operations, billing rules, and support channels
- keep live secrets out of tracked files such as `.env.example`, docs, and screenshots
- rotate any secret that has been shared in chat, screenshots, logs, or commits

## Data Model

At a high level, the app persists:

- users
- credit balances and credit transactions
- document sets
- graph-like documents per workspace/tab

Prisma is the source of truth for the persisted relational model.

## Architecture Model

The application uses graph data as a structured representation of backend systems.

Important concepts include:

- API bindings as contracts
- process nodes as execution definitions
- infrastructure blocks as capabilities
- service boundaries as policy and ownership boundaries
- validation as a first-class concern

## OpenAPI Export Flow

OpenAPI export works by:

1. collecting the current API graph from the studio state
2. sending it to `/api/openapi`
3. extracting `api_binding` nodes
4. generating:
   - workspace OpenAPI JSON
   - Markdown API docs
5. returning both files in a ZIP archive

## Agent Workspace Flow

The agent workspace works by:

1. collecting the active graph and all workspace graphs
2. posting them to `/api/agent`
3. generating:
   - execution plan
   - architecture summary
   - optional graph patch
4. optionally applying returned nodes/edges back into the current graph

## Testing

### Unit tests

```bash
npm run test
```

### E2E tests

```bash
npm run test:e2e
```

### Lint

```bash
npm run lint
```

## Deployment

### Recommended

Deploy on Vercel with:

- all required environment variables configured
- a reachable Postgres database
- Supabase redirect URLs updated for production

### Production checklist

- set all env vars
- run Prisma migrations
- verify Supabase OAuth callback URLs
- confirm build passes with `npm run build`

## Current Status

The project currently includes:

- studio foundations
- template loading
- auto-layout
- passive validation
- Canvas Copilot
- OpenAPI/docs export
- agent execution planning
- runtime graph execution routes

## Notes

- The `middleware.ts` convention currently produces a Next.js deprecation warning suggesting `proxy`.
- This is a warning, not a current build blocker.

## License

See `LICENSE`.