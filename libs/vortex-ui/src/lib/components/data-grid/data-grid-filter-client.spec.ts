import { describe, expect, it } from 'vitest';
import {
  evaluateFilter,
  hasActiveFilter,
  type VxDataFilter,
} from './data-source';

/**
 * Mirrors VxDataGridComponent.filteredClientRows filter branch
 * (setFilter → filter signal → hasActiveFilter + evaluateFilter).
 * Full component harness is blocked in Vitest by the vortex-ui/ai entry.
 */
function filteredClientRows<T extends Record<string, unknown>>(
  rows: T[],
  filter: VxDataFilter | null
): T[] {
  if (hasActiveFilter(filter)) {
    return rows.filter((row) => evaluateFilter(row, filter));
  }
  return rows;
}

interface Row {
  id: number;
  product: string;
  region: string;
}

const rows: Row[] = [
  { id: 1, product: 'SolarMax', region: 'África' },
  { id: 2, product: 'EcoCharge', region: 'Europa' },
  { id: 3, product: 'SolarMax', region: 'Europa' },
  { id: 4, product: 'VoltEdge', region: 'Américas' },
];

describe('DataGrid client filter path (setFilter / filteredClientRows)', () => {
  it('compound AND narrows rows like setFilter on local data', () => {
    const filter: VxDataFilter = {
      logic: 'and',
      filters: [
        { field: 'product', value: 'SolarMax', operator: 'equals' },
        { field: 'region', value: 'Europa', operator: 'equals' },
      ],
    };
    expect(filteredClientRows(rows, filter).map((r) => r.id)).toEqual([3]);
  });

  it('compound OR matches either arm; inactive filter restores full set', () => {
    const filter: VxDataFilter = {
      logic: 'or',
      filters: [
        { field: 'product', value: 'VoltEdge', operator: 'equals' },
        { field: 'region', value: 'África', operator: 'equals' },
      ],
    };
    expect(filteredClientRows(rows, filter).map((r) => r.id).sort()).toEqual([
      1, 4,
    ]);
    expect(filteredClientRows(rows, null).map((r) => r.id)).toEqual([
      1, 2, 3, 4,
    ]);
    expect(
      filteredClientRows(rows, {
        field: 'product',
        value: '',
        operator: 'contains',
      }).map((r) => r.id)
    ).toEqual([1, 2, 3, 4]);
  });
});
