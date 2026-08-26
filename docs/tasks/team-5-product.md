# Tasks — Team 5: Product + Frontend + Reporting

## T5-001 — Next.js Application

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Initialize the Next.js 14+ application with App Router, TypeScript, Tailwind CSS, and shadcn/ui.
**Why:** Frontend foundation for the investigation product.

### Dependencies
T1-003 (Schema package)

### Inputs
- Monorepo structure

### Outputs
- `apps/web/` directory with Next.js app
- Tailwind CSS configuration
- shadcn/ui setup
- TypeScript configuration

### Allowed Files
- `apps/web/`

### Do Not Modify
- Other workspace packages

### Implementation Guidance
1. Create Next.js app with App Router
2. Configure TypeScript strict mode
3. Set up Tailwind CSS
4. Install shadcn/ui components
5. Configure React Query

### AI Instructions
Ask AI to explain Next.js App Router patterns.

### Tests
- App starts and renders
- TypeScript compiles
- Tailwind works

### Documentation
- Frontend setup documentation

### Acceptance Criteria
- [ ] App starts
- [ ] TypeScript compiles
- [ ] Tailwind works

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-002 — Application Layout

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Build the application layout with navigation and routing.
**Why:** Users need consistent navigation across the application.

### Dependencies
T5-001

### Inputs
- Next.js application

### Outputs
- `apps/web/app/layout.tsx`
- Navigation component
- Sidebar component
- Unit tests

### Allowed Files
- `apps/web/app/layout.tsx`
- `apps/web/components/layout/`

### Do Not Modify
- Other pages

### Implementation Guidance
1. Create root layout with sidebar navigation
2. Add navigation links for all sections
3. Responsive design (sidebar collapses on mobile)
4. Loading states

### AI Instructions
Ask AI to explain Next.js layout patterns.

### Tests
- Layout renders
- Navigation works
- Responsive design works

### Documentation
- Layout documentation

### Acceptance Criteria
- [ ] Layout renders
- [ ] Navigation works
- [ ] Responsive

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-003 — Dashboard

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Build the dashboard page showing case list and recent investigations.
**Why:** Dashboard is the primary entry point for users.

### Dependencies
T5-002, T1-017 (Case API)

### Inputs
- Layout, Case API

### Outputs
- `apps/web/app/page.tsx`
- Case list component
- Case card component
- Unit tests

### Allowed Files
- `apps/web/app/page.tsx`
- `apps/web/components/case/`

### Do Not Modify
- Layout

### Implementation Guidance
1. Fetch cases from API
2. Display case list with cards
3. Show case status, title, description
4. Link to case detail
5. Loading and error states

### AI Instructions
Ask AI to explain React data fetching patterns.

### Tests
- Dashboard renders cases
- Loading states work
- Error states work

### Documentation
- Dashboard documentation

### Acceptance Criteria
- [ ] Cases displayed
- [ ] Loading states work
- [ ] Error states work

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-004 — Case Creation

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Build case creation form with validation.
**Why:** Users need to create cases to start investigations.

### Dependencies
T5-002, T1-017

### Inputs
- Layout, Case API

### Outputs
- `apps/web/app/cases/new/page.tsx`
- Case creation form component
- Form validation
- Unit tests

### Allowed Files
- `apps/web/app/cases/`
- `apps/web/components/forms/`

### Do Not Modify
- Other pages

### Implementation Guidance
1. Form with title, description fields
2. Client-side validation
3. API call on submit
4. Success redirect to case detail
5. Error display

### AI Instructions
Ask AI to explain React form patterns with validation.

### Tests
- Form renders
- Validation works
- API call works
- Redirect works

### Documentation
- Case creation documentation

### Acceptance Criteria
- [ ] Form works
- [ ] Validation works
- [ ] Redirect works

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-005 — Investigation Creation

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Build investigation creation form with objective intake.
**Why:** Investigations are created within cases with specific objectives.

### Dependencies
T5-002, T1-017, T1-005

### Inputs
- Layout, Investigation API

### Outputs
- `apps/web/app/investigations/new/page.tsx`
- Investigation creation form
- Objective intake form
- Unit tests

### Allowed Files
- `apps/web/app/investigations/`
- `apps/web/components/forms/`

