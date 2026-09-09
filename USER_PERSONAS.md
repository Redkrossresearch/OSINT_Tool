# IOP User Personas

## Document purpose and source boundary

This document defines the user personas explicitly present in `IOP_complete_conversation_product_memory.json`. It does not add demographic profiles, organization sizes, seniority levels, purchasing roles, named biographies, or usage-frequency assumptions because the source does not specify them.

IOP is the **Evidence-First Goal-Oriented Intelligence Operating Platform**. Its north star is: **“Turn scattered information into verified intelligence.”** The primary market wedge is professional cybercrime and fraud investigation teams, with expansion into government intelligence/security, financial crime/AML, enterprise threat intelligence, critical infrastructure, and supply-chain risk.

## Shared persona context

All personas operate within the same product framing:

- An authorized investigation objective starts the work.
- Evidence is the system of record.
- Every important claim must link to evidence.
- Entity-merge uncertainty must remain visible.
- Important findings require integrity checks, independent corroboration, and adversarial supervision.
- AI output is not ground truth; AI is replaceable and deterministic execution is preferred for integrity-sensitive operations.
- High-impact external actions require human approval.
- Authorization, jurisdiction, purpose limitation, privacy, audit, retention, approvals, quotas, and source scope constrain execution.
- The platform makes no guaranteed-truth, guaranteed-attribution, or endless-search claims.

See [FEATURES.md](FEATURES.md) for product capabilities and [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) for evidence and governance requirements.

## Persona 1 — Cybercrime Investigator

### Job

Turn a complex authorized investigation objective into defensible intelligence.

### Pains

- Disconnected tools
- Repetitive searches
- Entity ambiguity
- Duplicate results
- Weak provenance
- Manual evidence collection
- Manual reporting
- Difficult reproduction

### Desired gains

- Faster investigations
- Evidence-linked findings
- Better entity resolution
- Cross-domain correlation
- Transparent uncertainty
- Reproducible research

### IOP support

The MVP is centered on this persona’s core workflow: **Person / Company / Domain / IP investigation**. It spans objective definition, authorization/scope, planning, Dork/Search, public or authorized sources, evidence capture, entity extraction and resolution, graph construction, AI correlation, independent verification, adversarial supervision, evidence-gap identification, reporting, and replay.

## Persona 2 — Intelligence Analyst

### Job

Transform fragmented observations into structured intelligence.

### Pains

- Information overload
- Conflicting sources
- Manual correlation
- Confirmation bias
- Ambiguous entities

### Desired gains

- Structured evidence
- Pattern discovery
- Contradiction detection
- Timeline analysis
- Graph relationships

### IOP support

The Universal Entity + Temporal Knowledge Graph, Pattern Engine, Contradiction Engine, Timeline Engine, Verification Panel, and evidence-linked reporting support the analyst’s need to connect observations while keeping provenance and uncertainty visible.

## Persona 3 — Financial Crime/AML Investigator

### Job

Identify suspicious financial behaviour and relationships for human investigation.

### Non-negotiable design rule

**A risk signal is not a criminality determination.** Automatic criminal conclusions are outside the initial scope.

### Relevant inputs

- CSV
- Excel
- PDF bank statements
- Anonymized/simulated KYC
- Authorized transaction feeds

### Relevant outputs

- Risk signals
- Account profiles
- Transaction graphs
- Flow-of-funds visualization
- Investigation-ready reports
- Human review workflow

FININT is a Phase 5 roadmap capability, not part of the initial MVP vertical slice.

## Persona 4 — Threat Intelligence Analyst

### Job

Connect indicators, infrastructure, actors, campaigns, and events into evidence-supported assessments.

### Relevant IOP support

- CTI and INFRAINT domains
- Universal Entity + Temporal Knowledge Graph
- Pattern, timeline, contradiction, and verification capabilities
- Threat Email Intelligence, including raw evidence preservation, header forensics, campaign clustering, and CTI/OSINT/DARKINT correlation
- Structured alerts, case packages, and SIEM integration

VPN, Tor, or disposable-email signals are indicators, not proof of authorship.

## Persona 5 — Supply-Chain Risk Analyst

### Job

Understand dependencies and model cyber, ownership, geographic, and operational risk propagation.

### Relevant IOP support

- Supply-Chain Digital Twin
- Tier-2/Tier-3 mapping
- Ownership/FOCI analysis
- Facility and geographic concentration
- SBOM, HBOM, OBOM, SaaSBOM, AIBOM, VEX, and VDR
- Vulnerability propagation and blast-radius analysis
- Cryptographic asset inventory
- Business-impact analysis

The Supply-Chain Digital Twin is a Phase 7 roadmap capability.

## Persona-to-outcome map

| Persona | Primary outcome | Central safeguard |
|---|---|---|
| Cybercrime Investigator | Defensible, reproducible intelligence | Authorized scope and evidence-linked claims |
| Intelligence Analyst | Structured, connected intelligence | Contradiction search and visible uncertainty |
| Financial Crime/AML Investigator | Suspicious-behaviour and relationship signals for review | Risk signal ≠ criminality determination |
| Threat Intelligence Analyst | Evidence-supported assessment of indicators, infrastructure, actors, campaigns, and events | Indicators ≠ proof of authorship or attribution |
| Supply-Chain Risk Analyst | Dependency and risk-propagation understanding | Evidence-linked graph relationships and human review |

## Validation questions for all personas

The source defines these research questions:

- Where did the system save time?
- Where did the analyst distrust it?
- Which result was useful?
- Which was misleading?
- Where was uncertainty unclear?
- Which manual step should remain human-controlled?
- Which feature would the analyst remove?

See [EMPATHY_MAPS.md](EMPATHY_MAPS.md), [JTBD.md](JTBD.md), and [USER_JOURNEYS.md](USER_JOURNEYS.md).
