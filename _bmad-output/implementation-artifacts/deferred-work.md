- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-local-array-datasource.md`
  summary: Align VxDataSource / VxRemoteMockDataSource with keyOf + group load semantics from VxArrayDataSource
  evidence: Interface still types load as flat T[]; RemoteMock ignores group; Array-only scope for Story 1.2 left the shared contract uneven for later remote/group consumers
