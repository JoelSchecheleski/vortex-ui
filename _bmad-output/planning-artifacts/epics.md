---
status: final
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - VortexUI-PRD.md
  - docs/research/devextreme-data-management/PRD-DATA-MANAGEMENT.md
  - docs/research/devextreme-data-management/README.md
notes:
  architecture: deferred — no formal Architecture.md; technical constraints taken from VortexUI-PRD decisions + existing libs/vortex-ui data components
  ux: deferred — no DESIGN.md/EXPERIENCE.md; visual AC via Fluent Light + LDS tokens and PRD images/NNN-*.png (internal parity only)
  scope: Data Management family only (vx-data-grid, vx-tree-list, vx-card-view, vx-pivot-grid, vx-filter-builder)
  epicApproval: "2026-11-16 — user confirmed features are composable capabilities of DataGrid/DataSource family; approved 7-epic structure"
  storyMode: "YOLO 2026-11-16 — all epics/stories authored in one pass per user request"
---

# VortexUI - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for VortexUI, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

**Active scope for this breakdown:** Data Grids / Data Management parity (145 gallery demos) toward M2+, with Storybook as acceptance documentation per demo.

## Requirements Inventory

### Functional Requirements

FR1: Provide `vx-data-grid` as a flat/master-detail tabular data management component with Signals API (`input`/`model`/`output`).
FR2: Provide `vx-tree-list` for hierarchical tabular data with expand/collapse and shared column/filter/sort/selection patterns with the grid.
FR3: Provide `vx-card-view` for responsive card-based data presentation reusing filter/sort/selection/edit patterns.
FR4: Provide `vx-pivot-grid` (+ `vx-pivot-field-chooser`) for OLAP-style aggregation with field management.
FR5: Provide `vx-filter-builder` that produces a filter expression consumable by DataGrid/TreeList/CardView/List.
FR6: Support local array data binding via `VxArrayDataSource` (keyExpr, columns, client sort/filter/group).
FR7: Support JSON/URL and custom remote loading via DataSource load options (`skip`, `take`, `sort`, `filter`, `totalCount`).
FR8: Support pluggable custom store adapters (REST/GraphQL/SignalR-like) with incremental `push` updates without remount.
FR9: Support real-time / push updates to the bound dataset (local copy + patch).
FR10: Provide filtering UX: filter row/API, filter panel (FilterBuilder integration), and column header filters.
FR11: Provide multi-column sorting (client and remote).
FR12: Provide editing modes: row, cell, batch, form, popup; custom editors; validation; cascading lookups; edit state management; new-record position.
FR13: Provide remote CRUD and batch update request flows for server-processed grids.
FR14: Provide record grouping (local and remote) with expand/collapse.
FR15: Provide selection: single row, multiple records, selection API, deferred selection, and focused row.
FR16: Provide paging (page size, page index, remote paging).
FR17: Provide scrolling modes: local virtual, remote virtual, horizontal virtual, infinite scroll.
FR18: Provide column features: auto-populate, multi-level bands, reorder, resize, fixed/sticky, command column config, column chooser.
FR19: Provide master-detail views (template, API, advanced nested layouts).
FR20: Provide data summaries: total, group, custom aggregates, recalculate while editing.
FR21: Provide drag-and-drop: local reorder, remote reorder, drag between two grids.
FR22: Export grid data to PDF with cell/header/footer/multi-grid/image customization.
FR23: Export grid data to Excel with cell/header/footer/multi-grid/image customization (optional/peer export entry preferred).
FR24: Support appearance toggles (column/row lines, density) and customization templates for column/row/cell/toolbar.
FR25: Persist and restore grid/tree/pivot UI state (columns, filters, sort, selection, layout).
FR26: Support adaptive column hiding with priority and responsive layouts.
FR27: Support full keyboard navigation and screen-reader-oriented grid semantics (ARIA).
FR28: Support right-to-left layout for Data Management components without breaking chrome.
FR29: TreeList-specific: hierarchical binding, tree editing, tree selection, tree DnD, AI columns (opt-in).
FR30: CardView-specific: card templates, card editing, card filtering/sorting/selection, column/field chooser for cards.
FR31: Pivot-specific: field management, summaries, drill-down, filtering, virtual scrolling, Excel export, chart integration, state persistence.
FR32: FilterBuilder demos: standalone builder, with DataGrid integration, and customization of fields/operators/UI.
FR33: AI Semantic Search on DataGrid (opt-in, AI Bridge).
FR34: AI Columns on DataGrid and TreeList (Prompt Editor, regenerate/apply).
FR35: AI Assistant Dialog on DataGrid (NL → allowlisted commands: filter/sort/group/page/focus/select/summaries/column ops).
FR36: AI-powered master-detail analysis (on-demand per row, token-efficient).
FR37: Collaborative editing for DataGrid (multi-user edit awareness) as M3 capability.
FR38: For every parity demo `001–145`, ship an equivalent Storybook case documenting Signals API and visual/interaction parity.
FR39: Update `PRD-DATA-MANAGEMENT.md` status per demo (`TODO`|`M0`|`M1`|`M2`|`M3`) when implemented.
FR40: Expose tree-shakeable packaging path for grid family (`vortex-ui/grid` or equivalent) without requiring AI entry unless used.
FR41: Theme Lab / Widgets Gallery demos must run Fluent Light (default) and LDS without visual regression for Data Management surfaces.
FR42: Document “Choose a Data Management Component” guidance (DataGrid vs TreeList vs CardView vs PivotGrid) in Vortex docs/Storybook.

