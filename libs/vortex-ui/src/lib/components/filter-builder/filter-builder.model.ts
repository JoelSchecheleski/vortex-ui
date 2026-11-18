import {
  type VxCompoundFilter,
  type VxDataFilter,
  type VxFilterOperator,
  type VxFilterState,
} from '../data-grid/data-source';

export type { VxFilterOperator };

export interface VxFilterField {
  field: string;
  label: string;
}

export interface VxFilterCondition {
  id: string;
  field: string;
  operator: VxFilterOperator;
  value: string;
}

export type VxFilterGroupLogic = 'and' | 'or';

/** Nested group under the root (max depth 1 — conditions only, no further groups). */
export interface VxFilterNestedGroup {
  id: string;
  logic: VxFilterGroupLogic;
  conditions: VxFilterCondition[];
}

export interface VxFilterBuilderValue {
  logic: VxFilterGroupLogic;
  conditions: VxFilterCondition[];
  /** Nested AND/OR groups (depth ≤ 1 under root). */
  groups: VxFilterNestedGroup[];
}

let filterSeq = 0;
function nextId(prefix = 'fc'): string {
  filterSeq += 1;
  return `${prefix}-${filterSeq}`;
}

export function emptyFilterBuilderValue(): VxFilterBuilderValue {
  return { logic: 'and', conditions: [], groups: [] };
}

function isCompleteCondition(c: VxFilterCondition): boolean {
  return Boolean(c.field && c.value !== '');
}

function conditionToState(c: VxFilterCondition): VxFilterState {
  return {
    field: c.field,
    value: c.value,
    operator: c.operator,
  };
}

/**
 * Convert the builder expression model into a DataSource-compatible filter.
 * Incomplete conditions (empty value) are skipped. Empty model → `null`.
 */
export function toDataFilter(value: VxFilterBuilderValue): VxDataFilter | null {
  const rootFilters: Array<VxFilterState | VxCompoundFilter> = [];

  for (const c of value.conditions) {
    if (!isCompleteCondition(c)) continue;
    rootFilters.push(conditionToState(c));
  }

  for (const group of value.groups ?? []) {
    const childFilters = group.conditions
      .filter(isCompleteCondition)
      .map(conditionToState);
    if (childFilters.length === 0) continue;
    if (childFilters.length === 1) {
      rootFilters.push(childFilters[0]!);
    } else {
      rootFilters.push({ logic: group.logic, filters: childFilters });
    }
  }

  if (rootFilters.length === 0) return null;
  if (rootFilters.length === 1) return rootFilters[0]!;
  return { logic: value.logic, filters: rootFilters };
}

export function createCondition(fields: VxFilterField[]): VxFilterCondition {
  return {
    id: nextId('fc'),
    field: fields[0]?.field ?? '',
    operator: 'contains',
    value: '',
  };
}

export function createNestedGroup(fields: VxFilterField[]): VxFilterNestedGroup {
  return {
    id: nextId('fg'),
    logic: 'and',
    conditions: [createCondition(fields)],
  };
}

export function normalizeFilterBuilderValue(
  value: VxFilterBuilderValue
): VxFilterBuilderValue {
  return {
    logic: value.logic ?? 'and',
    conditions: value.conditions ?? [],
    groups: value.groups ?? [],
  };
}
