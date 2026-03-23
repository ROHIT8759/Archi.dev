# Technology Stack

**Analysis Date:** 2026-03-23

## Languages

**Primary:**
- TypeScript 5 - Full application (frontend and backend)
- JavaScript - Build and runtime scripts
- SQL - Database queries via Prisma ORM

**Secondary:**
- JSX/TSX - React component rendering
- Markdown - API documentation generation

## Runtime

**Environment:**
- Node.js (implied from package.json scripts and Next.js usage)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.1.6 - Full-stack React framework with API routes
- React 19.2.3 - UI library
- React DOM 19.2.3 - DOM rendering

**UI & Styling:**
- Tailwind CSS 4 - Utility-first CSS framework
- Framer Motion 12.38.0 - Animation library
- Lucide React 0.563.0 - Icon library
- Lenis 1.3.20 - Smooth scrolling
- clsx 2.1.1 - Conditional className utility

**Graph & Visualization:**
- @xyflow/react 12.10.0 - React Flow for node-based graph visualization
- Dagre 0.8.5 - Graph layout algorithms

**Testing:**
- Vitest 4.0.18 - Unit/integration test framework
- @vitest/coverage-v8 8.0.18 - Code coverage with V8 engine
- @playwright/test 1.58.2 - E2E testing framework
- Playwright 1.58.2 - Browser automation

**Build/Dev:**
- TypeScript 5 - Type checking
- ESLint 9 - Code linting
- eslint-config-next 16.1.6 - Next.js ESLint configuration
- Tailwind CSS PostCSS plugin 4 - CSS processing
- Vite TSConfig Paths 6.1.1 - Path alias resolution for tests

## Key Dependencies

**Critical:**
- @prisma/client 6.1.0 - PostgreSQL ORM for data access
- prisma 6.1.0 - Prisma CLI for migrations and code generation
- bullmq 5.69.3 - Job queue based on Redis (for async task processing)
- pg 8.18.0 - PostgreSQL driver

**AI & LLM Integration:**
- @google/genai 1.43.0 - Google Gemini API client
- groq-sdk 0.37.0 - Groq LLM API client

**Authentication & Backend Services:**
- @supabase/supabase-js 2.47.0 - Supabase client (authentication & database)
- @supabase/auth-helpers-nextjs 0.10.0 - Supabase auth integration for Next.js
- @supabase/ssr 0.8.0 - Server-side rendering support for Supabase

**Utilities:**
- zod 4.3.6 - Schema validation and parsing
- zustand 5.0.11 - State management
- jszip 3.10.1 - ZIP file generation (for API export)
- tailwind-merge 3.4.0 - Merge Tailwind CSS classes intelligently

**Optional:**
- lightningcss-win32-x64-msvc 1.30.2 - Lightning CSS for Windows x64 builds

## Configuration

**Environment:**
- Supabase project URL and API keys (public and service role)
- PostgreSQL connection strings (pooled and direct)
- AI API keys (Gemini, Groq)
- Redis connection string (for job queue)
- Monthly credit grants and reset day configuration
- Runtime queue mode (mock or Redis)

**Files:**
- `tsconfig.json` - TypeScript compiler options with path aliases (`@/*`)
- `next.config.ts - Next.js configuration (image optimization for OAuth providers)
- `.env.example` - Environment variable template
- `eslint.config.mjs` - ESLint configuration
- `prisma/schema.prisma` - Database schema definition

## Build Configuration

**Scripts:**
- `dev` - Run Next.js dev server
- `build` - Production build
- `start` - Start production server
- `lint` - Run ESLint
- `test` - Run Vitest tests
- `test:watch` - Run tests in watch mode
- `test:coverage` - Generate code coverage
- `test:e2e` - Run Playwright E2E tests
- `test:e2e:ui` - Run E2E tests with UI
- `prisma:generate` - Generate Prisma client
- `prisma:migrate` - Run database migrations
- `runtime:worker` - Start background worker for queue processing

## Platform Requirements

**Development:**
- Node.js (version unspecified, but compatible with Next.js 16)
- PostgreSQL database
- Redis (optional - for queue processing; defaults to in-memory when not configured)
- Modern browser with JavaScript enabled

**Production:**
- Deployment target: Vercel or any Node.js hosting platform compatible with Next.js
- PostgreSQL database (required)
- Redis instance (optional - in-memory queue fallback available)
- Environment variables configured (Supabase, database, AI APIs)

---

*Stack analysis: 2026-03-23*
