# Team 5 — Product + Frontend + Reporting + QA

## Mission

Create the usable investigation product. The frontend makes the platform accessible to analysts, and the reporting service produces investigation outputs.

---

## Responsibilities

- Dashboard (case list, investigation overview)
- Case creation UI
- Investigation creation and objective intake UI
- Investigation progress tracking UI
- Evidence viewer
- Entity viewer
- Graph visualization
- Timeline visualization
- Findings display
- Verification state display
- Report generation and export
- E2E tests
- UX testing
- Deployment testing

---

## Owned Directories

```
apps/web/                — Next.js frontend application
services/reporting/      — Report generation, export
tests/e2e/               — End-to-end tests
docs/product/            — Product documentation
```

---

## Technology Stack

| Component | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| State Management | React Query / TanStack Query |
| Graph Visualization | D3.js or react-force-graph |
| Timeline | Custom React component |
| Testing | Playwright (E2E), Vitest (unit) |

---

## Key Pages

| Page | Route | Description |
|---|---|---|
| Dashboard | `/` | Case list, recent investigations |
| Case Detail | `/cases/:id` | Case info, linked investigations |
| New Case | `/cases/new` | Case creation form |
| Investigation | `/investigations/:id` | Investigation overview, progress |
| New Investigation | `/investigations/new` | Objective intake form |
| Evidence | `/investigations/:id/evidence` | Evidence list and detail |
| Entities | `/investigations/:id/entities` | Entity list and detail |
| Graph | `/investigations/:id/graph` | Relationship graph visualization |
| Timeline | `/investigations/:id/timeline` | Temporal timeline |
| Findings | `/investigations/:id/findings` | AI findings and verification |
| Report | `/investigations/:id/report` | Report view and export |
| Settings | `/settings` | User settings, AI config |

---

## Report Format (MVP)

The report service generates:

1. **Executive Summary** — investigation objective and key findings
2. **Methodology** — sources used, collection approach
3. **Evidence Catalog** — all evidence items with metadata
4. **Entity Profile** — extracted entities with attributes
5. **Relationship Map** — graph summary
6. **Timeline** — chronological events
7. **Findings** — AI-assisted analysis with confidence
8. **Verification** — contradictions and resolution status
9. **Audit Trail** — replay manifest of all actions

Export formats: Markdown (MVP), PDF (future)

---

## Dependencies

- Team 1: All core APIs (Case, Investigation, Evidence)
- Team 2: Connector health, collection status
- Team 3: Entity API, Graph API, Timeline API
- Team 4: AI findings, verification status

## Dependents

- None (Team 5 is the final consumer)

---

## API Consumption

Team 5 consumes all backend APIs but does NOT own any backend services. It is purely a frontend + reporting consumer.

---

## Testing Strategy

- Unit tests for React components
- Integration tests for API interactions (MSW mocking)
- E2E tests with Playwright (critical user flows)
- Visual regression tests (future)
- Accessibility tests (WCAG 2.1 AA)

---

## Deployment

- Vercel (production)
- Docker (local development)
- Environment variables for API URL configuration
