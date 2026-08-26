# GLOBAL TASK SEQUENCE — OSINT Investigation Platform

> **Version:** 1.0  
> **Date:** 2026-08-26  
> **Total Tasks:** 97 | **Total Effort:** 168 person-days | **Parallel Waves:** 11  
> **Estimated Duration:** 60 working days (12 weeks)

---

## EXECUTIVE SUMMARY

| Metric | Value |
|--------|-------|
| Total Tasks | 97 |
| Total Effort (person-days) | 168 |
| Parallel Waves | 11 |
| Estimated Duration | ~60 working days |
| Teams | 5 |
| Interns | 25 |
| Critical Path Length | 12 tasks |

### Tasks & Effort by Team

| Team | Domain | Tasks | Interns | Effort (days) |
|------|--------|------:|--------:|--------------:|
| Team 1 | Infrastructure & Schemas | 22 | 5 | 28 |
| Team 2 | Connector System | 18 | 5 | 33 |
| Team 3 | Entity & Graph Intelligence | 18 | 6 | 34 |
| Team 4 | AI Engine | 20 | 4 | 34 |
| Team 5 | Frontend & UI | 19 | 5 | 39 |
| **Total** | | **97** | **25** | **168** |

### Highest Fan-Out Tasks (Most Critical)

| Rank | Task | Title | Transitive Dependents | Risk |
|------|------|-------|----------------------:|------|
| 1 | T1-001 | Repository/Monorepo Foundation | 53 | Highest |
| 2 | T1-008 | Observation Schema | 45 | Critical |
| 3 | T1-003 | Shared Zod Schema Package | 42 | Critical |
| 4 | T4-001 | Model Abstraction | 23 | High |
| 5 | T5-002 | Application Layout | 15 | High |

---

## CRITICAL PATH ANALYSIS

The following paths represent the longest dependency chains and determine the minimum project duration:

```
PATH A (Core Infrastructure — 12 tasks):
T1-001 → T1-002 → T1-003 → T1-005 → T1-013 → T1-015 → T1-016 → T1-017 → T1-019 → T1-020 → T1-021 → T1-022

PATH B (Connector Chain — 10 tasks):
T1-001 → T1-002 → T1-003 → T1-008 → T2-001 → T2-003 → T2-013
T1-001 → T1-002 → T1-003 → T1-008 → T2-001 → [connectors] → T2-016 → T2-017 → T2-018

PATH C (Entity Resolution — 8 tasks):
T1-001 → T1-002 → T1-003 → T1-008 → T3-003 → T3-005 → T3-015

PATH D (AI Engine — 8 tasks):
T1-001 → T1-002 → T1-003 → T4-001 → T4-007 → T4-018 → T4-019 → T4-020
```

**Longest path:** PATH A — **12 tasks** (determines minimum 60-day timeline).

---

## WAVE-BY-WAVE EXECUTION PLAN

---

### WAVE 1 — Foundation (Day 1–2)

> **Objective:** Establish the monorepo root and version control structure.  
> **Parallel Capacity:** 1 task | **Wave Effort:** 2 days

| Seq | Task ID | Team | Title | Primary Owner | Team Head | Dependencies | Status | Effort | Blocks | Next Task | Acceptance Criteria |
|-----|---------|------|-------|---------------|-----------|-------------|--------|--------|--------|-----------|---------------------|
| 1 | T1-001 | T1 | Repository/Monorepo Foundation | Preetam-06 | Preetam-06 | None | NOT STARTED | 2 | T1-002, T1-015 | T1-002 | Monorepo initialized with Turborepo, Git hooks, CI skeleton, and root `package.json` |

---

### WAVE 2 — Configuration (Day 2–4)

> **Objective:** Configure workspace structure and shared packages.  
> **Parallel Capacity:** 1 task | **Wave Effort:** 1 day

| Seq | Task ID | Team | Title | Primary Owner | Team Head | Dependencies | Status | Effort | Blocks | Next Task | Acceptance Criteria |
|-----|---------|------|-------|---------------|-----------|-------------|--------|--------|--------|-----------|---------------------|
| 2 | T1-002 | T1 | Workspace/Package Configuration | Preetam-06 | Preetam-06 | T1-001 | NOT STARTED | 1 | T1-003 | T1-003 | All workspace packages scaffolded: `@osint/schemas`, `@osint/connectors`, `@osint/core`, `@osint/ai`, `@osint/frontend`; shared tsconfig, eslint, prettier |

---

### WAVE 3 — Schema Foundation (Day 4–8)

> **Objective:** Establish the shared Zod schema package — the single most depended-upon component (42 downstream tasks).  
> **Parallel Capacity:** 1 task | **Wave Effort:** 2 days

| Seq | Task ID | Team | Title | Primary Owner | Team Head | Dependencies | Status | Effort | Blocks | Next Task | Acceptance Criteria |
|-----|---------|------|-------|---------------|-----------|-------------|--------|--------|--------|-----------|---------------------|
| 3 | T1-003 | T1 | Shared Zod Schema Package | Dinesh-Kumar-Ved | Dinesh-Kumar-Ved | T1-002 | NOT STARTED | 2 | T1-004, T1-006, T1-007, T1-010, T3-001, T4-001, T5-001 | T1-004 | `@osint/schemas` package published with base Zod types, validation utilities, and type exports; all downstream teams can import |

---

### WAVE 4 — Schema Expansion (Day 6–12)

> **Objective:** Build out all domain schemas in parallel; unblock connector, entity, AI, and frontend teams.  
> **Parallel Capacity:** 7 tasks | **Wave Effort:** 11 days (parallelized)

