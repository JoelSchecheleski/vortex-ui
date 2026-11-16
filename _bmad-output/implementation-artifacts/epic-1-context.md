# Epic 1 Context: Data Binding & Filter Builder

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Establish the shared local-data kernel (`VxArrayDataSource`) and a reusable filter-expression language via `vx-filter-builder`, plus the Storybook/docs and packaging conventions that every later Data Management widget will follow. FilterBuilder ships here early so Epic 2’s Filter Panel can consume one shared expression model instead of inventing a second filter API.

## Stories

- Story 1.1: Storybook & PRD tracking convention
- Story 1.2: Local Array DataSource
- Story 1.3: FilterBuilder overview
- Story 1.4: FilterBuilder with DataGrid Filter Panel
- Story 1.5: FilterBuilder customization
- Story 1.6: Choose Data Management Component docs & packaging

## Requirements & Constraints

- Ship `vx-filter-builder` that emits a filter expression consumable by DataGrid (and later TreeList/CardView/List) through Signals `model`/`output`.
- Ship `VxArrayDataSource` for in-memory arrays: `keyExpr`, client `load` with sort/filter/group/`skip`/`take`, stable keys, correct `totalCount`.
- Cover FilterBuilder parity demos ~143–145 (standalone/with DataGrid, customization of fields/operators/UI); update research PRD demo status to `TODO|M0|M1|M2|M3` as each lands.
- Every parity case gets a Storybook home; document “Choose a Data Management Component” (DataGrid = flat/master-detail; TreeList = hierarchy; CardView = responsive cards; PivotGrid = OLAP) and the intended `vortex-ui/grid` (or equivalent) import path for tree-shaking.
- Angular 22+ only: Standalone, Signals, OnPush, zoneless-compatible. No DevExtreme runtime or source in the tree — capability parity with Fluent/LDS visual language, not a pixel clone.
- Style only via `--vx-*` tokens (Fluent Blue Light default; LDS where chrome differs). No hardcoded theme hex.
- DX gallery screenshots under `docs/research/.../images/` are internal visual AC only — must never ship in published packages.
- Widget DoD for public surfaces: unit tests on public APIs, Storybook story, empty/loading/error states for binding demos.

## Technical Decisions

- Shared kernel first: Array DataSource + filter expression contract shared with FilterBuilder (and later Filter Panel). Column model lives with the grid family; this epic owns the filter language and local binding path.
- Sequence exception vs research catalog order: FilterBuilder before full DataGrid M1 because Filter Panel depends on it.
- Formal Architecture.md is deferred; treat VortexUI-PRD data-layer contracts and existing `libs/vortex-ui` DataSource/grid code as the baseline — extend, don’t fork a second filter/store model.
- Common widget contract: Signals API (`input`/`model`/`output`), token-only styling, tree-shakeable secondary entry (`vortex-ui/grid` for the family; AI stays out of that entry).
- Before implementing a numbered demo, read `docs/research/devextreme-data-management/raw/NNN-*.json` and the matching `images/NNN-*.png`.
- Storybook path convention: `Data Management/{Widget}/{NNN}-{Slug}` (foundation stories under `Data Management/_Foundation/…`); autodocs Signals table; no epic/story IDs as inline source comments.
- Filter expression must round-trip: builder UI → expression model → DataSource-compatible filter that actually changes visible rows; clear restores the full local set.
- Customization (demo ~145): allow custom fields/operators (e.g. domain ops with convert-to-DataSource expression), restrict group ops / nesting as configured, and keep emitted expressions valid.

## UX & Interaction Patterns

- Default Storybook presentation: Fluent Blue Light; FilterBuilder chrome uses Vortex tokens (screenshots `143`–`145` and Filter Panel refs are interaction/layout reference only).
- Cite the internal parity image path in each story’s docs description; never bundle those images in npm.
- Binding demos must show empty, loading, and error states.
- Filter Panel composition: apply FilterBuilder expression to local grid rows; document the composition in Storybook so Epic 2 filter modes reuse the same language.

## Cross-Story Dependencies

- 1.1 conventions should land before (or with) the first Storybook stories in 1.2–1.5 so paths and PRD status rules are consistent.
- 1.2 Array DataSource underpins local binding demos and the Filter Panel apply/clear path in 1.4.
- 1.3 FilterBuilder overview before 1.4 (panel integration) and 1.5 (customization).
- 1.4 unlocks Epic 2 filtering UX (filter panel / shared expression); later TreeList/CardView filter panels reuse the same contract.
- 1.6 packaging/docs guidance is orientation for consumers of all Data Management epics; does not block 1.2–1.5 implementation.
