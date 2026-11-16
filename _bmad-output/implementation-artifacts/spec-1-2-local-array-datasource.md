---
title: '1.2 Local Array DataSource'
type: 'feature'
created: '2026-11-16'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '3a93cb11ca692e2fb5acd60cf6686d87705e0451'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/libs/vortex-ui/src/lib/docs/data-management/storybook-prd-tracking.mdx'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `VxArrayDataSource` already filters/sorts/slices in memory but lacks `keyExpr`, client `group` on `load`, Storybook empty/loading/error demos, and unit tests — so widgets cannot rely on a stable local-data kernel (FR6 / NFR8 / UX-DR10).

**Approach:** Extend the existing `VxArrayDataSource` + `VxDataSourceLoadOptions` with `keyExpr` and client `group`, keep results + `totalCount` correct with stable keys, add Storybook `Data Management/_Foundation/DataSource-Array`, and cover the public `load` API with Vitest.

## Boundaries & Constraints

**Always:**
- Extend the current `VxDataSource` / `VxArrayDataSource` in place (same export path via data-grid barrel).
- `keyExpr` is a string field name (or getter path as a single string key on the row); `keyOf(item)` returns a stable primitive key.
- Client `load` supports `skip` / `take` / `sort` / `filter` / `group` (single-level: first field if an array is passed).
- When `group` is set, `data` is `VxArrayGroup<T>[]` (`{ key, items, count }`); `totalCount` is the filtered leaf-item count; `skip`/`take` page **groups**.
- When `group` is unset, behavior stays flat `T[]` + filtered `totalCount` (backward compatible).
- Storybook title exactly `Data Management/_Foundation/DataSource-Array` with `tags: ['autodocs']`; show empty, loading, and error states.
- Unit tests cover public `load` (sort/filter/group/skip/take + keys).

**Never:**
- Do not invent a second DataSource type or move the module to `core/` in this story.
- Do not wire TreeList/CardView to DataSource; do not implement `VxCustomStore` / real remote.
- Do not rename existing `Data/*` Storybook titles; do not ship research PNGs.
- Do not change DataGrid grouping UI (`groupBy` model) beyond what is required to compile against updated load types.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Flat page | items + keyExpr; load skip/take/sort/filter | `data` page + `totalCount` after filter; keys stable via keyOf | N/A |
| Empty | items `[]` | `data: []`, `totalCount: 0` | N/A |
| Group page | `group: 'field'` | `data` is groups; skip/take over groups; totalCount = leaf count | N/A |
| Missing key | row without keyExpr field | keyOf returns `undefined` (documented); load still returns row | N/A |
| Story error | demo forces reject | Storybook Error state visible | Surface message in demo UI |
| Story loading | demo delayed promise | Storybook Loading state visible | N/A |

</frozen-after-approval>

## Code Map

