---
title: '1.3 FilterBuilder overview'
type: 'feature'
created: '2026-11-18'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'ede371394e6f925d38726f1eac8baba3c1353662'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/libs/vortex-ui/src/lib/docs/data-management/storybook-prd-tracking.mdx'
  - '{project-root}/docs/research/devextreme-data-management/raw/143-FilterBuilder-WithDataGrid.json'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `vx-filter-builder` is an M0 stub: flat conditions, Apply emits only the first condition as `VxFilterState`, Storybook still lives under `Data/FilterBuilder`, and research demo 143 remains `TODO` — so apps cannot compose a typed expression model that round-trips into visible grid rows (FR5 / FR32).

**Approach:** Harden the FilterBuilder Signals surface (`fields` / `value` model / apply outputs), make add/remove of groups and conditions update the expression model, ship Storybook `Data Management/FilterBuilder/143-WithDataGrid` (standalone builder + DataGrid apply/clear on Fluent Light), and raise PRD 143 to at least `M1`.

**Decision — NESTED_GROUPS:** `NESTED_ONE_LEVEL` — UI supports add/remove of nested groups up to depth 1 under the root; root + one nested level of AND/OR groups with conditions.

## Boundaries & Constraints

**Always:**
- Extend existing `VxFilterBuilderComponent` in place (`selector: 'vx-filter-builder'`); keep Standalone + Signals + OnPush + `--vx-*` tokens only.
- Expression model is the source of truth via `value` `model`; Apply also emits the full model (`applied`) and a DataSource-consumable filter that can change visible DataGrid rows for multi-condition AND/OR (not first-condition-only).
- Nested groups: max depth 1 under the root (root group → nested groups → conditions only; no deeper nesting).
- Storybook title exactly `Data Management/FilterBuilder/143-WithDataGrid` with `tags: ['autodocs']`; cite parity image `143-FilterBuilder-WithDataGrid.png` in docs description; Fluent Blue Light default.
- Fields in the 143 story match a local sample grid dataset (reuse DataGrid story row shape: `product` / `region` / `sector` or equivalent).
- Update research `PRD-DATA-MANAGEMENT.md` demo 143 **Status Vortex** to at least `M1` and tick Storybook AC checkbox when the story exists.
- Unit-test public expression emit + DataSource-compatible filter evaluation for I/O matrix rows (NFR8).

**Never:**
- Filter Panel chrome / integrated panel invoke (Story 1.4).
- Custom operators / `maxGroupLevel` / customization demo 145 (Story 1.5).
- List binding demo 144; TreeList/CardView/Pivot; DevExtreme runtime; shipping research PNGs in npm/Storybook static assets.
- Rewrite theme tokens, rename public barrels, or redesign DataGrid editing/selection.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Empty builder | `conditions: []`, Apply | `applied` = empty model; grid filter cleared (`null`) | N/A |
| Add/remove condition | User adds then removes a condition | `value` model updates live with stable condition `id`s | N/A |
| Multi-condition AND | Two conditions, logic `and`, Apply | Grid rows match both; `applied` has both | Incomplete row (empty value) ignored in filter eval |
| Multi-condition OR | Two conditions, logic `or`, Apply | Grid rows match either | Same incomplete-row skip |
| Clear | Clear after applied filter | Model reset; grid shows full local set | N/A |
| Unsupported-op map | Condition `startsWith`/`gt`/`lt` applied via DataSource path | Evaluated per operator semantics (string prefix / numeric-or-string compare) | Non-comparable values → row excluded for gt/lt |
| Nested group depth | Add nested group at depth 1; attempt deeper nest | Nested group allowed; further nest blocked/no-op | N/A |

</frozen-after-approval>

## Code Map

