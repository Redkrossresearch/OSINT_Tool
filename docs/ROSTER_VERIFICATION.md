# Roster Verification Report

**Repository:** Redkrossresearch/OSINT_Tool
**Organization:** Redkrossresearch
**Date:** 26 August 2026
**Method:** GitHub API (`gh api users/<username>`) — account existence verified for all 26 interns.
**Source of truth:** `July_Batch_Github_Username.xlsx`

---

## Summary

| Metric | Count |
|---|---|
| Interns in Excel roster | 26 |
| GitHub accounts verified (EXISTS) | 26 |
| Accounts not found | 0 |
| Username discrepancies resolved | 2 |
| Already org members | 20 |
| Pending org invitation | 6 |
| Assigned to a team | 26 |

---

## Username Discrepancies (RESOLVED)

The Excel roster contained two usernames that do not exist on GitHub. Both resolved via GitHub API:

| Excel Name | Excel Username | Verified GitHub Username | Status |
|---|---|---|---|
| Sakshi Lahane | `lahanesakahi-create` | `lahanesakshi-create` | ✅ Only `lahanesakshi-create` exists |
| Khushi Shukla | `khushishukla3008` | `khushishukla3008-star` | ✅ Only `khushishukla3008-star` exists |

Both alternatives were queried. The non-existent variants returned HTTP 404; the verified variants exist. Documentation and GitHub access use the **verified** usernames.

---

## Full Verification Table

| # | Excel Name | Excel Username | Verified Username | Team | Head? | Account Exists | Org Member | Team Assigned | Discrepancy |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Preetam OmNarayan Prajapati | Preetam-06 | Preetam-06 | team-core | ✅ Head | YES | ✅ | ✅ | None |
| 2 | Dineshkumar Ved | Dinesh-Kumar-Ved | Dinesh-Kumar-Ved | team-core | No | YES | ✅ | ✅ | None |
| 3 | Rahul Zore | Zrahul2024 | Zrahul2024 | team-core | No | YES | ⏳ Invited | ⏳ Pending | None |
| 4 | Sarthak Prashant Jadhav | jadhavsarthak374-ai | jadhavsarthak374-ai | team-core | No | YES | ⏳ Invited | ⏳ Pending | None |
| 5 | Anish Raghwani | ANDY15K | ANDY15K | team-core | No | YES | ⏳ Invited | ⏳ Pending | None |
| 6 | Riddhi Sawant | riddhisawant305-jpg | riddhisawant305-jpg | team-connectors | ✅ Head | YES | ✅ | ✅ | None |
| 7 | Chinmay Yadav | yadavchinmay45-cloud | yadavchinmay45-cloud | team-connectors | No | YES | ✅ | ✅ | None |
| 8 | Aaryan Dhotre | AaryanDhotre2326 | AaryanDhotre2326 | team-connectors | No | YES | ✅ | ✅ | None |
| 9 | Antara Hire | antarahire22-creator | antarahire22-creator | team-connectors | No | YES | ✅ | ✅ | None |
| 10 | Darshan Kamble | darshankamble0628-coder | darshankamble0628-coder | team-connectors | No | YES | ✅ | ✅ | None |
| 11 | Abhishek Hirve | hirveabhishek2006-design | hirveabhishek2006-design | team-intelligence | ✅ Head | YES | ✅ | ✅ | None |
| 12 | Sujal Katkar | katkarsujal1-design | katkarsujal1-design | team-intelligence | No | YES | ✅ | ✅ | None |
| 13 | Raunak Singh | raunaksin9890-gif | raunaksin9890-gif | team-intelligence | No | YES | ✅ | ✅ | None |
| 14 | Sakshi Lahane | lahanesakahi-create | **lahanesakshi-create** | team-intelligence | No | YES | ✅ | ✅ | ✅ Username corrected |
| 15 | Pankaj Yadav | Pannkajyadhav333 | Pannkajyadhav333 | team-intelligence | No | YES | ✅ | ✅ | None |
| 16 | Parth Vichare | parthvichare20 | parthvichare20 | team-intelligence | No | YES | ✅ | ✅ | None |
| 17 | Sumeet Nandu More | sumeetmore334-rgb | sumeetmore334-rgb | team-ai-verification | ✅ Head | YES | ⏳ Invited | ⏳ Pending | None |
| 18 | Anuj Nitin More | anujmore2006-collab | anujmore2006-collab | team-ai-verification | No | YES | ⏳ Invited | ⏳ Pending | None |
| 19 | Akash Chandrakant Upade | Akash-Upade | Akash-Upade | team-ai-verification | No | YES | ⏳ Invited | ⏳ Pending | None |
| 20 | Shraddha Mahindrakar | shraddhamahindrakar217-cloud | shraddhamahindrakar217-cloud | team-ai-verification | No | YES | ✅ | ✅ | None |
| 21 | Isha Uparkar | Ishauparkar13 | Ishauparkar13 | team-product | ✅ Head | YES | ✅ | ✅ | None |
| 22 | Aryan Bhosale | aryanbhosale20 | aryanbhosale20 | team-product | No | YES | ✅ | ✅ | None |
| 23 | Daksh Jadyar | dakshjadyar | dakshjadyar | team-product | No | YES | ✅ | ✅ | None |
| 24 | Deep Kasare | Deepkasare | Deepkasare | team-product | No | YES | ✅ | ✅ | None |
| 25 | Khushi Shukla | khushishukla3008 | **khushishukla3008-star** | team-product | No | YES | ✅ | ✅ | ✅ Username corrected |
| 26 | Krishna Sondigala | krishnasondigala-sys | krishnasondigala-sys | team-product | No | YES | ✅ | ✅ | None |

