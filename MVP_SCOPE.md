# MVP Scope — September 19, 2026

## Definition

The September 19 MVP is a **narrow vertical slice** of the RedKross OSINT Investigation Platform. It demonstrates the complete investigation workflow from objective intake through report generation using authorized public sources only.

## MVP Objective Types

1. Person
2. Domain
3. Company
4. IP

## In-Scope Capabilities

### 1. Case Management
- Create investigation case
- Case metadata (title, description, status, created date)
- Case listing and retrieval

### 2. Investigation Lifecycle
- Investigation creation tied to a case
- Investigation state machine (DRAFT → PLANNING → COLLECTING → ANALYZING → VERIFYING → COMPLETE)
- Investigation ID (UUID)
- Investigation timeline

### 3. Objective Intake
- Define investigation objective (type + target)
- Objective types: Person, Domain, Company, IP
- Objective validation
- Link objective to investigation

### 4. Authorized Public-Source Collection
- Public web/search collection
- Domain intelligence (DNS, RDAP)
- Public company intelligence (public records, websites)
- Public GitHub intelligence (public repositories, profiles)

### 5. Evidence Objects
- Evidence schema (id, type, source, content, metadata, hash, timestamp)
- Evidence metadata
- Evidence hashing (SHA-256)
- Evidence storage
- Evidence provenance chain

### 6. Observation Model
- Observation schema (derived from evidence)
- Source reference
- Confidence score
- Timestamp
- Relationship to evidence

### 7. Entity Extraction & Resolution
- Entity types: Person, Company, Domain, IP, Email, URL, Repository, Technology, Location
- Entity extraction from observations
- Entity normalization
- Entity resolution (same-entity detection)
- Confidence scores

### 8. Relationship Graph
- Relationship types: OWNS, WORKS_FOR, USES, HOSTED_ON, REGISTERED_TO, MENTIONS, ASSOCIATED_WITH, RESOLVES_TO
- Relationship extraction from observations
- Temporal relationships (valid_from, valid_to)
- Graph storage and querying
- Graph visualization (basic)

### 9. AI-Assisted Correlation
- Model abstraction (Ollama-first)
- Planner agent (decomposes objective into research tasks)
- Analysis agent (processes evidence, extracts insights)
- Correlation agent (finds connections across evidence)
- Supervisor agent (monitors pipeline, handles errors)
- Structured outputs from AI
- AI activity logging

### 10. Verification & Contradiction Detection
- Contradiction detection across evidence
- Confidence adjustment
- Verification status per finding
- Human review workflow

### 11. Investigation Timeline
- Temporal ordering of evidence and events
- Timeline visualization

### 12. Findings
- Findings generated from analysis
- Finding confidence scores
- Evidence references per finding
- Finding status (unverified, verified, contradicted)

### 13. Report Generation
- Investigation summary report
- Evidence listing
- Entity listing
- Relationship graph summary
- Findings summary
- Timeline summary
- Export format: Markdown (PDF export future)

### 14. Replay / Audit Manifest
- Full audit log of investigation actions
- Evidence chain of custody
- Action timestamps and actors
- Replay capability (reconstruct investigation state)

### 15. Authentication & Authorization
- Basic authentication (JWT tokens)
- Basic RBAC (admin, analyst, viewer roles)
- User management (CRUD)

### 16. Connector Infrastructure
- Connector framework/interface
- Connector registry
- Connector health monitoring
- Timeout, retry, rate limiting
- Normalization to observation schema

### 17. Automated Testing
- Unit tests per service
- Integration tests
- Contract tests between teams
- Test fixtures and mocks

### 18. Basic Security Controls
- Input validation
- SSRF prevention
- SQL injection prevention
- XSS prevention
- Rate limiting
- Secret scanning in CI
- No paid API keys in codebase

---

## Out-of-Scope for September 19

| Capability | Reason |
|---|---|
| Full FININT | Requires specialized data sources |
| DARKINT | Requires Tor/specialized infrastructure |
| Threat-email platform | Separate product scope |
| Full supply-chain digital twin | Complex multi-source integration |
| Hundreds of connectors | MVP uses 5 core connectors |
| Uncontrolled crawling | Security risk; MVP uses authorized sources only |
| Autonomous external actions | Safety concern; MVP is collection-only |
| Autonomous attribution | Ethical/legal concerns |
| Unauthorized access | Prohibited |
| Credential theft | Prohibited |
| Exploit capabilities | Prohibited |
| Private account access | Prohibited |
| Full enterprise multi-tenancy | Unless already implemented and stable |
| Every capability in long-term documents | Documented features ≠ MVP features |
| Full microservices architecture | MVP uses monolith or simple services |
| Agent swarms | MVP uses bounded pipeline |
| Country packs | Future roadmap |
| Advanced graph algorithms | MVP uses basic traversal |
| Real-time streaming | Future roadmap |
| Mobile application | Future roadmap |
| WebSocket live updates | Future roadmap |

---

## MVP Success Criteria

1. An analyst can create a case and define an objective
2. The system can collect authorized public-source data for that objective
3. Evidence is stored with full provenance and hash integrity
4. Entities are extracted and resolved
5. Relationships form a queryable graph
6. AI assists with correlation (local Ollama model)
7. Contradictions are flagged
8. A report can be generated
9. Full audit trail exists
10. System uses only free/local AI — no paid API charges

---

## Technology Stack (MVP)

| Layer | Technology |
|---|---|
| Frontend | React/Next.js (apps/web/) |
| Backend | Node.js/TypeScript |
| Database | PostgreSQL (via Prisma or Drizzle) |
| AI | Ollama (local) with fallback chain |
| Graph | PostgreSQL Lateral/CTE queries (not Neo4j for MVP) |
| Auth | JWT + bcrypt |
| Testing | Vitest + Playwright |
| CI/CD | GitHub Actions |
| Containerization | Docker + Docker Compose |
| Package Manager | pnpm (monorepo) |
