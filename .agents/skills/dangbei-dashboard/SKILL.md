---
name: dangbei-dashboard
description: Use when creating, updating, comparing, validating, or publishing the Dangbei overseas sales-and-inventory HTML dashboard from the 新品N3 MAX / EOL Excel templates. Preserves existing UI and inventory accounting conventions.
---

# Dangbei Overseas Dashboard Skill

## Activation and boundaries
Use this skill for prompts like “把新模板更新到海外综合看板”, “比较 1109 和 1116 看板”, “给我一份看板分析报告”, “新增库存模块”, or “归档看板版本”. It is a **workflow skill**, not a claim that a workbook or browser is connected.

**The supplied workbook and HTML are the authoritative source for a specific update.** The rules in `docs/metrics.md` are verified against historical examples, not a license to override the current workbook. Preserve real dates, metric definitions, and visual components. Never fabricate missing cells or replace a broken source with data from a prior snapshot.

## Execute in this order

### 1. Locate and preserve inputs
- Identify the latest specifically named Excel and HTML inputs from the conversation or accessible library. If a file is inaccessible, report the exact name and blocker; do not guess its contents.
- Record source filenames, sheet names, export date, requested output date, and the last known dashboard version.
- Keep a copy of the existing HTML and workbook. Never overwrite earlier `1109`, `1116`, or `1123` versions by default.
- In a public repository, do not commit actual operational metrics, SKU-country detail, Excel workbooks, or private comparative reports. Use a private/approved destination for raw archives.

### 2. Inspect the workbook before coding
- Expect `新品N3 MAX` and `EOL` sheets, but verify actual sheet names, headers, row starts, values, formulas, and formatting before assuming offsets.
- Historical template: header row 4, first detail row 5, row 3 aggregate; columns A-D dimensions, E-I actual sales and averages, J FCST, K-Q inventory, R price, S inventory amount, T-W refurbishment in EOL.
- The code variables `m7,m8,m9,m10` map to **August, September, October, November** respectively in this historical version. Do not interpret `m7` as July.
- Preserve multi-model rows (e.g. bundle and standard) and stable product/country granularity.
- Audit blank vs zero, amount units, duplicate keys, merged summary cells and hidden rows. Do not double count summary row with details.

### 3. Build the snapshot
- Convert to the existing data object: `N3_COUNTRY`, `N3_SUMMARY`, `EOL` (per major SKU), `EOL_COUNTRY` (per model/country), `EOL_SUMMARY`, and `meta`.
- Use source values for amounts and reported summary columns. Recalculate aggregates at the correct grain for reconciliation, not as a replacement for the source truth.
- Update `meta.export_date`, `meta.updated_date`, `meta.source_file`, and dynamic counts only after reading source metadata.
- If source totals differ from independently computed totals, state the discrepancies and stop short of declaring completion.

### 4. Update the existing dashboard, not redesign it
- Retain dark-mode CSS, KPI cards, N3 and EOL tabs, SKU/country filters, column sorting, sticky header/columns, rankings, legends and note blocks.
- Replace the embedded `const DATA = {...};` object without rewriting unrelated CSS or JS logic.
- Maintain business definitions in `docs/metrics.md`; confirm special SKU exception logic instead of silently changing it.
- Never alter a metric to make a chart “look correct.” Explain data or business-rule inconsistencies.

### 5. Validate numbers and behavior
- Run checks in `docs/qa-checklist.md` and validate snapshot JSON with `node scripts/validate-snapshot.mjs <snapshot.json>`.
- Reconcile every KPI and SKU/country total against the sheet. Check N3 forecast achievement including zero-forecast cases.
- Check EOL inventory vs after-sales statuses, stock-turn days, classification and exceptions.
- Load the HTML in a browser: tabs, filters, sorting, horizontal scroll, sticky columns, zero/empty states, desktop and mobile.
- Check runtime JS errors. Test new and earlier snapshots for regressions.

### 6. Version, compare, deliver
- Output a dated HTML named `海外综合看板-YYYYMMDD.html` (or the exact name the user requests); preserve the original.
- When a comparison is requested, compute **snapshot-to-snapshot delta**, not automatically WoW sales. Describe changes in source completeness and metric definitions.
- Provide a concise release note: sources, date, changed modules, key reconciliation checks, unresolved issues, and exact output location.
- GitHub commit must exclude real business snapshots if the destination is public. If the user has not supplied an approved private destination, deliver the local artifact and indicate that raw GitHub upload remains pending.

## References
- [Detailed workflow](../../../docs/workflow.md)
- [Metric definitions](../../../docs/metrics.md)
- [QA checklist](../../../docs/qa-checklist.md)
- [Snapshot comparison guide](../../../docs/comparison-guide.md)
- [Original-file inventory](../../../docs/source-inventory.md)
- [Working sanitized demo](../../../examples/dashboard-demo.html)

## Typical acceptance criteria
- Every requested module visible, filters and sort working, no JavaScript exceptions.
- Summary stock, actual sales, FCST, inventory amount, and after-sales categories reconciled.
- No duplicate aggregation of transit, after-sales or summary rows.
- Data dates and source names reflect the supplied workbook; not historical hard-codes.
- Previous versions preserved; no confidential numbers in public Git history.
