# IOP User Flows

## Flow conventions

These flows are derived directly from the source-defined goal loop, Dorking flow, MVP flow, verification layers, and domain capabilities. A flow does not imply that every module is implemented at the current “Proposed / product, architecture and MVP definition stage.”

## UF-01 — End-to-end investigation goal loop

```text
OBJECTIVE
  → PLAN
  → SOURCE / TOOL / DATASET SELECTION
  → AUTHORIZED COLLECTION
  → EVIDENCE
  → ENTITY RESOLUTION
  → GRAPH
  → PATTERNS
  → HYPOTHESES
  → CORROBORATION
  → CONTRADICTION SEARCH
  → EVIDENCE GAP
  → NEXT-BEST-ACTION
  → CONTINUE / FINALIZE
  → REPORT
  → REPLAY
```

### Decision points

- If authorization, scope, jurisdiction, or purpose controls fail, collection must not proceed.
- If an important claim lacks evidence, it remains an evidence gap rather than a verified conclusion.
- If sources are not genuinely independent, multiple matches do not satisfy independent corroboration.
- If models disagree, verification is triggered; majority vote does not establish truth.
- If more research is justified, continue only within bounded worker count, recursion, tool calls, runtime, budget, evidence volume, and parallelism.
- High-impact external actions require human approval.

## UF-02 — MVP Person / Company / Domain / IP investigation

```text
Objective
  → Authorization / Scope
  → Planner
  → Dork / Search
  → Public / Authorized Sources
  → Evidence Capture
  → Entity Extraction
  → Entity Resolution
  → Graph
  → AI Correlation
  → Independent Verification
  → Supervisor
  → Evidence Gap
  → Report
  → Replay
```

### Expected artifacts

- Authorized objective and scope context
- Source and execution records
- EvidenceObjects with acquisition metadata and content identity
- Observations, entities, and evidence-linked relationships
- Claims and hypotheses that distinguish observation from inference
- Verification and contradiction results
- Report with visible uncertainty
- Replayable run and audit trail

## UF-03 — Goal-driven Dorking

```text
Objective
  → Planner
  → Dork generation
  → Policy / scope validation
  → Source router
  → Authorized public search / API sources
  → Normalization
  → Deduplication
  → Entity extraction
  → Evidence capture
  → Entity resolution
  → Graph
  → Cross-source corroboration
  → Supervisor
  → Report
```

### Hard boundaries

- Public or authorized sources only
- No credential harvesting
- No authentication bypass
- No unauthorized private-data access
- No access-control circumvention
- No unauthorized exploitation

## UF-04 — Three-layer verification

```text
Important finding
  → Layer 1: Integrity
      verify hashes + timestamps + provenance
  → Layer 2: Independent Corroboration
      test against genuinely independent sources
  → Layer 3: Adversarial Supervisor
      search contradictions + false merges
      + missing provenance + alternative explanations
  → Verified finding or evidence gap / challenged hypothesis
```

Important claims must link to evidence. AI output is not treated as ground truth.

## UF-05 — Entity resolution and graph update

```text
Preserved evidence
  → Parse
  → Extract observations and candidate entities
  → Compare identity evidence
  → Resolve or retain ambiguity
  → Expose merge uncertainty
  → Create evidence-linked temporal relationships
  → Update graph-derived views
  → Challenge false-merge risk
```

The evidence store is authoritative; graph and search indexes are derived systems.

## UF-06 — FININT human-review flow

```text
Authorized / anonymized / simulated input
  → Evidence preservation
  → Transaction and account analysis
  → Financial signal detection
  → Account profile + transaction graph + flow-of-funds view
  → Verification and contradiction search
  → Human review
  → Investigation-ready report
```

**Guardrail:** Risk signal ≠ criminality determination.

## UF-07 — Threat Email Intelligence

```text
Email
  → Raw evidence preservation
  → Header + SPF / DKIM / DMARC / ARC analysis
  → Sender / domain / IP / URL analysis
  → Attachment isolation
  → Semantic + intent analysis
  → Campaign clustering
  → CTI / OSINT / authorized DARKINT correlation
  → Risk classification
  → Quarantine / spam redirect / hold for review
  → Dashboard + alert + case package + SIEM integration
```

High-impact actions require human approval. VPN, Tor, and disposable-email indicators do not prove authorship.

## UF-08 — Supply-Chain Digital Twin analysis

```text
Authorized dependency and asset data
  → Model Customer / Supplier / Tier-N / Component / Asset / Facility / Geography
  → Link ownership and dependency relationships
  → Add BOM / VEX / VDR context
  → Detect concentration and vulnerability exposure
  → Propagate risk through evidence-linked temporal graph
  → Calculate blast-radius context
  → Connect to business impact
  → Human review and report
```

## UF-09 — Report and replay

```text
Verified findings + challenged hypotheses + evidence gaps
  → Report Builder
  → Evidence-to-claim links
  → Source attribution + uncertainty
  → Versioned report
  → Replay Engine
  → Reconstruct run from evidence, execution, model/prompt/schema versions, and audit context
```

See [USER_JOURNEYS.md](USER_JOURNEYS.md), [USE_CASES.md](USE_CASES.md), and [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md).