### NonFunctional Requirements

NFR1: Angular 22+ only; Standalone + Signals + OnPush + zoneless-compatible implementation.
NFR2: No DevExtreme / `devextreme*` runtime or source code in the Vortex tree; surface parity only.
NFR3: Styling via CSS Design Tokens (`--vx-*`); Fluent Blue Light default + LDS; no hardcoded theme hex in components.
NFR4: DataGrid virtualization: target ~60fps scroll with 1,000,000 rows (server-side); stable memory; sticky header.
NFR5: Time to first paint of visible rows < 100ms after data arrives (virtualized server path).
NFR6: AI is opt-in (`ai.enabled = false` by default); no vendor lock; typed context + allowlisted commands only; no DOM scraping by the model.
NFR7: Screenshots from DX gallery are internal research assets only — must not ship in published npm packages.
NFR8: Each widget DoD includes unit tests for public APIs, Storybook story, Gallery entry when applicable, a11y keyboard+ARIA minimum.
NFR9: Visual regression CI (Playwright) should cover Grid + canonical Data Management demos × Fluent + LDS (target as suite matures).
NFR10: Intended license MIT; no redistribution of proprietary DX assets/CSS.
NFR11: Secondary entries / tree-shaking: consumers import only needed families; AI in `vortex-ui/ai`.
NFR12: Pixel-perfect DX clone is NOT required — capability parity with Vortex/Fluent/LDS visual language.

### Additional Requirements

- Architecture.md is **deferred**; use VortexUI-PRD §2 decisions and existing `libs/vortex-ui` DataSource/grid code as the technical baseline.
- Shared kernel first: `VxDataSource` (Array/Remote/Custom/push), column model, filter expression contract shared with FilterBuilder.
- Implementation order constraint from research PRD: DataGrid → TreeList → CardView → PivotGrid → FilterBuilder **except** FilterBuilder is pulled earlier because Filter Panel depends on it.
- Finish DataGrid M2→M3 gaps (export PDF/Excel, AI, collaborative edit) before advanced Pivot engine work when sequencing capacity.
- Before coding each demo: read `raw/NNN-*.json` + `images/NNN-*.png`.
- Link `VortexUI-PRD.md` § Data Management to the research directory (already linked); keep statuses in sync.
- Storybook convention: `Data Management/{Widget}/{NNN}-{Slug}` with autodocs Signals table + play interaction where feasible.
- No epic/story IDs as inline code comments in source.

### UX Design Requirements

UX-DR1: Default theme presentation for all Data Management stories: Fluent Blue Light; second story or theme toggle for LDS where chrome differs.
UX-DR2: DataGrid toolbar chrome includes optional AI sparkle affordance only when `ai.enabled` (Mode A Assistant).
UX-DR3: AI Assistant Dialog UX: chat, empty state, suggestion chips, send — human-in-the-loop for destructive actions.
UX-DR4: AI Prompt Editor UX for AI Columns: regenerate/apply anchored to column (Mode B).
UX-DR5: Filter panel / FilterBuilder UI must match Vortex tokens (not DX assets); use PRD screenshots `010`, `143–145` as interaction reference only.
UX-DR6: Adaptive layouts: column hiding priority and card responsive breakpoints without card-heavy hero chrome in Storybook docs pages.
UX-DR7: Keyboard focus order and ARIA grid/treegrid/list roles documented per widget in Storybook Docs.
UX-DR8: Each Storybook story cites the parity image path `docs/research/.../images/NNN-*.png` in docs description (dev-only reference).
UX-DR9: RTL story for DataGrid (`079`) and shared chrome directionality for sibling widgets when applicable.
UX-DR10: Empty, loading, and error states are required for binding demos (JSON/Custom/Remote).