| Seq | Task ID | Team | Title | Primary Owner | Team Head | Dependencies | Status | Effort | Blocks | Next Task | Acceptance Criteria |
|-----|---------|------|-------|---------------|-----------|-------------|--------|--------|--------|-----------|---------------------|
| 4 | T1-004 | T1 | Case Schema | Dinesh-Kumar-Ved | Dinesh-Kumar-Ved | T1-003 | NOT STARTED | 1 | T1-005, T1-015 | T1-005 | Case entity Zod schema with status enums, assignee, priority, timestamps; fully typed |
| 5 | T1-005 | T1 | Investigation Schema | ANDY15K | ANDY15K | T1-003, T1-004 | NOT STARTED | 2 | T1-013, T1-014, T1-015, T4-007, T5-005 | T1-013 | Investigation schema with case linkage, status lifecycle, objective references, and nested objective array |
| 6 | T1-007 | T1 | Source Schema | Zrahul2024 | Zrahul2024 | T1-003 | NOT STARTED | 1 | T1-008, T1-009 | T1-008 | Source entity schema with type classification, reliability scoring, access metadata |
| 7 | T1-008 | T1 | Observation Schema | Zrahul2024 | Zrahul2024 | T1-003, T1-007 | NOT STARTED | 2 | T2-001, T3-003, T3-007 | T2-001 | Observation schema linking sources to evidence; includes observation type, confidence, and temporal data — **CRITICAL: unblocks all Team 2 and Team 3 downstream** |
| 8 | T1-009 | T1 | Evidence Schema | jadhavsarthak374-ai | jadhavsarthak374-ai | T1-003, T1-007 | NOT STARTED | 2 | T1-011, T1-012, T1-015, T4-008, T4-010 | T1-011 | Evidence schema with content types, hash fields, provenance chain, and admissibility flags |
| 9 | T1-010 | T1 | Evidence Provenance Model | Zrahul2024 | Zrahul2024 | T1-003 | NOT STARTED | 1 | T1-015 | — | Provenance chain schema: collector, collection method, chain-of-custody timestamps, integrity hashes |
| 10 | T3-001 | T3 | Entity Schema | hirveabhishek2006-design | hirveabhishek2006-design | T1-003 | NOT STARTED | 2 | T3-002, T3-003, T3-004, T3-006, T3-007 | T3-002 | Entity types (Person, Organization, Location, Event, etc.) with attributes, aliases, and confidence scoring |
| 11 | T4-001 | T4 | Model Abstraction | sumeetmore334-rgb | sumeetmore334-rgb | T1-003 | NOT STARTED | 2 | T4-002, T4-003, T4-005, T4-006, T4-007, T4-008, T4-010, T4-012, T4-014, T4-015, T4-016 | T4-002 | Abstract LLM provider interface with `generate()`, `embed()`, streaming support; pluggable provider architecture |
| 12 | T5-001 | T5 | Next.js Application | Ishauparkar13 | Ishauparkar13 | T1-003 | NOT STARTED | 2 | T5-002 | T5-002 | Next.js 14+ app scaffolded with App Router, Tailwind CSS, shadcn/ui, auth stub, and API route proxy |

---

### WAVE 5 — Entity/AI/Frontend Expansion (Day 10–16)

> **Objective:** Expand entity processing, AI providers, prompt systems, and frontend shell in parallel.  
> **Parallel Capacity:** 14 tasks | **Wave Effort:** 26 days (parallelized)

| Seq | Task ID | Team | Title | Primary Owner | Team Head | Dependencies | Status | Effort | Blocks | Next Task | Acceptance Criteria |
|-----|---------|------|-------|---------------|-----------|-------------|--------|--------|--------|-----------|---------------------|
| 13 | T1-013 | T1 | Audit Event Model | ANDY15K | ANDY15K | T1-003, T1-005 | NOT STARTED | 1 | T1-015, T3-013 | T1-015 | Audit event schema: actor, action, resource, timestamp, IP, diff payload |
| 14 | T1-014 | T1 | Investigation Lifecycle | ANDY15K | ANDY15K | T1-005 | NOT STARTED | 2 | T1-015 | T1-015 | State machine definitions: OPEN → IN_PROGRESS → REVIEW → CLOSED with transition guards and required fields |
| 15 | T1-011 | T1 | Evidence Hashing | jadhavsarthak374-ai | jadhavsarthak374-ai | T1-009 | NOT STARTED | 1 | T1-018 | T1-018 | SHA-256/BLAKE3 hashing utilities for evidence content; hash verification function |
| 16 | T3-002 | T3 | Entity Normalization | hirveabhishek2006-design | hirveabhishek2006-design | T3-001 | NOT STARTED | 2 | T3-005 | T3-005 | Normalization pipeline: name standardization, address parsing, date normalization, deduplication key generation |
| 17 | T3-003 | T3 | Entity Extraction | katkarsujal1-design | katkarsujal1-design | T3-001, T1-008 | NOT STARTED | 3 | T3-005 | T3-005 | NER pipeline extracting typed entities from raw observations; outputs Entity[] with confidence scores |
| 18 | T3-004 | T3 | Entity Confidence | katkarsujal1-design | katkarsujal1-design | T3-001 | NOT STARTED | 1 | T3-005 | T3-005 | Confidence scoring: source reliability × extraction confidence × corroboration factor |
| 19 | T3-006 | T3 | Relationship Schema | raunaksin9890-gif | raunaksin9890-gif | T3-001 | NOT STARTED | 1 | T3-007, T3-008 | T3-007 | Relationship types (employs, located_at, communicates_with, etc.) with direction, strength, and temporal bounds |
| 20 | T4-002 | T4 | Ollama Provider | sumeetmore334-rgb | sumeetmore334-rgb | T4-001 | NOT STARTED | 2 | T4-004 | T4-004 | Ollama provider implementing ModelAbstraction: local model inference, model listing, health check |
| 21 | T4-003 | T4 | Model Configuration | anujmore2006-collab | anujmore2006-collab | T4-001 | NOT STARTED | 1 | T4-004, T4-017 | T4-004 | Model config schema: provider selection, model name, temperature, max tokens, system prompt template |
| 22 | T4-005 | T4 | Prompt System | anujmore2006-collab | anujmore2006-collab | T4-001 | NOT STARTED | 2 | T4-006, T4-017 | T4-006 | Prompt template engine with variable interpolation, few-shot examples, and chain-of-thought scaffolding |
| 23 | T4-006 | T4 | Structured AI Output | Akash-Upade | Akash-Upade | T4-001 | NOT STARTED | 2 | T4-007, T4-008 | T4-007 | JSON schema output parsing with validation, retry on malformed output, type-safe response handling |
| 24 | T4-012 | T4 | Confidence Calculation | shraddhamahindrakar217-cloud | shraddhamahindrakar217-cloud | T4-001 | NOT STARTED | 2 | T4-011 | T4-011 | AI confidence scoring: token probability aggregation, calibration curves, uncertainty quantification |
| 25 | T4-015 | T4 | Prompt Injection Defenses | shraddhamahindrakar217-cloud | shraddhamahindrakar217-cloud | T4-001 | NOT STARTED | 2 | T4-016 | T4-016 | Input sanitization, instruction hierarchy enforcement, output boundary validation |
| 26 | T4-016 | T4 | AI Safety Controls | sumeetmore334-rgb | sumeetmore334-rgb | T4-001 | NOT STARTED | 2 | T4-011 | T4-011 | Content filtering, PII redaction, refusal logic, rate limiting per user/session |
| 27 | T5-002 | T5 | Application Layout | Ishauparkar13 | Ishauparkar13 | T5-001 | NOT STARTED | 2 | T5-003, T5-004, T5-005, T5-006, T5-007, T5-015, T5-016 | T5-003 | App shell: sidebar nav, top bar, breadcrumbs, responsive layout, route groups for /cases, /investigations, /evidence, /entities, /graph |

