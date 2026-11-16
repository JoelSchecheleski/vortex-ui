import {
  VxArrayDataSource,
  type VxArrayGroup,
  type VxDataSourceLoadResult,
} from './data-source';

export type DataSourceArrayDemoMode = 'ready' | 'empty' | 'loading' | 'error';

export interface DataSourceArrayDemoRow {
  id: number;
  product: string;
  region: string;
  amount: number;
}

export type DataSourceArrayDemoState =
  | { status: 'loading' }
  | { status: 'empty'; totalCount: 0 }
  | { status: 'error'; message: string }
  | {
      status: 'ready';
      totalCount: number;
      keys: unknown[];
      lines: string[];
    };

export const DATA_SOURCE_ARRAY_DEMO_ROWS: DataSourceArrayDemoRow[] = [
  { id: 1, product: 'SolarMax', region: 'África', amount: 1200 },
  { id: 2, product: 'EcoCharge', region: 'Europa', amount: 980 },
  { id: 3, product: 'VoltEdge', region: 'Américas', amount: 1450 },
  { id: 4, product: 'SolarMax', region: 'Europa', amount: 1100 },
  { id: 5, product: 'EcoCharge', region: 'África', amount: 870 },
];

/**
 * Pure demo loader for Storybook empty/loading/error/ready states.
 * Keeps UX-DR10 matrix rows unit-testable without mounting Storybook.
 */
export async function runDataSourceArrayDemo(
  mode: DataSourceArrayDemoMode,
  options?: { delayMs?: number; rows?: DataSourceArrayDemoRow[] }
): Promise<DataSourceArrayDemoState> {
  const delayMs = options?.delayMs ?? 0;
  const rows = options?.rows ?? DATA_SOURCE_ARRAY_DEMO_ROWS;

  if (mode === 'error') {
    if (delayMs > 0) await delay(delayMs);
    throw new Error('Simulated DataSource load failure');
  }

  if (mode === 'loading') {
    if (delayMs > 0) await delay(delayMs);
    return { status: 'loading' };
  }

  const items = mode === 'empty' ? ([] as DataSourceArrayDemoRow[]) : rows;
  const ds = new VxArrayDataSource(items, { keyExpr: 'id' });
  const flat = ds.load({
    skip: 0,
    take: 10,
    sort: { field: 'amount', direction: 'desc' },
  });
  const grouped: VxDataSourceLoadResult<VxArrayGroup<DataSourceArrayDemoRow>> =
    ds.load({
      skip: 0,
      take: 10,
      group: 'region',
    });

  if (flat.totalCount === 0) {
    return { status: 'empty', totalCount: 0 };
  }

  return {
    status: 'ready',
    totalCount: flat.totalCount,
    keys: flat.data.map((row) => ds.keyOf(row)),
    lines: [
      ...flat.data.map(
        (row) =>
          `#${ds.keyOf(row)} ${row.product} · ${row.region} · ${row.amount}`
      ),
      '— groups —',
      ...grouped.data.map(
        (g) =>
          `${String(g.key)} (${g.count}): ${g.items.map((r) => r.id).join(', ')}`
      ),
    ],
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
