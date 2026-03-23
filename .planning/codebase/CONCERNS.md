# Codebase Concerns

**Analysis Date:** 2026-03-23

## Tech Debt

**Type Safety: `as any` Casting in Document Routes**
- Issue: Heavy use of `as any` casting bypasses TypeScript safety in Prisma operations
- Files: `app/api/documents/route.ts` (lines 139-140), `lib/api/openapi-generator.ts` (lines 92-95, 155-158)
- Impact: Runtime errors possible when schema changes; hard to track data shape assumptions
- Fix approach: Create proper TypeScript interfaces for Prisma data, eliminate `as any` casts, use Prisma's generated types directly

**Weak JSON Parsing Without Validation**
- Issue: AI-generated responses use `JSON.parse()` followed by manual type checking instead of schema validation upfront
- Files: `app/api/gen/route.ts` (line 504), `app/api/copilot/route.ts` (lines 539, 557)
- Impact: Malformed AI responses can crash API routes; manual checking misses edge cases
- Fix approach: Wrap JSON.parse in try-catch, validate schema BEFORE parsing with Zod, add response size limits before parsing

**In-Memory Graph State Without Isolation**
- Issue: Runtime graphs stored in module-level variable in `lib/runtime/state.ts` with JSON clone as only isolation
- Files: `lib/runtime/state.ts` (lines 3, 6-16)
- Impact: Concurrent requests can interfere with each other if state updates aren't atomic; scaling to multiple instances loses state; no transaction safety
- Fix approach: Migrate to database-backed graph state, add request-scoped state containers, use locking mechanism for concurrent updates

**Implicit Test Coverage Gaps**
- Issue: Only 2 E2E tests exist for entire system; no unit tests for core runtime logic
- Files: `tests/e2e/database-block.spec.ts`, `tests/e2e/full-flow.spec.ts` (only files)
- Impact: Regressions in AI generation, runtime execution, or API routes go undetected; difficult to refactor safely
- Fix approach: Add unit tests for `RuntimeEngine.executeRestRequest()`, `generateOpenApiSpec()`, `planArchitecture()`, and graph traversal logic

## Known Issues

**Unhandled LLM Quota Exhaustion in Fallback Chain**
- Symptoms: When both Gemini and Groq APIs exhaust quota, silent failure returns null instead of informative error
- Files: `app/api/gen/route.ts` (lines 199-223), `app/api/copilot/route.ts` (lines 526-565)
- Trigger: Call `/api/gen` or `/api/copilot` with exhausted Gemini+Groq keys
- Workaround: Check logs for "QuotaExceededError" to understand retry timing; manually set alternative API key env vars

**Missing Validation on Graph Size Limits**
- Symptoms: Can create arbitrarily large graphs with hundreds of nodes causing memory spikes and slow canvas rendering
- Files: `store/useStore.ts` (node creation logic), no size validation anywhere
- Trigger: Programmatically or via AI generation creating large patch with many nodes
- Workaround: Manually delete nodes from UI; browser memory will eventually kill the tab

**Prisma Client Not Properly Closed in Serverless**
- Symptoms: Connection pool exhaustion in production after high request volume
- Files: All API routes using `prisma` singleton from `lib/prisma`
- Trigger: Sustained traffic spikes; visible as timeouts after ~100-200 concurrent requests
- Workaround: Manual restart of deployment; shorter connection timeouts mask the issue temporarily

## Security Considerations

**Insufficient Input Validation on Document Content**
- Risk: User can store arbitrary JSON in document.content field; no size limit enforced
- Files: `app/api/documents/route.ts` (lines 16-22, 134-144)
- Current mitigation: Zod validates basic structure but not maximum size
- Recommendations: Add `z.string().max(5000000)` to content field; reject documents >5MB; add audit logging for large uploads

**AI-Generated Code Injection via Copilot Patch**
- Risk: AI model can be prompted to generate malicious graph structures that execute unvalidated code paths
- Files: `app/api/copilot/route.ts` (lines 536-565), `sanitizePatch()` function
- Current mitigation: Schema validation with `ProcessNodeSchema.safeParse()` prevents invalid structures but not malicious logic
- Recommendations: Add runtime execution sandbox; whitelist allowed node types and step kinds; log all AI-generated patches with user review flow

**Environment Variable Exposure via Error Messages**
- Risk: Detailed error messages in API responses may leak Prisma connection strings or internal paths
- Files: Multiple API routes returning `{ error: string, details: object }`
- Current mitigation: Generic error messages in some places but details still exposed in JSON
- Recommendations: Never include database error details in 500 responses; sanitize error messages; use request IDs for server-side error lookup

