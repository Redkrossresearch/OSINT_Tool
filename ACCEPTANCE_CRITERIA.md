# IOP Acceptance Criteria

## Scope and test policy

These criteria convert explicit requirements in `IOP_complete_conversation_product_memory.json` into testable statements. They do not introduce numeric service levels, accuracy targets, confidence thresholds, data-retention periods, or legal interpretations absent from the source. Such values require validation and governance decisions.

## AC-01 — Authorized objective and scope

- Given an investigation is created, when collection is requested, then an authorized objective and scope must be associated with the run.
- Authorization, scope, case ID, trace ID, and audit context must be available to relevant MCP operations where applicable.
- Policy, jurisdiction, purpose limitation, approvals, retention, quotas, and access controls must be enforceable through the Control Plane.
- A request outside authorized scope must not proceed as authorized collection.

## AC-02 — Evidence as system of record

- Every important claim must link to evidence.
- Collected evidence must record cryptographic content identity, acquisition timestamp, and source metadata.
- Historical evidence must be immutable/versioned.
- Transformations must be versioned.
- Evidence, execution, run, and audit history must support replay.
- Graph and search indexes must be treated as derived systems rather than the evidence system of record.

## AC-03 — Observation, inference, and uncertainty

- Observation and inference must be distinguishable.
- Correlation and causation must not be presented as equivalent.
- Entity merges must expose uncertainty.
- Ambiguous entities must not be silently converted into certain identities.
- AI output must not be treated as ground truth.
- Reports and workspaces must show evidence before AI narrative, clear source attribution, and visible uncertainty.

## AC-04 — Three-layer verification

- Layer 1 must verify hashes, timestamps, and provenance.
- Layer 2 must seek genuinely independent corroboration for important findings.
- Layer 3 must search for contradictions, false merges, missing provenance, and alternative explanations.
- Source independence must be measurable.
- Model disagreement must trigger verification rather than majority-vote truth.
- A finding that lacks sufficient evidence must remain challenged, uncertain, or an evidence gap; it must not be represented as guaranteed truth.

## AC-05 — Bounded multi-agent execution

- Multi-agent execution must be bounded by worker count, recursion, tool calls, runtime, budget, evidence volume, and parallelism.
- Costs, latency, quotas, provider health, and availability must be observable where relevant.
- The system must not claim endless autonomous search.
- High-impact external actions must require human approval.
- Agent/tool execution must be logged, and model/prompt versions must be tracked when used.

## AC-06 — Model and deterministic routing

- Model routing must be able to consider task, quality, context, privacy, jurisdiction, cost, latency, quota, provider health, and availability.
- Providers must be treated as adapters and AI as replaceable.
- The design must avoid a required single-provider dependency.
- Hashing, parsing, arithmetic, schema validation, graph traversal, standards processing, and evidence integrity must prefer deterministic execution over AI.

## AC-07 — Dorking and collection boundaries

- Dorking must operate as a goal-driven discovery capability connected to planning, scope validation, evidence capture, entity resolution, graph correlation, supervision, and reporting.
- Search and collection must use public or authorized sources.
- The system must not support credential harvesting, authentication bypass, unauthorized private-data access, access-control circumvention, or unauthorized exploitation.
- Results must support normalization, deduplication, entity extraction, and evidence capture.

## AC-08 — Entity resolution and temporal graph

- The system must support Person, Company, Organization, Asset, Account, Domain, IP, Location, Supplier, Facility, Event, Relationship, Ownership, Directorship, Transaction, and Threat Indicator entity categories where applicable to the implemented scope.
- Graph relationships must be evidence-linked and capable of temporal representation.
- The graph must support multi-hop traversal, entity resolution, pattern detection, network analysis, risk propagation, and supply-chain dependency mapping as the corresponding roadmap capability is implemented.
- False entity merges must be surfaced for adversarial review.

## AC-09 — MVP vertical slice

- The MVP must support Person / Company / Domain / IP investigation.
- The MVP flow must include Objective, Authorization/Scope, Planner, Dork/Search, Public/Authorized Sources, Evidence Capture, Entity Extraction, Entity Resolution, Graph, AI Correlation, Independent Verification, Supervisor, Evidence Gap, Report, and Replay.
- The output must be evidence-backed and reproducible.
- The run must preserve auditability and visible uncertainty.

## AC-10 — MVP exclusions

The MVP must not be accepted on the assumption that it includes:

- Universal integration with every vendor
- Autonomous law-enforcement action
- Unbounded agents
- Guaranteed attribution
- Unrestricted dark-web activity
- Automatic criminal conclusions
- Unlimited third-party API usage

## AC-11 — FININT safeguards and outputs

- FININT must accept only the source-defined input categories: CSV, Excel, PDF bank statements, anonymized/simulated KYC, and authorized transaction feeds.
- Detected patterns must be presented as risk signals, not criminality determinations.
- FININT must support account profiles, transaction graphs, flow-of-funds visualization, investigation-ready reports, and human review workflow when this Phase 5 capability is implemented.
- Automatic criminal conclusions must remain out of scope.

