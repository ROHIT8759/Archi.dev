# Coding Conventions

**Analysis Date:** 2026-03-23

## Naming Patterns

**Files:**
- API routes: `[resource]/route.ts` (e.g., `app/api/gen/route.ts`, `app/api/documents/route.ts`)
- Components: PascalCase with `.tsx` extension (e.g., `ProcessNode.tsx`, `FlowCanvas.tsx`)
- Utilities and libraries: camelCase with `.ts` extension (e.g., `auto-layout.ts`, `openapi-generator.ts`)
- Type definitions: Descriptive names in schema files (e.g., `lib/schema/node.ts`, `lib/schema/graph.ts`)

**Functions:**
- camelCase naming for all functions and methods
- Exported functions: `export function functionName()`
- Helper functions: prefix with underscore or nested scope (e.g., `getApiKeys()`, `getQuotaRetryAfter()`)
- React components: PascalCase (e.g., `ProcessNode`, `FlowCanvas`)
- Hooks: `use*` prefix for custom Zustand stores (e.g., `useStore`)

**Variables:**
- camelCase for all variable and property names
- Constants: UPPER_SNAKE_CASE (e.g., `GEMINI_MODEL`, `GROQ_MODEL`, `DEFAULT_NODE_WIDTH`)
- Type discriminators: lowercase strings (e.g., `kind: "process"`, `type: "api_binding"`)

**Types:**
- PascalCase for all type and interface names
- Descriptive, specific names (e.g., `ProcessDefinition`, `ApiBinding`, `GraphCollection`)
- Union types: explicit naming (e.g., `type NodeKind = "process" | "database" | ...`)

## Code Style

**Formatting:**
- ESLint 9 with Next.js Core Web Vitals config
- Flat config format in `eslint.config.mjs`
- TypeScript strict mode enabled
- Line length: No explicit rule; code typically wraps around 80-100 characters

**Linting:**
- Tool: ESLint 9.0+
- Config: `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Key rules enforced:
  - Core Web Vitals checks
  - TypeScript type safety rules
  - No unused variables
- Global ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`

**Indentation:**
- 2 spaces (inferred from typical Next.js/React projects)
- Consistent formatting in all examples shown

## Import Organization

**Order:**
1. External libraries (React, Next, third-party)
2. Type imports (`import type`)
3. Internal utilities and helpers (`@/lib`, `@/components`, `@/store`)
4. Local files (relative imports)

**Example from `store/useStore.ts`:**
```typescript
import { create } from "zustand";
import {
  Connection,
  Edge,
  // ... more @xyflow imports
  OnConnect,
} from "@xyflow/react";
import { ProcessGraph } from "@/lib/schema/graph";
import { NodeData, InputField, OutputField } from "@/lib/schema/node";
import { autoLayoutNodes } from "@/lib/studio/auto-layout";
```

**Path Aliases:**
- `@/*` resolves to root directory (configured in `tsconfig.json`)
- Used for all internal imports across the codebase

## Error Handling

**Patterns:**
- Custom error classes for domain-specific errors (e.g., `QuotaExceededError extends Error`)
- Error classes include additional properties (e.g., `retryAfter: number`)
- Try-catch blocks for async operations in API routes
- `console.error()` for logging errors with context (e.g., `console.error("GET /api/documents error:", error)`)
- Return appropriate HTTP status codes: 400 (bad request), 401 (unauthorized), 429 (rate limit), 500 (server error)

**Example from `app/api/gen/route.ts`:**
```typescript
class QuotaExceededError extends Error {
  retryAfter: number;
  constructor(retryAfter = 60) {
    super("Gemini API free-tier quota exceeded");
    this.name = "QuotaExceededError";
    this.retryAfter = retryAfter;
  }
}
```

**Validation:**
- Zod for schema validation (e.g., `createSchema = z.object({ tab: tabEnum, title: z.string().trim().min(1) })`)
- `safeParse()` method for non-throwing validation
- Return 400 status with validation errors in response

## Logging

**Framework:** `console.log()`, `console.error()` — no external logging library

**Patterns:**
- Log errors at route level: `console.error("GET /api/documents error:", error)`
- Include context in error messages (route name, operation)
- Error logging happens before returning error response
- No production logging framework configured

## Comments

**When to Comment:**
- Complex algorithmic sections (e.g., Dagre graph layout logic)
- Non-obvious error handling logic (quota retry detection)
- Algorithm strategy explanations
- Configuration explanations (model selection, timeout values)

**JSDoc/TSDoc:**
- Block comments above functions for documentation
- Example from `app/api/gen/route.ts`:
```typescript
/**
 * Which Gemini model to use. Override with GEMINI_MODEL env var.
 * gemini-2.5-flash-lite — fastest, lowest token cost, good free-tier quota.
 */
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite";
```

**Section Separators:**
- Horizontal rule comments for logical section breaks:
```typescript
// ─────────────────────────────────────────────────────────────────────────────
// KeyRotator — shared across all concurrent workers within one request
// ─────────────────────────────────────────────────────────────────────────────
```

## Function Design

**Size:** Functions are typically 20-60 lines for complex logic; simple helpers 5-15 lines

**Parameters:**
- Specific parameters typed with Zod schemas or TypeScript interfaces
- Avoid large object parameters; use destructuring
- Optional parameters use `?:` or defaults

**Return Values:**
- Explicit return type annotations on all functions
- Async functions return `Promise<Type>`
- Type discriminated returns (e.g., `{ ok: boolean; errors: Error[] }`)
- No implicit `any` returns

**Example from `lib/studio/auto-layout.ts`:**
```typescript
export function autoLayoutNodes(nodes: Node[], edges: Edge[]): Node[] {
  if (nodes.length === 0) return nodes;
  // ... implementation
}
```

## Module Design

**Exports:**
- Named exports preferred over default exports
- `export function`, `export type`, `export const`
- All API route handlers use named exports: `export async function GET()`, `export async function POST()`

**Barrel Files:**
- Used for organizing related schemas (e.g., type exports from `lib/schema/`)
- Clean grouping of domain types

**File Organization:**
- Related types grouped in same file (e.g., all node types in `lib/schema/node.ts`)
- Separate files for different concerns (logic vs. types vs. UI)

## React Component Patterns

**Component Structure:**
- Functional components with TypeScript (`React.FC` not required)
- `memo()` wrapper for optimization: `export const ProcessNode = memo(({ data, selected }: NodeProps) => { ... })`
- Props destructured in function parameters

**Props:**
- No default export of components
- Use consistent prop naming (`NodeProps` from `@xyflow/react`)

**Inline Styles:**
- Style objects using CSS-in-JS (example from `ProcessNode.tsx`):
```typescript
style={{
  background: "var(--panel)",
  borderRadius: 8,
  minWidth: 280,
}}
```
- CSS custom properties for theming (`var(--panel)`, `var(--border)`)
- Conditional inline styles with ternary operators

---

*Convention analysis: 2026-03-23*