- `libs/vortex-ui/src/lib/components/filter-builder/filter-builder.component.ts` — **extend**: nested expression model (max depth 1), add/remove group/condition UX, fix Apply to emit full model + DataSource-compatible filter (drop first-condition-only). Reuse token styles; keep Portuguese chrome labels unless a tiny English tweak is required for gallery clarity.
- `libs/vortex-ui/src/lib/components/data-grid/data-source.ts` — **extend** filter evaluation so Array `load({ filter })` (or a documented companion expression type) honors multi-condition AND/OR + `startsWith`/`gt`/`lt` needed by Apply. Keep flat single `VxFilterState` backward compatible for existing DataGrid toolbar filter.
- `libs/vortex-ui/src/lib/components/data-grid/data-grid.component.ts` — only if `setFilter` / load typing must accept the richer filter shape; **do not** build Filter Panel.
- `libs/vortex-ui/src/lib/components/filter-builder/143-with-data-grid.stories.ts` — **create** CSF `Data Management/FilterBuilder/143-WithDataGrid` composing `vx-filter-builder` + `vx-data-grid` with apply/clear.
- `libs/vortex-ui/src/lib/components/filter-builder/filter-builder.stories.ts` — leave legacy `Data/FilterBuilder` as-is (convention is additive).
- `libs/vortex-ui/src/lib/components/filter-builder/filter-builder.spec.ts` — **create** Vitest for matrix rows (emit + filter eval helpers).
- `libs/vortex-ui/src/lib/components/data-grid/data-source.spec.ts` — **extend** only if filter eval lives in DataSource.
- `docs/research/devextreme-data-management/PRD-DATA-MANAGEMENT.md` — demo 143 status → `M1` + Storybook checkbox.
- Continuity from 1.2: Vitest via `nx test vortex-ui`; no epic/story IDs in source comments.

## Tasks & Acceptance

**Execution:**
- [x] `libs/vortex-ui/src/lib/components/filter-builder/filter-builder.component.ts` — nested expression model (max depth 1) + group/condition mutations; Apply/Clear emit full model + consumable filter — FR5
- [x] `libs/vortex-ui/src/lib/components/data-grid/data-source.ts` (+ grid touch if typed) — evaluate multi-condition / extra operators without breaking single `VxFilterState` — round-trip
- [x] `libs/vortex-ui/src/lib/components/filter-builder/filter-builder.spec.ts` (+ data-source.spec if needed) — I/O matrix coverage — NFR8
- [x] `libs/vortex-ui/src/lib/components/filter-builder/143-with-data-grid.stories.ts` — `Data Management/FilterBuilder/143-WithDataGrid` Fluent Light — FR32 / UX-DR1 / UX-DR5 / UX-DR8
- [x] `docs/research/devextreme-data-management/PRD-DATA-MANAGEMENT.md` — demo 143 → ≥`M1` + Storybook AC tick — tracking rule

**Acceptance Criteria:**
- Given configured fields matching demo ~143 sample data, when I add/remove groups and conditions, then the expression model updates via Signals `model`/`output` (FR5, FR32).
- Given Apply with multiple conditions, when the 143 story grid loads, then visible rows match the expression; Clear restores the full local set.
- Given Storybook `Data Management/FilterBuilder/143-WithDataGrid`, when opened on Fluent Light, then the builder + grid composition is demonstrable with parity image cited (UX-DR1, UX-DR5, UX-DR8).
- Given research PRD demo 143, when the story lands, then Status Vortex is at least `M1`.
- Given `nx test vortex-ui` and `npm run lint`, when run, then new/updated tests pass and tsc exits 0.

## Implementation Notes

- Expression model lives in `filter-builder.model.ts` (`groups[]` depth-1 + `toDataFilter`); component UI adds/removes root conditions and nested groups; deeper nest is a no-op (`addNestedGroupInside`).
- DataSource accepts `VxDataFilter` = `VxFilterState | VxCompoundFilter`; `evaluateFilter` / `hasActiveFilter` shared with DataGrid client path; operators `startsWith` / `gt` / `lt` added; single-condition path unchanged.
- `applyFilter` now emits the full DataSource filter (not first-condition-only); `applied` still emits the builder model. Clear → `null` + empty model.
- Story `Data Management/FilterBuilder/143-WithDataGrid` wires Apply into `vx-data-grid.setFilter`; legacy `Data/FilterBuilder` left as-is.
- Verified: `npm run lint` (tsc 0) and `npx nx test vortex-ui` — 24 tests pass (filter-builder + data-source + client filter path).
- Risk: AI context still projects only the first *complete* leaf as `contains|equals` via `toAIFilterState` (AI contract unchanged). Visual chrome is token-based, not pixel-parity with DX pastel pills.
- Review patches: compound `evaluateFilter` skips inactive children; FilterBuilder component apply/clear/mutation tests; client filter path suite; `firstFilterLeaf` skips incompletes; filter pill gated by `hasActiveFilter`.

