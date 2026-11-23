# Repository instructions

This repository stores a reusable **overseas dashboard update workflow**, not live production datasets.

When the user asks to update a dashboard from an Excel template:
1. Read `.agents/skills/dangbei-dashboard/SKILL.md` first.
2. Read `docs/metrics.md` and `docs/qa-checklist.md`.
3. Preserve the latest supplied HTML layout, navigation, filters, sort order, and business rules.
4. Use only the user's supplied workbook to construct data; never invent business figures.
5. Generate a new dated output; do not replace an earlier snapshot unless explicitly requested.
6. Keep real Excel workbooks, business snapshots, and operational reports OUT of this public repository; commit sanitized demonstrations and documentation only.
7. Report exact reconciliation results, source filename, snapshot date, and changed files. If a file cannot be accessed, list it as unavailable rather than fabricating it.
