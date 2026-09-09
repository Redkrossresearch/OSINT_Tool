# IOP Use Cases

## Use-case rules

All use cases inherit these conditions:

- The objective and collection must be authorized.
- Jurisdiction, purpose limitation, privacy, source scope, retention, approvals, and quotas apply.
- Evidence is the system of record; graph and search indexes are derived.
- Important claims link to evidence and preserve uncertainty.
- AI output is not ground truth.
- High-impact external actions require human approval.
- The platform does not promise guaranteed truth, guaranteed attribution, or endless search.

## UC-01 — Investigate a Person / Company / Domain / IP

**Primary actor:** Cybercrime Investigator  
**Release context:** MVP vertical slice  
**Goal:** Turn an authorized objective into a defensible, reproducible report.

**Preconditions**

- An objective, authorization, and scope are available.
- Public or authorized sources/connectors are available.

**Main flow**

1. Record objective and scope.
2. Plan domains, sources, tools, datasets, models, and actions.
3. Search public or authorized sources.
4. Capture and preserve evidence.
5. Extract and resolve Person, Company, Domain, and IP entities.
6. Build evidence-linked temporal graph relationships.
7. Correlate observations and create explicit hypotheses.
8. Verify integrity and seek independent corroboration.
9. Use the adversarial supervisor to search contradictions, false merges, missing provenance, and alternative explanations.
10. Record evidence gaps and select the next best action or finalize.
11. Generate an evidence-backed report.
12. Replay the run.

**Alternate/exception flows**

- Invalid or missing scope stops collection.
- Ambiguous identity remains unresolved or carries visible uncertainty.
- Unsupported important claims remain evidence gaps.
- Model disagreement triggers verification.
- Budget, runtime, quota, provider-health, or other agent bounds constrain continuation.

## UC-02 — Perform goal-driven discovery

**Primary actor:** Cybercrime Investigator or Intelligence Analyst  
**Goal:** Discover relevant information without manually orchestrating disconnected searches.

The Planner generates dorks, validates policy/scope, routes to authorized public search/API sources, normalizes and deduplicates results, extracts entities, captures evidence, resolves identities, updates the graph, seeks cross-source corroboration, and submits findings to the Supervisor.

**Prohibited outcomes:** credential harvesting, authentication bypass, unauthorized private-data access, access-control circumvention, and unauthorized exploitation.

## UC-03 — Preserve evidence and provenance

**Primary actor:** Any investigator; Provenance/Compliance functions  
**Goal:** Make findings explainable, auditable, and reproducible.

For each collected item, IOP creates or updates the appropriate EvidenceObject, Observation, Source, Execution, and Run context with cryptographic content identity, acquisition timestamp, source metadata, versioned transformations, evidence-to-claim links, and audit trail. Historical evidence is immutable/versioned.

## UC-04 — Resolve entities with uncertainty

**Primary actor:** Cybercrime Investigator or Intelligence Analyst  
**Goal:** Connect observations without hiding identity ambiguity.

IOP extracts candidate entities, evaluates identity evidence, resolves or retains ambiguity, exposes merge uncertainty, creates evidence-linked relationships, and allows the Supervisor to challenge false merges.

## UC-05 — Verify and challenge an important finding

**Primary actor:** Intelligence Analyst; Verification and Supervisor functions  
**Goal:** Determine whether a finding is defensible.

1. Verify hashes, timestamps, and provenance.
2. Seek genuinely independent corroboration.
3. Search contradictions, false merges, missing provenance, and alternative explanations.
4. Preserve unresolved uncertainty and evidence gaps.

Multiple-model agreement is not a substitute for verification; disagreement triggers verification.

## UC-06 — Produce and replay an intelligence report

**Primary actor:** Cybercrime Investigator or Intelligence Analyst  
**Goal:** Communicate findings with evidence and prove how they were produced.

The Report Builder presents important claims with evidence, source attribution, verification state, contradictions, and uncertainty. The Replay Engine reconstructs the run using immutable/versioned evidence, execution logs, and versioned transformations. Model, prompt, and tool execution are tracked where used.

## UC-07 — Analyze suspicious financial behaviour

**Primary actor:** Financial Crime/AML Investigator  
**Release context:** Roadmap Phase 5  
**Goal:** Identify risk signals and relationships for human investigation.