### Do Not Modify
- Other pages

### Implementation Guidance
1. Link investigation to case
2. Objective type selection (PERSON, DOMAIN, COMPANY, IP)
3. Type-specific fields
4. Form validation
5. API call on submit

### AI Instructions
Ask AI to explain discriminated form patterns.

### Tests
- Form renders per objective type
- Validation works
- API call works

### Documentation
- Investigation creation documentation

### Acceptance Criteria
- [ ] Form works
- [ ] Objective types work
- [ ] Validation works

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-006 — Investigation Status

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Build investigation detail view with progress tracking.
**Why:** Users need to monitor investigation progress.

### Dependencies
T5-002, T1-017

### Inputs
- Layout, Investigation API

### Outputs
- `apps/web/app/investigations/[id]/page.tsx`
- Progress indicator component
- State display
- Unit tests

### Allowed Files
- `apps/web/app/investigations/[id]/`
- `apps/web/components/investigation/`

### Do Not Modify
- Other pages

### Implementation Guidance
1. Fetch investigation details
2. Show current state with visual indicator
3. Show progress through states
4. Show linked evidence count
5. Show linked entities count

### AI Instructions
Ask AI to explain progress indicator patterns.

### Tests
- Investigation details displayed
- Progress indicator works
- State displayed correctly

### Documentation
- Investigation status documentation

### Acceptance Criteria
- [ ] Details displayed
- [ ] Progress works
- [ ] State shown

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-007 — Evidence Viewer

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Build evidence list and detail viewer.
**Why:** Users need to examine collected evidence.

### Dependencies
T5-002, T1-018

### Inputs
- Layout, Evidence API

### Outputs
- `apps/web/app/investigations/[id]/evidence/page.tsx`
- Evidence list component
- Evidence detail component
- Unit tests

### Allowed Files
- `apps/web/app/investigations/[id]/evidence/`
- `apps/web/components/evidence/`

### Do Not Modify
- Other pages

### Implementation Guidance
1. List evidence items with type, source, timestamp
2. Detail view with full content
3. Hash display
4. Provenance chain display

### AI Instructions
Ask AI to explain evidence display patterns.

### Tests
- Evidence list renders
- Detail view works
- Hash displayed

### Documentation
- Evidence viewer documentation

### Acceptance Criteria
- [ ] List renders
- [ ] Detail works
- [ ] Hash displayed

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-008 — Entity Viewer

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Build entity list and detail viewer.
**Why:** Users need to examine extracted entities.

### Dependencies
T5-002, T3-014

### Inputs
- Layout, Entity API

### Outputs
- `apps/web/app/investigations/[id]/entities/page.tsx`
- Entity list component
- Entity detail component
- Unit tests

### Allowed Files
- `apps/web/app/investigations/[id]/entities/`
- `apps/web/components/entities/`

### Do Not Modify
- Other pages

### Implementation Guidance
1. List entities with type, name, confidence
2. Detail view with all attributes
3. Filter by entity type
4. Confidence score display

### AI Instructions
Ask AI to explain entity display patterns.

### Tests
- Entity list renders
- Detail works
- Filtering works

### Documentation
- Entity viewer documentation

### Acceptance Criteria
- [ ] List renders
- [ ] Detail works
- [ ] Filtering works

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-009 — Graph View

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Build relationship graph visualization.
**Why:** Graph visualization reveals connections between entities.

### Dependencies
T5-002, T3-011

### Inputs
- Layout, Graph API

### Outputs
- `apps/web/app/investigations/[id]/graph/page.tsx`
- Graph visualization component
- Node and edge components
- Unit tests

### Allowed Files
- `apps/web/app/investigations/[id]/graph/`
- `apps/web/components/graph/`

### Do Not Modify
- Other pages

### Implementation Guidance
1. Use react-force-graph or d3-force
2. Nodes: entities (colored by type)
3. Edges: relationships (labeled)
4. Interactive: click, zoom, pan
5. Node detail on click

### AI Instructions
Ask AI to explain force-directed graph visualization.

### Tests
- Graph renders
- Nodes interactive
- Zoom/pan works

### Documentation
- Graph view documentation

