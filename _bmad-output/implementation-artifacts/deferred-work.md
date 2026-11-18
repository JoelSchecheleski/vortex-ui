- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-local-array-datasource.md`
  summary: Align VxDataSource / VxRemoteMockDataSource with keyOf + group load semantics from VxArrayDataSource
  evidence: Interface still types load as flat T[]; RemoteMock ignores group; Array-only scope for Story 1.2 left the shared contract uneven for later remote/group consumers

- source_spec: `_bmad-output/implementation-artifacts/spec-1-3-filterbuilder-overview.md`
  summary: Add VxRemoteMockDataSource tests for compound / multi-operator filters after hasActiveFilter wiring
  evidence: Remote mock now uses evaluateFilter/hasActiveFilter but has zero specs; 1.3 acceptance is Array/client + FilterBuilder 143 only

- source_spec: `_bmad-output/implementation-artifacts/spec-1-3-filterbuilder-overview.md`
  summary: Update apps/docs gallery onFilterApply typing/toast for VxDataFilter compounds
  evidence: applyFilter now emits VxDataFilter; gallery still types VxFilterState and formats .field/.value — misleading toast on compound Apply; outside package 1.3 surface
