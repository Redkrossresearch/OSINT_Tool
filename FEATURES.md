# IOP Features

## Product framing

IOP is a goal-oriented investigation platform that turns an authorized objective into evidence-preserved, verified, explainable, and reproducible intelligence. Evidence is the system of record; AI is replaceable; providers are adapters; MCP is an interoperability layer rather than the business-logic core; graph and search indexes are derived systems.

The source lists the following differentiators:

- Goal-oriented investigation instead of tool-first search
- Evidence Fabric and provenance-first architecture
- Universal Entity + Temporal Knowledge Graph
- Multi-model AI routing without single-provider dependency
- Bounded multi-agent research with adversarial supervisor
- Country Intelligence Packs with official/local-language sources
- Open API/MCP/connector ecosystem
- Cross-domain OSINT, CTI, FININT, DARKINT, and supply-chain intelligence
- Investigation replay and source-independence analysis
- Cost-aware information-gain research planning
- Supply-Chain Digital Twin and blast-radius analysis
- Customer-controlled/private/on-prem deployment options

## Feature catalog

### Investigation orchestration

- **Investigation Workspace** — central workspace for authorized investigations.
- **Objective Planner** — maps an objective to relevant intelligence domains, sources, tools, datasets, models, and actions.
- **Case Management** — manages investigation context.
- **Next-best-action planning** — uses evidence gaps to guide bounded continuation or finalization.
- **Investigation Dashboard** — provides an investigator-oriented overview.

### Discovery and source fabric

- **Source Registry**
- **Connector Registry**
- **Capability Registry**
- **Dorking Engine** — goal-driven discovery implemented in Python, not a standalone scraper.
- **Source Explorer**
- **Country Packs** — versioned dynamic intelligence packs with official sources, corporate registries, local identifiers, local-language queries, and jurisdiction-aware source management.
- **Dataset Registry and Dataset Intelligence** — gated by license, security, provenance, quality, bias/coverage, and production suitability.

### Evidence and provenance

- **Evidence Vault**
- **EvidenceObject, Observation, Claim, Hypothesis, Source, Dataset, Asset, Event, Execution, Run, and Report objects**
- Cryptographic content identity
- Acquisition timestamps and source metadata
- Immutable/versioned historical evidence
- Evidence-to-claim linkage
- Versioned transformations
- Audit trail
- Standards discussed in the source: C2PA, W3C Verifiable Credentials, RFC 3161, and W3C Trace Context; current versions/status require external verification.

### Parsing, entity resolution, and graph

- **Universal Parser**
- **Entity Resolution** with visible merge uncertainty
- **Universal Entity + Temporal Knowledge Graph**
- Multi-hop traversal and temporal relationships
- Pattern detection and network analysis
- Risk propagation and supply-chain dependency mapping
- Evidence-linked graph edges
- **Entity Profile, Graph Workspace, and Timeline**

### Analysis, verification, and supervision

- **Pattern Engine**
- **Contradiction Engine**
- **Verification Engine**
- **Supervisor**
- **Timeline Engine**
- **Risk Engine**
- Three-layer verification: integrity, independent corroboration, adversarial supervision
- Source-independence analysis
- Explicit evidence-gap handling
- Alternative-explanation and false-merge search
- **Verification Panel**

### AI and agent fabric

- **Model, Agent, and Prompt Registries**
- Multi-model routing based on task, quality, context, privacy, jurisdiction, cost, latency, quota, provider health, and availability
- Supported provider categories listed by the source: OpenAI, Google Gemini, Grok, Claude, Qwen, DeepSeek, Mistral, and local/self-hosted models
- Bounded specialist workers with Manager, Planner, domain, Pattern, Timeline, Graph, Risk, Provenance, Verification, Report, Compliance, and Supervisor roles
- Observable bounds for worker count, recursion, tool calls, runtime, budget, evidence volume, and parallelism
- **Agent/Execution Trace**

Deterministic execution is preferred for hashing, parsing, arithmetic, schema validation, graph traversal, standards processing, and evidence integrity.

### Intelligence domains

OSINT, WEBINT, SOCMINT, GEOINT, IMINT, VIDINT, AUDINT, DOCINT, PERSONINT, CORPINT, FININT, CTI, DARKINT, INFRAINT, Authorized Security Validation/Pentest Intelligence, FORENSICINT, Mobile/IoT/OT, Cloud/IAM, Transport, Environment, Dataset/AI Intelligence, Supply-Chain Intelligence, and Threat Email Intelligence.