### Acceptance Criteria
- [ ] Graph renders
- [ ] Interactive
- [ ] Zoom/pan works

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-010 — Timeline

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Build investigation timeline visualization.
**Why:** Timeline shows chronological investigation progress.

### Dependencies
T5-002, T3-013

### Inputs
- Layout, Timeline API

### Outputs
- `apps/web/app/investigations/[id]/timeline/page.tsx`
- Timeline component
- Event detail popups
- Unit tests

### Allowed Files
- `apps/web/app/investigations/[id]/timeline/`
- `apps/web/components/timeline/`

### Do Not Modify
- Other pages

### Implementation Guidance
1. Chronological event display
2. Event type icons/colors
3. Click for detail popup
4. Filter by event type

### AI Instructions
Ask AI to explain timeline visualization patterns.

### Tests
- Timeline renders chronologically
- Events clickable
- Filtering works

### Documentation
- Timeline documentation

### Acceptance Criteria
- [ ] Timeline renders
- [ ] Events clickable
- [ ] Filtering works

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-011 — Findings View

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Build findings display with verification status.
**Why:** Users need to review AI-generated findings.

### Dependencies
T5-002, T4-011

### Inputs
- Layout, Findings API, Verification API

### Outputs
- `apps/web/app/investigations/[id]/findings/page.tsx`
- Finding card component
- Verification status display
- Unit tests

### Allowed Files
- `apps/web/app/investigations/[id]/findings/`
- `apps/web/components/findings/`

### Do Not Modify
- Other pages

### Implementation Guidance
1. List findings with confidence scores
2. Show verification status
3. Show linked evidence
4. Verify/reject actions (for authorized users)

### AI Instructions
Ask AI to explain findings display patterns.

### Tests
- Findings displayed
- Verification status shown
- Actions work

### Documentation
- Findings documentation

### Acceptance Criteria
- [ ] Findings displayed
- [ ] Verification status shown
- [ ] Actions work

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-012 — Verification View

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Build verification workflow UI for human review of AI findings.
**Why:** Humans must review and verify AI findings.

### Dependencies
T5-011, T4-013

### Inputs
- Findings view, Review state API

### Outputs
- Verification workflow component
- Review actions
- Unit tests

### Allowed Files
- `apps/web/components/findings/`
- `apps/web/components/verification/`

### Do Not Modify
- Findings page

### Implementation Guidance
1. Show findings requiring review
2. Approve/reject/needs-info actions
3. Comment input
4. Reviewer attribution

### AI Instructions
Ask AI to explain review workflow UI patterns.

### Tests
- Review actions work
- Comments saved
- Status updated

### Documentation
- Verification workflow documentation

### Acceptance Criteria
- [ ] Review actions work
- [ ] Comments saved
- [ ] Status updated

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-013 — Report Generation

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Build report generation service.
**Why:** Reports are the final output of an investigation.

### Dependencies
T5-002, T1-018, T3-014, T4-011

### Inputs
- All data APIs

### Outputs
- `services/reporting/src/services/report-generator.ts`
- Report page
- Unit tests

### Allowed Files
- `services/reporting/src/services/`
- `apps/web/app/investigations/[id]/report/`

### Do Not Modify
- Other services

### Implementation Guidance
1. Generate report sections: Executive Summary, Methodology, Evidence, Entities, Graph, Timeline, Findings, Verification, Audit Trail
2. Markdown format (MVP)
3. Include all investigation data

### AI Instructions
Ask AI to explain report generation patterns.

### Tests
- Report generated
- All sections included
- Markdown valid

### Documentation
- Report format documentation

### Acceptance Criteria
- [ ] Report generated
- [ ] All sections included
- [ ] Markdown valid

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-014 — Report Export

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Implement report export functionality.
**Why:** Users need to export reports for sharing and archival.

### Dependencies
T5-013

### Inputs
- Report generator

### Outputs
- `services/reporting/src/export/markdown-export.ts`
- Download endpoint
- Unit tests

### Allowed Files
- `services/reporting/src/export/`

### Do Not Modify
- Report generator

### Implementation Guidance
1. Export as Markdown file
2. API endpoint for download
3. Content-Type headers
4. Filename convention

### AI Instructions
Ask AI to explain file export patterns.

### Tests
- Export produces valid Markdown
- Download works
- Filename correct

