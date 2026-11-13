import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  model,
  output,
} from '@angular/core';

export interface VxListItem {
  id: string;
  text: string;
  secondaryText?: string;
  disabled?: boolean;
}

@Component({
  selector: 'vx-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-list" role="listbox" [attr.aria-multiselectable]="multiSelect()">
      @if (searchable()) {
        <input
          class="vx-list__search"
          type="search"
          [placeholder]="searchPlaceholder()"
          [value]="query()"
          (input)="onSearch($event)"
        />
      }
      <div class="vx-list__items">
        @for (item of filteredItems(); track item.id) {
          <button
            type="button"
            class="vx-list__item"
            role="option"
            [attr.aria-selected]="selected().has(item.id)"
            [disabled]="!!item.disabled"
            [class.vx-list__item--selected]="selected().has(item.id)"
            (click)="toggle(item)"
          >
            <span class="vx-list__text">{{ item.text }}</span>
            @if (item.secondaryText) {
              <span class="vx-list__secondary">{{ item.secondaryText }}</span>
            }
          </button>
        } @empty {
          <div class="vx-list__empty">{{ emptyText() }}</div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .vx-list {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 180px;
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-surface);
      overflow: hidden;
      font-family: var(--vx-font-sans);
    }

    .vx-list__search {
      margin: var(--vx-space-2);
      height: 2.25rem;
      padding: 0 var(--vx-space-3);
      border: 1px solid var(--vx-color-border-strong);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-bg-elevated);
      color: var(--vx-color-text);
      font: inherit;
      font-size: var(--vx-font-size-sm);
    }

    .vx-list__search:focus {
      outline: none;
      box-shadow: var(--vx-focus-ring);
      border-color: var(--vx-color-border-focus);
    }

    .vx-list__items {
      flex: 1;
      overflow: auto;
      padding: var(--vx-space-1);
    }

    .vx-list__item {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.15rem;
      text-align: left;
      border: none;
      background: transparent;
      padding: var(--vx-space-2) var(--vx-space-3);
      border-radius: var(--vx-radius-md);
      cursor: pointer;
      color: var(--vx-color-text);
      font: inherit;
    }

    .vx-list__item:hover:not(:disabled) {
      background: var(--vx-color-bg-hover);
    }

    .vx-list__item--selected {
      background: var(--vx-color-primary-subtle);
      color: var(--vx-color-primary-ink, var(--vx-color-text));
    }

    .vx-list__item:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .vx-list__text {
      font-size: var(--vx-font-size-sm);
    }

    .vx-list__secondary {
      font-size: var(--vx-font-size-xs);
      color: var(--vx-color-text-muted);
    }

    .vx-list__empty {
      padding: var(--vx-space-6);
      text-align: center;
      color: var(--vx-color-text-muted);
      font-size: var(--vx-font-size-sm);
    }
  `,
})
export class VxListComponent {
  readonly items = input<VxListItem[]>([]);
  readonly multiSelect = input(false);
  readonly searchable = input(false);
  readonly searchPlaceholder = input('Buscar');
  readonly emptyText = input('Nenhum item');
  readonly selectedIds = model<string[]>([]);

  readonly selectionChange = output<VxListItem[]>();

  readonly query = model('');

  readonly selected = computed(() => new Set(this.selectedIds()));

  readonly filteredItems = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter(
      (i) =>
        i.text.toLowerCase().includes(q) ||
        (i.secondaryText?.toLowerCase().includes(q) ?? false)
    );
  });

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  toggle(item: VxListItem): void {
    if (item.disabled) return;
    let next: string[];
    if (this.multiSelect()) {
      const set = new Set(this.selectedIds());
      if (set.has(item.id)) set.delete(item.id);
      else set.add(item.id);
      next = [...set];
    } else {
      next = this.selectedIds().includes(item.id) ? [] : [item.id];
    }
    this.selectedIds.set(next);
    this.selectionChange.emit(this.items().filter((i) => next.includes(i.id)));
  }
}
