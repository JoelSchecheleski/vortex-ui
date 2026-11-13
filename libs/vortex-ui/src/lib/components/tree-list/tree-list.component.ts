import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { VxColumnDef } from '../data-grid/data-grid.types';

export interface VxTreeListNode<T = Record<string, unknown>> {
  id: string;
  data: T;
  children?: VxTreeListNode<T>[];
}

interface FlatRow<T> {
  node: VxTreeListNode<T>;
  depth: number;
  hasChildren: boolean;
}

@Component({
  selector: 'vx-tree-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-tl" role="treegrid" [attr.aria-label]="ariaLabel()" [attr.aria-rowcount]="visibleRows().length">
      <div class="vx-tl__header" role="row">
        <div class="vx-tl__header-cell vx-tl__header-cell--tree" role="columnheader">{{ treeColumnHeader() }}</div>
        @for (col of columns(); track col.field) {
          <div class="vx-tl__header-cell" role="columnheader" [style.width]="colWidth(col)">
            {{ col.header }}
          </div>
        }
      </div>
      <div class="vx-tl__body" role="rowgroup">
        @for (row of visibleRows(); track row.node.id) {
          <div
            class="vx-tl__row"
            role="row"
            [class.vx-tl__row--selected]="selected().has(row.node.id)"
            (click)="select(row.node)"
          >
            <div
              class="vx-tl__cell vx-tl__cell--tree"
              role="gridcell"
              [style.padding-left.rem]="row.depth * 1.1 + 0.5"
            >
              <button
                type="button"
                class="vx-tl__toggle"
                [class.vx-tl__toggle--hidden]="!row.hasChildren"
                [class.vx-tl__toggle--open]="isExpanded(row.node.id)"
                [attr.aria-label]="isExpanded(row.node.id) ? 'Recolher' : 'Expandir'"
                (click)="toggleExpand(row.node.id); $event.stopPropagation()"
              >
                ▸
              </button>
              <span>{{ treeLabel(row.node) }}</span>
            </div>
            @for (col of columns(); track col.field) {
              <div class="vx-tl__cell" role="gridcell" [style.width]="colWidth(col)">
                {{ cellValue(row.node.data, col) }}
              </div>
            }
          </div>
        } @empty {
          <div class="vx-tl__empty">{{ emptyText() }}</div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .vx-tl {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 220px;
        border: 1px solid var(--vx-color-border);
        border-radius: var(--vx-radius-md);
        background: var(--vx-color-surface);
        font-family: var(--vx-font-sans);
        font-size: var(--vx-font-size-sm);
        overflow: hidden;
      }

      .vx-tl__header,
      .vx-tl__row {
        display: flex;
        align-items: stretch;
        min-width: max-content;
      }

      .vx-tl__header {
        background: var(--vx-color-bg-muted);
        border-bottom: 1px solid var(--vx-color-border);
        font-weight: var(--vx-font-weight-semibold);
        flex-shrink: 0;
      }

      .vx-tl__body {
        flex: 1;
        overflow: auto;
      }

      .vx-tl__header-cell,
      .vx-tl__cell {
        padding: var(--vx-space-2) var(--vx-space-3);
        border-right: 1px solid var(--vx-color-border);
        box-sizing: border-box;
        display: flex;
        align-items: center;
        min-width: 120px;
      }

      .vx-tl__header-cell--tree,
      .vx-tl__cell--tree {
        min-width: 220px;
        flex: 1;
      }

      .vx-tl__row {
        border-bottom: 1px solid var(--vx-color-border);
        cursor: pointer;
        color: var(--vx-color-text);
      }

      .vx-tl__row:hover {
        background: var(--vx-color-bg-hover);
      }

      .vx-tl__row--selected {
        background: var(--vx-color-primary-subtle);
      }

      .vx-tl__toggle {
        width: 1.4rem;
        height: 1.4rem;
        border: none;
        background: transparent;
        color: var(--vx-color-text-secondary);
        cursor: pointer;
        margin-right: var(--vx-space-1);
        border-radius: var(--vx-radius-sm);
        flex-shrink: 0;
        transition: transform var(--vx-transition-fast);
      }

      .vx-tl__toggle--hidden {
        visibility: hidden;
      }

      .vx-tl__toggle--open {
        transform: rotate(90deg);
      }

      .vx-tl__empty {
        padding: var(--vx-space-6);
        color: var(--vx-color-text-secondary);
        text-align: center;
      }
    `,
  ],
})
export class VxTreeListComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  readonly items = input<VxTreeListNode<T>[]>([]);
  readonly columns = input<VxColumnDef<T>[]>([]);
  readonly treeField = input('name');
  readonly treeColumnHeader = input('Nome');
  readonly ariaLabel = input('Tree List');
  readonly emptyText = input('Nenhum item');
  readonly selectedIds = model<string[]>([]);
  readonly expandedIds = model<string[]>([]);
  readonly selectionChange = output<VxTreeListNode<T>[]>();
  readonly expandChange = output<string[]>();

  readonly selected = computed(() => new Set(this.selectedIds()));

  readonly visibleRows = computed(() => {
    const expanded = new Set(this.expandedIds());
    const rows: FlatRow<T>[] = [];
    const walk = (nodes: VxTreeListNode<T>[], depth: number) => {
      for (const node of nodes) {
        const hasChildren = !!node.children?.length;
        rows.push({ node, depth, hasChildren });
        if (hasChildren && expanded.has(node.id)) {
          walk(node.children!, depth + 1);
        }
      }
    };
    walk(this.items(), 0);
    return rows;
  });

  isExpanded(id: string): boolean {
    return this.expandedIds().includes(id);
  }

  toggleExpand(id: string): void {
    const cur = this.expandedIds();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    this.expandedIds.set(next);
    this.expandChange.emit(next);
  }

  select(node: VxTreeListNode<T>): void {
    this.selectedIds.set([node.id]);
    this.selectionChange.emit([node]);
  }

  treeLabel(node: VxTreeListNode<T>): string {
    const v = node.data[this.treeField()];
    return v == null ? node.id : String(v);
  }

  cellValue(data: T, col: VxColumnDef<T>): unknown {
    if (col.valueGetter) return col.valueGetter(data);
    return data[col.field];
  }

  colWidth(col: VxColumnDef<T>): string {
    if (col.width == null) return '140px';
    return typeof col.width === 'number' ? `${col.width}px` : col.width;
  }
}
