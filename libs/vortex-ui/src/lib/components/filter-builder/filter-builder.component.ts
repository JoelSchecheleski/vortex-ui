import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VxFilterState } from '../data-grid/data-source';

export interface VxFilterField {
  field: string;
  label: string;
}

export type VxFilterOperator = 'contains' | 'equals' | 'startsWith' | 'gt' | 'lt';

export interface VxFilterCondition {
  id: string;
  field: string;
  operator: VxFilterOperator;
  value: string;
}

export type VxFilterGroupLogic = 'and' | 'or';

export interface VxFilterBuilderValue {
  logic: VxFilterGroupLogic;
  conditions: VxFilterCondition[];
}

let filterSeq = 0;
function nextId(): string {
  filterSeq += 1;
  return `fc-${filterSeq}`;
}

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
            [class.vx-fb__chip--active]="value().logic === 'and'"
            (click)="setLogic('and')"
          >
            E
          </button>
          <button
            type="button"
            class="vx-fb__chip"
            [class.vx-fb__chip--active]="value().logic === 'or'"
            (click)="setLogic('or')"
          >
            OU
          </button>
        </div>
        <button type="button" class="vx-fb__add" (click)="addCondition()">+ Condição</button>
      </header>

      <div class="vx-fb__list">
        @for (c of value().conditions; track c.id; let i = $index) {
          @if (i > 0) {
            <div class="vx-fb__join">{{ value().logic === 'and' ? 'E' : 'OU' }}</div>
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
        } @empty {
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

    .vx-fb__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--vx-space-2);
      flex-wrap: wrap;
    }

    .vx-fb__logic {
      display: flex;
      gap: var(--vx-space-1);
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
    }
  `,
})
export class VxFilterBuilderComponent {
  readonly fields = input<VxFilterField[]>([]);
  readonly ariaLabel = input('Filter Builder');
  readonly value = model<VxFilterBuilderValue>({ logic: 'and', conditions: [] });
  /** Primeira condição compatível com VxFilterState (Grid atual). */
  readonly applyFilter = output<VxFilterState | null>();
  readonly applied = output<VxFilterBuilderValue>();

  readonly operators: VxFilterOperator[] = [
    'contains',
    'equals',
    'startsWith',
    'gt',
    'lt',
  ];

  readonly summary = computed(() => {
    const v = this.value();
    return `${v.conditions.length} condição(ões) · ${v.logic.toUpperCase()}`;
  });

  operatorLabel(op: VxFilterOperator): string {
    return OPERATOR_LABELS[op];
  }

  setLogic(logic: VxFilterGroupLogic): void {
    this.commit({ ...this.value(), logic });
  }

  addCondition(): void {
    const fields = this.fields();
    const field = fields[0]?.field ?? '';
    const next: VxFilterCondition = {
      id: nextId(),
      field,
      operator: 'contains',
      value: '',
    };
    this.commit({
      ...this.value(),
      conditions: [...this.value().conditions, next],
    });
  }

  patch(id: string, patch: Partial<VxFilterCondition>): void {
    this.commit({
      ...this.value(),
      conditions: this.value().conditions.map((c) =>
        c.id === id ? { ...c, ...patch } : c
      ),
    });
  }

  remove(id: string): void {
    this.commit({
      ...this.value(),
      conditions: this.value().conditions.filter((c) => c.id !== id),
    });
  }

  clear(): void {
    this.commit({ logic: 'and', conditions: [] });
    this.applyFilter.emit(null);
    this.applied.emit(this.value());
  }

  apply(): void {
    const v = this.value();
    this.applied.emit(v);
    const first = v.conditions.find((c) => c.field && c.value !== '');
    if (!first) {
      this.applyFilter.emit(null);
      return;
    }
    const op =
      first.operator === 'equals' || first.operator === 'contains'
        ? first.operator
        : 'contains';
    this.applyFilter.emit({
      field: first.field,
      value: first.value,
      operator: op,
    });
  }

  private commit(next: VxFilterBuilderValue): void {
    this.value.set(next);
  }
}
