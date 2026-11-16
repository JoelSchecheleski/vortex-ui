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
  /** Campo de agrupamento (single-level). Array → usa o primeiro campo. */
  group?: string | readonly string[] | null;
}

export interface VxDataSourceLoadResult<T> {
  data: T[];
  totalCount: number;
}

/** Grupo client-side produzido por `load({ group })`. */
export interface VxArrayGroup<T> {
  key: unknown;
  items: T[];
  count: number;
}

export interface VxArrayDataSourceOptions {
  /** Nome do campo-chave na linha. Default: `'id'`. */
  keyExpr?: string;
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

function resolveGroupField(
  group?: string | readonly string[] | null
): string | null {
  if (group == null) return null;
  if (typeof group === 'string') {
    return group.length > 0 ? group : null;
  }
  const first = group[0];
  return typeof first === 'string' && first.length > 0 ? first : null;
}

function buildGroups<T>(rows: T[], field: string): VxArrayGroup<T>[] {
  const order: unknown[] = [];
  const map = new Map<unknown, T[]>();
  for (const row of rows) {
    const key = (row as Record<string, unknown>)[field];
    let bucket = map.get(key);
    if (!bucket) {
      bucket = [];
      map.set(key, bucket);
      order.push(key);
    }
    bucket.push(row);
  }
  return order.map((key) => {
    const items = map.get(key) ?? [];
    return { key, items, count: items.length };
  });
}

/** Helper: array em memória com filter + sort + group + slice. */
export class VxArrayDataSource<T> implements VxDataSource<T> {
  private readonly keyExpr: string;

  constructor(
    private readonly items: T[],
    options?: VxArrayDataSourceOptions
  ) {
    this.keyExpr = options?.keyExpr || 'id';
  }

  /**
   * Chave estável do item via `keyExpr`.
   * Retorna `undefined` se o campo estiver ausente no item.
   */
  keyOf(item: T): unknown {
    if (item == null || typeof item !== 'object') return undefined;
    return (item as Record<string, unknown>)[this.keyExpr];
  }

  load(
    options: VxDataSourceLoadOptions & { group: string | readonly string[] }
  ): VxDataSourceLoadResult<VxArrayGroup<T>>;
  load(options: VxDataSourceLoadOptions): VxDataSourceLoadResult<T>;
  load(
    options: VxDataSourceLoadOptions
  ): VxDataSourceLoadResult<T> | VxDataSourceLoadResult<VxArrayGroup<T>> {
    const asRecord = (row: T) => row as Record<string, unknown>;
    let rows = applyFilter(this.items.map(asRecord), options.filter);
    rows = applySort(rows, options.sort);
    const leafCount = rows.length;
    const skip = Math.max(0, options.skip | 0);
    const take = Math.max(0, options.take | 0);

    const groupField = resolveGroupField(options.group);
    if (groupField) {
      const groups = buildGroups(rows as T[], groupField);
      const data = groups.slice(skip, skip + take);
      return { data, totalCount: leafCount };
    }

    const data = rows.slice(skip, skip + take) as T[];
    return { data, totalCount: leafCount };
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