---

### WAVE 6 — Core Services + Connectors + Intelligence (Day 14–22)

> **Objective:** Build the database layer, all connectors, entity resolution, AI analysis agents, and graph schema — the largest parallel wave.  
> **Parallel Capacity:** 28 tasks | **Wave Effort:** 55 days (parallelized)

| Seq | Task ID | Team | Title | Primary Owner | Team Head | Dependencies | Status | Effort | Blocks | Next Task | Acceptance Criteria |
|-----|---------|------|-------|---------------|-----------|-------------|--------|--------|--------|-----------|---------------------|
| 28 | T1-012 | T1 | Evidence Metadata | Dinesh-Kumar-Ved | Dinesh-Kumar-Ved | T1-009 | NOT STARTED | 1 | T1-015 | T1-015 | Metadata extraction: file type detection, EXIF parsing, MIME classification, size/duration calculation |
| 29 | T1-015 | T1 | Database/Prisma Foundation | jadhavsarthak374-ai | jadhavsarthak374-ai | T1-001, T1-004, T1-005, T1-008, T1-009, T1-013 | NOT STARTED | 3 | T1-016, T3-008, T4-014 | T1-016 | Prisma schema with all entity models, migrations, seed data, connection pooling, and read replica config — **CRITICAL: blocks all service layers** |
| 30 | T2-001 | T2 | Connector Interface | riddhisawant305-jpg | riddhisawant305-jpg | T1-008 | NOT STARTED | 3 | T2-002, T2-003, T2-004, T2-005, T2-006, T2-007, T2-008, T2-009, T2-010, T2-011, T2-012, T2-014, T2-015 | T2-002 | Abstract `Connector` interface: `search()`, `fetch()`, `health()`, rate limit config, typed result contract |
| 31 | T2-002 | T2 | Connector Result Contract | riddhisawant305-jpg | riddhisawant305-jpg | T2-001, T1-008 | NOT STARTED | 2 | T2-005, T2-006, T2-007, T2-008, T2-009, T2-010 | T2-005 | Unified result type: `ConnectorResult<T>` with data, metadata, provenance, rate limit headers, error taxonomy |
| 32 | T2-003 | T2 | Connector Registry | darshankamble0628-coder | darshankamble0628-coder | T2-001 | NOT STARTED | 2 | T2-013 | T2-013 | Registry: register/unregister connectors, list by capability, health aggregation, plugin discovery |
| 33 | T2-004 | T2 | Connector Configuration | darshankamble0628-coder | darshankamble0628-coder | T2-001 | NOT STARTED | 1 | T2-005, T2-006, T2-007, T2-008, T2-009, T2-010 | T2-005 | Config schema: API keys, base URLs, rate limits, timeout, retry policy per connector; env var binding |
| 34 | T2-005 | T2 | Public Web Connector | yadavchinmay45-cloud | yadavchinmay45-cloud | T2-001, T1-008 | NOT STARTED | 2 | T2-016 | T2-016 | HTTP/HTTPS connector: headless fetch, robots.txt compliance, HTML parsing, response normalization |
| 35 | T2-006 | T2 | Public Search Connector | yadavchinmay45-cloud | yadavchinmay45-cloud | T2-001, T1-008 | NOT STARTED | 2 | T2-016 | T2-016 | Search API connector: query formulation, result pagination, snippet extraction, deduplication |
| 36 | T2-007 | T2 | DNS/RDAP Connector | AaryanDhotre2326 | AaryanDhotre2326 | T2-001, T1-008 | NOT STARTED | 2 | T2-016 | T2-016 | DNS lookup: A, AAAA, MX, NS, TXT, CNAME records; RDAP for domain registration data |
| 37 | T2-008 | T2 | Certificate Intelligence Connector | AaryanDhotre2326 | AaryanDhotre2326 | T2-001, T1-008 | NOT STARTED | 2 | T2-016 | T2-016 | CT log parsing: certificate transparency, subject alt names, issuer chain, expiry, key size |
| 38 | T2-009 | T2 | GitHub Public Connector | antarahire22-creator | antarahire22-creator | T2-001, T1-008 | NOT STARTED | 2 | T2-016 | T2-016 | GitHub API: user profiles, repos, commits, gists, org membership; rate limit aware |
| 39 | T2-010 | T2 | Normalization Pipeline | antarahire22-creator | antarahire22-creator | T2-001, T1-008 | NOT STARTED | 2 | T2-016 | T2-016 | Cross-connector normalization: field mapping, type coercion, deduplication, confidence assignment |
| 40 | T2-011 | T2 | Rate Limiting | darshankamble0628-coder | darshankamble0628-coder | T2-001 | NOT STARTED | 1 | T2-016 | T2-016 | Token bucket / sliding window rate limiter; per-connector and global limits; backpressure signals |
| 41 | T2-012 | T2 | Timeout/Retry Handling | darshankamble0628-coder | darshankamble0628-coder | T2-001 | NOT STARTED | 1 | T2-016 | T2-016 | Configurable timeouts, exponential backoff, jitter, circuit breaker pattern |
| 42 | T2-014 | T2 | Connector Logging | riddhisawant305-jpg | riddhisawant305-jpg | T2-001 | NOT STARTED | 1 | T2-016 | T2-016 | Structured logging: request/response, latency, error rates, correlation IDs |
| 43 | T2-015 | T2 | Connector Security Validation | riddhisawant305-jpg | riddhisawant305-jpg | T2-001 | NOT STARTED | 2 | T2-016 | T2-016 | SSRF protection, URL allowlisting, input sanitization, response content validation |
| 44 | T3-005 | T3 | Entity Resolution | raunaksin9890-gif | raunaksin9890-gif | T3-003, T3-004 | NOT STARTED | 3 | T3-015 | T3-015 | Fuzzy matching, ML-based deduplication, entity linking across sources, conflict resolution |
| 45 | T3-007 | T3 | Relationship Extraction | Pannkajyadhav333 | Pannkajyadhav333 | T3-001, T3-006, T1-008 | NOT STARTED | 3 | T3-008 | T3-008 | NLP-based relation extraction from observations; typed edges with confidence and temporal bounds |
| 46 | T3-008 | T3 | Graph Schema | Pannkajyadhav333 | Pannkajyadhav333 | T1-015, T3-001, T3-006 | NOT STARTED | 3 | T3-009, T3-012 | T3-009 | Property graph model: node types, edge types, properties, indexes, constraints |
| 47 | T3-012 | T3 | Temporal Relationships | Pannkajyadhav333 | Pannkajyadhav333 | T3-008 | NOT STARTED | 2 | T3-009 | T3-009 | Valid-from/valid-to timestamps on edges; temporal range queries; snapshot queries |
| 48 | T4-004 | T4 | Model Fallback | anujmore2006-collab | anujmore2006-collab | T4-001, T4-003 | NOT STARTED | 2 | T4-006 | T4-006 | Fallback chain: primary → secondary → local; health-based routing; graceful degradation |
| 49 | T4-007 | T4 | Investigation Planner | Akash-Upade | Akash-Upade | T4-001, T1-005 | NOT STARTED | 3 | T4-018 | T4-018 | AI-generated investigation plans: objective decomposition, task scheduling, resource estimation |
| 50 | T4-008 | T4 | Evidence Analysis | Akash-Upade | Akash-Upade | T4-001, T1-009 | NOT STARTED | 3 | T4-009, T4-018 | T4-009 | AI evidence analysis: relevance scoring, content summarization, entity extraction, anomaly detection |
| 51 | T4-010 | T4 | Contradiction Detection | shraddhamahindrakar217-cloud | shraddhamahindrakar217-cloud | T4-001, T1-009 | NOT STARTED | 3 | T4-011, T4-018 | T4-011 | Cross-evidence contradiction identification: logical inconsistency, temporal paradoxes, source conflicts |
| 52 | T4-014 | T4 | AI Audit Logging | shraddhamahindrakar217-cloud | shraddhamahindrakar217-cloud | T4-001, T1-015 | NOT STARTED | 2 | T4-018 | T4-018 | Full AI action audit: prompt hash, model version, token usage, response hash, latency, cost |
| 53 | T5-003 | T5 | Dashboard | aryanbhosale20 | aryanbhosale20 | T5-002, T1-017 | NOT STARTED | 2 | T5-017 | T5-017 | Overview dashboard: active cases, recent activity, entity count, risk indicators, charts |
| 54 | T5-004 | T5 | Case Creation | aryanbhosale20 | aryanbhosale20 | T5-002, T1-017 | NOT STARTED | 2 | T5-017 | T5-017 | Case creation form: title, description, priority, assignees; client-side validation; API integration |
| 55 | T5-005 | T5 | Investigation Creation | aryanbhosale20 | aryanbhosale20 | T5-002, T1-017, T1-005 | NOT STARTED | 2 | T5-017 | T5-017 | Investigation creation: link to case, define objectives, set scope, AI-assisted planning toggle |
| 56 | T5-006 | T5 | Investigation Status | dakshjadyar | dakshjadyar | T5-002, T1-017 | NOT STARTED | 2 | T5-017 | T5-017 | Status dashboard: progress bars, objective completion, timeline, team assignments |
| 57 | T5-007 | T5 | Evidence Viewer | dakshjadyar | dakshjadyar | T5-002, T1-018 | NOT STARTED | 2 | T5-017 | T5-017 | Evidence display: content rendering (text, image, PDF), metadata panel, provenance chain, hash verification |
| 58 | T5-008 | T5 | Entity Viewer | Deepkasare | Deepkasare | T5-002, T3-014 | NOT STARTED | 2 | T5-017 | T5-017 | Entity detail page: attributes, aliases, relationships list, evidence links, confidence score |
| 59 | T5-009 | T5 | Graph View | Deepkasare | Deepkasare | T5-002, T3-011 | NOT STARTED | 3 | T5-017 | T5-017 | Interactive graph visualization: D3/Force-graph, node click, edge labels, zoom, filter, layout toggle |
| 60 | T5-010 | T5 | Timeline | Deepkasare | Deepkasare | T5-002, T3-013 | NOT STARTED | 2 | T5-017 | T5-017 | Chronological timeline view: events, evidence, entity appearances on time axis |
| 61 | T5-011 | T5 | Findings View | krishnasondigala-sys | krishnasondigala-sys | T5-002, T4-011 | NOT STARTED | 2 | T5-012, T5-013 | T5-012 | Findings list: AI-detected patterns, contradictions, correlations with evidence references |
| 62 | T5-015 | T5 | Error/Loading States | dakshjadyar | dakshjadyar | T5-002 | NOT STARTED | 1 | T5-017 | T5-017 | Skeleton loaders, error boundaries, retry UI, empty states, connection status indicators |
| 63 | T5-016 | T5 | Accessibility | dakshjadyar | dakshjadyar | T5-002 | NOT STARTED | 1 | T5-017 | T5-017 | WCAG 2.1 AA compliance: keyboard nav, screen reader labels, focus management, color contrast |

