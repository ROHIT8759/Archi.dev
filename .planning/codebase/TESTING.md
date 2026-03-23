# Testing Patterns

**Analysis Date:** 2026-03-23

## Test Framework

**Runner:**
- Vitest 4.0.18
- Config: `vitest.config.ts`
- ESM-native, optimized for TypeScript and Vite

**Assertion Library:**
- Vitest built-in expect assertions (no separate assertion library needed)
- Supports all standard matchers: `toBe()`, `toContain()`, `toHaveLength()`, etc.

**Run Commands:**
```bash
npm run test              # Run all unit tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run test:e2e         # Run end-to-end tests with Playwright
npm run test:e2e:ui      # Run e2e tests with Playwright UI
```

## Test File Organization

**Location:**
- Unit tests: `tests/unit/**/*.test.ts`
- E2E tests: `tests/e2e/**/*.spec.ts`
- Co-located with source code is NOT used

**Naming:**
- Unit tests: `.test.ts` extension (e.g., `api-gen.test.ts`, `deploy.test.ts`)
- E2E tests: `.spec.ts` extension (e.g., `database-block.spec.ts`, `full-flow.spec.ts`)

**Structure:**
```
tests/
├── unit/
│   ├── api-gen.test.ts
│   ├── deploy.test.ts
│   ├── test-panel.test.ts
│   └── validate-architecture.test.ts
└── e2e/
    ├── database-block.spec.ts
    ├── full-flow.spec.ts
    └── helpers.ts
```

## Test Structure

**Suite Organization:**
```typescript
describe("POST /api/gen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // setup
  });

  afterEach(() => {
    // cleanup
  });

  it("returns 400 when nodes is missing", async () => {
    // test body
  });
});
```

**Patterns:**
- `describe()` for grouping related tests
- `beforeEach()` for test setup (mock clearing, env vars, defaults)
- `afterEach()` for cleanup (restore original state, disconnect)
- `it()` for individual test cases
- Descriptive test names that read as sentences: "returns X when Y happens"

**Test Organization Strategy (from `api-gen.test.ts`):**
- Group related tests under comment sections: `// ── 400 guards`, `// ── happy path`
- Separate concerns: validation tests, happy path tests, error tests, edge cases
- Integration tests marked with `it.skipIf()` and conditional flags

## Mocking

**Framework:** Vitest's built-in `vi.mock()`, `vi.fn()`, `vi.stubGlobal()`

**Patterns:**

1. **Hoisted mocks** (top-level before imports):
```typescript
const { mockGenerateContent, mockGroqCreate } = vi.hoisted(() => ({
  mockGenerateContent: vi.fn(),
  mockGroqCreate: vi.fn(),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: vi.fn().mockImplementation(function (this: Record<string, unknown>) {
    this.models = { generateContent: mockGenerateContent };
  }),
}));
```

2. **Global stubs** (for fetch, globals):
```typescript
vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200 }));
```

3. **Mock resetting**:
```typescript
beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});
```

4. **Sequential mock returns**:
```typescript
mockGenerateContent
  .mockResolvedValueOnce(PLAN_RESPONSE)
  .mockResolvedValue(CODE_RESPONSE("src/index.ts"));
```

**What to Mock:**
- External API calls (Google Genai, Groq, fetch)
- Environment variables (API keys, URLs, feature flags)
- Global objects (fetch, timers)

**What NOT to Mock:**
- Internal utility functions (use real implementations)
- Database operations (use real Prisma for integration tests)
- File system (use real JSZip for ZIP verification)

## Fixtures and Factories

**Test Data:**

Shared fixtures (from `api-gen.test.ts`):
```typescript
const VALID_NODES = [
  {
    id: "node-1",
    type: "process",
    position: { x: 100, y: 100 },
    data: {
      kind: "process",
      id: "process_1",
      label: "My Function",
      processType: "function_block",
      execution: "sync",
      inputs: [],
      outputs: { success: [], error: [] },
      steps: [],
    },
  },
];

const VALID_EDGES = [
  { id: "e1", source: "node-1", target: "node-2" },
];

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/gen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
```

**Factory Pattern** (from `validate-architecture.test.ts`):
```typescript
function makeNode(overrides: Partial<Node> & { data: Record<string, unknown> }): Node {
  return {
    id: overrides.id ?? "n1",
    position: overrides.position ?? { x: 0, y: 0 },
    type: overrides.type ?? "process",
    data: overrides.data,
  };
}

function makeEdge(source: string, target: string): Edge {
  return { id: `${source}-${target}`, source, target };
}
```