### FR Coverage Map

FR1: Epic 2 — vx-data-grid Signals surface
FR2: Epic 4 — vx-tree-list hierarchy
FR3: Epic 5 — vx-card-view cards
FR4: Epic 6 — vx-pivot-grid + field chooser
FR5: Epic 1 — vx-filter-builder
FR6: Epic 1 — VxArrayDataSource local binding
FR7: Epic 3 — JSON/remote DataSource load options
FR8: Epic 3 — Custom store adapters
FR9: Epic 3 — Real-time / push updates
FR10: Epic 2 — Filtering UX (row/API/panel/header)
FR11: Epic 2 — Multi-column sorting
FR12: Epic 2 — Editing modes (local)
FR13: Epic 3 — Remote CRUD / batch update
FR14: Epic 2 + Epic 3 — Grouping local then remote
FR15: Epic 2 — Selection + focused row
FR16: Epic 2 — Paging
FR17: Epic 2 + Epic 3 — Scrolling local then remote/virtual
FR18: Epic 2 — Column features
FR19: Epic 2 — Master-detail
FR20: Epic 2 — Summaries
FR21: Epic 2 + Epic 3 — DnD local then remote/cross-grid
FR22: Epic 7 — Export PDF
FR23: Epic 7 — Export Excel
FR24: Epic 2 — Appearance + templates
FR25: Epic 2 — State persistence
FR26: Epic 2 — Adaptability
FR27: Epic 2 — Keyboard / ARIA
FR28: Epic 2 — RTL
FR29: Epic 4 — TreeList-specific behaviors
FR30: Epic 5 — CardView-specific behaviors
FR31: Epic 6 — Pivot-specific behaviors
FR32: Epic 1 — FilterBuilder demos 143–145
FR33: Epic 7 — AI Semantic Search
FR34: Epic 7 — AI Columns (grid + tree)
FR35: Epic 7 — AI Assistant Dialog
FR36: Epic 7 — AI-powered detail
FR37: Epic 7 — Collaborative editing
FR38: Epic 1 (+ all) — Storybook parity cases
FR39: Epic 1 (+ all) — PRD status updates
FR40: Epic 1 — Tree-shakeable grid packaging
FR41: Epic 2 — Fluent + LDS Theme Lab
FR42: Epic 1 — Choose Data Management Component docs

## Epic List

### Epic 1: Data Binding & Filter Builder
Apps bind local data through VxDataSource and users compose reusable filter expressions; Storybook/docs conventions for the Data Management family start here. FilterBuilder ships early to unlock grid Filter Panel.
**FRs covered:** FR5, FR6, FR32, FR38, FR39, FR40, FR42

### Epic 2: DataGrid — Local Professional Workspace (M0→M1)
Users explore, filter, sort, page, select, edit, group, summarize, customize columns, use master-detail, appearance, state, adaptability, keyboard, and RTL — all on local/array data. These are composable capabilities of `vx-data-grid`, not separate products.
**FRs covered:** FR1, FR10, FR11, FR12, FR14 (local), FR15, FR16, FR17 (local), FR18, FR19, FR20, FR21 (local), FR24, FR25, FR26, FR27, FR28, FR41

### Epic 3: DataGrid — Remote Scale & Realtime (M2)
Users operate against JSON/custom/remote stores with remote CRUD, remote grouping/virtualization, push/realtime updates, and remote/cross-grid DnD — still the same `vx-data-grid` + DataSource composition surface.
**FRs covered:** FR7, FR8, FR9, FR13, FR14 (remote), FR17 (remote), FR21 (remote)

### Epic 4: TreeList — Hierarchical Data
Users navigate and edit hierarchical tabular data, reusing grid column/filter/sort/selection/edit patterns on `vx-tree-list`.
**FRs covered:** FR2, FR29

### Epic 5: CardView — Card Layout Data
Users browse/filter/edit the same datasets in a responsive card layout via `vx-card-view`.
**FRs covered:** FR3, FR30