**Hardcoded OAuth Redirect and Authorization URL**
- Risk: OAuth2 authorization URL hardcoded to "https://auth.example.com" in generated OpenAPI spec
- Files: `lib/api/openapi-generator.ts` (line 110)
- Current mitigation: Placeholder URL prevents real auth but misleads clients
- Recommendations: Add authorizationUrl to `ApiBinding.security` schema; require OAuth2 config before generating specs

**localStorage Usage for Sensitive Test Environment Variables**
- Risk: Test panel stores API keys and credentials in browser localStorage unencrypted
- Files: `components/studio/TestPanel.tsx` (uses ENV_STORAGE_KEY for localStorage)
- Current mitigation: Only stored in browser, not sent to server
- Recommendations: Use memory-only storage during session; warn users not to store real credentials; implement client-side encryption

## Performance Bottlenecks

**Synchronous JSON Clone for Large Graphs**
- Problem: State management uses `JSON.parse(JSON.stringify(graphs))` for deep cloning in every tab switch
- Files: `lib/runtime/state.ts` (line 7)
- Cause: No structural sharing; full serialization/deserialization required
- Improvement path: Replace with recursive shallow clone or use Immer for structural sharing; benchmark impact on 1000+ node graphs

**O(n) Node Lookup in Graph Traversal**
- Problem: Runtime engine finds nodes via array filter/find operations during request handling
- Files: `lib/runtime/engine.ts` (implied in nodeById/incomingById/outgoingById maps setup)
- Cause: Graph structures not pre-indexed; repeated lookups during execution
- Improvement path: Pre-compute adjacency lists during engine initialization; use Map instead of array iteration

**Unoptimized AI Prompt Context Building**
- Problem: Full graph JSON serialized in every copilot/agent request regardless of relevance
- Files: `app/api/gen/route.ts` (line 497), `app/api/copilot/route.ts` (lines 56-82)
- Cause: Entire architecture dumped into prompt every time; scales poorly with graph size
- Improvement path: Implement graph summarization; extract only relevant subgraphs; limit prompt size to 32K tokens

**Database Query N+1 Potential**
- Problem: Document fetches don't use Prisma `include()` for relationships; comments/metadata loaded separately if accessed
- Files: `app/api/documents/route.ts` (line 64-69)
- Cause: Basic findMany without eager loading
- Improvement path: Add `.include({ documentSet: true })` if set is accessed; profile actual query patterns in production

## Fragile Areas

**Runtime Engine Graph Mutation During Execution**
- Files: `lib/runtime/engine.ts` (execution logic)
- Why fragile: No copy-on-write for graph state during request processing; concurrent requests can see partial mutations
- Safe modification: Snapshot graph at request start; restore on error; validate no mutations outside transaction boundaries
- Test coverage: Only E2E tests; no unit tests for concurrent execution scenarios

**GenCodeModal AI Patch Application Without Dry-Run**
- Files: `components/studio/GenCodeModal.tsx` (implies patch application to canvas)
- Why fragile: AI-generated patches applied directly to user graph; no preview or manual review step
- Safe modification: Show patch diff before applying; allow undo; validate patch doesn't break existing connections
- Test coverage: No E2E test for edge case of conflicting node IDs in patches

**Supabase Auth Token Refresh Not Tested**
- Files: `app/auth/callback/route.ts`, middleware auth setup (location TBD)
- Why fragile: Session refresh logic depends on Supabase SSR client behavior; token expiration handling implicit
- Safe modification: Test manual token refresh; test callback failure scenarios; add explicit logout on token expiry
- Test coverage: No E2E test covering auth token expiration and refresh

**Validation Issue Synchronization Between Modal and Inspector**
- Files: `store/useStore.ts` (validationIssues state), components reading/updating this state
- Why fragile: Multiple components update validationIssues asynchronously; no coordination ensures consistency
- Safe modification: Single source of truth for validation; batch updates; test that focus/unfocus cycles don't lose issues
- Test coverage: No unit tests for validation issue state mutations

## Scaling Limits

**In-Memory Graph State Cannot Scale Beyond Single Instance**
- Current capacity: ~1000 concurrent users per instance (approximate)
- Limit: Horizontal scaling impossible; no session affinity saves state to db
- Scaling path: Move `lib/runtime/state.ts` to Redis or database; implement state versioning; support multi-region deployments

