# IOP Jobs To Be Done

## Core job

> When I receive a complex authorized investigation objective, I want to discover, connect, verify, and preserve relevant information across fragmented sources so that I can produce a defensible and reproducible intelligence assessment without manually orchestrating dozens of disconnected tools.

This statement is the source-defined JTBD for the **Evidence-First Goal-Oriented Intelligence Operating Platform (IOP)**. It is constrained by authorization, evidence provenance, verification, governance, and human approval.

## Job dimensions

| Dimension | Job |
|---|---|
| Functional | Find relevant information. |
| Analytical | Understand what information means. |
| Relational | Connect information across sources. |
| Verification | Determine whether a finding is defensible. |
| Operational | Determine what to investigate next. |
| Reporting | Communicate findings with evidence. |
| Governance | Prove how findings were produced. |
| Strategic | Turn fragmented information into decision-grade intelligence. |

## Complete job map

**Define → Plan → Discover → Search → Collect → Preserve → Parse → Extract → Resolve → Connect → Correlate → Hypothesize → Verify → Challenge → Prioritize → Expand → Report → Replay**

### 1. Define

Establish the investigation objective. The objective must be authorized and compatible with scope, jurisdiction, and purpose limitation.

### 2. Plan

Determine relevant intelligence domains and select appropriate sources, tools, datasets, models, and capabilities. Planning is cost-aware and considers information gain, privacy, jurisdiction, latency, quotas, provider health, and availability.

### 3. Discover and Search

Use goal-driven discovery, including the Dorking Engine where relevant. Dorking is not a standalone scraper. Search is limited to public or authorized sources and does not include credential harvesting, authentication bypass, unauthorized private-data access, access-control circumvention, or unauthorized exploitation.

### 4. Collect and Preserve

Perform authorized collection and create evidence with cryptographic content identity, acquisition timestamp, source metadata, immutable/versioned history, and audit context.

### 5. Parse and Extract

Normalize source material and extract observations and entities. Deterministic execution is preferred for parsing, hashing, arithmetic, schema validation, standards processing, and evidence integrity.

### 6. Resolve

Resolve entity identities while exposing uncertainty and measuring false-merge risk. Entity merges must not hide ambiguity.

### 7. Connect and Correlate

Build evidence-linked relationships in the Universal Entity + Temporal Knowledge Graph. Use multi-hop traversal, temporal relationships, pattern detection, network analysis, and domain-specific correlation.

### 8. Hypothesize

Create hypotheses from observations without treating inference as observation or correlation as causation.

### 9. Verify and Challenge

Apply three-layer verification:

1. **Integrity** — verify hashes, timestamps, and provenance.
2. **Independent Corroboration** — verify important findings with genuinely independent sources.
3. **Adversarial Supervisor** — search for contradictions, false merges, missing provenance, and alternative explanations.

Model disagreement triggers verification rather than majority-vote truth.

### 10. Prioritize and Expand

Identify evidence gaps and recommend the next best action. Continue or finalize within explicit worker-count, recursion, tool-call, runtime, budget, evidence-volume, and parallelism bounds. IOP does not claim endless autonomous search.

### 11. Report

Produce an evidence-backed, reproducible intelligence report with clear source attribution and visible uncertainty.

### 12. Replay

Replay the investigation run using recorded evidence, executions, versions, and audit history. Historical evidence remains immutable/versioned.

## Persona-specific applications

### Cybercrime Investigator

Apply the core job to a complex authorized investigation, with the MVP focused on Person / Company / Domain / IP investigations.

### Intelligence Analyst

Apply the analytical, relational, verification, and reporting jobs to transform fragmented observations into structured intelligence.

### Financial Crime/AML Investigator

Identify suspicious financial behaviour and relationships for human investigation. **Risk signal is not a criminality determination.**

### Threat Intelligence Analyst

Connect indicators, infrastructure, actors, campaigns, and events into evidence-supported assessments. VPN, Tor, and disposable-email signals are indicators, not proof of authorship.

### Supply-Chain Risk Analyst

Understand dependencies and model cyber, ownership, geographic, and operational risk propagation using a Supply-Chain Digital Twin.

## Job success measures

The source defines the following metrics:

- Time-to-Defensible Intelligence
- Evidence coverage
- Independent corroboration rate
- False entity merge rate
- Manual tool-switch count
- Investigation completion time
- Cost per verified finding
- Replay success rate
- Analyst correction rate

Product tests additionally measure time-to-first-useful-finding, duplicate findings, contradiction discovery, report preparation time, cost per investigation, and replay consistency. The source does not define numeric targets.

## Job boundaries

The initial scope excludes universal integration with every vendor, autonomous law-enforcement action, unbounded agents, guaranteed attribution, unrestricted dark-web activity, automatic criminal conclusions, and unlimited third-party API usage.

See [USER_FLOWS.md](USER_FLOWS.md), [USE_CASES.md](USE_CASES.md), and [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md).