### Epic 6: PivotGrid — OLAP Analysis
Users aggregate fields, drill down, filter, scroll large pivots, and persist pivot layout via `vx-pivot-grid` + field chooser.
**FRs covered:** FR4, FR31

### Epic 7: Export, Collaboration & AI (M3)
Users export grid data (PDF/Excel), collaborate on edits, and opt into AI Bridge features (semantic search, AI columns, assistant, AI detail) on the same Data Management components.
**FRs covered:** FR22, FR23, FR33, FR34, FR35, FR36, FR37

---

## Epic 1: Data Binding & Filter Builder

Apps bind local data through VxDataSource and users compose reusable filter expressions; Storybook/docs conventions for the Data Management family start here. FilterBuilder ships early to unlock grid Filter Panel.

### Story 1.1: Storybook & PRD tracking convention

As a Vortex engineer,
I want a fixed Storybook path `Data Management/{Widget}/{NNN}-{Slug}` and a PRD status update rule,
So that every parity demo has a predictable docs home and progress is visible.

**Acceptance Criteria:**

**Given** the Data Management research PRD
**When** the convention is documented under Storybook Data Management docs
**Then** path, `autodocs` tags, and status values `TODO|M0|M1|M2|M3` are specified (FR38, FR39)
**And** docs state that `images/NNN-*.png` are internal visual AC only and must not ship in npm (UX-DR8, NFR7)

### Story 1.2: Local Array DataSource

As an app developer,
I want `VxArrayDataSource` with keyExpr and client load options (sort/filter/group/skip/take),
So that I can bind in-memory arrays to Data Management widgets without a server.

**Acceptance Criteria:**

**Given** an array of keyed objects
**When** the DataSource `load` API is called with sort/filter/paging options
**Then** results and totalCount are correct and keys are stable (FR6)
**And** Storybook `Data Management/_Foundation/DataSource-Array` shows empty/loading/error states (UX-DR10)
**And** unit tests cover the public load API (NFR8)

### Story 1.3: FilterBuilder overview

As a power user,
I want a visual filter builder with typed fields and operators,
So that I can compose complex filter expressions without writing code.

**Acceptance Criteria:**

**Given** configured fields matching demo ~143
**When** I add/remove groups and conditions
**Then** an expression model is emitted via Signals `model`/`output` (FR5, FR32)
**And** Storybook `Data Management/FilterBuilder/143-…` runs on Fluent Light (UX-DR1, UX-DR5)
**And** PRD status for the covered demo is updated to at least `M1`

### Story 1.4: FilterBuilder with DataGrid Filter Panel

As a grid user,
I want FilterBuilder expressions applied to `vx-data-grid`,
So that the professional Filter Panel uses one shared filter language.

**Acceptance Criteria:**

**Given** a grid with Filter Panel enabled and a FilterBuilder expression
**When** I apply the filter
**Then** visible rows match the expression (FR5 unlocks FR10)
**And** clearing the filter restores the full local dataset
**And** Storybook documents the FilterBuilder + DataGrid composition

### Story 1.5: FilterBuilder customization

As an app developer,
I want custom fields, operators, and UI customization hooks,
So that domain-specific filters match our product language (demo ~145).

**Acceptance Criteria:**

**Given** custom field/operator configuration
**When** the builder renders
**Then** only allowed operators appear and the expression remains valid (FR32)
**And** Storybook `…/FilterBuilder/145-Customization` documents the Signals API
**And** PRD demos 143–145 statuses are updated accordingly

### Story 1.6: Choose Data Management Component docs & packaging

As an Angular developer,
I want guidance for DataGrid vs TreeList vs CardView vs Pivot plus the intended grid import path,
So that I pick the right widget and tree-shake correctly.

**Acceptance Criteria:**

**Given** the Data Management Storybook/docs section
**When** I open “Choose a component”
**Then** decision guidance matches VortexUI-PRD §5.1 (FR42)
**And** packaging/import guidance for `vortex-ui/grid` (or equivalent) is stated (FR40)

---

## Epic 2: DataGrid — Local Professional Workspace (M0→M1)

Users explore, filter, sort, page, select, edit, group, summarize, customize columns, use master-detail, appearance, state, adaptability, keyboard, and RTL — all on local/array data. These are composable capabilities of `vx-data-grid`, not separate products.

### Story 2.1: Overview & simple array binding

As an app developer,
I want `vx-data-grid` Overview + Simple Array demos with Signals column/data APIs,
So that I can render a professional local grid baseline (demos 001–002, 039).