---

### WAVE 7 — Services + Graph + AI Agents + Frontend (Day 20–30)

> **Objective:** Build core APIs, graph storage/queries, AI correlation engine, and primary frontend views.  
> **Parallel Capacity:** 18 tasks | **Wave Effort:** 42 days (parallelized)

| Seq | Task ID | Team | Title | Primary Owner | Team Head | Dependencies | Status | Effort | Blocks | Next Task | Acceptance Criteria |
|-----|---------|------|-------|---------------|-----------|-------------|--------|--------|--------|-----------|---------------------|
| 64 | T1-016 | T1 | Core Service Structure | Preetam-06 | Preetam-06 | T1-015 | NOT STARTED | 2 | T1-017, T1-018, T1-020 | T1-017 | Service layer: CRUD operations for all entities, transaction management, soft delete, audit hooks |
| 65 | T2-013 | T2 | Connector Health | riddhisawant305-jpg | riddhisawant305-jpg | T2-003 | NOT STARTED | 1 | T2-016 | T2-016 | Health check endpoints, uptime tracking, latency monitoring, degradation alerts |
| 66 | T3-009 | T3 | Graph Storage | parthvichare20 | parthvichare20 | T3-008 | NOT STARTED | 3 | T3-010, T3-013, T3-014 | T3-010 | Graph DB adapter (Neo4j/Prisma): node/edge CRUD, bulk import, indexing, transaction support |
| 67 | T3-010 | T3 | Graph Queries | parthvichare20 | parthvichare20 | T3-009 | NOT STARTED | 3 | T3-011, T3-016 | T3-011 | Query engine: shortest path, N-hop traversal, pattern matching, subgraph extraction, centrality |
| 68 | T3-011 | T3 | Graph API | parthvichare20 | parthvichare20 | T3-010 | NOT STARTED | 2 | T5-009, T3-016 | T3-016 | REST/GraphQL endpoints for graph operations: query, mutate, visualize, export |
| 69 | T3-013 | T3 | Investigation Timeline | parthvichare20 | parthvichare20 | T3-009, T1-013 | NOT STARTED | 2 | T5-010 | T5-010 | Temporal query engine: event sequences, time-range filters, gap detection |
| 70 | T3-014 | T3 | Entity API | parthvichare20 | parthvichare20 | T3-009 | NOT STARTED | 2 | T5-008, T5-013 | T5-008 | Entity CRUD API: create, read, update, merge, list with filters, search by attributes |
| 71 | T4-009 | T4 | Correlation Engine | Akash-Upade | Akash-Upade | T4-001, T4-008 | NOT STARTED | 3 | T4-018 | T4-018 | Cross-evidence correlation: pattern detection, clustering, timeline alignment, link analysis |
| 72 | T4-011 | T4 | Verification Engine | shraddhamahindrakar217-cloud | shraddhamahindrakar217-cloud | T4-010 | NOT STARTED | 3 | T4-013, T5-011, T5-013 | T4-013 | Claim verification: cross-reference checking, source corroboration, confidence recalculation |
| 73 | T1-017 | T1 | Core API | Preetam-06 | Preetam-06 | T1-016 | NOT STARTED | 3 | T1-019, T5-003, T5-004, T5-005, T5-006 | T1-019 | REST API: cases, investigations, objectives, sources, observations CRUD; auth middleware, rate limiting |
| 74 | T1-018 | T1 | Evidence API | jadhavsarthak374-ai | jadhavsarthak374-ai | T1-016, T1-011 | NOT STARTED | 2 | T1-019, T1-020, T5-007, T5-013 | T1-019 | Evidence API: upload, retrieve, search, hash verification, provenance chain query |
| 75 | T4-013 | T4 | Human-Review State | shraddhamahindrakar217-cloud | shraddhamahindrakar217-cloud | T4-011 | NOT STARTED | 2 | T5-012, T4-018 | T4-018 | Review queue: pending items, approve/reject workflow, reviewer assignment, SLA tracking |
| 76 | T5-003 | T5 | Dashboard | aryanbhosale20 | aryanbhosale20 | T5-002, T1-017 | NOT STARTED | 2 | T5-017 | T5-017 | Overview dashboard: active cases, recent activity, entity count, risk indicators, charts |
| 77 | T5-004 | T5 | Case Creation | aryanbhosale20 | aryanbhosale20 | T5-002, T1-017 | NOT STARTED | 2 | T5-017 | T5-017 | Case creation form: title, description, priority, assignees; client-side validation; API integration |
| 78 | T5-005 | T5 | Investigation Creation | aryanbhosale20 | aryanbhosale20 | T5-002, T1-017, T1-005 | NOT STARTED | 2 | T5-017 | T5-017 | Investigation creation: link to case, define objectives, set scope, AI-assisted planning toggle |
| 79 | T5-006 | T5 | Investigation Status | dakshjadyar | dakshjadyar | T5-002, T1-017 | NOT STARTED | 2 | T5-017 | T5-017 | Status dashboard: progress bars, objective completion, timeline, team assignments |
| 80 | T5-007 | T5 | Evidence Viewer | dakshjadyar | dakshjadyar | T5-002, T1-018 | NOT STARTED | 2 | T5-017 | T5-017 | Evidence display: content rendering (text, image, PDF), metadata panel, provenance chain, hash verification |
| 81 | T5-008 | T5 | Entity Viewer | Deepkasare | Deepkasare | T5-002, T3-014 | NOT STARTED | 2 | T5-017 | T5-017 | Entity detail page: attributes, aliases, relationships list, evidence links, confidence score |
| 82 | T5-009 | T5 | Graph View | Deepkasare | Deepkasare | T5-002, T3-011 | NOT STARTED | 3 | T5-017 | T5-017 | Interactive graph visualization: D3/Force-graph, node click, edge labels, zoom, filter, layout toggle |
| 83 | T5-010 | T5 | Timeline | Deepkasare | Deepkasare | T5-002, T3-013 | NOT STARTED | 2 | T5-017 | T5-017 | Chronological timeline view: events, evidence, entity appearances on time axis |
| 84 | T5-011 | T5 | Findings View | krishnasondigala-sys | krishnasondigala-sys | T5-002, T4-011 | NOT STARTED | 2 | T5-012, T5-013 | T5-012 | Findings list: AI-detected patterns, contradictions, correlations with evidence references |

