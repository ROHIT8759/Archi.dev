---
phase: 1
slug: ui-ux-overhaul
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-25
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.x + @testing-library/react (Wave 0 installs) |
| **Config file** | `vitest.config.ts` (exists — add jsdom environment) |
| **Quick run command** | `npm run test -- --run` |
| **Full suite command** | `npm run test -- --run && npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- --run`
- **After every plan wave:** Run `npm run test -- --run && npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-W0-01 | W0 | 0 | REQ-001 | setup | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 1-01-01 | 01 | 1 | REQ-004 | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | REQ-005 | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 1-01-03 | 01 | 1 | REQ-006 | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 1-01-04 | 01 | 1 | REQ-007 | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 1-01-05 | 01 | 1 | REQ-008 | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 1 | REQ-009 | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 1-03-01 | 03 | 2 | REQ-010 | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 1-03-02 | 03 | 2 | REQ-011 | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 1-03-03 | 03 | 2 | REQ-012 | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 1-04-01 | 04 | 2 | REQ-013 | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 1-04-02 | 04 | 2 | REQ-014 | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 1-05-01 | 05 | 3 | REQ-015 | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 1-build | all | final | all | build | `npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/components/landing/Navbar.test.tsx` — stubs for REQ-004
- [ ] `tests/components/landing/Hero.test.tsx` — stubs for REQ-005
- [ ] `tests/components/landing/BentoSpotlight.test.tsx` — stubs for REQ-006
- [ ] `tests/components/landing/StickyScrollSequence.test.tsx` — stubs for REQ-007
- [ ] `tests/components/landing/MagneticCTA.test.tsx` — stubs for REQ-008
- [ ] `tests/components/auth/LoginPage.test.tsx` — stubs for REQ-009
- [ ] `tests/components/dashboard/Dashboard.test.tsx` — stubs for REQ-010, REQ-011, REQ-012
- [ ] `tests/components/studio/CommandPalette.test.tsx` — stubs for REQ-014
- [ ] `tests/components/studio/FloatingContextMenu.test.tsx` — stubs for REQ-014
- [ ] `tests/components/canvas/AnimatedEdge.test.tsx` — stubs for REQ-013
- [ ] `vitest.config.ts` — add `environment: 'jsdom'` + `@testing-library/react` setup
- [ ] `npm install --save-dev @testing-library/react @testing-library/user-event jsdom` — install test deps if not present

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 60fps animations on all interactive elements | REQ-003 | Requires visual performance profiling (Chrome DevTools) | Open Chrome DevTools → Performance tab → record interaction with Studio canvas + Landing page scroll; verify no frame drops below 60fps |
| Magnetic button cursor pull | REQ-008 | Requires real mouse interaction | Load landing page, hover near (but not on) "Start Building Free" button within 80px radius; verify button subtly shifts toward cursor |
| Bento spotlight follows cursor | REQ-006 | Requires real mouse movement | Load landing page, move mouse across bento grid cards; verify radial gradient spotlight follows cursor on each card |
| Command palette node placement | REQ-014 | Requires canvas context | Open Studio, press Cmd+K, type "API", select result; verify node appears at canvas center |
| Reduced motion compliance | REQ-003 | Requires OS-level setting | Enable "Reduce motion" in OS accessibility settings; verify parallax, edge pulse, and entrance animations are disabled/minimized |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
