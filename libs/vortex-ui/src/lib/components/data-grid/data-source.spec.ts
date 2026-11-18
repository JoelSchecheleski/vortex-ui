import { describe, expect, it } from 'vitest';
import { VxArrayDataSource, type VxArrayGroup } from './data-source';
import { runDataSourceArrayDemo } from './data-source-array-demo';

interface Row {
  id: number;
  product: string;
  region: string;
  amount: number;
}

const sample: Row[] = [
  { id: 1, product: 'SolarMax', region: 'África', amount: 100 },
  { id: 2, product: 'EcoCharge', region: 'Europa', amount: 200 },
  { id: 3, product: 'VoltEdge', region: 'África', amount: 150 },
  { id: 4, product: 'SolarMax', region: 'Américas', amount: 300 },
  { id: 5, product: 'EcoCharge', region: 'Europa', amount: 250 },
];

describe('VxArrayDataSource', () => {
  it('flat page: sort/filter/skip/take + stable keys', () => {
    const ds = new VxArrayDataSource(sample, { keyExpr: 'id' });

    const filtered = ds.load({
      skip: 0,
      take: 10,
      filter: { field: 'region', value: 'europa', operator: 'contains' },
      sort: { field: 'amount', direction: 'asc' },
    });

    expect(filtered.totalCount).toBe(2);
    expect(filtered.data.map((r) => r.id)).toEqual([2, 5]);
    expect(filtered.data.map((r) => ds.keyOf(r))).toEqual([2, 5]);

    const page = ds.load({
      skip: 1,
      take: 2,
      sort: { field: 'id', direction: 'asc' },
    });
    expect(page.totalCount).toBe(5);
    expect(page.data.map((r) => r.id)).toEqual([2, 3]);
  });

  it('empty: items [] → data [] and totalCount 0', () => {
    const ds = new VxArrayDataSource<Row>([]);
    const result = ds.load({ skip: 0, take: 10 });
    expect(result.data).toEqual([]);
    expect(result.totalCount).toBe(0);
  });

  it('group: pages groups; totalCount is filtered leaf count', () => {
    const ds = new VxArrayDataSource(sample, { keyExpr: 'id' });

    const grouped = ds.load({
      skip: 0,
      take: 10,
      group: 'region',
      sort: { field: 'id', direction: 'asc' },
    });

    expect(grouped.totalCount).toBe(5);
    expect(grouped.data).toHaveLength(3);
    const keys = grouped.data.map((g: VxArrayGroup<Row>) => g.key);
    expect(keys).toEqual(['África', 'Europa', 'Américas']);
    expect(grouped.data[0]).toMatchObject({
      key: 'África',
      count: 2,
    });
    expect(grouped.data[0]!.items.map((r) => r.id)).toEqual([1, 3]);

    const page = ds.load({
      skip: 1,
      take: 1,
      group: 'region',
    });
    expect(page.totalCount).toBe(5);
    expect(page.data).toHaveLength(1);
    expect(page.data[0]!.key).toBe('Europa');

    const fromArray = ds.load({
      skip: 0,
      take: 10,
      group: ['region', 'product'],
    });
    expect(fromArray.data.map((g) => g.key)).toEqual([
      'África',
      'Europa',
      'Américas',
    ]);
  });

  it('group + filter: totalCount reflects filtered leaves', () => {
    const ds = new VxArrayDataSource(sample);
    const result = ds.load({
      skip: 0,
      take: 10,
      group: 'region',
      filter: { field: 'product', value: 'SolarMax', operator: 'equals' },
    });
    expect(result.totalCount).toBe(2);
    expect(result.data).toHaveLength(2);
    expect(result.data.map((g) => g.key)).toEqual(['África', 'Américas']);
  });

  it('missing keyExpr field → keyOf returns undefined; load still returns row', () => {
    const ds = new VxArrayDataSource([{ product: 'x' } as Row], {
      keyExpr: 'id',
    });
    const result = ds.load({ skip: 0, take: 1 });
    expect(result.data).toHaveLength(1);
    expect(ds.keyOf(result.data[0]!)).toBeUndefined();
  });

  it('default keyExpr is id', () => {
    const ds = new VxArrayDataSource(sample);
    expect(ds.keyOf(sample[0]!)).toBe(1);
  });

  it('keyExpr ≠ id uses that field in keyOf', () => {
    const ds = new VxArrayDataSource(sample, { keyExpr: 'product' });
    expect(ds.keyOf(sample[0]!)).toBe('SolarMax');
    expect(ds.keyOf(sample[1]!)).toBe('EcoCharge');
  });

  it('empty group string / [\'\'] behave as flat path', () => {
    const ds = new VxArrayDataSource(sample);
    const flat = ds.load({ skip: 0, take: 10 });
    const emptyStr = ds.load({ skip: 0, take: 10, group: '' });
    const emptyArr = ds.load({ skip: 0, take: 10, group: [''] });
    expect(emptyStr.data).toEqual(flat.data);
    expect(emptyStr.totalCount).toBe(flat.totalCount);
    expect(emptyArr.data).toEqual(flat.data);
    expect(emptyArr.totalCount).toBe(flat.totalCount);
  });

  it('compound AND/OR + startsWith/gt/lt keep single VxFilterState path working', () => {
    const ds = new VxArrayDataSource(sample, { keyExpr: 'id' });

    const and = ds.load({
      skip: 0,
      take: 10,
      filter: {
        logic: 'and',
        filters: [
          { field: 'region', value: 'África', operator: 'contains' },
          { field: 'amount', value: '120', operator: 'gt' },
        ],
      },
    });
    expect(and.data.map((r) => r.id)).toEqual([3]);

    const or = ds.load({
      skip: 0,
      take: 10,
      filter: {
        logic: 'or',
        filters: [
          { field: 'product', value: 'Eco', operator: 'startsWith' },
          { field: 'amount', value: '100', operator: 'lt' },
        ],
      },
    });
    expect(or.data.map((r) => r.id).sort()).toEqual([2, 5]);

    // Backward-compatible single condition still works
    const single = ds.load({
      skip: 0,
      take: 10,
      filter: { field: 'product', value: 'SolarMax', operator: 'equals' },
    });
    expect(single.totalCount).toBe(2);
  });

  it('OR compound with incomplete child ignores incomplete (does not match all rows)', () => {
    const ds = new VxArrayDataSource(sample, { keyExpr: 'id' });
    const result = ds.load({
      skip: 0,
      take: 10,
      filter: {
        logic: 'or',
        filters: [
          { field: 'product', value: 'VoltEdge', operator: 'equals' },
          { field: 'region', value: '', operator: 'contains' },
        ],
      },
    });
    // Incomplete OR arm must not make every row match — only VoltEdge
    expect(result.data.map((r) => r.id)).toEqual([3]);
    expect(result.totalCount).toBe(1);
  });
});

describe('DataSource-Array Storybook demo states', () => {
  it('story loading: keeps loading status after delay', async () => {
    const result = await runDataSourceArrayDemo('loading', { delayMs: 0 });
    expect(result.status).toBe('loading');
  });

  it('story error: rejects with visible failure message', async () => {
    await expect(runDataSourceArrayDemo('error', { delayMs: 0 })).rejects.toThrow(
      'Simulated DataSource load failure'
    );
  });

  it('story empty: returns empty status', async () => {
    const result = await runDataSourceArrayDemo('empty', { delayMs: 0 });
    expect(result).toEqual({ status: 'empty', totalCount: 0 });
  });
});
