# GAME MECHANICS SPECIFICATION
## LIFE LINES – THE 24-HOUR PUZZLE

---

### 1. Dynamic 24-Hour Timeline System

#### Chronological Representation
The core timeline spans active daylight and evening hours (06:00 to 24:00, 18 active hours). Each hour is represented as an interactive grid slot on the scheduling canvas.

#### Task Card Attributes
Every task possesses explicit constraints:
- `id`: Unique identifier (e.g. `task_pharmacy`)
- `title`: User-facing commitment description
- `durationHours`: Integer duration of time block (1 to 3 hours)
- `earliestStartHour`: Earliest time of day the task can begin (e.g. 09:00 for pharmacy opening)
- `deadlineHour`: Hard completion deadline (e.g. 13:00)
- `dependencies`: Array of prerequisite task IDs that must finish prior to starting this task
- `energyCost`: Energy deducted upon scheduling
- `moneyCost`: Cash deducted upon scheduling
- `stressCost`: Stress incurred or relieved upon scheduling

#### Conflict Detection & Collision Rules
The timeline engine executes strict validation algorithms:
1. **Overlap Prevention**: If time slot $[T_{start}, T_{end}]$ overlaps with any existing scheduled block, scheduling is blocked and a warning notification is displayed.
2. **Deadline Integrity**: If $T_{end} > \text{deadlineHour}$, the task is flagged as failed.
3. **Prerequisite Order**: If a dependency finishes at $T_{dep}$, the dependent task cannot start before $T_{dep}$.
4. **Algorithmic Auto-Optimization**: An integrated greedy scheduling assistant is available to compute a baseline valid schedule that players can inspect and adjust.

---

### 2. Forensic Clue & Investigation System

#### Evidence Objects
Evidence is categorized by type:
- `document`: Formal corporate, legal, or municipal records
- `message`: Private text, email, or Slack communications
- `object`: Physical artifacts (e.g. medical logs, prescription dispensers)

#### Mechanics of Discovery & Gatekeeping
- Clues display summary snippets on the dossier list. Clicking inspects full evidentiary text.
- Inspecting key documents unlocks hidden flags (e.g., discovering the phishing email alert allows the protagonist to petition for a federal banking clawback).
- Discovery progress directly feeds into the end-of-case **Investigative Insight** score.

---

### 3. Resource Management HUD

#### Resource Equations & Bounds
All resources update dynamically and broadcast state changes to the HUD:
- **Time**: $\text{Minutes} \in [0, 1440]$.
- **Energy**: $\text{Energy} \in [0, 100]$. Tasks cost 10–35% energy. Rest restorative actions recover energy.
- **Money**: Financial reserves in dollars. Deducted for emergency services, legal retainers, or medical consultations.
- **Stress**: $\text{Stress} \in [0, 100]$. Exceeding 70% penalizes final evaluation score. Exceeding 100% risks breakdown.
- **Relationships**: Individual trust scores per relevant character $[0, 100]$. An aggregate relationship average is continuously computed.

---

### 4. Decision & Consequence Engine

#### Decision Structure
Story beats present 2–3 meaningful choices with distinct moral and practical tradeoffs. Choices contain:
- `text`: Nuanced description of the proposed action.
- `consequenceSummary`: Immediate narrative feedback.
- `resourceEffects`: Mathematical delta applied to resources.
- `flags`: Narrative strings appended to the active case session (e.g. `['empathetic_approach', 'sibling_reunion']`).

#### Ending Resolution Logic
Endings are prioritized based on accumulated flags and resource thresholds. Rather than binary success/failure, scenarios yield nuanced qualitative conclusions:
- **Optimal Master Ending**: High integrity, harmonious preservation of life lines.
- **Compromised Ending**: Professional or practical victory achieved at a steep personal cost.
- **Resilient Settlement**: Survival through adversity with lessons learned.
