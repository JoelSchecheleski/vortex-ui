/** @vitest-environment jsdom */
import '@angular/compiler';
import { provideZonelessChangeDetection } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  VxArrayDataSource,
  evaluateFilter,
  type VxDataFilter,
} from '../data-grid/data-source';
import { VxFilterBuilderComponent } from './filter-builder.component';
import {
  createNestedGroup,
  emptyFilterBuilderValue,
  toDataFilter,
  type VxFilterBuilderValue,
  type VxFilterCondition,
  type VxFilterField,
} from './filter-builder.model';

const fields: VxFilterField[] = [
  { field: 'product', label: 'Produto' },
  { field: 'region', label: 'Região' },
  { field: 'sector', label: 'Setor' },
  { field: 'amount', label: 'Valor' },
];

interface Row {
  id: number;
  product: string;
  region: string;
  sector: string;
  amount: number;
}

const sample: Row[] = [
  { id: 1, product: 'SolarMax', region: 'África', sector: 'Energy', amount: 100 },
  { id: 2, product: 'EcoCharge', region: 'Europa', sector: 'Retail', amount: 200 },
  { id: 3, product: 'VoltEdge', region: 'África', sector: 'Energy', amount: 150 },
  { id: 4, product: 'SolarMax', region: 'Américas', sector: 'Energy', amount: 300 },
  { id: 5, product: 'EcoCharge', region: 'Europa', sector: 'Retail', amount: 250 },
];

function cond(
  partial: Omit<VxFilterCondition, 'id'> & { id?: string }
): VxFilterCondition {
  return {
    id: partial.id ?? `fc-${partial.field}-${partial.value}`,
    field: partial.field,
    operator: partial.operator,
    value: partial.value,
  };
}

function loadIds(filter: VxDataFilter | null): number[] {
  const ds = new VxArrayDataSource(sample, { keyExpr: 'id' });
  return ds.load({ skip: 0, take: 50, filter }).data.map((r) => r.id);
}

beforeAll(() => {
  try {
    getTestBed().initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  } catch {
    /* already initialized in this Vitest worker */
  }
});

function createBuilder(): VxFilterBuilderComponent {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [VxFilterBuilderComponent],
    providers: [provideZonelessChangeDetection()],
  });
  const fixture = TestBed.createComponent(VxFilterBuilderComponent);
  fixture.detectChanges();
  return fixture.componentInstance;
}

describe('VxFilterBuilderComponent apply/clear + mutations', () => {
  it('addCondition/remove/addGroup/removeGroup update value() with stable ids', () => {
    const c = createBuilder();
    c.addCondition();
    c.addCondition();
    const [a, b] = c.value().conditions;
    expect(a).toBeDefined();
    expect(b).toBeDefined();
    expect(a!.id).not.toBe(b!.id);

    const keepId = b!.id;
    c.remove(a!.id);
    expect(c.value().conditions.map((x) => x.id)).toEqual([keepId]);

    c.addGroup();
    expect(c.value().groups).toHaveLength(1);
    const groupId = c.value().groups[0]!.id;
    const nestedId = c.value().groups[0]!.conditions[0]!.id;
    c.addCondition(groupId);
    expect(c.value().groups[0]!.conditions.map((x) => x.id)).toContain(nestedId);
    expect(c.value().groups[0]!.conditions).toHaveLength(2);

    c.removeGroup(groupId);
    expect(c.value().groups).toHaveLength(0);
    expect(c.value().conditions.map((x) => x.id)).toEqual([keepId]);
  });

  it('apply() emits applyFilter === toDataFilter(value) for multi-condition and nested', () => {
    const c = createBuilder();
    c.setLogic('or');
    c.addCondition();
    c.addCondition();
    const [a, b] = c.value().conditions;
    c.patch(a!.id, {
      field: 'region',
      operator: 'equals',
      value: 'Europa',
    });
    c.patch(b!.id, {
      field: 'product',
      operator: 'equals',
      value: 'VoltEdge',
    });
    c.addGroup();
    const g = c.value().groups[0]!;
    c.setGroupLogic(g.id, 'and');
    c.patch(
      g.conditions[0]!.id,
      { field: 'product', operator: 'contains', value: 'Solar' },
      g.id
    );
    c.addCondition(g.id);
    const nestedSecond = c.value().groups[0]!.conditions[1]!;
    c.patch(
      nestedSecond.id,
      { field: 'amount', operator: 'gt', value: '100' },
      g.id
    );

    const filters: VxDataFilter[] = [];
    const applied: VxFilterBuilderValue[] = [];
    c.applyFilter.subscribe((v) => {
      if (v) filters.push(v);
    });
    c.applied.subscribe((v) => applied.push(v));

    c.apply();
    expect(filters[0]).toEqual(toDataFilter(c.value()));
    expect(applied[0]).toEqual(c.value());
    expect(loadIds(filters[0]!).sort()).toEqual([2, 3, 4, 5]);
  });

  it('clear() emits null applyFilter + empty applied model', () => {
    const c = createBuilder();
    c.addCondition();
    c.patch(c.value().conditions[0]!.id, {
      field: 'product',
      value: 'x',
      operator: 'contains',
    });

    const filters: Array<VxDataFilter | null> = [];
    const applied: VxFilterBuilderValue[] = [];
    c.applyFilter.subscribe((v) => filters.push(v));
    c.applied.subscribe((v) => applied.push(v));

    c.clear();
    expect(filters[0]).toBeNull();
    expect(applied[0]).toEqual(emptyFilterBuilderValue());
    expect(c.value()).toEqual(emptyFilterBuilderValue());
  });
});