**Acceptance Criteria:**

**Given** local rows and column defs
**When** the grid renders in Storybook on Fluent Light and LDS
**Then** chrome, headers, and rows match parity intent for 001/002/039 (FR1, FR41)
**And** autodocs list `input`/`model`/`output` (FR38)
**And** PRD statuses updated

### Story 2.2: Sorting & paging

As a grid user,
I want multi-column sorting and paging on local data,
So that I can navigate large in-memory datasets (demos 013, 034).

**Acceptance Criteria:**

**Given** a local DataSource-bound grid
**When** I sort columns and change page size/index
**Then** row order and page contents update correctly (FR11, FR16)
**And** Storybook play tests cover sort + page interactions

### Story 2.3: Selection & focused row

As a grid user,
I want single/multi selection, selection API, deferred selection, and focused row,
So that I can act on chosen records (demos 029–033).

**Acceptance Criteria:**

**Given** selection mode configured
**When** I click/keyboard-select rows or use the selection API
**Then** selection state and focused row stay consistent (FR15)
**And** Storybook covers each selection demo path

### Story 2.4: Filtering row, API, panel, header filter

As a grid user,
I want filter row, filtering API, filter panel, and column header filters on local data,
So that I can narrow datasets with professional grid chrome (demos 008–011).

**Acceptance Criteria:**

**Given** local data and FilterBuilder available from Epic 1
**When** I use filter row / API / panel / header filter
**Then** visible rows match each filter mode (FR10)
**And** stories exist per demo with Fluent Light (UX-DR5)

### Story 2.5: Editing modes (row, cell, batch, form, popup)

As a grid user,
I want row/cell/batch/form/popup editing on local data,
So that I can create/update/delete records in the UX that fits the screen (demos 014–018).

**Acceptance Criteria:**

**Given** editing mode enabled
**When** I add/edit/delete via that mode
**Then** the local dataset updates and cancel discards pending edits (FR12)
**And** Storybook documents each mode’s Signals API

### Story 2.6: Custom editors, validation, cascading lookups, edit state

As an app developer,
I want custom editors, validation, cascading lookups, edit-state management, and new-record position,
So that domain forms inside the grid behave professionally (demos 019–021, 025–026).

**Acceptance Criteria:**

**Given** column editors and validation rules
**When** I edit dependent lookup fields and invalid values
**Then** cascading options update and invalid saves are blocked (FR12)
**And** edit-state APIs and new-record position behave per demos 025–026

### Story 2.7: Grouping & summaries (local)

As a grid user,
I want local record grouping plus total/group/custom summaries (including recalc while editing),
So that I can analyze aggregates without a server (demos 027, 052–055).

**Acceptance Criteria:**

**Given** groupBy and summary configs
**When** I expand/collapse groups and edit summarized cells
**Then** group rows and summary values stay correct (FR14 local, FR20)
**And** Storybook covers grouping + each summary demo

### Story 2.8: Column UX (bands, reorder, resize, fixed, command, chooser)

As a grid user,
I want multi-level headers, reorder, resize, fixed/sticky columns, command column config, and column chooser,
So that I can shape the table layout to my task (demos 040–045).

**Acceptance Criteria:**

**Given** column configuration for bands/fixed/command/chooser
**When** I reorder, resize, pin, or toggle column visibility
**Then** layout persists for the session and matches demo intent (FR18)
**And** Storybook stories exist for 040–045

### Story 2.9: Local virtual / horizontal / infinite scrolling

As a grid user,
I want local virtual, horizontal virtual, and infinite scrolling,
So that large local datasets stay responsive (demos 035, 037, 038).

**Acceptance Criteria:**

**Given** a large local dataset
**When** I scroll vertically/horizontally or load more via infinite mode
**Then** only the needed window renders and scroll remains usable (FR17 local, NFR4 intent on local scale)
**And** sticky header remains visible where specified

### Story 2.10: Master-detail (non-AI)

As a grid user,
I want master-detail templates, API-driven expansion, and advanced nested detail layouts,
So that I can inspect related records without leaving the grid (demos 048–049, 051).

**Acceptance Criteria:**

**Given** detail template/API configuration
**When** I expand/collapse detail rows
**Then** detail content renders and API-driven state works (FR19)
**And** Storybook covers 048, 049, 051 (050 deferred to Epic 7)

### Story 2.11: Appearance, templates, toolbar customization

