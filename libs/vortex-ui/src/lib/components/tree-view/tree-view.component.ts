import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  model,
  output,
} from '@angular/core';

export interface VxTreeNode {
  id: string;
  text: string;
  children?: VxTreeNode[];
  disabled?: boolean;
}

interface FlatNode {
  node: VxTreeNode;
  depth: number;
  hasChildren: boolean;
}

@Component({
  selector: 'vx-tree-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-tree" role="tree" [attr.aria-label]="ariaLabel()" [attr.aria-multiselectable]="multiSelect()">
      @for (row of visibleRows(); track row.node.id) {
        <div class="vx-tree__row" [style.padding-left.rem]="row.depth" role="none">
          <button
            type="button"
            class="vx-tree__toggle"
            [class.vx-tree__toggle--hidden]="!row.hasChildren"
            [class.vx-tree__toggle--open]="isExpanded(row.node.id)"
            [attr.aria-label]="isExpanded(row.node.id) ? 'Recolher' : 'Expandir'"
            (click)="toggleExpand(row.node.id)"
          >
            ▸
          </button>
          <button
            type="button"
            class="vx-tree__node"
            role="treeitem"
            [attr.aria-expanded]="row.hasChildren ? isExpanded(row.node.id) : null"
            [attr.aria-selected]="selected().has(row.node.id)"
            [disabled]="!!row.node.disabled"
            [class.vx-tree__node--selected]="selected().has(row.node.id)"
            (click)="select(row.node)"
          >
            {{ row.node.text }}
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .vx-tree {
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-surface);
      padding: var(--vx-space-2);
      font-family: var(--vx-font-sans);
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
    }

    .vx-tree__row {
      display: flex;
      align-items: center;
      gap: var(--vx-space-1);
    }

    .vx-tree__toggle {
      width: 1.5rem;
      height: 1.5rem;
      border: none;
      background: transparent;
      color: var(--vx-color-text-secondary);
      cursor: pointer;
      border-radius: var(--vx-radius-sm);
      transition: transform var(--vx-transition-fast);
      flex-shrink: 0;
    }

    .vx-tree__toggle--hidden {
      visibility: hidden;
    }

    .vx-tree__toggle--open {
      transform: rotate(90deg);
    }

    .vx-tree__node {
      flex: 1;
      text-align: left;
      border: none;
      background: transparent;
      color: var(--vx-color-text);
      font: inherit;
      font-size: var(--vx-font-size-sm);
      padding: var(--vx-space-2);
      border-radius: var(--vx-radius-md);
      cursor: pointer;
    }

    .vx-tree__node:hover:not(:disabled) {
      background: var(--vx-color-bg-hover);
    }

    .vx-tree__node--selected {
      background: var(--vx-color-primary-subtle);
      color: var(--vx-color-primary-ink, var(--vx-color-text));
    }

    .vx-tree__node:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  `,
})
export class VxTreeViewComponent {
  readonly items = input<VxTreeNode[]>([]);
  readonly multiSelect = input(false);
  readonly ariaLabel = input('Árvore');
  readonly selectedIds = model<string[]>([]);
  readonly expandedIds = model<string[]>([]);
  readonly selectionChange = output<VxTreeNode[]>();
  readonly expandChange = output<string[]>();

  readonly selected = computed(() => new Set(this.selectedIds()));

  readonly visibleRows = computed(() => {
    const expanded = new Set(this.expandedIds());
    const rows: FlatNode[] = [];
    const walk = (nodes: VxTreeNode[], depth: number) => {
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

  private readonly nodeIndex = computed(() => {
    const map = new Map<string, VxTreeNode>();
    const walk = (nodes: VxTreeNode[]) => {
      for (const n of nodes) {
        map.set(n.id, n);
        if (n.children) walk(n.children);
      }
    };
    walk(this.items());
    return map;
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

  select(node: VxTreeNode): void {
    if (node.disabled) return;
    let next: string[];
    if (this.multiSelect()) {
      const set = new Set(this.selectedIds());
      if (set.has(node.id)) set.delete(node.id);
      else set.add(node.id);
      next = [...set];
    } else {
      next = [node.id];
    }
    this.selectedIds.set(next);
    const nodes = next.map((id) => this.nodeIndex().get(id)!).filter(Boolean);
    this.selectionChange.emit(nodes);
  }
}