describe('FilterBuilder toDataFilter + DataSource round-trip', () => {
  it('empty builder → null filter; grid shows full set', () => {
    const model = emptyFilterBuilderValue();
    expect(toDataFilter(model)).toBeNull();
    expect(loadIds(null)).toEqual([1, 2, 3, 4, 5]);
  });

  it('multi-condition AND → rows match both; incomplete value ignored', () => {
    const model: VxFilterBuilderValue = {
      logic: 'and',
      conditions: [
        cond({ field: 'region', operator: 'contains', value: 'África' }),
        cond({ field: 'product', operator: 'equals', value: 'SolarMax' }),
        cond({ field: 'sector', operator: 'contains', value: '' }),
      ],
      groups: [],
    };
    const filter = toDataFilter(model);
    expect(filter).toEqual({
      logic: 'and',
      filters: [
        { field: 'region', value: 'África', operator: 'contains' },
        { field: 'product', value: 'SolarMax', operator: 'equals' },
      ],
    });
    expect(loadIds(filter)).toEqual([1]);
  });

  it('multi-condition OR → rows match either', () => {
    const model: VxFilterBuilderValue = {
      logic: 'or',
      conditions: [
        cond({ field: 'product', operator: 'equals', value: 'VoltEdge' }),
        cond({ field: 'region', operator: 'equals', value: 'Américas' }),
      ],
      groups: [],
    };
    const filter = toDataFilter(model);
    expect(loadIds(filter).sort()).toEqual([3, 4]);
  });

  it('clear model → null filter restores full local set', () => {
    const cleared = emptyFilterBuilderValue();
    expect(toDataFilter(cleared)).toBeNull();
    expect(loadIds(null)).toHaveLength(5);
  });

  it('startsWith / gt / lt operators evaluate per semantics', () => {
    expect(
      loadIds({ field: 'product', value: 'Eco', operator: 'startsWith' })
    ).toEqual([2, 5]);

    expect(loadIds({ field: 'amount', value: '200', operator: 'gt' })).toEqual([
      4, 5,
    ]);
    expect(loadIds({ field: 'amount', value: '150', operator: 'lt' })).toEqual([
      1,
    ]);

    expect(
      evaluateFilter({ amount: null }, { field: 'amount', value: '10', operator: 'gt' })
    ).toBe(false);
  });

  it('nested group depth 1 converts; deeper nesting is not produced by helpers', () => {
    const nested = createNestedGroup(fields);
    nested.logic = 'and';
    nested.conditions = [
      cond({
        id: 'n1',
        field: 'product',
        operator: 'contains',
        value: 'Solar',
      }),
      cond({
        id: 'n2',
        field: 'amount',
        operator: 'gt',
        value: '100',
      }),
    ];

    const model: VxFilterBuilderValue = {
      logic: 'or',
      conditions: [
        cond({ field: 'region', operator: 'equals', value: 'Europa' }),
      ],
      groups: [nested],
    };

    const filter = toDataFilter(model);
    expect(filter).toMatchObject({
      logic: 'or',
      filters: [
        { field: 'region', value: 'Europa', operator: 'equals' },
        {
          logic: 'and',
          filters: [
            { field: 'product', value: 'Solar', operator: 'contains' },
            { field: 'amount', value: '100', operator: 'gt' },
          ],
        },
      ],
    });

    expect(loadIds(filter).sort()).toEqual([2, 4, 5]);
    expect(createNestedGroup(fields)).not.toHaveProperty('groups');
  });
});