**Location:**
- Fixtures defined at top of test file after imports
- Factories as helper functions in test file
- E2E helpers extracted to `tests/e2e/helpers.ts`

## Coverage

**Requirements:** No explicit coverage target enforced

**View Coverage:**
```bash
npm run test:coverage    # Generates coverage report
```

**Configuration** (from `vitest.config.ts`):
```typescript
coverage: {
  provider: "v8",
  reporter: ["text", "lcov"],
}
```

Coverage reports output in text format (console) and LCOV format (for CI/tools).

## Test Types

**Unit Tests:**
- Scope: Single function or route handler
- Approach: Mock all external dependencies, test logic in isolation
- Examples: `tests/unit/api-gen.test.ts`, `tests/unit/validate-architecture.test.ts`
- Test both happy path and error cases
- Verify exact response shapes and headers

**Integration Tests:**
- Marked with `it.skipIf(!INTEGRATION)` flag
- Opt-in via `DEPLOY_INTEGRATION=true` environment variable
- Allow tests to run against real local servers
- Skipped in CI to prevent flakiness
- Example: `tests/unit/deploy.test.ts` has 4 integration tests that send real ZIPs to local deploy server

**E2E Tests:**
- Framework: Playwright 1.58.2
- Config: `playwright.config.ts`
- Location: `tests/e2e/`
- Scope: Full user flow (UI → API → database)
- Features:
  - Chromium browser testing
  - Automatic server startup via webServer config
  - Database helpers for state verification
  - Auth bypass via `E2E_BYPASS_AUTH=1` flag
  - Parallel execution (fullyParallel: true)
  - Retries in CI (2 retries)
  - HTML reporter with traces on first retry

## Common Patterns

**Async Testing:**
```typescript
it("returns 200 with a valid ZIP on success", async () => {
  mockGenerateContent
    .mockResolvedValueOnce(PLAN_RESPONSE)
    .mockResolvedValue(CODE_RESPONSE("src/index.ts"));

  const res = await POST(makeRequest({ nodes: VALID_NODES, edges: VALID_EDGES }));
  expect(res.status).toBe(200);

  const arrayBuffer = await res.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  expect(Object.keys(zip.files)).toContain("src/index.ts");
});
```

**Error Testing:**
```typescript
it("returns 400 when nodes is missing", async () => {
  const res = await POST(makeRequest({ edges: VALID_EDGES }));
  expect(res.status).toBe(400);
  const body = await res.json();
  expect(body.error).toBe("Missing nodes or edges");
});

it("returns 500 when the AI plan call throws a non-quota error", async () => {
  mockGenerateContent.mockRejectedValueOnce(new Error("network connection refused"));
  const res = await POST(makeRequest({ nodes: VALID_NODES, edges: VALID_EDGES }));
  expect(res.status).toBe(500);
  const body = await res.json();
  expect(body.error).toBe("Internal server error");
});
```

**Polling for Async State** (E2E pattern from `database-block.spec.ts`):
```typescript
await expect
  .poll(async () => {
    return prisma.user.findUnique({
      where: { email },
      select: { email: true, name: true },
    });
  })
  .not.toBeNull();
```

**Cleanup Pattern**:
```typescript
try {
  // test actions
} finally {
  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
}
```

**Environment Variable Management**:
```typescript
beforeEach(() => {
  const savedKeys = {};
  savedKeys["GEMINI_API_KEY"] = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY_1 = "test-api-key";
});

afterEach(() => {
  delete process.env.GEMINI_API_KEY;
  for (const [key, val] of Object.entries(savedKeys)) {
    if (val !== undefined) process.env[key] = val;
    else delete process.env[key];
  }
});
```

**Response Header Verification** (from `deploy.test.ts`):
```typescript
const res = await POST(makeRequest({ nodes: VALID_NODES, edges: VALID_EDGES }));
expect(res.headers.get("Content-Type")).toBe("application/zip");
expect(res.headers.get("Content-Disposition")).toContain("generated-project.zip");
expect(res.headers.get("X-Deploy-Status")).toBe("ok");
```

---

*Testing analysis: 2026-03-23*
