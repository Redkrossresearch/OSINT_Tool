# Team 2 — Connectors + Public Collection

## Mission

Collect authorized public information and normalize it into the common observation/evidence model. Each connector is a bounded, testable module that ingests data from one source type.

---

## Team Responsibilities

1. Connector interface definition
2. Connector registry and discovery
3. Connector lifecycle management
4. Public web collection
5. Public search collection
6. DNS/RDAP lookup
7. Certificate intelligence (CT logs)
8. GitHub public intelligence
9. Data normalization to Observation schema
10. Rate limiting
11. Timeout handling
12. Retry with exponential backoff
13. Connector error handling
14. Connector health monitoring
15. Collection logging
16. Connector tests
17. Connector documentation

---

## Team Ownership

```
connectors/                    — Connector implementations (web-search, dns-rdap, etc.)
services/connectors/           — Connector orchestration, registry, health
docs/connectors/               — Connector documentation
```

---

## Team Boundaries

### Team 2 OWNS

- All connector implementations
- Connector framework (interface, base class, registry)
- Connector configuration
- Connector health monitoring
- Rate limiting logic
- Normalization pipeline

### Team 2 DOES NOT OWN

- `services/core/` — Team 1
- `services/evidence/` — Team 1
- `packages/schemas/` — Team 1 (Team 2 can propose changes via PR)
- `services/intelligence/` — Team 3
- `services/ai/` — Team 4
- `apps/web/` — Team 5

---

## What Team 2 Must NOT Modify

- Core schemas (`packages/schemas/`) without Team 1 review
- Database migrations (Team 1 only)
- Evidence storage logic (Team 1 only)
- AI agent code (`services/ai/`)
- Frontend code (`apps/web/`)
- Graph or entity logic (`services/graph/`, `services/intelligence/`)

---

## Dependencies

| Dependency | Provider | What |
|---|---|---|
| Observation schema | Team 1 | Output format for all connectors |
| Evidence schema | Team 1 | How evidence is structured |
| Objective schema | Team 1 | Input format for collection |
| Source schema | Team 1 | Source reference format |

---

## Dependents

| Team | What They Consume |
|---|---|
| Team 3 (Intelligence) | Observations from connectors |
| Team 4 (AI) | Observations for analysis |
| Team 5 (Product) | Connector health, collection status |

---

## Interfaces With Other Teams

### Outgoing (Team 2 provides)

| Interface | Consumer | Description |
|---|---|---|
| Observations | Team 3, Team 4 | Normalized data from public sources |
| Connector health | Team 5 | Health status of all connectors |
| Collection logs | Team 5 | Activity and progress |

### Incoming (Team 2 receives)

| Interface | Provider | Description |
|---|---|---|
| Objective | Team 1 | What to investigate |
| Observation schema | Team 1 | How to format output |
| Connector triggers | Team 4 | AI-planned research tasks |

---

## Initial Connectors

| # | Connector | Source | API Key Required |
|---|---|---|---|
| 1 | Public web search | DuckDuckGo HTML | No |
| 2 | Public web fetch | Web pages | No |
| 3 | DNS/RDAP | Public DNS + RDAP servers | No |
| 4 | Certificate intelligence | crt.sh (CT logs) | No |
| 5 | GitHub public | GitHub REST API v3 | No |

**All connectors use public, authorized sources only.**

---

## Task List

See `docs/tasks/team-2-connectors.md` for the complete task list.

| Task | Title | Difficulty |
|---|---|---|
| T2-001 | Connector interface | Hard |
| T2-002 | Connector result contract | Medium |
| T2-003 | Connector registry | Medium |
| T2-004 | Connector configuration | Easy |
| T2-005 | Public web connector | Hard |
| T2-006 | Public search connector | Hard |
| T2-007 | DNS/RDAP connector | Hard |
| T2-008 | Certificate intelligence connector | Medium |
| T2-009 | GitHub public connector | Medium |
| T2-010 | Normalization pipeline | Hard |
| T2-011 | Rate limiting | Medium |
| T2-012 | Timeout/retry handling | Medium |
| T2-013 | Connector health | Medium |
| T2-014 | Connector logging | Easy |
| T2-015 | Connector security validation | Hard |
| T2-016 | Unit tests | Medium |
| T2-017 | Integration tests | Hard |
| T2-018 | Connector documentation | Easy |

---

## Git Workflow

1. Feature branch from `team/2-connectors`
2. Implement connector
3. Write tests
4. Self-review
5. PR to `team/2-connectors`
6. Team lead reviews
7. Merge to `team/2-connectors`
8. Technical architect reviews `team/2-connectors` → `main`

**Never push directly to `main`.**

---

## Testing Expectations

- Unit tests per connector (mock HTTP)
- Integration tests against live public sources (rate-limited)
- Contract tests against Observation schema
- Health check tests
- Timeout/retry tests
- SSRF protection tests

---

## Documentation Expectations

- Each connector has a README
- Configuration guide
- Rate limit documentation
- Error handling guide
- Source reliability notes

---

## Security Rules

- No credential theft
- No private account access
- No unauthorized access
- No exploit development
- No malware
- No bypass techniques
- No illegal surveillance
- All connectors respect authorization
- All connectors respect rate limits
- SSRF protection on all URL handling
- Safe URL parsing (no internal IP access)
- Timeouts on all external requests
- Resource limits enforced

---

## AI Coding Rules

- Use OpenCode + Ollama (free/local only)
- No paid AI APIs
- AI explains before modifying
- AI suggests implementation plan first
- Human reviews all AI output
- AI never implements unauthorized access patterns
- AI never bypasses rate limits
- AI never introduces credential handling

---

## Definition of Done

- [ ] Code compiles with TypeScript strict mode
- [ ] All tests pass
- [ ] Rate limiting works
- [ ] Timeout handling works
- [ ] No paid API keys required
- [ ] No unauthorized access patterns
- [ ] Documentation updated
- [ ] PR reviewed and approved
- [ ] Connector produces valid Observations

---

## Current Team Members

Head Intern: Riddhi Sawant (`riddhisawant305-jpg`)

| Member | Role | Task Allocations |
|---|---|---|
| riddhisawant305-jpg | Head Intern | T2-001, T2-002 |
| yadavchinmay45-cloud | Intern | T2-005, T2-006 |
| AaryanDhotre2326 | Intern | T2-007, T2-008 |
| antarahire22-creator | Intern | T2-009, T2-010 |
| darshankamble0628-coder | Intern | T2-003, T2-004, T2-011, T2-012 |
