# External Integrations

**Analysis Date:** 2026-03-23

## APIs & External Services

**LLM/AI Providers:**
- Google Gemini API - Code generation and copilot features
  - SDK/Client: `@google/genai` 1.43.0
  - Auth: `GEMINI_API_KEY` (can be comma-separated list) or `GEMINI_API_KEY_1`
  - Model: `gemini-2.5-flash-lite` (default, configurable via `GEMINI_MODEL`)
  - Usage: `app/api/gen/route.ts`, `app/api/copilot/route.ts`

- Groq API - Alternative LLM provider for code generation
  - SDK/Client: `groq-sdk` 0.37.0
  - Auth: `GROQ_API_KEY`
  - Model: `llama-3.3-70b-versatile` (default, configurable via `GROQ_MODEL`)
  - Usage: `app/api/gen/route.ts`, `app/api/copilot/route.ts`, `app/api/fix-hint/route.ts`

## Data Storage

**Databases:**
- PostgreSQL (primary)
  - Connection: `DATABASE_URL` (pooled connection via PgBouncer)
  - Direct connection: `DIRECT_URL` (for migrations)
  - Client: Prisma ORM (`@prisma/client` 6.1.0)
  - Node driver: `pg` 8.18.0
  - Schema location: `prisma/schema.prisma`

**Caching & Queue:**
- Redis (job queue via BullMQ)
  - Connection: `REDIS_URL` (optional)
  - Queue adapter: `bullmq` 5.69.3
  - Fallback: In-memory queue adapter when Redis unavailable
  - Mode: Configurable via `RUNTIME_QUEUE_MODE` (default: auto-detect)
  - Implementation: `lib/runtime/queue-adapter.ts`

**File Storage:**
- Local filesystem only - No cloud storage integration detected

## Authentication & Identity

**Auth Provider:**
- Supabase (OAuth-based authentication)
  - Project URL: `NEXT_PUBLIC_SUPABASE_URL`
  - Anon Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client-side safe)
  - Service Role Key: `SUPABASE_SERVICE_ROLE_KEY` (server-only)
  - Implementation:
    - Client: `lib/supabase/client.ts` (browser client)
    - Server: `lib/supabase/server.ts` (API routes with cookie management)
  - Auth flow:
    - Login: User redirected to Supabase OAuth
    - Callback: `app/auth/callback/route.ts` - Exchanges OAuth code for session
    - Logout: `app/auth/logout/route.ts`
  - OAuth providers configured: Google and GitHub (image optimization in `next.config.ts`)

**Session Management:**
- Supabase SSR pattern with Next.js 16 async cookies API
- Authentication enforced via `@supabase/auth-helpers-nextjs` and `@supabase/ssr`

## Monitoring & Observability

**Error Tracking:**
- Not detected - No Sentry, Rollbar, or similar integration

**Logs:**
- Console logging approach (`console.error` used in error paths)
- Prisma logging: Limited to `["error"]` (see `lib/prisma.ts`)

## CI/CD & Deployment

**Hosting:**
- Agnostic (Next.js compatible platforms like Vercel, AWS, DigitalOcean, etc.)

**CI Pipeline:**
- Not detected in codebase

## Environment Configuration

**Required env vars:**

*Supabase:*
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public auth key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side auth key

*Database:*
- `DATABASE_URL` - PostgreSQL pooled connection string
- `DIRECT_URL` - PostgreSQL direct connection for migrations

*AI/LLM:*
- `GEMINI_API_KEY` or `GEMINI_API_KEY_1` - Google Gemini API key(s)
- `GROQ_API_KEY` - Groq API key (optional, for LLM fallback)
- `GEMINI_MODEL` - Gemini model name (optional, default: `gemini-2.5-flash-lite`)
- `GROQ_MODEL` - Groq model name (optional, default: `llama-3.3-70b-versatile`)

*Queue & Background Jobs:*
- `REDIS_URL` - Redis connection string (optional; in-memory queue if omitted)
- `RUNTIME_QUEUE_MODE` - Queue backend: `"mock"` or `"bullmq"` (auto-detected)

*Credits & Billing:*
- `MONTHLY_FREE_CREDITS` - Monthly free credit allocation (default: 1000)
- `FREE_RESET_DAY_OF_MONTH` - Day of month for credit reset (1-28, default: 1)

*Deployment:*
- `DEPLOY_URL` - Deployment URL for runtime callbacks (used in `app/api/gen/route.ts`)

**Secrets location:**
- `.env` file (local development) - Never committed
- Environment variables in hosting platform (production)

## Webhooks & Callbacks

**Incoming:**
- Supabase OAuth callback: `app/auth/callback/route.ts` - Handles OAuth code exchange

**Outgoing:**
- Deployment callbacks: Runtime can invoke `DEPLOY_URL` endpoint (conditional in code)
- No webhook endpoints for external services detected

## API Endpoints Summary

**Authentication:**
- `POST /auth/callback` - OAuth session exchange
- `POST /auth/logout` - User logout

**AI/Code Generation:**
- `POST /api/gen` - Generate code using LLMs
- `POST /api/copilot` - Copilot features with graph analysis
- `POST /api/fix-hint` - Generate fix hints using Groq

**Agent & Runtime:**
- `POST /api/agent` - Agent execution planning
- `POST /api/runtime/start` - Initialize runtime graphs
- `POST /api/runtime/stream` - Stream runtime events

**Documents & Credits:**
- `GET/POST /api/documents` - Document CRUD
- `DELETE /api/documents/[id]` - Delete document
- `GET/POST /api/document-sets` - Document set management
- `GET /api/credits` - Get credit balance
- `POST /api/credits/use` - Deduct credits
- `POST /api/payments/dummy` - Dummy payment for testing

**Export & Integration:**
- `POST /api/openapi` - Generate OpenAPI spec and ZIP export

---

*Integration audit: 2026-03-23*
