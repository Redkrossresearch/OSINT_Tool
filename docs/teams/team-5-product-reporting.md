# Team 5 — Product + Frontend + Reporting

## Mission

Turn the investigation engine into a usable product. The frontend makes the platform accessible to analysts, and the reporting service produces investigation outputs.

---

## Team Responsibilities

1. Dashboard
2. Case creation UI
3. Investigation creation UI
4. Objective intake UI
5. Investigation status display
6. Evidence viewer
7. Entity viewer
8. Graph visualization
9. Timeline visualization
10. Findings display
11. Verification status display
12. Report generation
13. Report export (Markdown)
14. UX design
15. Accessibility (WCAG 2.1 AA)
16. E2E testing

---

## Team Ownership

```
apps/web/                 — Next.js frontend application
services/reporting/       — Report generation, export
tests/e2e/                — End-to-end tests
docs/product/             — Product documentation
```

---

## Team Boundaries

### Team 5 OWNS

- All frontend code
- All UI components
- Report generation service
- Report export
- E2E tests
- Product documentation

### Team 5 DOES NOT OWN

- `services/core/` — Team 1
- `services/evidence/` — Team 1
- `packages/schemas/` — Team 1
- `connectors/` — Team 2
- `services/intelligence/` — Team 3
- `services/graph/` — Team 3
- `services/ai/` — Team 4
- `services/verification/` — Team 4

---

## What Team 5 Must NOT Modify

- Core schemas (`packages/schemas/`) without Team 1 review
- Database migrations (Team 1 only)
- Connector implementations (`connectors/`)
- AI agent code (`services/ai/`)
- Entity/graph logic (`services/intelligence/`, `services/graph/`)
- Evidence storage logic (Team 1 only)
- Verification logic (Team 4 only)

---

## Dependencies

| Dependency | Provider | What |
|---|---|---|
| Case API | Team 1 | Case CRUD |
| Investigation API | Team 1 | Investigation lifecycle |
| Evidence API | Team 1 | Evidence data |
| Entity API | Team 3 | Entity data |
| Graph API | Team 3 | Relationship data |
| Timeline API | Team 3 | Timeline data |
| Findings API | Team 4 | AI findings |
| Verification API | Team 4 | Verification status |
| Connector health | Team 2 | Collection status |

---

## Dependents

None. Team 5 is the final consumer.

---

## Interfaces With Other Teams

### Outgoing (Team 5 provides)

None. Team 5 is purely a consumer.

### Incoming (Team 5 receives)

| Interface | Provider | Description |
|---|---|---|
| Case API | Team 1 | Case data |
| Investigation API | Team 1 | Investigation data |
| Evidence API | Team 1 | Evidence data |
| Entity API | Team 3 | Entity data |
| Graph API | Team 3 | Graph data |
| Timeline API | Team 3 | Timeline data |
| Findings API | Team 4 | AI findings |
| Verification API | Team 4 | Verification status |
| Connector health | Team 2 | Collection status |

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
| E2E Testing | Playwright |
| Unit Testing | Vitest |

---

## Key Pages

| Page | Route | Description |
|---|---|---|
| Dashboard | `/` | Case list, recent investigations |
| New Case | `/cases/new` | Case creation form |
| Case Detail | `/cases/:id` | Case info, linked investigations |
| New Investigation | `/investigations/new` | Objective intake form |
| Investigation | `/investigations/:id` | Overview, progress, state |
| Evidence | `/investigations/:id/evidence` | Evidence list and detail |
| Entities | `/investigations/:id/entities` | Entity list and detail |
| Graph | `/investigations/:id/graph` | Relationship graph visualization |
| Timeline | `/investigations/:id/timeline` | Temporal timeline |
| Findings | `/investigations/:id/findings` | AI findings and verification |
| Report | `/investigations/:id/report` | Report view and export |

---

## Task List

See `docs/tasks/team-5-product.md` for the complete task list.

| Task | Title | Difficulty |
|---|---|---|
| T5-001 | Next.js application | Medium |
| T5-002 | Application layout | Medium |
| T5-003 | Dashboard | Medium |
| T5-004 | Case creation | Medium |
| T5-005 | Investigation creation | Medium |
| T5-006 | Objective intake | Medium |
| T5-007 | Investigation status | Easy |
| T5-008 | Evidence viewer | Medium |
| T5-009 | Entity viewer | Medium |
| T5-010 | Graph view | Hard |
| T5-011 | Timeline | Medium |
| T5-012 | Findings view | Medium |
| T5-013 | Verification view | Medium |
| T5-014 | Report generation | Hard |
| T5-015 | Report export | Medium |
| T5-016 | Error/loading states | Medium |
| T5-017 | Accessibility | Medium |
| T5-018 | E2E tests | Hard |
| T5-019 | Product integration tests | Hard |
| T5-020 | Documentation | Easy |

---

## Git Workflow

1. Feature branch from `team/5-product`
2. Implement feature
3. Write tests
4. Self-review
5. PR to `team/5-product`
6. Team lead reviews
7. Merge to `team/5-product`
8. Technical architect reviews `team/5-product` → `main`

**Never push directly to `main`.**

---

## Testing Expectations

- Unit tests for React components
- Integration tests for API interactions (MSW mocking)
- E2E tests with Playwright (critical user flows)
- Accessibility tests (WCAG 2.1 AA)
- Loading/error state tests

---

## Documentation Expectations

- Component documentation
- Page routing guide
- API consumption guide
- Setup instructions
- Deployment guide

---

## Security Rules

- No secrets in frontend code
- No API keys in client-side bundles
- Environment variables for API URL only
- No sensitive data in URLs
- XSS protection via React defaults
- CSRF protection where applicable

---

## AI Coding Rules

- Use OpenCode + Ollama (free/local only)
- No paid AI APIs
- AI explains before modifying
- AI suggests implementation plan first
- Human reviews all AI output
- AI never decides UI/UX alone without human approval
- AI never introduces analytics or tracking without approval

---

## Definition of Done

- [ ] Code compiles with TypeScript strict mode
- [ ] All tests pass
- [ ] Pages load without errors
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Accessibility standards met
- [ ] Documentation updated
- [ ] PR reviewed and approved
- [ ] No secrets in client bundle

---

## Current Team Members

Head Intern: Isha Uparkar (`Ishauparkar13`)

| Member | Role | Task Allocations |
|---|---|---|
| Ishauparkar13 | Head Intern | T5-001, T5-002 |
| aryanbhosale20 | Intern | T5-003, T5-004, T5-005 |
| dakshjadyar | Intern | T5-006, T5-007, T5-015 |
| Deepkasare | Intern | T5-008, T5-009, T5-010 |
| krishnasondigala-sys | Intern | T5-011, T5-012, T5-013, T5-014 |
| khushishukla3008 | PENDING VERIFICATION | |
