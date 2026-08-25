# Tasks — Team 5: Product + Frontend + Reporting

## T5-001: Next.js Application Setup

**TEAM:** 5 — Product + Frontend + Reporting
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Initialize the Next.js 14+ application with App Router, TypeScript, Tailwind CSS, and shadcn/ui.

### Dependencies
T1-001

### Input
- Monorepo structure

### Output
- `apps/web/` directory with Next.js app
- Tailwind CSS configuration
- shadcn/ui components
- Layout and navigation
- Unit test setup (Vitest)

### Allowed Files
- `apps/web/*`
- `apps/web/package.json`

### Implementation Notes
- Next.js 14+ with App Router
- TypeScript strict mode
- Tailwind CSS + shadcn/ui
- React Query for API calls

### Acceptance Criteria
- [ ] App starts and renders
- [ ] Tailwind styling works
- [ ] shadcn/ui components are available
- [ ] TypeScript compiles

---

## T5-002: Dashboard + Case List

**TEAM:** 5 — Product + Frontend + Reporting
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Build the dashboard and case listing page.

### Dependencies
T5-001, T1-003

### Input
- Next.js app, Case API

### Output
- Dashboard page
- Case list component
- Case card component
- Unit tests

### Allowed Files
- `apps/web/app/page.tsx`
- `apps/web/app/cases/page.tsx`
- `apps/web/components/case/*.tsx`
- `apps/web/__tests__/cases/*.test.tsx`

### Acceptance Criteria
- [ ] Dashboard shows case list
- [ ] Cases are fetched from API
- [ ] Loading states work
- [ ] Error states work

---

## T5-003: Case Creation + Investigation Creation

**TEAM:** 5 — Product + Frontend + Reporting
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Build case and investigation creation forms.

### Dependencies
T5-001, T1-003, T1-004

### Input
- Next.js app, Case/Investigation APIs

### Output
- Case creation form
- Investigation creation form with objective intake
- Form validation
- Unit tests

### Allowed Files
- `apps/web/app/cases/new/page.tsx`
- `apps/web/app/investigations/new/page.tsx`
- `apps/web/components/forms/*.tsx`
- `apps/web/__tests__/forms/*.test.tsx`

### Acceptance Criteria
- [ ] Forms are validated
- [ ] API calls work
- [ ] Success/error feedback works
- [ ] Navigation after creation works

---

## T5-004: Investigation Progress View

**TEAM:** 5 — Product + Frontend + Reporting
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Build investigation detail view with progress tracking.

### Dependencies
T5-001, T1-004

### Input
- Next.js app, Investigation API

### Output
- Investigation detail page
- Progress indicator
- State display
- Unit tests

### Allowed Files
- `apps/web/app/investigations/[id]/page.tsx`
- `apps/web/components/investigation/*.tsx`
- `apps/web/__tests__/investigation/*.test.tsx`

### Acceptance Criteria
- [ ] Investigation details are displayed
- [ ] Current state is shown
- [ ] Progress indicator works

---

## T5-005: Evidence Viewer

**TEAM:** 5 — Product + Frontend + Reporting
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Build evidence list and detail viewer.

### Dependencies
T5-001, T1-007

### Input
- Next.js app, Evidence API

### Output
- Evidence list page
- Evidence detail component
- Hash verification display
- Unit tests

### Allowed Files
- `apps/web/app/investigations/[id]/evidence/page.tsx`
- `apps/web/components/evidence/*.tsx`
- `apps/web/__tests__/evidence/*.test.tsx`

### Acceptance Criteria
- [ ] Evidence list is displayed
- [ ] Evidence detail shows all fields
- [ ] Hash is displayed
- [ ] Provenance chain is shown

---

## T5-006: Entity Viewer

**TEAM:** 5 — Product + Frontend + Reporting
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Build entity list and detail viewer.

### Dependencies
T5-001, T3-008

### Input
- Next.js app, Entity API