As an app developer,
I want appearance toggles and column/row/cell/toolbar templates,
So that the grid chrome matches product UI (demos 069–073).

**Acceptance Criteria:**

**Given** appearance flags and template slots
**When** the grid renders customized cells/rows/toolbar
**Then** tokens Fluent/LDS still apply with no hardcoded theme hex (FR24, NFR3)
**And** Storybook documents each customization demo

### Story 2.12: State persistence & adaptability

As a grid user,
I want layout state persistence and adaptive column hiding with priority,
So that my preferred layout survives reloads and small viewports (demos 074–076).

**Acceptance Criteria:**

**Given** state store enabled and hiding priorities set
**When** I resize the viewport or reload with saved state
**Then** columns/filters/sort restore and low-priority columns hide first (FR25, FR26, UX-DR6)
**And** Storybook covers 074–076

### Story 2.13: Local reorder DnD

As a grid user,
I want local row reordering via drag and drop,
So that I can manually order records in-memory (demo 056).

**Acceptance Criteria:**

**Given** local DnD reorder enabled
**When** I drag a row to a new index
**Then** the local array order updates (FR21 local)
**And** Storybook play covers the reorder path

### Story 2.14: Keyboard navigation & RTL

As an accessibility-minded user,
I want full keyboard navigation and RTL layout support,
So that the grid is usable without a mouse and in RTL locales (demos 077–079).

**Acceptance Criteria:**

**Given** keyboard focus in the grid and `dir=rtl`
**When** I navigate with arrows/tab/enter and view RTL chrome
**Then** focus order and ARIA roles remain valid and layout mirrors correctly (FR27, FR28, UX-DR7, UX-DR9)
**And** Storybook includes keyboard + RTL stories

---

## Epic 3: DataGrid — Remote Scale & Realtime (M2)

Users operate against JSON/custom/remote stores with remote CRUD, remote grouping/virtualization, push/realtime updates, and remote/cross-grid DnD — still the same `vx-data-grid` + DataSource composition surface.

### Story 3.1: JSON & custom remote DataSource binding

As an app developer,
I want JSON URL binding and custom remote DataSource adapters,
So that the grid loads server data with skip/take/sort/filter/totalCount (demos 003–004).

**Acceptance Criteria:**

**Given** a JSON endpoint or custom store mock
**When** the grid loads
**Then** remote load options are honored and loading/error states show (FR7, FR8, UX-DR10)
**And** Storybook uses mocks (no real proprietary backends required)

### Story 3.2: Web API remote operations pattern

As an app developer,
I want a documented Web API / remoteOperations pattern,
So that server-processed grids integrate cleanly (demo 005).

**Acceptance Criteria:**

**Given** `remoteOperations` enabled with a mock Web API store
**When** sort/filter/page occur
**Then** the store receives corresponding load options (FR7)
**And** Storybook + docs describe the contract

### Story 3.3: Realtime push & SignalR-style updates

As a grid user,
I want live updates via store `push` without remounting the grid,
So that changing remote data appears in near real time (demos 006–007).

**Acceptance Criteria:**

**Given** a store with push support
**When** push patches arrive
**Then** affected rows update without full reload (FR8, FR9)
**And** Storybook simulates push ticks

### Story 3.4: Remote CRUD & batch update requests

As an app developer,
I want remote insert/update/delete and batch update request flows,
So that edits persist through the server store (demos 023–024).

**Acceptance Criteria:**

**Given** remote editing enabled against a mock store
**When** I save single or batch changes
**Then** store mutation APIs are invoked and failures surface to the UI (FR13)
**And** Storybook covers success and error paths

### Story 3.5: Remote grouping & remote virtual scrolling

As a grid user,
I want remote grouping and remote virtual scrolling,
So that huge server datasets remain usable (demos 028, 036).

**Acceptance Criteria:**

**Given** remote group/virtual configs
**When** I expand groups or scroll the virtual window
**Then** only required server pages load and UI stays responsive (FR14 remote, FR17 remote, NFR4)
**And** Storybook mocks large totals

### Story 3.6: Remote reorder & drag between two grids

As a grid user,
I want remote row reorder and drag-and-drop between two grids,
So that cross-list workflows work with server-backed data (demos 057–058).

**Acceptance Criteria:**

**Given** two grids (or remote reorder) with DnD enabled
**When** I drop a row on a new index or target grid
**Then** stores receive the intended move/copy operations (FR21 remote)
**And** Storybook demonstrates both demos with mocks