### Documentation
- Export documentation

### Acceptance Criteria
- [ ] Export works
- [ ] Download works
- [ ] Valid Markdown

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-015 — Error/Loading States

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Implement consistent error and loading states across all pages.
**Why:** Good UX requires clear feedback during loading and errors.

### Dependencies
T5-002

### Inputs
- Application layout

### Outputs
- Error boundary component
- Loading skeleton components
- Unit tests

### Allowed Files
- `apps/web/components/ui/`

### Do Not Modify
- Page files

### Implementation Guidance
1. Global error boundary
2. Loading skeletons for each page type
3. Empty state components
4. Retry actions

### AI Instructions
Ask AI to explain React error boundary patterns.

### Tests
- Error boundary catches errors
- Loading states display
- Empty states display

### Documentation
- Error handling documentation

### Acceptance Criteria
- [ ] Error boundary works
- [ ] Loading states work
- [ ] Empty states work

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-016 — Accessibility

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Ensure WCAG 2.1 AA accessibility compliance.
**Why:** Accessibility ensures the product is usable by everyone.

### Dependencies
T5-002

### Inputs
- All pages

### Outputs
- Accessibility fixes
- ARIA labels
- Keyboard navigation

### Allowed Files
- All `apps/web/` files

### Do Not Modify
- Backend services

### Implementation Guidance
1. ARIA labels on interactive elements
2. Keyboard navigation for all features
3. Color contrast compliance
4. Screen reader compatibility
5. Focus management

### AI Instructions
Ask AI to explain WCAG 2.1 AA requirements.

### Tests
- Keyboard navigation works
- ARIA labels present
- Color contrast passes

### Documentation
- Accessibility documentation

### Acceptance Criteria
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Contrast passes

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-017 — E2E Tests

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Write end-to-end tests for critical user flows.
**Why:** E2E tests verify the complete user experience.

### Dependencies
T5-002 through T5-016

### Inputs
- All frontend pages

### Outputs
- Playwright test suite
- Test fixtures

### Allowed Files
- `tests/e2e/`

### Do Not Modify
- Source files

### Implementation Guidance
1. Test: Create case → Create investigation → View results
2. Test: Navigation flows
3. Test: Error states
4. Test: Loading states

### AI Instructions
Ask AI to explain Playwright E2E testing patterns.

### Tests
- Critical flows covered
- Tests deterministic
- Tests run in CI

### Documentation
- E2E test setup

### Acceptance Criteria
- [ ] Critical flows covered
- [ ] Tests deterministic
- [ ] Tests run in CI

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-018 — Product Integration Tests

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Write integration tests for frontend API interactions.
**Why:** Integration tests verify frontend-backend communication.

### Dependencies
T5-017

### Inputs
- All frontend pages

### Outputs
- Integration test suite
- MSW mock handlers

### Allowed Files
- `tests/integration/frontend/`

### Do Not Modify
- Source files

### Implementation Guidance
1. Mock API responses with MSW
2. Test data fetching
3. Test error handling
4. Test form submissions

### AI Instructions
Ask AI to explain MSW mocking patterns.

### Tests
- API interactions tested
- Error handling tested
- Mocks work correctly

### Documentation
- Integration test setup

### Acceptance Criteria
- [ ] API interactions tested
- [ ] Error handling tested
- [ ] Mocks work

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`

---

## T5-019 — Documentation

**Team:** Team 5 — Product + Frontend + Reporting
**Objective:** Write documentation for frontend setup, routing, and components.
**Why:** Clear documentation helps developers work on the frontend.

### Dependencies
T5-018

### Inputs
- All frontend code

### Outputs
- Frontend setup guide
- Routing documentation
- Component documentation
- Deployment guide

### Allowed Files
- `docs/product/`

### Do Not Modify
- Source files

### Implementation Guidance
1. Document Next.js setup and configuration
2. Document page routing
3. Document component library
4. Document deployment to Vercel

### AI Instructions
Ask AI to explain frontend documentation best practices.

### Tests
- Documentation accurate
- Examples work

### Documentation
- This IS the documentation task

### Acceptance Criteria
- [ ] Setup guide complete
- [ ] Routing documented
- [ ] Components documented

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/5-product`
