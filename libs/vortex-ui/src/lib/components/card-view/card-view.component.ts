import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  model,
  output,
} from '@angular/core';

export interface VxCardViewField {
  field: string;
  label: string;
}

export interface VxCardViewItem {
  id: string;
  title: string;
  subtitle?: string;
  data?: Record<string, unknown>;
  imageUrl?: string;
}

@Component({
  selector: 'vx-card-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-cv" [attr.aria-label]="ariaLabel()">
      @if (searchable()) {
        <input
          class="vx-cv__search"
          type="search"
          [placeholder]="searchPlaceholder()"
          [value]="query()"
          (input)="onSearch($event)"
        />
      }
      <div class="vx-cv__grid" [style.--vx-cv-min]="cardMinWidth()">
        @for (item of filteredItems(); track item.id) {
          <article
            class="vx-cv__card"
            [class.vx-cv__card--selected]="selected().has(item.id)"
            (click)="toggle(item)"
            (keydown.enter)="toggle(item)"
            tabindex="0"
            role="option"
            [attr.aria-selected]="selected().has(item.id)"
          >
            @if (item.imageUrl) {
              <div class="vx-cv__media" [style.background-image]="'url(' + item.imageUrl + ')'"></div>
            }
            <div class="vx-cv__body">
              <h3 class="vx-cv__title">{{ item.title }}</h3>
              @if (item.subtitle) {
                <p class="vx-cv__subtitle">{{ item.subtitle }}</p>
              }
              @if (fields().length && item.data) {
                <dl class="vx-cv__fields">
                  @for (f of fields(); track f.field) {
                    <div class="vx-cv__field">
                      <dt>{{ f.label }}</dt>
                      <dd>{{ item.data[f.field] ?? '—' }}</dd>
                    </div>
                  }
                </dl>
              }
            </div>
          </article>
        } @empty {
          <p class="vx-cv__empty">{{ emptyText() }}</p>
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

      .vx-cv {
        display: flex;
        flex-direction: column;
        gap: var(--vx-space-3);
        height: 100%;
        font-family: var(--vx-font-sans);
      }

      .vx-cv__search {
        height: 2.25rem;
        padding: 0 var(--vx-space-3);
        border: 1px solid var(--vx-color-border-strong);
        border-radius: var(--vx-radius-md);
        background: var(--vx-color-bg-elevated);
        color: var(--vx-color-text);
        font: inherit;
        font-size: var(--vx-font-size-sm);
      }

      .vx-cv__search:focus {
        outline: none;
        box-shadow: var(--vx-focus-ring);
        border-color: var(--vx-color-border-focus);
      }

      .vx-cv__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(var(--vx-cv-min, 220px), 1fr));
        gap: var(--vx-space-3);
        overflow: auto;
        flex: 1;
        align-content: start;
      }

      .vx-cv__card {
        border: 1px solid var(--vx-color-border);
        border-radius: var(--vx-radius-lg);
        background: var(--vx-color-surface);
        overflow: hidden;
        cursor: pointer;
        color: var(--vx-color-text);
        transition: border-color var(--vx-transition-fast), box-shadow var(--vx-transition-fast);
      }

      .vx-cv__card:hover,
      .vx-cv__card:focus-visible {
        border-color: var(--vx-color-primary);
        box-shadow: var(--vx-shadow-md);
        outline: none;
      }

      .vx-cv__card--selected {
        border-color: var(--vx-color-primary);
        background: var(--vx-color-primary-subtle);
      }

      .vx-cv__media {
        height: 96px;
        background-size: cover;
        background-position: center;
        background-color: var(--vx-color-bg-muted);
      }

      .vx-cv__body {
        padding: var(--vx-space-3);
      }

      .vx-cv__title {
        margin: 0;
        font-size: var(--vx-font-size-md);
        font-weight: var(--vx-font-weight-semibold);
      }

      .vx-cv__subtitle {
        margin: var(--vx-space-1) 0 0;
        color: var(--vx-color-text-secondary);
        font-size: var(--vx-font-size-sm);
      }

      .vx-cv__fields {
        margin: var(--vx-space-3) 0 0;
        display: grid;
        gap: var(--vx-space-2);
      }

      .vx-cv__field {
        display: flex;
        justify-content: space-between;
        gap: var(--vx-space-2);
        font-size: var(--vx-font-size-xs);
      }

      .vx-cv__field dt {
        margin: 0;
        color: var(--vx-color-text-secondary);
      }

      .vx-cv__field dd {
        margin: 0;
        font-weight: var(--vx-font-weight-medium);
      }

      .vx-cv__empty {
        grid-column: 1 / -1;
        text-align: center;
        color: var(--vx-color-text-secondary);
      }
    `,
  ],
})
export class VxCardViewComponent {
  readonly items = input<VxCardViewItem[]>([]);
  readonly fields = input<VxCardViewField[]>([]);
  readonly searchable = input(true);
  readonly searchPlaceholder = input('Buscar…');
  readonly multiSelect = input(true);
  readonly cardMinWidth = input('220px');
  readonly ariaLabel = input('Card View');
  readonly emptyText = input('Nenhum card');
  readonly selectedIds = model<string[]>([]);
  readonly selectionChange = output<VxCardViewItem[]>();

  readonly query = model('');
  readonly selected = computed(() => new Set(this.selectedIds()));

  readonly filteredItems = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter((item) => {
      const hay = [item.title, item.subtitle, ...Object.values(item.data ?? {})]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  });

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  toggle(item: VxCardViewItem): void {
    const set = new Set(this.selectedIds());
    if (this.multiSelect()) {
      if (set.has(item.id)) set.delete(item.id);
      else set.add(item.id);
    } else {
      set.clear();
      set.add(item.id);
    }
    const next = [...set];
    this.selectedIds.set(next);
    this.selectionChange.emit(this.items().filter((i) => set.has(i.id)));
  }
}
