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

| Team | Slug | ID | Privacy | Permission | Purpose | Members |
|---|---|---|---|---|---|---|
| technical-admins | `technical-admins` | 19165676 | closed | push | Technical architecture & governance | ojas1216 |
| directors | `directors` | 19165984 | closed | pull | Director oversight | harsh01harsh |
| team-core | `team-core` | 19165667 | closed | push | Core Platform + Evidence | (pending) |
| team-connectors | `team-connectors` | 19165668 | closed | push | Connectors + Collection | (pending) |
| team-intelligence | `team-intelligence` | 19165669 | closed | push | Intelligence + Entity + Graph | (pending) |
| team-ai-verification | `team-ai-verification` | 19165670 | closed | push | AI + Verification | (pending) |
| team-product | `team-product` | 19165671 | closed | push | Frontend + Reporting + QA | (pending) |

---

## Repository Collaborators

| Username | Role | Repo Permission | Team Membership | Notes |
|---|---|---|---|---|
| shivammittal2403 | CEO | admin | — | Full admin |
| ojas1216 | Tech Architect | admin | technical-admins | Full admin |
| harsh01harsh | Director | admin* | directors | *Needs reduction to read via web UI |
| Upasana1611 | Pending | read | — | Awaiting roster |
| Preetam-06 | Pending | write | — | Awaiting roster |
| PiyushBabele1 | Pending | read | — | Awaiting roster |
| riddhisawant305-jpg | Pending | write | — | Awaiting roster |
| ishauparkar13 | Pending | write | — | Awaiting roster |
| hirveabhishek2006-design | Pending | write | — | Awaiting roster |
| sumeetmore334-rgb | Pending | write | — | Awaiting roster |

**\*ACTION REQUIRED:** Harsh's repo permission must be changed from admin to read via GitHub web UI by another org owner.

---

## Organization Members

| Username | Role | Notes |
|---|---|---|
| harsh01harsh | Member* | *Org owner status unknown (requires admin:org scope) |
| ojas1216 | Member | CLI authenticated user |
| PiyushBabele1 | Member | — |
| shivammittal2403 | Member* | *Org owner status unknown |
| Upasana1611 | Member | — |

---

## CODEOWNERS Status

**NOT ACTIVE.** See `docs/CODEOWNERS_PLAN.md` for intended mapping.

Activation requires:
1. Team members assigned (Excel roster)
2. Repository team access configured
3. Team leads confirmed

---

## Branch Protection Status

**NOT CONFIGURED.** GitHub Free plan does not support branch protection for private repos.

Required action:
- Upgrade to GitHub Pro, OR
- Enforce via convention and team discipline

---

## Team Branches

**NOT CREATED.** Will be created after team membership is finalized.

| Branch | Purpose |
|---|---|
| `team/1-core` | Team 1 integration |
| `team/2-connectors` | Team 2 integration |
| `team/3-intelligence` | Team 3 integration |
| `team/4-ai-verification` | Team 4 integration |
| `team/5-product` | Team 5 integration |

---

## Pending Items

| Item | Status | Blocked By |
|---|---|---|
| Excel roster | Pending | CEO delivery |
| Team member assignments | Pending | Excel roster |
| Harsh repo permission reduction | Pending | Web UI by org owner |
| CODEOWNERS activation | Pending | Team membership |
| Branch protection | Pending | GitHub Pro or convention |
| Team branches | Pending | Team membership |
| Task assignments | Pending | Team leads confirmed |

---

## CLI Authentication

Authenticated as: `ojas1216`
Token scopes: `gist`, `read:org`, `repo`, `workflow`
Missing: `admin:org` (required for team-repo access management)

To enable full governance operations:
```
gh auth refresh -h github.com -s admin:org
```

---

## Related Documents

- `docs/ACCESS_CONTROL.md` — Authoritative access structure
- `docs/TEAM_MEMBERS_PENDING.md` — Pending team membership
- `docs/CODEOWNERS_PLAN.md` — CODEOWNERS activation plan
