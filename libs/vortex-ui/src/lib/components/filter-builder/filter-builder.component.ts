import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  type VxDataFilter,
  isCompoundFilter,
} from '../data-grid/data-source';
import {
  createCondition,
  createNestedGroup,
  emptyFilterBuilderValue,
  normalizeFilterBuilderValue,
  toDataFilter,
  type VxFilterBuilderValue,
  type VxFilterCondition,
  type VxFilterField,
  type VxFilterGroupLogic,
  type VxFilterNestedGroup,
  type VxFilterOperator,
} from './filter-builder.model';

export type {
  VxFilterBuilderValue,
  VxFilterCondition,
  VxFilterField,
  VxFilterGroupLogic,
  VxFilterNestedGroup,
  VxFilterOperator,
} from './filter-builder.model';

export {
  createCondition,
  createNestedGroup,
  emptyFilterBuilderValue,
  toDataFilter,
} from './filter-builder.model';

const OPERATOR_LABELS: Record<VxFilterOperator, string> = {
  contains: 'contém',
  equals: 'igual a',
  startsWith: 'começa com',
  gt: 'maior que',
  lt: 'menor que',
};

@Component({
  selector: 'vx-filter-builder',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-fb" [attr.aria-label]="ariaLabel()">
      <header class="vx-fb__header">
        <div class="vx-fb__logic" role="group" aria-label="Lógica">
          <button
            type="button"
            class="vx-fb__chip"
            [class.vx-fb__chip--active]="view().logic === 'and'"
            (click)="setLogic('and')"
          >
            E
          </button>
          <button
            type="button"
            class="vx-fb__chip"
            [class.vx-fb__chip--active]="view().logic === 'or'"
            (click)="setLogic('or')"
          >
            OU
          </button>
        </div>
        <div class="vx-fb__header-actions">
          <button type="button" class="vx-fb__add" (click)="addCondition()">
            + Condição
          </button>
          <button type="button" class="vx-fb__add" (click)="addGroup()">
            + Grupo
          </button>
        </div>
      </header>

      <div class="vx-fb__list">
        @for (c of view().conditions; track c.id; let i = $index) {
          @if (i > 0) {
            <div class="vx-fb__join">{{ view().logic === 'and' ? 'E' : 'OU' }}</div>
          }
          <div class="vx-fb__row">
            <select
              class="vx-fb__select"
              [ngModel]="c.field"
              (ngModelChange)="patch(c.id, { field: $event })"
              aria-label="Campo"
            >
              @for (f of fields(); track f.field) {
                <option [value]="f.field">{{ f.label }}</option>
              }
            </select>
            <select
              class="vx-fb__select"
              [ngModel]="c.operator"
              (ngModelChange)="patch(c.id, { operator: $event })"
              aria-label="Operador"
            >
              @for (op of operators; track op) {
                <option [value]="op">{{ operatorLabel(op) }}</option>
              }
            </select>
            <input
              class="vx-fb__input"
              type="text"
              [ngModel]="c.value"
              (ngModelChange)="patch(c.id, { value: $event })"
              placeholder="Valor"
              aria-label="Valor"
            />
            <button
              type="button"
              class="vx-fb__remove"
              aria-label="Remover condição"
              (click)="remove(c.id)"
            >
              ✕
            </button>
          </div>
        }

        @for (g of view().groups; track g.id; let gi = $index) {
          @if (view().conditions.length > 0 || gi > 0) {
            <div class="vx-fb__join">{{ view().logic === 'and' ? 'E' : 'OU' }}</div>
          }
          <div class="vx-fb__group" [attr.aria-label]="'Grupo ' + (gi + 1)">
            <div class="vx-fb__group-header">
              <div class="vx-fb__logic" role="group" aria-label="Lógica do grupo">
                <button
                  type="button"
                  class="vx-fb__chip"
                  [class.vx-fb__chip--active]="g.logic === 'and'"
                  (click)="setGroupLogic(g.id, 'and')"
                >
                  E
                </button>
                <button
                  type="button"
                  class="vx-fb__chip"
                  [class.vx-fb__chip--active]="g.logic === 'or'"
                  (click)="setGroupLogic(g.id, 'or')"
                >
                  OU
                </button>
              </div>
              <div class="vx-fb__header-actions">
                <button
                  type="button"
                  class="vx-fb__add"
                  (click)="addCondition(g.id)"
                >
                  + Condição
                </button>
                <button
                  type="button"
                  class="vx-fb__remove"
                  aria-label="Remover grupo"
                  (click)="removeGroup(g.id)"
                >
                  ✕
                </button>
              </div>
            </div>

            @for (c of g.conditions; track c.id; let ci = $index) {
              @if (ci > 0) {
                <div class="vx-fb__join">{{ g.logic === 'and' ? 'E' : 'OU' }}</div>
              }
              <div class="vx-fb__row">
                <select
                  class="vx-fb__select"
                  [ngModel]="c.field"
                  (ngModelChange)="patch(c.id, { field: $event }, g.id)"
                  aria-label="Campo"
                >
                  @for (f of fields(); track f.field) {
                    <option [value]="f.field">{{ f.label }}</option>
                  }
                </select>
                <select
                  class="vx-fb__select"
                  [ngModel]="c.operator"
                  (ngModelChange)="patch(c.id, { operator: $event }, g.id)"
                  aria-label="Operador"
                >
                  @for (op of operators; track op) {
                    <option [value]="op">{{ operatorLabel(op) }}</option>
                  }
                </select>
                <input
                  class="vx-fb__input"
                  type="text"
                  [ngModel]="c.value"
                  (ngModelChange)="patch(c.id, { value: $event }, g.id)"
                  placeholder="Valor"
                  aria-label="Valor"
                />
                <button
                  type="button"
                  class="vx-fb__remove"
                  aria-label="Remover condição"
                  (click)="remove(c.id, g.id)"
                >
                  ✕
                </button>
              </div>
            } @empty {
              <p class="vx-fb__empty">Grupo vazio. Adicione uma condição.</p>
            }
          </div>
        }

        @if (view().conditions.length === 0 && view().groups.length === 0) {
          <p class="vx-fb__empty">Nenhuma condição. Adicione para filtrar.</p>
        }
      </div>

      <footer class="vx-fb__footer">
        <button type="button" class="vx-fb__btn" (click)="clear()">Limpar</button>
        <button type="button" class="vx-fb__btn vx-fb__btn--primary" (click)="apply()">
          Aplicar
        </button>
      </footer>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .vx-fb {
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-surface);
      font-family: var(--vx-font-sans);
      padding: var(--vx-space-3);
      display: flex;
      flex-direction: column;
      gap: var(--vx-space-3);
    }

    .vx-fb__header,
    .vx-fb__group-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--vx-space-2);
      flex-wrap: wrap;
    }

    .vx-fb__header-actions,
    .vx-fb__logic {
      display: flex;
      gap: var(--vx-space-1);
      flex-wrap: wrap;
    }

    .vx-fb__chip,
    .vx-fb__add,
    .vx-fb__btn,
    .vx-fb__remove {
      border: 1px solid var(--vx-color-border);
      background: var(--vx-color-bg-elevated);
      color: var(--vx-color-text);
      border-radius: var(--vx-radius-md);
      font: inherit;
      font-size: var(--vx-font-size-sm);
      cursor: pointer;
      padding: 0.35rem 0.7rem;
    }

    .vx-fb__chip--active,
    .vx-fb__btn--primary {
      background: var(--vx-color-primary);
      border-color: var(--vx-color-primary);
      color: var(--vx-color-primary-text);
    }

    .vx-fb__group {
      margin-left: var(--vx-space-3);
      padding: var(--vx-space-2);
      border-left: 2px solid var(--vx-color-border-strong);
      display: flex;
      flex-direction: column;
      gap: var(--vx-space-2);
    }

    .vx-fb__row {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1.4fr) auto;
      gap: var(--vx-space-2);
      align-items: center;
    }

    .vx-fb__select,
    .vx-fb__input {
      height: 2.25rem;
      border: 1px solid var(--vx-color-border-strong);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-bg-elevated);
      color: var(--vx-color-text);
      font: inherit;
      font-size: var(--vx-font-size-sm);
      padding: 0 var(--vx-space-2);
      min-width: 0;
    }

    .vx-fb__select:focus,
    .vx-fb__input:focus {
      outline: none;
      box-shadow: var(--vx-focus-ring);
      border-color: var(--vx-color-border-focus);
    }

    .vx-fb__join {
      font-size: var(--vx-font-size-xs);
      font-weight: var(--vx-font-weight-semibold);
      color: var(--vx-color-text-secondary);
      padding: var(--vx-space-1) 0;
    }

    .vx-fb__empty {
      margin: 0;
      color: var(--vx-color-text-secondary);
      font-size: var(--vx-font-size-sm);
    }

    .vx-fb__footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--vx-space-2);
    }

    @media (max-width: 640px) {
      .vx-fb__row {
        grid-template-columns: 1fr;
      }

      .vx-fb__group {
        margin-left: var(--vx-space-2);
      }
    }
  `,
})
export class VxFilterBuilderComponent {
  readonly fields = input<VxFilterField[]>([]);
  readonly ariaLabel = input('Filter Builder');
  readonly value = model<VxFilterBuilderValue>(emptyFilterBuilderValue());
  /** DataSource-compatible filter (full expression — not first-condition-only). */
  readonly applyFilter = output<VxDataFilter | null>();
  readonly applied = output<VxFilterBuilderValue>();

  readonly operators: VxFilterOperator[] = [
    'contains',
    'equals',
    'startsWith',
    'gt',
    'lt',
  ];

  /** Normalized view model so legacy `{ logic, conditions }` bindings stay safe. */
  readonly view = computed(() => normalizeFilterBuilderValue(this.value()));

  readonly summary = computed(() => {
    const v = this.view();
    const nested = v.groups.reduce((n, g) => n + g.conditions.length, 0);
    return `${v.conditions.length + nested} condição(ões) · ${v.logic.toUpperCase()}`;
  });

  operatorLabel(op: VxFilterOperator): string {
    return OPERATOR_LABELS[op];
  }

  setLogic(logic: VxFilterGroupLogic): void {
    this.commit({ ...normalizeFilterBuilderValue(this.value()), logic });
  }

  setGroupLogic(groupId: string, logic: VxFilterGroupLogic): void {
    const v = normalizeFilterBuilderValue(this.value());
    this.commit({
      ...v,
      groups: v.groups.map((g) => (g.id === groupId ? { ...g, logic } : g)),
    });
  }

  /** Add a condition at the root, or inside a nested group when `groupId` is set. */
  addCondition(groupId?: string | null): void {
    const fields = this.fields();
    const next = createCondition(fields);
    const v = normalizeFilterBuilderValue(this.value());
    if (!groupId) {
      this.commit({ ...v, conditions: [...v.conditions, next] });
      return;
    }
    this.commit({
      ...v,
      groups: v.groups.map((g) =>
        g.id === groupId ? { ...g, conditions: [...g.conditions, next] } : g
      ),
    });
  }

  /**
   * Add a nested group under the root (depth 1).
   * Deeper nesting is intentionally a no-op (NESTED_ONE_LEVEL).
   */
  addGroup(): void {
    const v = normalizeFilterBuilderValue(this.value());
    this.commit({
      ...v,
      groups: [...v.groups, createNestedGroup(this.fields())],
    });
  }

  /** No-op guard: nested groups cannot contain further groups. */
  addNestedGroupInside(_groupId: string): void {
    return;
  }

  patch(
    id: string,
    patch: Partial<VxFilterCondition>,
    groupId?: string | null
  ): void {
    const v = normalizeFilterBuilderValue(this.value());
    if (!groupId) {
      this.commit({
        ...v,
        conditions: v.conditions.map((c) =>
          c.id === id ? { ...c, ...patch } : c
        ),
      });
      return;
    }
    this.commit({
      ...v,
      groups: v.groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              conditions: g.conditions.map((c) =>
                c.id === id ? { ...c, ...patch } : c
              ),
            }
          : g
      ),
    });
  }

  remove(id: string, groupId?: string | null): void {
    const v = normalizeFilterBuilderValue(this.value());
    if (!groupId) {
      this.commit({
        ...v,
        conditions: v.conditions.filter((c) => c.id !== id),
      });
      return;
    }
    this.commit({
      ...v,
      groups: v.groups.map((g) =>
        g.id === groupId
          ? { ...g, conditions: g.conditions.filter((c) => c.id !== id) }
          : g
      ),
    });
  }

  removeGroup(groupId: string): void {
    const v = normalizeFilterBuilderValue(this.value());
    this.commit({
      ...v,
      groups: v.groups.filter((g) => g.id !== groupId),
    });
  }

  clear(): void {
    this.commit(emptyFilterBuilderValue());
    this.applyFilter.emit(null);
    this.applied.emit(this.value());
  }

  apply(): void {
    const v = normalizeFilterBuilderValue(this.value());
    this.applied.emit(v);
    this.applyFilter.emit(toDataFilter(v));
  }

  /** Stable summary label for toolbar / demos. */
  static describeFilter(filter: VxDataFilter | null): string {
    if (!filter) return '';
    if (isCompoundFilter(filter)) {
      return `${filter.logic.toUpperCase()} (${filter.filters.length})`;
    }
    return `${filter.field} ≈ ${filter.value}`;
  }

  private commit(next: VxFilterBuilderValue): void {
    this.value.set(normalizeFilterBuilderValue(next));
  }
}