---

## Repository Access Status

- **Leadership:** shivammittal2403 (admin), ojas1216 (admin), harsh01harsh (read) — unchanged.
- **Effective write access for interns:** via active GitHub team membership (each development team has write permission).
- **20 interns:** team membership `active` → effective repo write.
- **6 interns (pending org invitation):** Zrahul2024, jadhavsarthak374-ai, ANDY15K (team-core) + sumeetmore334-rgb, anujmore2006-collab, Akash-Upade (team-ai-verification) — team membership `pending` until they accept the **organization invitation** they were sent.

> Note: GitHub private-repo permissions are repository-wide. Team branches provide **logical ownership**, not folder-level security. See `ACCESS_CONTROL.md`.

---

## Action Required (Human)

| # | Action | User(s) | Command / UI |
|---|---|---|---|
| 1 | Accept organization invitation | Zrahul2024, jadhavsarthak374-ai, ANDY15K, sumeetmore334-rgb, anujmore2006-collab, Akash-Upade | Email invite from GitHub → accept. After acceptance org membership is active and team membership becomes active. |
| 2 | Reduce Harsh to read-only | shivammittal2403 / ojas1216 | GitHub Web UI → repo Settings → Collaborators → set harsh01harsh to Read (requires web UI since Harsh may be org owner). |
| 3 | Review non-roster collaborators | shivammittal2403 | Decide on `Upasana1611`, `PiyushBabele1` (read-only, not in roster). |

---

## Verified Team Membership State (after changes)

| Team | Head (maintainer) | Members (active) | Members (pending org invite) |
|---|---|---|---|
| team-core | Preetam-06 | Dinesh-Kumar-Ved | Zrahul2024, jadhavsarthak374-ai, ANDY15K |
| team-connectors | riddhisawant305-jpg | AaryanDhotre2326, yadavchinmay45-cloud, antarahire22-creator, darshankamble0628-coder | — |
| team-intelligence | hirveabhishek2006-design | raunaksin9890-gif, katkarsujal1-design, Pannkajyadhav333, parthvichare20, lahanesakshi-create | — |
| team-ai-verification | sumeetmore334-rgb (pending) | shraddhamahindrakar217-cloud | sumeetmore334-rgb, anujmore2006-collab, Akash-Upade |
| team-product | Ishauparkar13 | aryanbhosale20, dakshjadyar, Deepkasare, krishnasondigala-sys, khushishukla3008-star | — |

All 5 head interns set as **maintainer** of their development team.