---

### WAVE 8 — Integration + Verification + Reporting (Day 28–40)

> **Objective:** Validation layer, test foundations, evaluation datasets, verification UI, and report generation.  
> **Parallel Capacity:** 8 tasks | **Wave Effort:** 15 days (parallelized)

| Seq | Task ID | Team | Title | Primary Owner | Team Head | Dependencies | Status | Effort | Blocks | Next Task | Acceptance Criteria |
|-----|---------|------|-------|---------------|-----------|-------------|--------|--------|--------|-----------|---------------------|
| 85 | T1-019 | T1 | Validation/Error Handling | Preetam-06 | Preetam-06 | T1-017, T1-018 | NOT STARTED | 2 | T1-020 | T1-020 | Zod validation middleware, structured error responses, error taxonomy, request/response logging |
| 86 | T3-015 | T3 | Resolution Tests | katkarsujal1-design | katkarsujal1-design | T3-005 | NOT STARTED | 1 | T3-017 | T3-017 | Unit tests for entity resolution: matching accuracy, false positive/negative rates, edge cases |
| 87 | T4-017 | T4 | Evaluation Dataset | anujmore2006-collab | anujmore2006-collab | T4-003, T4-005 | NOT STARTED | 1 | T4-018 | T4-018 | Gold-standard test cases: input/output pairs for each AI capability; labeled contradiction/correlation examples |
| 88 | T5-012 | T5 | Verification View | krishnasondigala-sys | krishnasondigala-sys | T5-011, T4-013 | NOT STARTED | 2 | T5-017 | T5-017 | Verification UI: review queue, evidence comparison, approve/reject with notes, confidence breakdown |
| 89 | T5-013 | T5 | Report Generation | krishnasondigala-sys | krishnasondigala-sys | T5-002, T1-018, T3-014, T4-011 | NOT STARTED | 3 | T5-014, T5-017 | T5-014 | Report builder: template engine, evidence compilation, graph snapshots, executive summary generation |
| 90 | T5-016 | T5 | Accessibility | dakshjadyar | dakshjadyar | T5-002 | NOT STARTED | 1 | T5-017 | T5-017 | WCAG 2.1 AA compliance: keyboard nav, screen reader labels, focus management, color contrast |