## Spec Change Log

## Review Triage Log

- Blind: sprint `in-progress` vs spec `done` — **false** — stale at review time; sprint synced to `review`, spec `in-review`.
- Blind: Story 143 missing Fluent Blue Light theme param — **false** — Fluent Light is Storybook toolbar default per UX-DR1 / convention; 1.2 stories same pattern.
- Blind: barrel dropped `VxFilterOperator` — **false** — still exported from `data-grid.component` (`export *`) and re-exported from `filter-builder.component` types; package root resolves via data-grid.
- Blind: `evaluateFilter` incomplete leaf = match breaks OR — **medium** — real; patched compound path to filter via `hasActiveFilter` + OR-incomplete unit test.
- Blind: `toAIFilterState` / first incomplete leaf nulls AI despite later complete leaf — **medium** — real; patched `firstFilterLeaf` to skip incompletes.
- Blind: no component tests for apply/clear/value mutations — **medium** — real; patched `filter-builder.spec.ts` with TestBed harness.
- Blind: `addNestedGroupInside` dead API — **low** — rejected (intentional depth guard; no UI affordance; everyday users never call it).
- Blind: compound filter pill shows only `AND (n)` — **low** — rejected (cosmetic; Apply AC does not require verbose pill copy).
- Blind: story host omits `value`/`applied` wiring — **false** — AC is Apply→grid; docs description already lists Signals; Clear emits `applyFilter(null)`.
- Blind: PRD 143 only Storybook checkbox at M1 — **false** — tracking rule requires ≥M1 + Storybook tick; remaining AC boxes are later maturity.
- Blind: `isCompoundFilter` hybrid object risk — **false** — typed union; no demonstrated caller builds hybrid bags.
- Blind: no migration note for `VxDataFilter` consumers — **low** — deferred with docs gallery toast typing (pre-existing gallery, not 143 path).
- Edge: OR compound + incomplete leaf matches all rows — **medium** — same root as Blind evaluateFilter; patched.
- Edge: firstFilterLeaf incomplete drops AI context — **medium** — same as Blind AI leaf; patched.
- Edge: filter pill for inactive filter object — **medium** — real; patched pill to `activeFilter` / `hasActiveFilter`.
- Edge: invalid compound logic silently OR — **false** — `logic` typed `'and'|'or'`; junk values are not a demonstrated caller path.
- Edge: invalid `groupId` mutation no-op — **false** — safe no-op; UI only passes known ids.
- Edge: `normalizeFilterBuilderValue` on null value — **false** — `model` default + typed non-null; no null binding in stories.
- Edge: story Apply before grid `viewChild` — **false** — grid is in same template; user Apply is post-render; optional chaining is sufficient.
- Verification-gap: apply/clear public emit untested — **medium** — real; patched component tests (disposition patch).
- Verification-gap: add/remove coverage never ran component mutations — **medium** — real; patched harness mutations (disposition patch).
- Verification-gap: DataGrid client `setFilter`/filteredClientRows untested — **medium** — real; added `data-grid-filter-client.spec.ts` mirroring client branch (disposition patch).
- Verification-gap: `VxRemoteMockDataSource` compound path untested — **medium** — deferred (outside 143 acceptance; Array/client path covered).
- Verification-gap Other: docs gallery `onFilterApply` still typed `VxFilterState` — **low** — deferred (apps/docs, not story 1.3 package surface).

## Design Notes

Demo 143 is **standalone** FilterBuilder filtering a DataGrid — not the integrated Filter Panel (that is 1.4). Prefer a thin story host that wires `applied` / filter output into `vx-data-grid.setFilter` (or equivalent) over inventing a second filter language.

Keep a single-condition `VxFilterState` path for existing grid chrome; richer Apply payload should be a compatible extension (union or wrapper) so 1.2 Array paging/sort/group stays untouched.

## Verification

**Commands:**
- `npm run lint` — expected: tsc exit 0
- `npx nx test vortex-ui` — expected: FilterBuilder + filter-eval tests pass

**Manual checks (if no CLI):**
- Storybook → `Data Management/FilterBuilder/143-WithDataGrid` on Fluent Light: add conditions, Apply narrows grid, Clear restores rows.