### FININT

- CSV, Excel, PDF bank statement, anonymized/simulated KYC, and authorized transaction-feed inputs
- Financial-signal detection
- Account profiles, transaction graphs, and flow-of-funds visualization
- Investigation-ready reports and human review

**Rule:** Risk signal is not a criminality determination.

### Threat Email Intelligence

- Real-time scanning and raw evidence preservation
- Header and SPF/DKIM/DMARC/ARC analysis
- Sender/domain/IP, URL, attachment, semantic, and intent analysis
- Campaign clustering and CTI/OSINT/DARKINT correlation
- High, Medium/Suspicious, and Low/Safe risk classes
- Quarantine, spam redirection, hold for review, dashboards, structured alerts, case packages, SIEM integration, and continuous learning

### DARKINT

Licensed/public/authorized exposure intelligence, passive monitoring, ransomware and leak/exposure monitoring, actor/entity correlation, and sandboxed network/content analysis. Credential theft, illicit purchases, unauthorized access, and unauthorized exploit activity are prohibited.

### Supply-Chain Digital Twin

- Customer, Supplier, Tier-N, Component, Software, Hardware, AI model/agent, Facility, Logistics, Geography, Vulnerability, and Business Impact graph
- Tier-2/Tier-3 mapping and Ownership/FOCI
- Facility and geographic concentration
- SBOM, HBOM, OBOM, SaaSBOM, AIBOM, VEX, and VDR
- Vulnerability propagation, blast-radius analysis, cryptographic asset inventory, and business-impact analysis

### Reporting, replay, and integrations

- **Report Generator / Report Builder**
- **Replay Engine**
- **Alerting**
- **SIEM Integration**
- **API Gateway**
- **MCP Gateway**

Every MCP operation should ideally carry authorization, scope, case ID, trace ID, and audit context.

### Control plane and governance

IAM, RBAC, ABAC, policy, jurisdiction, purpose limitation, registries, audit, retention, approvals, secret references, and quotas.

### Memory

- Short-term/session, long-term/project, semantic, episodic investigation, and procedural memory
- Vector, graph, relational, and object/file storage
- Relevant prior investigations, entity profiles, source and dork suggestions, pattern alerts, investigation context, and next-step recommendations

### UX

- Professional, evidence-first, investigator-oriented enterprise interface
- Evidence before AI narrative
- Clear source attribution and visible uncertainty
- Graph + timeline + evidence together
- Progressive disclosure
- High information density without clutter
- Accessible and responsive

## MVP and roadmap placement

### MVP vertical slice

Person / Company / Domain / IP investigation, from objective and authorization through search, evidence, entity resolution, graph, AI correlation, independent verification, supervision, evidence-gap analysis, report, and replay.

### Roadmap

- Phase 0: discovery and architecture-gap analysis
- Phase 1: foundation, auth, case/evidence/source/connector registry, observability
- Phase 2: core investigation vertical slice
- Phase 3: graph, entity resolution, verification, replay
- Phase 4: multi-agent and multi-model routing
- Phase 5: FININT and Threat Email Intelligence
- Phase 6: DARKINT, Country Packs, broader OSINT
- Phase 7: Supply-Chain Digital Twin
- Phase 8: enterprise hardening, governance, commercial readiness

## Initial out-of-scope

- Universal integration with every vendor
- Autonomous law-enforcement action
- Unbounded agents
- Guaranteed attribution
- Unrestricted dark-web activity
- Automatic criminal conclusions
- Unlimited third-party API usage

## Risks and metrics

Key risks are scope explosion; data acquisition and licensing; AI hallucination; false entity merges; API/model cost; privacy/regulatory exposure; dark-web legal/operational risk; overbuilding before customer validation; vendor dependency; and false confidence from weak corroboration.

North-star metrics are Time-to-Defensible Intelligence, evidence coverage, independent corroboration rate, false entity merge rate, manual tool-switch count, investigation completion time, cost per verified finding, replay success rate, and analyst correction rate. No numeric thresholds are specified.

See [USE_CASES.md](USE_CASES.md) and [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md).