---

### WAVE 9 — Testing + Reports + Final (Day 35–50)

> **Objective:** Comprehensive unit and integration tests across all teams; finalize reports.  
> **Parallel Capacity:** 6 tasks | **Wave Effort:** 14 days (parallelized)

| Seq | Task ID | Team | Title | Primary Owner | Team Head | Dependencies | Status | Effort | Blocks | Next Task | Acceptance Criteria |
|-----|---------|------|-------|---------------|-----------|-------------|--------|--------|--------|-----------|---------------------|
| 91 | T1-020 | T1 | Unit Tests | jadhavsarthak374-ai | jadhavsarthak374-ai | T1-016, T1-017, T1-018, T1-019 | NOT STARTED | 2 | T1-021 | T1-021 | Unit tests for all services and APIs; >80% coverage; mock external dependencies |
| 92 | T2-016 | T2 | Unit Tests | darshankamble0628-coder | darshankamble0628-coder | T2-005, T2-006, T2-007, T2-008, T2-009, T2-010, T2-011, T2-012, T2-013, T2-014, T2-015 | NOT STARTED | 2 | T2-017 | T2-017 | Unit tests for all connectors and infrastructure; mocked HTTP responses; rate limit tests |
| 93 | T3-017 | T3 | Integration Tests | Pannkajyadhav333 | Pannkajyadhav333 | T3-003, T3-004, T3-005, T3-006, T3-007, T3-008, T3-009, T3-010, T3-011, T3-012, T3-013, T3-014 | NOT STARTED | 3 | T3-018 | T3-018 | Integration tests: entity pipeline end-to-end, graph CRUD, query correctness, timeline accuracy |
| 94 | T4-018 | T4 | Evaluation Tests | anujmore2006-collab | anujmore2006-collab | T4-007, T4-008, T4-009, T4-010, T4-017 | NOT STARTED | 3 | T4-019 | T4-019 | AI evaluation: accuracy benchmarks, latency thresholds, safety regression tests, prompt injection tests |
| 95 | T5-014 | T5 | Report Export | krishnasondigala-sys | krishnasondigala-sys | T5-013 | NOT STARTED | 1 | T5-017 | T5-017 | PDF/HTML/Markdown export; evidence citations; graph image embedding; page breaks, headers/footers |
| 96 | T5-017 | T5 | E2E Tests | Deepkasare | Deepkasare | T5-002, T5-003, T5-004, T5-005, T5-006, T5-007, T5-008, T5-009, T5-010, T5-011, T5-012, T5-013, T5-014, T5-015, T5-016 | NOT STARTED | 3 | T5-018 | T5-018 | Playwright E2E: full user flows, case creation → investigation → evidence → report; visual regression |

