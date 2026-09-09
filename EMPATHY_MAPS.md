# IOP Evidence-Bound Empathy Maps

## Document purpose and source boundary

These empathy maps organize only the jobs, pains, gains, principles, and validation questions explicitly present in `IOP_complete_conversation_product_memory.json`. The source does not provide direct user quotations, field observations, demographics, emotional labels, organization profiles, or behavioural-frequency data. Accordingly, “Says,” “Thinks,” “Feels,” and “Does” are not presented as observed facts.

The source-supported structure is: **Job → Pains → Desired outcomes → Required safeguards → Validation questions**.

## Shared investigator empathy context

### Common environment

- Information is abundant but fragmented.
- The intelligence-production bottleneck is converting information into verified, explainable, reproducible intelligence.
- Existing work involves disconnected tools, manual correlation, evidence handling, and reporting.
- The operating loop runs from an authorized objective through planning, collection, evidence, graph analysis, verification, reporting, and replay.

### Common needs

- Evidence before AI narrative
- Clear source attribution
- Visible uncertainty
- Graph, timeline, and evidence together
- Progressive disclosure
- High information density without clutter
- Accessible and responsive interfaces
- Human approval for high-impact actions

### Unknowns that must be researched

Direct quotes, emotional states, work setting, frequency of tasks, procurement influence, team composition, and accessibility needs beyond the stated “accessible and responsive” principle are not specified.

## Cybercrime Investigator

### Job

Turn a complex authorized investigation objective into defensible intelligence.

### Pains

- Disconnected tools and repetitive searches
- Entity ambiguity and duplicate results
- Weak provenance
- Manual evidence collection and reporting
- Difficult reproduction

### Desired outcomes

- Faster investigations
- Evidence-linked findings
- Better entity resolution
- Cross-domain correlation
- Transparent uncertainty
- Reproducible research

### Product safeguards that matter

- Public or authorized sources only
- Immutable/versioned historical evidence
- Evidence-to-claim linkage
- Independent corroboration and contradiction search
- Replay support and audit trail

### Validation focus

Measure time-to-first-useful-finding, time-to-defensible-finding, manual tool switches, evidence coverage, false merges, duplicate findings, contradiction discovery, report preparation time, cost per investigation, and replay consistency.

## Intelligence Analyst

### Job

Transform fragmented observations into structured intelligence.

### Pains

- Information overload
- Conflicting sources
- Manual correlation
- Confirmation bias
- Ambiguous entities

### Desired outcomes

- Structured evidence
- Pattern discovery
- Contradiction detection
- Timeline analysis
- Graph relationships

### Product safeguards that matter

- Observation and inference remain separate
- Correlation and causation remain separate
- Entity merges expose uncertainty
- Source independence is measured
- Model disagreement triggers verification, not majority-vote truth

### Validation focus

Ask where the analyst distrusted the system, which result was useful or misleading, and where uncertainty was unclear.

## Financial Crime/AML Investigator

### Job

Identify suspicious financial behaviour and relationships for human investigation.

### Desired outcomes represented in the source

- Risk signals and account profiles
- Transaction graphs and flow-of-funds visualization
- Investigation-ready reports
- Human review workflow

### Product safeguards that matter

- **Risk signal is not a criminality determination.**
- Automatic criminal conclusions are outside the initial scope.
- Inputs must be authorized, anonymized, simulated, or otherwise within scope.
- Sensitive-data exposure is minimized.
- High-impact actions require human approval.

### Unknowns that must be researched

Persona-specific pains and gains beyond the job, outputs, and design rule are not stated in the source.

## Threat Intelligence Analyst

### Job

Connect indicators, infrastructure, actors, campaigns, and events into evidence-supported assessments.

### Desired outcomes represented in the source

- Evidence-supported correlation
- Campaign clustering
- Risk classification
- Structured alerts and case packages
- Investigation dashboard and SIEM integration

### Product safeguards that matter

- Raw evidence preservation
- Indicators are not proof of authorship
- Licensed/public/authorized DARKINT only
- Independent corroboration and alternative-explanation search
- No guaranteed attribution

### Unknowns that must be researched

Persona-specific pains, desired gains, tooling environment, and response-time expectations are not stated.

## Supply-Chain Risk Analyst

### Job

Understand dependencies and model cyber, ownership, geographic, and operational risk propagation.

### Desired outcomes represented in the source

- Tier-N dependency mapping
- Ownership/FOCI insight
- Facility and geographic concentration insight
- Vulnerability propagation and blast-radius analysis
- Business-impact analysis

### Product safeguards that matter

- Evidence-linked graph edges
- Temporal relationships and multi-hop traversal
- Provenance and auditability
- Visible uncertainty in entity resolution
- Jurisdiction, authorization, and purpose controls

### Unknowns that must be researched

Persona-specific pains, gains, data-refresh expectations, and decision thresholds are not stated.

## Research prompts

Use the source-defined validation questions without converting assumptions into facts:

1. Where did the system save time?
2. Where did the analyst distrust it?
3. Which result was useful?
4. Which was misleading?
5. Where was uncertainty unclear?
6. Which manual step should remain human-controlled?
7. Which feature would the analyst remove?

Related documents: [USER_PERSONAS.md](USER_PERSONAS.md), [JTBD.md](JTBD.md), and [USER_JOURNEYS.md](USER_JOURNEYS.md).