Authorized or anonymized/simulated CSV, Excel, PDF bank statement, KYC, or transaction-feed inputs are preserved and analyzed for the source-defined financial signals. IOP produces account profiles, transaction graphs, flow-of-funds visualization, risk signals, and an investigation-ready report for human review.

**Critical boundary:** A risk signal is not a criminality determination; automatic criminal conclusions are outside scope.

## UC-08 — Investigate a threat email

**Primary actor:** Threat Intelligence Analyst  
**Release context:** Roadmap Phase 5  
**Goal:** Produce an evidence-supported risk assessment and case package.

IOP preserves raw email evidence; performs header, SPF/DKIM/DMARC/ARC, sender/domain/IP, URL, attachment, semantic, and intent analysis; clusters campaigns; correlates CTI/OSINT/authorized DARKINT; assigns High, Medium/Suspicious, or Low/Safe risk; supports quarantine, spam redirection, or hold-for-review; displays structured alerts; generates a case package; and supports SIEM integration.

**Critical boundary:** VPN, Tor, and disposable-email signals are indicators, not proof of authorship. High-impact actions require human approval.

## UC-09 — Monitor authorized exposure intelligence

**Primary actor:** Threat Intelligence Analyst  
**Release context:** Roadmap Phase 6  
**Goal:** Correlate licensed, public, or authorized exposure information.

IOP supports passive ransomware and leak/exposure monitoring, actor/entity correlation, and sandboxed network/content analysis.

**Prohibited:** credential theft, illicit purchases, unauthorized access, and unauthorized exploit activity.

## UC-10 — Use a Country Intelligence Pack

**Primary actor:** Investigator or Intelligence Analyst  
**Release context:** Roadmap Phase 6  
**Goal:** Discover jurisdiction-relevant official and local-language sources.

IOP selects a versioned country pack containing official government sources, registries, local identifiers, local-language queries, public social ecosystems, geospatial, cyber, procurement, supplier, and legal/public-record sources. Sources are health-checked and changes tracked. URLs must not be invented; jurisdiction and authorization must be respected.

## UC-11 — Evaluate a dataset

**Primary actor:** Dataset specialist or investigator  
**Goal:** Use datasets as governed context/evidence inputs.

Candidate datasets from Hugging Face, GitHub, Kaggle, Zenodo, government open data, or academic repositories pass license, security, provenance, quality, bias/coverage, and production-suitability gates before use.

**Boundary:** A dataset is not automatic truth.

## UC-12 — Analyze supply-chain risk propagation

**Primary actor:** Supply-Chain Risk Analyst  
**Release context:** Roadmap Phase 7  
**Goal:** Understand dependencies and cyber, ownership, geographic, and operational risk propagation.

IOP models Customer, Supplier, Tier-N, Component, Software, Hardware, AI model/agent, Facility, Logistics, Geography, Vulnerability, and Business Impact. It supports Tier-2/Tier-3 mapping, ownership/FOCI, concentration analysis, BOM/VEX/VDR context, vulnerability propagation, blast-radius analysis, cryptographic asset inventory, and business-impact analysis.

## UC-13 — Route AI/models under policy and cost constraints

**Primary actor:** Platform operator; Manager/Planner functions  
**Goal:** Select replaceable model providers without single-provider dependency.

Routing considers task, quality, context, privacy, jurisdiction, cost, latency, quota, provider health, and availability. Hashing, parsing, arithmetic, schema validation, graph traversal, standards processing, and evidence integrity prefer deterministic execution.

## UC-14 — Audit an investigation

**Primary actor:** Compliance or authorized reviewer  
**Goal:** Prove how findings were produced.

The reviewer examines authorization, scope, case ID, trace ID, audit context, evidence and claim links, source metadata, transformations, agent/tool/model/prompt execution, approvals, versions, retention context, and replay outcome.

## Success metrics

Use Time-to-Defensible Intelligence, evidence coverage, independent corroboration rate, false entity merge rate, manual tool-switch count, investigation completion time, cost per verified finding, replay success rate, analyst correction rate, time-to-first-useful-finding, duplicate findings, contradiction discovery, report preparation time, cost per investigation, and replay consistency. The source does not define numeric targets.

See [FEATURES.md](FEATURES.md), [USER_FLOWS.md](USER_FLOWS.md), and [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md).