---

### WAVE 10 — Final Integration + QA (Day 45–55)

> **Objective:** Cross-team integration tests, final QA pass.  
> **Parallel Capacity:** 4 tasks | **Wave Effort:** 8 days (parallelized)

| Seq | Task ID | Team | Title | Primary Owner | Team Head | Dependencies | Status | Effort | Blocks | Next Task | Acceptance Criteria |
|-----|---------|------|-------|---------------|-----------|-------------|--------|--------|--------|-----------|---------------------|
| 97 | T1-021 | T1 | Integration Tests | ANDY15K | ANDY15K | T1-020 | NOT STARTED | 2 | T1-022 | T1-022 | Cross-module integration: schema → service → API → DB; migration tests; seed data validation |
| 98 | T2-017 | T2 | Integration Tests | yadavchinmay45-cloud | yadavchinmay45-cloud | T2-016 | NOT STARTED | 2 | T2-018 | T2-018 | Connector integration: live API tests (with mocks for CI), registry health, normalization accuracy |
| 99 | T4-019 | T4 | Integration Tests | shraddhamahindrakar217-cloud | shraddhamahindrakar217-cloud | T4-018 | NOT STARTED | 2 | T4-020 | T4-020 | AI pipeline integration: end-to-end planner → analyzer → correlation → verification flow |
| 100 | T5-018 | T5 | Product Integration Tests | krishnasondigala-sys | krishnasondigala-sys | T5-017 | NOT STARTED | 2 | T5-019 | T5-019 | Full product integration: UI → API → Service → DB → AI; performance baseline; security scan |

---

### WAVE 11 — Documentation + Demo (Day 50–60)

> **Objective:** Final documentation, demo preparation, and project handoff.  
> **Parallel Capacity:** 5 tasks | **Wave Effort:** 5 days (parallelized)

| Seq | Task ID | Team | Title | Primary Owner | Team Head | Dependencies | Status | Effort | Blocks | Next Task | Acceptance Criteria |
|-----|---------|------|-------|---------------|-----------|-------------|--------|--------|--------|-----------|---------------------|
| 101 | T1-022 | T1 | Documentation | Preetam-06 | Preetam-06 | T1-021 | NOT STARTED | 1 | None | — | Infrastructure docs: setup guide, architecture diagram, deployment runbook, contribution guide |
| 102 | T2-018 | T2 | Connector Documentation | riddhisawant305-jpg | riddhisawant305-jpg | T2-017 | NOT STARTED | 1 | None | — | Connector docs: per-connector guide, config reference, adding custom connectors, troubleshooting |
| 103 | T3-018 | T3 | Documentation | hirveabhishek2006-design | hirveabhishek2006-design | T3-017 | NOT STARTED | 1 | None | — | Entity/graph docs: schema reference, query examples, graph API guide, data model diagrams |
| 104 | T4-020 | T4 | Documentation | sumeetmore334-rgb | sumeetmore334-rgb | T4-019 | NOT STARTED | 1 | None | — | AI engine docs: model configuration, prompt engineering guide, safety controls, evaluation methodology |
| 105 | T5-019 | T5 | Documentation | Ishauparkar13 | Ishauparkar13 | T5-018 | NOT STARTED | 1 | None | — | Frontend docs: component library, page guide, accessibility notes, deployment instructions |

---

## HANDOFF TRACKING

### Cross-Team Handoff Points