---

## Epic 4: TreeList — Hierarchical Data

Users navigate and edit hierarchical tabular data, reusing grid column/filter/sort/selection/edit patterns on `vx-tree-list`.

### Story 4.1: TreeList overview & hierarchical binding

As an app developer,
I want TreeList overview and hierarchical data binding,
So that I can render parent/child tabular trees (demos 080–084).

**Acceptance Criteria:**

**Given** hierarchical items with keys/parent or children
**When** `vx-tree-list` renders with expand/collapse
**Then** structure and columns match demos 080–084 (FR2, FR29)
**And** Storybook path `Data Management/TreeList/…` exists

### Story 4.2: TreeList filtering & sorting

As a tree user,
I want filtering (incl. modes aligned with grid) and sorting on tree data,
So that I can find nodes in large hierarchies (demos 085–090).

**Acceptance Criteria:**

**Given** filter/sort configs on TreeList
**When** I filter or sort
**Then** visible nodes update while hierarchy semantics remain valid (FR29, FR10/FR11 reuse)
**And** Storybook covers 085–090

### Story 4.3: TreeList editing

As a tree user,
I want tree editing modes analogous to the grid,
So that I can maintain hierarchical records (demos 091–095).

**Acceptance Criteria:**

**Given** editing enabled on TreeList
**When** I add/edit/delete nodes
**Then** hierarchy integrity is preserved (parent/child keys) (FR29, FR12 reuse)
**And** Storybook covers 091–095

### Story 4.4: TreeList selection & paging

As a tree user,
I want selection modes and paging for hierarchical datasets,
So that I can act on subsets of the tree (demos 096–099).

**Acceptance Criteria:**

**Given** selection/paging configuration
**When** I select nodes and page
**Then** selection and page state behave per demos 096–099 (FR15/FR16 reuse, FR29)
**And** Storybook stories exist

### Story 4.5: TreeList columns, DnD, state, adapt, keyboard

As a tree user,
I want column UX, drag-and-drop, state persistence, adaptability, and keyboard navigation,
So that TreeList reaches professional parity with the grid chrome (demos 100–103, 105–109).

**Acceptance Criteria:**

**Given** column/DnD/state/adapt/keyboard features enabled
**When** I rearrange columns, drag nodes, resize viewport, and navigate by keyboard
**Then** behavior matches demos 100–103 and 105–109 (FR29; AI column 104 deferred to Epic 7)
**And** PRD statuses updated for those demos

---

## Epic 5: CardView — Card Layout Data

Users browse/filter/edit the same datasets in a responsive card layout via `vx-card-view`.

### Story 5.1: CardView overview & binding

As an app developer,
I want CardView overview and data binding demos,
So that I can present datasets as responsive cards (demos 110–112).

**Acceptance Criteria:**

**Given** bound fields/cards configuration
**When** `vx-card-view` renders
**Then** overview/binding demos 110–112 are represented in Storybook with responsive card breakpoints (FR3, FR30, UX-DR6)

### Story 5.2: CardView filter, sort, selection

As a card user,
I want filtering, sorting, and selection on cards,
So that I can find and act on card records (demos 113–116, 119).

**Acceptance Criteria:**

**Given** filter/sort/selection configs
**When** I filter, sort, and select cards
**Then** the visible set and selection state match demos 113–116, 119 (FR30)
**And** Storybook covers each path

### Story 5.3: CardView editing & columns/fields

As a card user,
I want card editing and column/field chooser behaviors,
So that I can maintain records in card layout (demos 117–118, 120–121).

**Acceptance Criteria:**

**Given** editing and field visibility configs
**When** I edit cards and toggle fields
**Then** data and visible fields update per demos 117–118, 120–121 (FR30)

### Story 5.4: Card templates & customization

As an app developer,
I want card templates and customization hooks,
So that card chrome matches product design (demos 122–123).

**Acceptance Criteria:**

**Given** custom card templates
**When** cards render
**Then** templates apply without breaking tokens Fluent/LDS (FR30, NFR3)
**And** Storybook documents 122–123

---

## Epic 6: PivotGrid — OLAP Analysis

Users aggregate fields, drill down, filter, scroll large pivots, and persist pivot layout via `vx-pivot-grid` + field chooser.

### Story 6.1: Pivot overview, binding & field management

As an analyst,
I want Pivot overview, data binding, and field management with field chooser,
So that I can place fields on row/column/data/filter areas (demos 124–130).

