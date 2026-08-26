# GitHub Organization Governance

**Organization:** Redkrossresearch
**Repository:** Redkrossresearch/OSINT_Tool
**Last Updated:** 25 August 2026
**Authority:** docs/ACCESS_CONTROL.md is the authoritative access structure.

---

## Organization

| Property | Value |
|---|---|
| Name | Redkross Research Foundation |
| Login | Redkrossresearch |
| Location | India |
| Website | redkross.org.in |
| Plan | Free |
| Public Repos | 9 |
| Created | June 10, 2026 |

---

## Repository

| Property | Value |
|---|---|
| Name | OSINT_Tool |
| Visibility | Private |
| Default Branch | main |
| Tags | phase-0-foundation |

---

## Leadership (Confirmed)

### Level 1 — FULL ADMIN

| Person | GitHub | Role |
|---|---|---|
| Shivam Mittal | `shivammittal2403` | CEO / Main Administrator |
| Ojas | `ojas1216` | Technical Administrator / Architect |

### Level 2 — DIRECTOR / OVERSIGHT

| Person | GitHub | Role |
|---|---|---|
| Harsh | `harsh01harsh` | Director |

**Harsh has read-only oversight. No admin, no technical-admin, no write access.**

---

## GitHub Teams (7)

| Team | Slug | ID | Privacy | Permission | Members |
|---|---|---|---|---|---|
| technical-admins | `technical-admins` | 19165676 | closed | push | ojas1216 |
| directors | `directors` | 19165984 | closed | pull | harsh01harsh |
| team-core | `team-core` | 19165667 | closed | push | ojas1216, Preetam-06, Dinesh-Kumar-Ved, Zrahul2024, jadhavsarthak374-ai, ANDY15K |
| team-connectors | `team-connectors` | 19165668 | closed | push | ojas1216, riddhisawant305-jpg, yadavchinmay45-cloud, AaryanDhotre2326, antarahire22-creator, darshankamble0628-coder |
| team-intelligence | `team-intelligence` | 19165669 | closed | push | ojas1216, hirveabhishek2006-design, katkarsujal1-design, raunaksin9890-gif, Pannkajyadhav333, parthvichare20 |
| team-ai-verification | `team-ai-verification` | 19165670 | closed | push | ojas1216, sumeetmore334-rgb, anujmore2006-collab, Akash-Upade, shraddhamahindrakar217-cloud |
| team-product | `team-product` | 19165671 | closed | push | ojas1216, Ishauparkar13, aryanbhosale20, dakshjadyar, Deepkasare, krishnasondigala-sys |

**Note:** Team members show as "pending" until they accept GitHub invitations.

---

## Repository Collaborators

| Username | Role | Repo Permission | Team Membership | Notes |
|---|---|---|---|---|
| shivammittal2403 | CEO | admin | — | Full admin |
| ojas1216 | Tech Architect | admin | technical-admins | Full admin |
| harsh01harsh | Director | admin* | directors | *Needs reduction to read via web UI |
| Upasana1611 | Pending | read | — | FLAG FOR HUMAN REVIEW |
| Preetam-06 | Head Intern | write | team-core | Team 1 head |
| PiyushBabele1 | Pending | read | — | FLAG FOR HUMAN REVIEW |
| riddhisawant305-jpg | Head Intern | write | team-connectors | Team 2 head |
| ishauparkar13 | Head Intern | write | team-product | Team 5 head |
| hirveabhishek2006-design | Head Intern | write | team-intelligence | Team 3 head |
| sumeetmore334-rgb | Head Intern | write | team-ai-verification | Team 4 head |

---

## CODEOWNERS

**ACTIVE.** See `.github/CODEOWNERS`.

| Directory | Owner |
|---|---|
| `services/core/`, `services/evidence/`, `packages/schemas/` | @Redkrossresearch/team-core |
| `connectors/`, `services/connectors/` | @Redkrossresearch/team-connectors |
| `services/intelligence/`, `services/graph/`, `packages/entities/` | @Redkrossresearch/team-intelligence |
| `services/ai/`, `services/verification/` | @Redkrossresearch/team-ai-verification |
| `apps/web/`, `services/reporting/` | @Redkrossresearch/team-product |
| Architecture/governance files | @Redkrossresearch/technical-admins |

---

## Branch Protection Status

**NOT CONFIGURED.** GitHub Free plan does not support branch protection for private repos.

Enforced via: documentation, PR workflow, CODEOWNERS, CI, team discipline.

---

## Pending Items

| Item | Status | Blocked By |
|---|---|---|
| Harsh permission reduction | Pending | Web UI by org owner |
| Upasana1611 review | Pending | Human decision |
| PiyushBabele1 review | Pending | Human decision |
| lahanesakshi-create invitation | Pending | Intern accepting invitation |
| khushishukla3008-star invitation | Pending | Intern accepting invitation |

---

## Related Documents

- `docs/ACCESS_CONTROL.md` — Authoritative access structure
- `docs/TEAM_ROSTER.md` — Full roster with task assignments
- `docs/TEAM_MEMBERS_PENDING.md` — Team membership details