- `libs/vortex-ui/src/lib/components/data-grid/data-source.ts` — **extend**: `keyExpr` on `VxArrayDataSource`, `group` on `VxDataSourceLoadOptions`, `VxArrayGroup<T>`, `keyOf`; reuse `applyFilter` / `applySort`.
- `libs/vortex-ui/src/lib/components/data-grid/data-grid.component.ts` — re-exports DS symbols; only touch if types break `ds.load(...)` call (~L965). **Do not** redesign grid grouping.
- `libs/vortex-ui/src/lib/components/data-grid/data-grid.types.ts` — `VxSortState` import source; leave unless shared group type belongs here.
- `libs/vortex-ui/src/index.ts` + `lib/components/index.ts` — already export via data-grid; no new barrel unless needed.
- `libs/vortex-ui/src/lib/docs/data-management/storybook-prd-tracking.mdx` — convention for `_Foundation` title (reuse, don't rewrite).
- `libs/vortex-ui/src/lib/components/data-grid/data-source-array.stories.ts` — **create** Storybook foundation demo (empty/loading/error).
- `libs/vortex-ui/src/lib/components/data-grid/data-source.spec.ts` — **create** Vitest suite for public load API.
- Vitest config — **none exists**; add minimal Nx/Vitest config so `nx test vortex-ui` runs (workspace-level or lib-level as Nx 24 expects). **Do not** change unrelated packages.
- Continuity from Story 1.1: CSF `tags: ['autodocs']`, Fluent Light default, `_Foundation` reserved namespace.

## Tasks & Acceptance

**Execution:**
- [x] `libs/vortex-ui/src/lib/components/data-grid/data-source.ts` — add `keyExpr`, `keyOf`, `group` + `VxArrayGroup`; keep flat path backward compatible — FR6 kernel
- [x] `libs/vortex-ui/src/lib/components/data-grid/data-grid.component.ts` — fix load typing/usage if required — compile safety
- [x] Vitest harness (config + `nx test vortex-ui`) — enable first unit suite — NFR8
- [x] `libs/vortex-ui/src/lib/components/data-grid/data-source.spec.ts` — tests for I/O matrix rows (flat/empty/group/keys) — NFR8
- [x] `libs/vortex-ui/src/lib/components/data-grid/data-source-array.stories.ts` — `Data Management/_Foundation/DataSource-Array` empty/loading/error — UX-DR10

**Acceptance Criteria:**
- Given keyed objects in `VxArrayDataSource`, when `load` is called with sort/filter/paging, then `data` + `totalCount` match and `keyOf` is stable for each row.
- Given `group` on load options, when `load` runs, then `data` is paged `VxArrayGroup[]` and `totalCount` is the filtered leaf count.
- Given Storybook `Data Management/_Foundation/DataSource-Array`, when opened, then empty, loading, and error states are demonstrable.
- Given `nx test vortex-ui`, when run, then public `load` tests pass.
- Given `npm run lint`, when run, then tsc passes.

## Implementation Notes

- Extended `data-source.ts`: `VxArrayDataSourceOptions` / `keyExpr` (default `'id'`), `keyOf`, `group` on load options (single-level; array → first field), `VxArrayGroup<T>`; flat path unchanged.
- Re-exported new types from `data-grid.component.ts`. DataGrid `ds.load` call unchanged (no group).
- Vitest harness: `libs/vortex-ui/vitest.config.mts` + `tsconfig.spec.json`; registered `@nx/vitest` plugin in `nx.json`; removed deprecated `@nx/vitest:test` executor from `project.json` (Nx 24 infers `test`).
- Added `data-source.spec.ts` (flat/empty/group/keys) and `data-source-array.stories.ts` (`Data Management/_Foundation/DataSource-Array` — Ready/Empty/Loading/Error).
- Verified: `npm run lint` (tsc 0), `npx nx test vortex-ui` (9/9 pass after matrix story-state tests). No push.
- Extracted `data-source-array-demo.ts` (`runDataSourceArrayDemo`) so Empty/Loading/Error matrix rows are unit-tested; stories consume the same helper.

## Spec Change Log

## Review Triage Log

- Blind: empty `group` / `['']` type vs flat runtime — **medium** — real; patched `resolveGroupField` + overload docs via empty→flat.
- Blind: Storybook controls stale after init — **medium** — real; patched `effect` re-run.
- Blind: temp `_tmp-1-2-review.diff` in tree — **low** — real; deleted.
- Blind: sprint `in-progress` vs spec `in-review` — **low** — real; sprint → `review`.
- Blind: `VxDataSource` / RemoteMock lack `keyOf`+group parity — **medium** — deferred (Array kernel only this story).
- Blind: nested keyExpr getter path unsupported — **false** — Always means a string property name on the row, not dotted paths.
- Blind: no group-count field; totalCount is leaves — **false** — frozen matrix/Always require leaf `totalCount`.
- Blind: no custom `keyExpr` test — **medium** — real; patched test `keyExpr: 'product'`.
- Blind: Ready story omits filter demo — **low** — rejected (filter covered by unit tests; story not everyday gap).
- Blind: empty Spec Change/Triage logs mid-review — **false** — triage written this pass.
- Edge: negative skip/take — **medium** — real; clamped with `Math.max(0, …|0)`.
- Edge: empty group string/array — **medium** — same root as Blind empty-group; patched.
- Edge: VxDataSource interface group typing — **medium** — deferred with Blind interface parity.
- Edge: empty `keyExpr` option — **low** — real; fallback `|| 'id'`.
- Edge: null rows in `buildGroups` — **low** — rejected (not a demonstrated caller path).
- Edge: story input change stale — **medium** — same as Blind story effect; patched.
- Edge: destroy while demo pending — **low** — rejected (seq guard enough for Storybook remount).
- Verification-gap: custom `keyExpr` unobserved — **medium** — pre-verified; patched test.

## Design Notes

Keep `VxArrayDataSource` under `data-grid/` (already exported). Constructor becomes `new VxArrayDataSource(items, { keyExpr: 'id' })` (options object optional; default keyExpr `'id'` to align with DataGrid `trackByField`).

Group (single-level only this story):

```ts
load({ skip: 0, take: 10, group: 'region' })
// → { data: [{ key: 'South', items: T[], count: n }, ...], totalCount: leafCount }
```

Storybook: thin host component or story `render` that calls `load` and toggles empty / delayed resolve / reject via story args — no production widget dependency beyond the DataSource class.

## Verification

**Commands:**
- `npm run lint` — expected: tsc exit 0
- `npx nx test vortex-ui` — expected: all new DataSource tests pass

**Manual checks (if no CLI):**
- Storybook → `Data Management/_Foundation/DataSource-Array` shows Empty / Loading / Error stories on Fluent Light.
