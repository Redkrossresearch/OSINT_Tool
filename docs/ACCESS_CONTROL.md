# Access Control — Redkross OSINT Investigation Platform

**Last Updated:** 26 August 2026
**Authority:** This document is the authoritative access structure for `Redkrossresearch/OSINT_Tool`.

---

## 1. Leadership Hierarchy

### Level 1 — FULL ADMIN

| Person | GitHub | Role | Repository Access | Org Access |
|---|---|---|---|---|
| Shivam Mittal | `shivammittal2403` | CEO / Main Administrator | admin | Full administration |
| Ojas | `ojas1216` | Technical Administrator / Architect | admin | Full technical administration |

**Only these two have unrestricted repository administration.**

### Level 2 — DIRECTOR / OVERSIGHT

| Person | GitHub | Role | Repository Access | Org Access |
|---|---|---|---|---|
| Harsh | `harsh01harsh` | Director | read | Read-only oversight |

**Harsh must NOT receive:**
- Organization owner/admin privileges
- Repository admin privileges
- Technical-admin team membership
- Ability to modify architecture
- Ability to modify branch governance
- Ability to modify GitHub organization settings

**Harsh CAN:**
- Inspect the project, code, documentation
- View PRs and progress
- Read all non-sensitive project materials

### Level 3 — TEAM LEADS

Team leads receive team-specific write/maintain permissions. Assigned after Excel roster.

### Level 4 — INTERNS

Interns receive team-specific write/contribution access. Assigned after Excel roster.

**Interns must NEVER receive:**
- Organization admin
- Repository admin
- Technical-admin team membership
- Unrelated team administrative privileges

---

## 2. Organization Administration

| Action | Authorized |
|---|---|
| Modify org settings | Shivam, Ojas |
| Manage org teams | Shivam, Ojas |
| Manage org members | Shivam, Ojas |
| Change org billing | Shivam only |
| Modify org ownership | Shivam only (with explicit approval) |
| Create/delete repositories | Shivam, Ojas |

---

## 3. Technical Administration

| Action | Authorized |
|---|---|
| Architecture decisions | Ojas (authority), Shivam (approval) |
| CI/CD configuration | Ojas |
| Security configuration | Ojas |
| Repository governance | Ojas |
| Branch protection rules | Ojas (when GitHub Pro obtained) |
| CODEOWNERS management | Ojas |
| Database architecture | Ojas (approval required) |
| Public interface changes | Ojas (approval required) |

---

## 4. Director Oversight

| Action | Authorized |
|---|---|
| View repository | Yes |
| View code | Yes |
| View documentation | Yes |
| View PRs | Yes |
| View issues | Yes |
| View progress | Yes |
| Modify code | No |
| Merge PRs | No |
| Modify governance | No |
| Modify architecture | No |
| Modify CI/CD | No |
| Manage teams | No |

---

## 5. Team Lead Permissions

| Action | Authorized |
|---|---|
| Review PRs in own team | Yes |
| Merge PRs in own team | Yes (after review) |
| Assign tasks to interns | Yes |
| Modify team-owned code | Yes |
| Modify other team's code | No (without authorization) |
| Modify global architecture | No |
| Modify CI/CD | No |
| Manage org settings | No |

---

## 6. Intern Permissions

| Action | Authorized |
|---|---|
| Create feature branches | Yes |
| Submit PRs to team branch | Yes |
| Modify team-owned code | Yes (via PR) |
| Modify other team's code | No |
| Merge PRs | No |
| Push to main | No |
| Force push | No |
| Modify CI/CD | No |
| Modify governance docs | No |

---

## 7. Repository Access Model

```
SHIVAM (shivammittal2403)
  └── admin — Full repository administration

OJAS (ojas1216)
  └── admin — Full repository administration
  └── technical-admins team — Technical governance

HARSH (harsh01harsh)
  └── read — Read-only oversight
  └── directors team — Oversight visibility

TEAM LEADS (pending Excel roster)
  └── team-specific write/maintain

INTERNS (pending Excel roster)
  └── team-specific write/contribution
```

---

## 8. Least-Privilege Policy

Every user receives the **minimum permissions necessary** for their role.

| Principle | Implementation |
|---|---|
| Default deny | No access unless explicitly granted |
| Role-based | Permissions tied to role, not individual |
| Team-scoped | Write access limited to team-owned directories |
| No cross-team | Interns cannot modify other team's code |
| No self-merge | Nobody merges their own PRs |
| Audit trail | All actions logged |

---

## 9. Permission Escalation Process

If a user needs elevated permissions:

1. **Request** — User explains what access is needed and why
2. **Review** — Ojas reviews the request
3. **Approval** — Shivam approves (for admin changes) or Ojas approves (for team-level)
4. **Implementation** — Change is made via GitHub API or web UI
5. **Documentation** — Change is recorded in ACCESS_CONTROL.md
6. **Verification** — Change is verified

**Emergency escalation:**
- If Ojas is unavailable → Shivam handles
- If Shivam is unavailable → Ojas handles
- Both unavailable → No changes until one returns

---

## 10. Emergency Administrator Procedure

In case of security incident or urgent governance need:

1. **Identify** — Describe the emergency
2. **Contain** — Revoke compromised access immediately
3. **Notify** — Inform Shivam and Ojas
4. **Investigate** — Review audit logs
5. **Remediate** — Fix the issue
6. **Document** — Record in incident log
7. **Prevent** — Update controls to prevent recurrence

**Emergency contacts:**
- Shivam Mittal: `shivammittal2403`
- Ojas: `ojas1216`

---

## Current Permission Matrix (26 August 2026)

**Note:** Private-repo GitHub permissions are repository-wide. Team branches provide **logical ownership**, not folder-level security. Effective write access for interns flows through active team membership.

### Leadership

| Username | Role | Repo Permission | Team Membership | Notes |
|---|---|---|---|---|
| shivammittal2403 | CEO | admin | — | Full admin |
| ojas1216 | Tech Architect | admin | technical-admins | Full admin |
| harsh01harsh | Director | admin* | directors | *Needs reduction to read via web UI |

### Team 1 — team-core (head: Preetam-06, maintainer)

| Username | Role | Team Membership | Effective Access |
|---|---|---|---|
| Preetam-06 | Head Intern | active (maintainer) | write |
| Dinesh-Kumar-Ved | Intern | active | write |
| Zrahul2024 | Intern | pending org invite | pending |
| jadhavsarthak374-ai | Intern | pending org invite | pending |
| ANDY15K | Intern | pending org invite | pending |

### Team 2 — team-connectors (head: riddhisawant305-jpg, maintainer)

| Username | Role | Team Membership | Effective Access |
|---|---|---|---|
| riddhisawant305-jpg | Head Intern | active (maintainer) | write |
| yadavchinmay45-cloud | Intern | active | write |
| AaryanDhotre2326 | Intern | active | write |
| antarahire22-creator | Intern | active | write |
| darshankamble0628-coder | Intern | active | write |

### Team 3 — team-intelligence (head: hirveabhishek2006-design, maintainer)

| Username | Role | Team Membership | Effective Access |
|---|---|---|---|
| hirveabhishek2006-design | Head Intern | active (maintainer) | write |
| katkarsujal1-design | Intern | active | write |
| raunaksin9890-gif | Intern | active | write |
| lahanesakshi-create | Intern | active | write |
| Pannkajyadhav333 | Intern | active | write |
| parthvichare20 | Intern | active | write |

### Team 4 — team-ai-verification (head: sumeetmore334-rgb, maintainer)

| Username | Role | Team Membership | Effective Access |
|---|---|---|---|
| sumeetmore334-rgb | Head Intern | pending org invite (maintainer) | pending |
| shraddhamahindrakar217-cloud | Intern | active | write |
| anujmore2006-collab | Intern | pending org invite | pending |
| Akash-Upade | Intern | pending org invite | pending |

### Team 5 — team-product (head: Ishauparkar13, maintainer)

| Username | Role | Team Membership | Effective Access |
|---|---|---|---|
| Ishauparkar13 | Head Intern | active (maintainer) | write |
| aryanbhosale20 | Intern | active | write |
| dakshjadyar | Intern | active | write |
| Deepkasare | Intern | active | write |
| krishnasondigala-sys | Intern | active | write |
| khushishukla3008-star | Intern | active | write |

### Non-Roster Collaborators (existing, flag for human review)

| Username | Repo Permission | Status |
|---|---|---|
| Upasana1611 | read | FLAG — not in roster |
| PiyushBabele1 | read | FLAG — not in roster |

**\*ACTION REQUIRED (Harsh):** Change repository/org permission from `admin` to `read` via GitHub web UI. Another org owner (Shivam) must change Harsh's org role in Settings → Members.

**ACTION REQUIRED (org invitations):** 6 interns must accept their organization invitation for team membership to become active: Zrahul2024, jadhavsarthak374-ai, ANDY15K (Team 1); sumeetmore334-rgb, anujmore2006-collab, Akash-Upade (Team 4).