| Handoff | From | To | Task Receiving | Deliverable | Day |
|---------|------|-----|----------------|-------------|-----|
| H1 | T1 | T2 | T2-001 | Observation Schema (T1-008) interface contract | ~Day 8 |
| H2 | T1 | T3 | T3-001 | Shared Zod schemas (T1-003) and Observation Schema (T1-008) | ~Day 6 |
| H3 | T1 | T4 | T4-001 | Shared Zod schemas (T1-003) | ~Day 6 |
| H4 | T1 | T5 | T5-001 | Shared Zod schemas (T1-003) | ~Day 6 |
| H5 | T1 | T3 | T3-008 | Database schema (T1-015) for graph storage | ~Day 20 |
| H6 | T1 | T5 | T5-003–T5-006 | Core API (T1-017) endpoints | ~Day 28 |
| H7 | T1 | T5 | T5-007 | Evidence API (T1-018) endpoints | ~Day 28 |
| H8 | T3 | T5 | T5-008, T5-009, T5-010 | Entity API (T3-014), Graph API (T3-011), Timeline (T3-013) | ~Day 30 |
| H9 | T4 | T5 | T5-011 | Verification Engine (T4-011) findings data | ~Day 30 |
| H10 | T2 | T1 | T1-015 | Connector data model requirements | ~Day 14 |
| H11 | T3 | T4 | T4-008 | Entity data for evidence analysis | ~Day 22 |

---

## TEAM CAPACITY MATRIX

| Team Member | Team | Tasks Owned | Total Effort | Primary Wave |
|-------------|------|------------:|-------------:|--------------|
| Preetam-06 | T1 | T1-001, T1-002, T1-016, T1-017, T1-019, T1-022 | 11 | 1–11 |
| Dinesh-Kumar-Ved | T1 | T1-003, T1-004, T1-006, T1-012 | 5 | 3–6 |
| ANDY15K | T1 | T1-005, T1-013, T1-014, T1-021 | 7 | 4–10 |
| Zrahul2024 | T1 | T1-007, T1-008, T1-010 | 4 | 4 |
| jadhavsarthak374-ai | T1 | T1-009, T1-011, T1-015, T1-018, T1-020 | 10 | 4–9 |
| riddhisawant305-jpg | T2 | T2-001, T2-002, T2-013, T2-014, T2-015, T2-018 | 10 | 6–11 |
| darshankamble0628-coder | T2 | T2-003, T2-004, T2-011, T2-012, T2-016 | 7 | 6–9 |
| yadavchinmay45-cloud | T2 | T2-005, T2-006, T2-017 | 6 | 6–10 |
| AaryanDhotre2326 | T2 | T2-007, T2-008 | 4 | 6 |
| antarahire22-creator | T2 | T2-009, T2-010 | 4 | 6 |
| hirveabhishek2006-design | T3 | T3-001, T3-002, T3-018 | 5 | 4–11 |
| katkarsujal1-design | T3 | T3-003, T3-004, T3-015 | 5 | 5–9 |
| raunaksin9890-gif | T3 | T3-005, T3-006 | 4 | 5–8 |
| Pannkajyadhav333 | T3 | T3-007, T3-008, T3-012, T3-016, T3-017 | 14 | 6–11 |
| parthvichare20 | T3 | T3-009, T3-010, T3-011, T3-013, T3-014 | 13 | 7–8 |
| sumeetmore334-rgb | T4 | T4-001, T4-002, T4-016, T4-020 | 7 | 4–11 |
| anujmore2006-collab | T4 | T4-003, T4-004, T4-005, T4-017, T4-018 | 9 | 5–11 |
| Akash-Upade | T4 | T4-006, T4-007, T4-008, T4-009 | 10 | 5–7 |
| shraddhamahindrakar217-cloud | T4 | T4-010, T4-011, T4-012, T4-013, T4-014, T4-015, T4-019 | 18 | 5–10 |
| Ishauparkar13 | T5 | T5-001, T5-002, T5-019 | 5 | 4–11 |
| aryanbhosale20 | T5 | T5-003, T5-004, T5-005 | 6 | 7 |
| dakshjadyar | T5 | T5-006, T5-007, T5-015, T5-016 | 7 | 7–8 |
| Deepkasare | T5 | T5-008, T5-009, T5-010, T5-017 | 10 | 7–9 |
| krishnasondigala-sys | T5 | T5-011, T5-012, T5-013, T5-014, T5-018 | 11 | 7–10 |

---

## RISK REGISTER

| Risk | Impact | Affected Tasks | Mitigation |
|------|--------|----------------|------------|
| T1-003 delayed | 42 downstream tasks blocked | All schema-dependent tasks | Assign backup; daily standup; parallelize non-schema work |
| T1-008 delayed | 45 downstream tasks blocked | All T2-*, T3-extraction | Prioritize T1-007 → T1-008 chain; Zrahul2024 focused |
| T1-015 delayed | Service layer blocked | T1-016, T1-017, T3-008, T4-014 | Start DB design spec in Wave 3; mock Prisma client |
| shraddhamahindrakar217-cloud overloaded | 18 effort, 7 tasks | T4-010–T4-015, T4-019 | Redistribute T4-012 or T4-015 to another team member |
| T2-001 delayed | All connectors blocked | T2-002–T2-015, T2-016–T2-018 | Start connector interface spec in Wave 4; mock-first |
| T5-002 delayed | All frontend views blocked | T5-003–T5-016, T5-017–T5-019 | Begin layout in Wave 5 with placeholder components |

---

## APPROVAL

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Project Lead | Preetam-06 | | |
| Team 1 Head | Preetam-06 | | |
| Team 2 Head | riddhisawant305-jpg | | |
| Team 3 Head | Pannkajyadhav333 | | |
| Team 4 Head | shraddhamahindrakar217-cloud | | |
| Team 5 Head | Ishauparkar13 | | |

---

*Document generated automatically. All 97 tasks across 11 parallel waves. Status: NOT STARTED for all tasks. Update status as work begins.*
