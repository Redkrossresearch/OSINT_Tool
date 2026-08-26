# Milestones

**Target:** September 19, 2026 — MVP Release

---

## Milestone 1: Contracts

**Target:** Week 1-2
**Owner:** Team 1

### Deliverables
- [ ] Shared schema package (`packages/schemas/`)
- [ ] Case, Investigation, Objective, Evidence, Observation schemas
- [ ] Source and Provenance schemas
- [ ] Audit Event schema
- [ ] Entity type definitions
- [ ] Relationship type definitions
- [ ] Zod validation for all schemas
- [ ] Schema documentation

### Exit Criteria
- All schemas published and importable
- All teams can code against schemas
- Schema tests pass

---

## Milestone 2: Core + Evidence

**Target:** Week 2-4
**Owner:** Team 1

### Deliverables
- [ ] PostgreSQL + Prisma setup
- [ ] Database migrations
- [ ] Case CRUD service + API
- [ ] Investigation lifecycle (state machine)
- [ ] Evidence storage + hashing
- [ ] Provenance tracking
- [ ] Audit event system
- [ ] Core unit tests

### Exit Criteria
- All core APIs functional
- Database operations work
- Evidence integrity verified
- Unit tests pass

---

## Milestone 3: Collection

**Target:** Week 2-4
**Owner:** Team 2

### Deliverables
- [ ] Connector interface + framework
- [ ] Connector registry + health
- [ ] Rate limiting
- [ ] Timeout/retry handling
- [ ] Web search connector
- [ ] Web fetch connector
- [ ] DNS/RDAP connector
- [ ] Certificate intelligence connector
- [ ] GitHub public connector
- [ ] Normalization pipeline

### Exit Criteria
- All connectors produce valid Observations
- Rate limiting works
- Health checks work
- No paid API keys required

---

## Milestone 4: Intelligence + Graph

**Target:** Week 3-5
**Owner:** Team 3

### Deliverables
- [ ] Entity extraction
- [ ] Entity normalization
- [ ] Entity resolution
- [ ] Relationship extraction
- [ ] Graph storage (PostgreSQL)
- [ ] Graph queries (traversal, path, neighborhood)
- [ ] Graph API
- [ ] Entity API
- [ ] Timeline service + API

### Exit Criteria
- Observations → Entities pipeline works
- Graph queries return correct results
- Entity resolution has confidence scores
- No silent entity merges

---

## Milestone 5: AI + Verification

**Target:** Week 3-6
**Owner:** Team 4

### Deliverables
- [ ] Model abstraction layer
- [ ] Ollama provider
- [ ] Model fallback chain (no paid APIs)
- [ ] Prompt management system
- [ ] Planner agent
- [ ] Analysis agent
- [ ] Correlation agent
- [ ] Supervisor agent
- [ ] Contradiction detection
- [ ] Verification workflow
- [ ] AI audit logging
- [ ] Safety controls
- [ ] Prompt injection defenses

### Exit Criteria
- AI pipeline runs end-to-end
- No paid API dependencies
- All AI actions logged
- Bounding rules enforced
- Prompt injection defenses active

---

## Milestone 6: Product

**Target:** Week 4-7
**Owner:** Team 5

### Deliverables
- [ ] Next.js application
- [ ] Dashboard
- [ ] Case creation
- [ ] Investigation creation
- [ ] Investigation status
- [ ] Evidence viewer
- [ ] Entity viewer
- [ ] Graph visualization
- [ ] Timeline
- [ ] Findings view
- [ ] Verification view
- [ ] Report generation
- [ ] Report export (Markdown)
- [ ] Error/loading states
- [ ] Accessibility

### Exit Criteria
- All pages functional
- API integration works
- Loading/error states work
- WCAG 2.1 AA compliance

---

## Milestone 7: Integration

**Target:** Week 6-8
**Owner:** All Teams

### Deliverables
- [ ] Cross-team integration testing
- [ ] Full pipeline: Objective → Collection → Intelligence → AI → Findings → Report
- [ ] Performance testing
- [ ] Bug fixes

### Exit Criteria
- Full pipeline works end-to-end
- No critical bugs
- Performance acceptable

---

## Milestone 8: Security + QA

**Target:** Week 8-9
**Owner:** Technical Architect + All Teams

### Deliverables
- [ ] Security audit
- [ ] Penetration testing
- [ ] SSRF protection verification
- [ ] Prompt injection testing
- [ ] Data integrity verification
- [ ] QA testing
- [ ] Bug fixes

### Exit Criteria
- No security vulnerabilities
- All QA tests pass
- Data integrity verified

---

## Milestone 9: Demo

**Target:** Week 9-10
**Owner:** Team 5 + All Teams

### Deliverables
- [ ] Demo scenario implementation
- [ ] Demo data
- [ ] Demo script
- [ ] Presentation materials

### Exit Criteria
- Demo runs successfully
- All features demonstrated
- Presentation ready

---

## Milestone 10: September 19 Release

**Target:** September 19, 2026
**Owner:** All

### Deliverables
- [ ] MVP deployed
- [ ] Documentation complete
- [ ] All tests passing
- [ ] No critical bugs
- [ ] Release notes

### Exit Criteria
- MVP is production-ready
- All milestones completed
- Team leads confirm readiness
- Technical architect confirms readiness
- CEO confirms acceptance
