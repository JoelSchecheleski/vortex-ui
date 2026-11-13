import { VxSortState } from './data-grid.types';

export interface VxFilterState {
  field: string;
  value: string;
  operator?: 'contains' | 'equals';
}

/** Opções de carga (client window ou servidor). */
export interface VxDataSourceLoadOptions {
  skip: number;
  take: number;
  sort?: VxSortState | null;
  filter?: VxFilterState | null;
}

export interface VxDataSourceLoadResult<T> {
  data: T[];
  totalCount: number;
}

/**
 * Contrato de DataSource — preferido para milhões de linhas.
 * O grid solicita apenas a janela visível (+ overscan).
 */
export interface VxDataSource<T = unknown> {
  load(
    options: VxDataSourceLoadOptions
  ): Promise<VxDataSourceLoadResult<T>> | VxDataSourceLoadResult<T>;
}

function applyFilter<T extends Record<string, unknown>>(
  rows: T[],
  filter?: VxFilterState | null
): T[] {
  if (!filter?.field || filter.value == null || filter.value === '') return rows;
  const op = filter.operator ?? 'contains';
  const needle = String(filter.value).toLowerCase();
  return rows.filter((row) => {
    const raw = row[filter.field];
    const hay = raw == null ? '' : String(raw).toLowerCase();
    return op === 'equals' ? hay === needle : hay.includes(needle);
  });
}

function applySort<T extends Record<string, unknown>>(
  rows: T[],
  sort?: VxSortState | null
): T[] {
  if (!sort) return rows;
  const { field, direction } = sort;
  const dir = direction === 'asc' ? 1 : -1;
  return rows.slice().sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av == null && bv == null) return 0;
    if (av == null) return -1 * dir;
    if (bv == null) return 1 * dir;
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
}

/** Helper: array em memória com filter + sort + slice. */
export class VxArrayDataSource<T> implements VxDataSource<T> {
  constructor(private readonly items: T[]) {}

  load(options: VxDataSourceLoadOptions): VxDataSourceLoadResult<T> {
    const asRecord = (row: T) => row as Record<string, unknown>;
    let rows = applyFilter(this.items.map(asRecord), options.filter);
    rows = applySort(rows, options.sort);
    const totalCount = rows.length;
    const data = rows.slice(options.skip, options.skip + options.take) as T[];
    return { data, totalCount };
  }
}

/**
 * Simula latência de API — útil no Theme Lab / demos.
 * `factory(index)` gera a linha; `totalCount` pode ser 1_000_000+.
 */
export class VxRemoteMockDataSource<T> implements VxDataSource<T> {
  constructor(
    private readonly totalCount: number,
    private readonly factory: (index: number) => T,
    private readonly latencyMs = 40
  ) {}

  async load(options: VxDataSourceLoadOptions): Promise<VxDataSourceLoadResult<T>> {
    if (this.latencyMs > 0) {
      await delay(this.latencyMs);
    }

    const take = Math.min(Math.max(0, options.take), 200);
    const filter = options.filter;
    const asRecord = (row: T) => row as Record<string, unknown>;

    // Sem filtro: slice direto O(take)
    if (!filter?.field || !filter.value) {
      const start = Math.max(0, options.skip);
      const end = Math.min(this.totalCount, start + take);
      const data: T[] = [];
      for (let i = start; i < end; i++) {
        data.push(this.factory(i));
      }
      return {
        data: applySort(data.map(asRecord), options.sort) as T[],
        totalCount: this.totalCount,
      };
    }

    // Com filtro: varre índices até preencher a janela (cap de scan para não travar)
    const matched: T[] = [];
    const maxScan = Math.min(this.totalCount, 50_000);
    let seen = 0;
    for (let i = 0; i < maxScan; i++) {
      const row = this.factory(i);
      if (!rowMatches(asRecord(row), filter)) continue;
      if (seen >= options.skip && matched.length < take) {
        matched.push(row);
      }
      seen++;
      if (matched.length >= take && seen > options.skip + take) {
        break;
      }
    }

    const sample = Math.min(2000, maxScan);
    let hits = 0;
    for (let i = 0; i < sample; i++) {
      if (rowMatches(asRecord(this.factory(i)), filter)) hits++;
    }
    const density = sample > 0 ? hits / sample : 0;
    const estimatedTotal = Math.max(matched.length, Math.floor(this.totalCount * density));

    return {
      data: applySort(matched.map(asRecord), options.sort) as T[],
      totalCount: estimatedTotal,
    };
  }
}

function rowMatches(row: Record<string, unknown>, filter: VxFilterState): boolean {
  const op = filter.operator ?? 'contains';
  const needle = String(filter.value).toLowerCase();
  const raw = row[filter.field];
  const hay = raw == null ? '' : String(raw).toLowerCase();
  return op === 'equals' ? hay === needle : hay.includes(needle);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