### Output
- Entity list page
- Entity detail component
- Unit tests

### Allowed Files
- `apps/web/app/investigations/[id]/entities/page.tsx`
- `apps/web/components/entities/*.tsx`
- `apps/web/__tests__/entities/*.test.tsx`

### Acceptance Criteria
- [ ] Entity list is displayed
- [ ] Entity detail shows attributes
- [ ] Entity type is displayed

---

## T5-007: Graph Visualization

**TEAM:** 5 — Product + Frontend + Reporting
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Build relationship graph visualization.

### Dependencies
T5-001, T3-008

### Input
- Next.js app, Graph API

### Output
- Graph visualization page
- Force-directed graph component
- Entity node component
- Relationship edge component
- Unit tests

### Allowed Files
- `apps/web/app/investigations/[id]/graph/page.tsx`
- `apps/web/components/graph/*.tsx`
- `apps/web/__tests__/graph/*.test.tsx`

### Implementation Notes
- Use react-force-graph or d3-force
- Nodes: entities (colored by type)
- Edges: relationships (labeled)
- Interactive: click, zoom, pan

### Acceptance Criteria
- [ ] Graph renders correctly
- [ ] Nodes are interactive
- [ ] Relationship labels are shown
- [ ] Zoom/pan works

---

## T5-008: Timeline View

**TEAM:** 5 — Product + Frontend + Reporting
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Build investigation timeline visualization.

### Dependencies
T5-001, T3-009

### Input
- Next.js app, Timeline API

### Output
- Timeline page
- Timeline component
- Event detail popups
- Unit tests

### Allowed Files
- `apps/web/app/investigations/[id]/timeline/page.tsx`
- `apps/web/components/timeline/*.tsx`
- `apps/web/__tests__/timeline/*.test.tsx`

### Acceptance Criteria
- [ ] Timeline is chronologically ordered
- [ ] Events are clickable
- [ ] Filtering works

---

## T5-009: Findings + Verification View

**TEAM:** 5 — Product + Frontend + Reporting
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Build findings display with verification status.

### Dependencies
T5-001, T4-008

### Input
- Next.js app, Findings API, Verification API

### Output
- Findings page
- Finding card component
- Verification status display
- Verify/override actions
- Unit tests

### Allowed Files
- `apps/web/app/investigations/[id]/findings/page.tsx`
- `apps/web/components/findings/*.tsx`
- `apps/web/__tests__/findings/*.test.tsx`

### Acceptance Criteria
- [ ] Findings are displayed
- [ ] Verification status is shown
- [ ] Actions work

---

## T5-010: Report Generation + Export

**TEAM:** 5 — Product + Frontend + Reporting
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Build report generation service and report viewer.

### Dependencies
T5-001, T1-007, T3-008, T4-008

### Input
- All data APIs

### Output
- `services/reporting/src/services/report-generator.ts`
- Report page
- Markdown export
- Unit tests

### Allowed Files
- `services/reporting/src/services/report-generator.ts`
- `apps/web/app/investigations/[id]/report/page.tsx`
- `apps/web/components/report/*.tsx`
- `services/reporting/src/__tests__/report-generator.test.ts`

### Acceptance Criteria
- [ ] Report is generated
- [ ] Markdown export works
- [ ] All sections are included

---

## T5-011: E2E Tests

**TEAM:** 5 — Product + Frontend + Reporting
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Write end-to-end tests for critical user flows.

### Dependencies
T5-002 through T5-010

### Input
- All frontend pages

### Output
- Playwright test suite
- Test fixtures

### Allowed Files
- `tests/e2e/*.spec.ts`
- `tests/e2e/fixtures/*.json`
- `playwright.config.ts`

### Implementation Notes
- Test complete investigation flow
- Create case → Create investigation → Collect evidence → View results → Generate report
- Test error states
- Test responsive design

### Acceptance Criteria
- [ ] Critical user flows are covered
- [ ] Tests run in CI
- [ ] Tests are deterministic
