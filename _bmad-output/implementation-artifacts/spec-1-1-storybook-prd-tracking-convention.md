---
title: '1.1 Storybook & PRD tracking convention'
type: 'feature'
created: '2026-11-16'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/docs/research/devextreme-data-management/README.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Parity demos `001–145` have no fixed Storybook home or shared rule for updating `PRD-DATA-MANAGEMENT.md` status, so later stories invent inconsistent paths and progress stays invisible.

**Approach:** Document under Storybook Data Management the path `Data Management/{Widget}/{NNN}-{Slug}`, require `autodocs` tags, define status values `TODO|M0|M1|M2|M3`, and state that `images/NNN-*.png` are internal visual AC only (must not ship in npm). Leave existing `Data/*` titles untouched; the new tree is additive for parity cases.

</frozen-after-approval>

## Implementation Notes

- Decision: MDX at `libs/vortex-ui/src/lib/docs/data-management/storybook-prd-tracking.mdx` with title `Data Management/_Docs/Storybook-PRD-Tracking` (additive; leave existing `Data/*` titles alone).
- Decision: status values and M0–M3 meanings aligned with `VortexUI-PRD.md` maturity table; status store remains `PRD-DATA-MANAGEMENT.md` only.
- Decision after review: `{Widget}` = PascalCase PRD/DX id (not kebab folder); one CSF file per `NNN`; reserved `_Docs` / `_Foundation`; CSF snippet for image cite; README reading-order step 2.
- Files: MDX convention doc; README pointer + reading order; sprint-status synced through `review`.
- Lint: `npm run lint` (tsc) passed after changes.

## Review Triage Log

- Widget segment ambiguous (PascalCase vs kebab folder) — **high** — real; MDX now states PRD/DX PascalCase widget id.
- No on-disk CSF layout rule — **medium** — real; added file-placement section.
- Missing CSF `docs.description` snippet for UX-DR8 — **medium** — real; added example.
- Autodocs / Signals surface underspecified — **medium** — real; require `component` on Meta + composition note.
- README IA reading order skipped convention — **medium** — real; inserted as step 2.
- Status bump vs Storybook checkbox unclear — **medium** — real; two-step PRD update rule.
- Fluent Blue Light default omitted — **low** — real; one-line default presentation rule.
- `_Docs` / `_Foundation` not reserved — **medium** — real; reserved-namespace table.
- Example skipped demo 144 — **low** — real; added `144-WithList`.
- npm image ban lacked verification hint — **low** — real; spot-check under `dist/libs/vortex-ui`.
- Oneshot spec missing FR/AC checklist — **false** — oneshot route intentionally keeps only Intent + Implementation Notes.
- README pointer incomplete vs intent — **medium** — real; expanded convention bullets (cite + npm ban).
