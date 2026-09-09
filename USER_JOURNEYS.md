# IOP User Journeys

## Purpose and interpretation

These journeys map the source-defined job map, investigation goal loop, personas, workspaces, safeguards, and roadmap. They are conceptual product journeys, not claims about observed user behaviour. No elapsed-time estimates or quantitative thresholds are added because the source does not specify them.

## Journey 1 — Core authorized investigation (MVP)

**Primary persona:** Cybercrime Investigator  
**MVP entities:** Person / Company / Domain / IP  
**Outcome:** A defensible, reproducible intelligence report

| Stage | User intent | IOP response | Evidence/governance requirement |
|---|---|---|---|
| Objective | State the investigation objective | Investigation Workspace records the objective | Objective must be authorized |
| Authorization/Scope | Establish permitted scope | Control Plane applies policy, jurisdiction, purpose limitation, and approvals | Authorization and scope remain in execution context |
| Plan | Determine how to investigate | Objective Planner selects relevant domains, sources, tools, datasets, models, and capabilities | Cost, latency, quotas, privacy, jurisdiction, provider health, and availability are observable |
| Discover/Search | Find relevant public or authorized information | Dork/Search and source routing perform goal-driven discovery | No credential harvesting, bypass, circumvention, unauthorized private-data access, or unauthorized exploitation |
| Evidence Capture | Preserve what was found | Evidence Vault records content identity, timestamps, source metadata, transformations, and audit trail | Historical evidence is immutable/versioned |
| Extract/Resolve | Identify entities and reduce ambiguity | Universal Parser extracts; Entity Resolution proposes identity links | Merge uncertainty remains visible; false merges are challenged |
| Graph/Correlation | Connect observations and relationships | Temporal Knowledge Graph and AI correlation expose multi-hop, temporal, and cross-domain patterns | Edges link to evidence; observation and inference remain separate |
| Verify | Determine defensibility | Integrity checks, independent corroboration, and adversarial supervision run | Contradictions, missing provenance, alternative explanations, and false merges are surfaced |
| Evidence Gap | Decide what is missing | System identifies gaps and next-best action | Search remains bounded by runtime, budget, calls, evidence volume, and parallelism |
| Report | Communicate findings | Report Builder produces evidence-backed findings with source attribution | Uncertainty remains visible; no guaranteed-truth or attribution claim |
| Replay | Reproduce the investigation | Replay Engine reconstructs the run from recorded evidence and execution context | Versions and audit trail support reproducibility |

### Main workspaces

Investigation Dashboard, Entity Profile, Evidence Viewer, Graph Workspace, Timeline, Source Explorer, Agent/Execution Trace, Verification Panel, Report Builder, and—where relevant—Risk Dashboard and Supply Chain Digital Twin.

## Journey 2 — Intelligence synthesis and challenge

**Primary persona:** Intelligence Analyst  
**Outcome:** Structured intelligence that accounts for conflicts and uncertainty

1. Start with fragmented observations in an authorized case.
2. Preserve and normalize evidence rather than relying on an AI narrative.
3. Extract and resolve entities with uncertainty visible.
4. Explore evidence-linked graph relationships and timeline context.
5. Detect patterns and form explicit hypotheses.
6. Search for conflicting sources and contradictions.
7. Independently corroborate important findings.
8. Review alternative explanations and analyst corrections.
9. Produce an evidence-backed report and replayable run.

The critical design principles are: evidence before AI narrative, clear source attribution, visible uncertainty, graph + timeline + evidence together, and separation of observation from inference and correlation from causation.

## Journey 3 — Financial behaviour review (roadmap Phase 5)

**Primary persona:** Financial Crime/AML Investigator  
**Outcome:** Risk signals and relationships prepared for human investigation

1. Ingest CSV, Excel, PDF bank statements, anonymized/simulated KYC, or authorized transaction feeds.
2. Preserve source evidence and provenance.
3. Identify source-defined signals such as fan-in, fan-out, pass-through, round-trip/circular transactions, structuring indicators, geographic anomalies, KYC mismatch, or income/transaction inconsistency.
4. Build account profiles, transaction graphs, and flow-of-funds visualization.
5. Link signals and relationships to evidence.
6. Route results through verification, contradiction search, and human review.
7. Produce an investigation-ready report.

**Boundary:** Risk signals do not determine criminality; automatic criminal conclusions are outside scope.

## Journey 4 — Threat email investigation (roadmap Phase 5)

**Primary persona:** Threat Intelligence Analyst  
**Outcome:** Evidence-supported email risk assessment and case package

1. Scan email and preserve raw evidence.
2. Perform header forensics and SPF/DKIM/DMARC/ARC analysis.
3. Analyze sender, domain, IP, URLs, attachments, semantics, and intent.
4. Cluster campaigns and correlate CTI, OSINT, and authorized DARKINT.
5. Classify risk as High, Medium/Suspicious, or Low/Safe.
6. Support quarantine, spam redirection, or hold-for-review workflows, subject to human approval for high-impact actions.
7. Present findings in the Investigation Dashboard and structured alerts.
8. Generate a case package and support SIEM integration.

**Boundary:** VPN, Tor, or disposable-email signals are indicators, not proof of authorship.

## Journey 5 — Supply-chain risk propagation (roadmap Phase 7)

**Primary persona:** Supply-Chain Risk Analyst  
**Outcome:** Evidence-supported dependency, blast-radius, and business-impact analysis

1. Model customers, suppliers, Tier-N relationships, components, software, hardware, AI models/agents, facilities, logistics, geography, vulnerabilities, and business impact.
2. Map Tier-2/Tier-3 dependencies and ownership/FOCI relationships.
3. Incorporate SBOM, HBOM, OBOM, SaaSBOM, AIBOM, VEX, and VDR inputs where available and authorized.
4. Identify facility and geographic concentration.
5. Trace vulnerability propagation and blast radius.
6. Connect technical risk to business impact.
7. Preserve evidence-linked edges, temporal context, provenance, and uncertainty.
8. Produce a reviewable risk assessment.

## Journey-level measures

- Time-to-first-useful-finding
- Time-to-defensible-finding / Time-to-Defensible Intelligence
- Manual tool switches
- Evidence coverage
- Independent corroboration rate
- False entity merges
- Duplicate findings
- Contradiction discovery
- Report preparation time
- Cost per investigation / verified finding
- Replay consistency / success rate
- Analyst correction rate

The source supplies no numeric targets. See [USER_FLOWS.md](USER_FLOWS.md), [FEATURES.md](FEATURES.md), and [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md).