## AC-12 — Threat Email Intelligence safeguards and outputs

- Raw email evidence must be preserved.
- The capability must support the source-defined header, authentication, sender/domain/IP, URL, attachment, semantic/intent, campaign, and cross-domain analyses when implemented.
- Risk classes must be High, Medium/Suspicious, and Low/Safe.
- VPN, Tor, or disposable-email signals must not be represented as proof of authorship.
- Quarantine, spam redirection, or hold-for-review must respect the human-approval requirement for high-impact external actions.
- Structured alerts, case packages, dashboards, and SIEM integration must retain evidence and audit context.

## AC-13 — DARKINT boundaries

- DARKINT must be limited to licensed, public, or authorized exposure intelligence; passive monitoring; ransomware and leak/exposure monitoring; actor/entity correlation; and sandboxed network/content analysis.
- Credential theft, illicit purchases, unauthorized access, and unauthorized exploit activity must be prohibited.

## AC-14 — Country Intelligence Packs

- Each country pack must be a versioned dynamic intelligence pack.
- Sources must be versioned, health-checked, and change-tracked.
- The system must not invent URLs.
- Country-pack operation must respect jurisdiction and authorization.
- Packs may contain the source-defined official, registry, identifier, local-language, social, geospatial, cyber, procurement, supplier, and legal/public-record source categories.

## AC-15 — Dataset Intelligence

- Dataset use must pass license, security, provenance, quality, bias/coverage, and production-suitability gates.
- Datasets must be treated as context/evidence inputs, not automatic truth.
- Current dataset licenses and provider capabilities must be independently verified before reliance.

## AC-16 — Supply-Chain Digital Twin

- When the Phase 7 capability is implemented, it must support the source-defined graph entities and Tier-2/Tier-3, ownership/FOCI, concentration, BOM/VEX/VDR, vulnerability-propagation, blast-radius, cryptographic-asset, and business-impact capabilities.
- Relationships and risk propagation must remain evidence-linked, temporal where applicable, and subject to entity-resolution uncertainty.

## AC-17 — Reporting and replay

- Reports must connect important claims to evidence.
- Reports must expose source attribution, uncertainty, contradictions, and evidence gaps.
- Replay must use immutable/versioned evidence, versioned transformations, and recorded execution/audit context.
- Replay success and consistency must be measurable.

## AC-18 — UX

- The interface must be professional, evidence-first, investigator-oriented, accessible, and responsive.
- It must support progressive disclosure and high information density without clutter.
- Graph, timeline, and evidence must be available together where relevant.
- The defined workspace set includes Investigation Dashboard, Entity Profile, Evidence Viewer, Graph Workspace, Timeline, Source Explorer, Agent/Execution Trace, Verification Panel, Risk Dashboard, Supply Chain Digital Twin, and Report Builder.

## AC-19 — Engineering quality bar

For an implemented capability, the engineering protocol requires:

- Contract
- Tests
- Schema validation
- Provenance
- Audit
- Observability
- Health check
- Documentation
- Versioning
- Rollback/replay where applicable

Definition of done includes requirement implementation, preservation of existing behaviour, relevant tests, typecheck, lint, build, security review, performance consideration, documentation updates, current-state and task updates, and memory updates where necessary.

## AC-20 — Metrics and validation

The product must be capable of measuring the source-defined metrics relevant to implemented flows:

- Time-to-Defensible Intelligence
- Evidence coverage
- Independent corroboration rate
- False entity merge rate
- Manual tool-switch count
- Investigation completion time
- Cost per verified finding
- Replay success rate
- Analyst correction rate
- Time-to-first-useful-finding
- Duplicate findings
- Contradiction discovery
- Report preparation time
- Cost per investigation
- Replay consistency

No numeric acceptance thresholds are specified in the source. Thresholds must be established through validation rather than invented here.

## AC-21 — Risk review

Acceptance reviews must consider the source-defined risks: scope explosion; source/data acquisition and licensing; AI hallucination; entity-resolution false positives; API/model costs; privacy/regulatory exposure; dark-web operational/legal risk; overbuilding before customer validation; vendor dependency; and false confidence from weak corroboration.

## AC-22 — External-claim verification

Before externally presenting affected claims as verified facts, independently verify current competitor pricing, market statistics, MCP specification/version details, C2PA status, W3C Verifiable Credentials status, NIST publication details, CycloneDX version details, API/provider capabilities, dataset licenses, and current legal/regulatory requirements.

Related documents: [USER_PERSONAS.md](USER_PERSONAS.md), [JTBD.md](JTBD.md), [USER_JOURNEYS.md](USER_JOURNEYS.md), [USER_FLOWS.md](USER_FLOWS.md), [FEATURES.md](FEATURES.md), and [USE_CASES.md](USE_CASES.md).