**Prisma Connection Pool Exhaustion**
- Current capacity: ~20-50 concurrent database connections (default pool size)
- Limit: 100+ simultaneous API requests deplete connections; subsequent requests timeout
- Scaling path: Increase `max` in connection string; implement connection pooling middleware (PgBouncer); reduce query duration

**Single Supabase Instance for All Users**
- Current capacity: Supabase free tier supports ~10,000 MAU
- Limit: Hit rate limits on auth requests; concurrent seat limits
- Scaling path: Migrate to Supabase Teams/dedicated instance; implement auth caching; use JWT refresh token optimization

**AI API Quota Rotation Limited to Single Request**
- Current capacity: ~60 Gemini requests/min or Groq equivalents
- Limit: Concurrent users spike exhausts quota; falling back to null response
- Scaling path: Implement request queuing; add exponential backoff; fallback to cached previous responses; budget credits per user

## Dependencies at Risk

**React 19.2.3 + Next.js 16.1.6 Compatibility Unverified**
- Risk: React 19 significantly rewrote hooks; Next.js version may not have full compatibility fixes
- Impact: useCallback, useEffect, state mutations could behave differently; hydration mismatches possible
- Migration plan: Downgrade to React 18 LTS if issues found; test server/client boundary carefully; check @xyflow/react compatibility

**@xyflow/react 12.10.0 Custom Node Type Casting**
- Risk: Multiple `as unknown as ComponentType<NodeProps>` casts in `FlowCanvas.tsx` bypass type safety
- Impact: Node components might not receive expected props; runtime errors in handlers
- Migration plan: Update to @xyflow/react 13+ if type definitions improved; otherwise create wrapper components with proper typing

**Groq SDK 0.37.0 Undocumented Deprecation**
- Risk: Groq API rapidly evolving; SDK version not pinned to exact patch
- Impact: Model names might change; response format variations not caught by tests
- Migration plan: Pin exact SDK version in package.json; implement SDK version checks; subscribe to Groq SDK releases

**Zustand 5.0.11 Store Middleware Not Tested**
- Risk: New Zustand version has API changes; middleware setup in useStore may not work as expected
- Impact: State updates might not trigger component re-renders; actions might lose context
- Migration plan: Test store mutations directly; verify selector memoization works; consider Redux Toolkit alternative if issues persist

## Missing Critical Features

**No User-Facing Error Recovery UI**
- Problem: API errors (quota, database, validation) return JSON but UI doesn't display them clearly
- Blocks: Users don't know why operations failed; can't retry intelligently
- Priority: High - currently frustrating user experience

**No Graph Versioning or Conflict Resolution**
- Problem: Concurrent edits from multiple tabs/windows overwrite each other without warning
- Blocks: Collaborative features; multi-user deployments
- Priority: Medium - affects power users

**No Audit Trail for Generated Code**
- Problem: Cannot track which AI model generated which code or when changes occurred
- Blocks: Compliance requirements; debugging AI behavior regression
- Priority: Medium - required for enterprise adoption

**No Circuit Breaker for External API Calls**
- Problem: Failed LLM calls retry immediately; no gradual fallback strategy
- Blocks: Cascading failures during LLM API outages
- Priority: Medium - affects system stability

## Test Coverage Gaps

**AI Generation Consistency**
- What's not tested: Determinism of copilot/agent patches; same prompt produces same output
- Files: `app/api/copilot/route.ts`, `app/api/agent/route.ts` (post endpoints)
- Risk: AI model updates silently change behavior; no regression detection
- Priority: High

**Graph Validation Against Service Boundaries**
- What's not tested: Whether `analyzeDesignSystem()` correctly identifies cross-boundary violations
- Files: `lib/runtime/architecture.ts` (validation logic)
- Risk: Service boundary policies enforced incorrectly; security assumptions break silently
- Priority: High

**Runtime Execution Error Propagation**
- What's not tested: When subprocess or external service fails, does error properly flow through engine?
- Files: `lib/runtime/engine.ts` (executeRestRequest implementation)
- Risk: Errors swallowed silently; user sees hanging request
- Priority: High

**Prisma Database Migrations**
- What's not tested: Schema migrations don't corrupt existing data; rollback works
- Files: `prisma/schema.prisma`
- Risk: Production deployment could accidentally delete user data
- Priority: High

**Auth Callback Edge Cases**
- What's not tested: Callback with invalid code; callback with expired session; multiple concurrent callbacks
- Files: `app/auth/callback/route.ts`
- Risk: Users unable to log in silently; no error feedback
- Priority: Medium

---

*Concerns audit: 2026-03-23*