**Acceptance Criteria:**

**Given** a pivotable dataset and field chooser
**When** I bind data and move fields between areas
**Then** the pivot layout updates (FR4, FR31)
**And** Storybook covers 124–130 including field chooser

### Story 6.2: Pivot summaries, drill-down, filtering, scrolling

As an analyst,
I want summaries, drill-down, filtering, and scrolling modes,
So that I can explore aggregates at scale (demos 131–136).

**Acceptance Criteria:**

**Given** summary/filter/scroll configs
**When** I drill into a cell, filter fields, and scroll
**Then** aggregates and detail paths match demos 131–136 (FR31)
**And** Storybook stories exist for each

### Story 6.3: Pivot Excel export, chart integration, customization, state

As an analyst,
I want Excel export, chart integration, customization, and state persistence for pivots,
So that analysis results leave the grid and layouts survive reloads (demos 137–142).

**Acceptance Criteria:**

**Given** export/chart/customize/state options
**When** I export, link a chart, customize, and reload state
**Then** behaviors match demos 137–142 (FR31; optional export peer ok per NFR/PRD)
**And** Storybook documents each path

---

## Epic 7: Export, Collaboration & AI (M3)

Users export grid data (PDF/Excel), collaborate on edits, and opt into AI Bridge features on the same Data Management components.

### Story 7.1: DataGrid export to PDF

As a grid user,
I want PDF export with cell/header/footer/multi-grid/image customization,
So that I can share printable grid output (demos 059–063).

**Acceptance Criteria:**

**Given** PDF export enabled
**When** I export with customization options
**Then** generated PDF reflects demos 059–063 intent (FR22)
**And** Storybook documents each export variant (may use download stubs in CI)

### Story 7.2: DataGrid export to Excel

As a grid user,
I want Excel export with cell/header/footer/multi-grid/image customization,
So that I can continue analysis in spreadsheets (demos 064–068).

**Acceptance Criteria:**

**Given** Excel export enabled (optional/peer entry acceptable)
**When** I export with customization options
**Then** output matches demos 064–068 intent (FR23)
**And** Storybook documents variants without bundling DX assets

### Story 7.3: Collaborative editing

As a multi-user app developer,
I want collaborative editing awareness on the DataGrid,
So that concurrent edits are visible and conflict-safe enough for demo parity (demo 022).

**Acceptance Criteria:**

**Given** collaborative editing hooks/config
**When** simulated concurrent edits arrive
**Then** UI reflects collaborative state per demo 022 (FR37)
**And** Storybook uses a mock collaboration bus

### Story 7.4: AI Semantic Search

As a grid user,
I want opt-in semantic search via AI Bridge,
So that I can find rows with natural language (demo 012).

**Acceptance Criteria:**

**Given** `ai.enabled` and mock `VortexAIIntegration`
**When** I run a semantic search prompt
**Then** the grid filters/highlights via allowlisted commands only (FR33, NFR6)
**And** Storybook uses `parameters.ai = { mock: true }` with no real API keys

### Story 7.5: AI Columns (DataGrid & TreeList)

As a grid/tree user,
I want AI columns with Prompt Editor regenerate/apply,
So that derived cell values can be generated on demand (demos 046, 104).

**Acceptance Criteria:**

**Given** AI column defs and Prompt Editor
**When** I regenerate/apply prompts
**Then** generated values populate AI columns for DataGrid and TreeList (FR34, UX-DR4)
**And** AI remains off by default (NFR6)

### Story 7.6: AI Assistant Dialog

As a grid user,
I want an AI Assistant dialog that maps NL to allowlisted grid commands,
So that I can filter/sort/group/page/focus/select/summarize/reshape columns by chat (demo 047).

**Acceptance Criteria:**

**Given** `ai.enabled` and assistant UI
**When** I send prompts / use suggestion chips
**Then** only allowlisted commands execute and destructive actions confirm (FR35, UX-DR2, UX-DR3)
**And** Storybook mock assistant covers a happy-path command set

### Story 7.7: AI-powered detail view

As a grid user,
I want on-demand AI analysis for a specific master-detail row,
So that I can interrogate one record without generating AI data for every row (demo 050).

**Acceptance Criteria:**

**Given** AI detail enabled on a row
**When** I open AI detail for that row
**Then** analysis runs for the selected record context only (FR36, NFR6)
**And** Storybook mock covers the on-demand path
