import { Component, ChangeDetectionStrategy, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'vx-autocomplete',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="vx-field">
      @if (label()) { <span class="vx-field__label">{{ label() }}</span> }
      <input
        class="vx-ac"
        type="search"
        [placeholder]="placeholder()"
        [value]="query()"
        (input)="onQuery($event)"
        [attr.aria-expanded]="suggestions().length > 0"
        aria-autocomplete="list"
        aria-label="Autocomplete"
      />
      @if (suggestions().length) {
        <ul class="vx-ac__list" role="listbox">
          @for (item of suggestions(); track item) {
            <li><button type="button" (click)="pick(item)">{{ item }}</button></li>
          }
        </ul>
      }
    </label>
  `,
  styles: `
    :host { display: block; position: relative; }
    .vx-field { display: flex; flex-direction: column; gap: var(--vx-space-1); font-family: var(--vx-font-sans); }
    .vx-field__label { font-size: var(--vx-font-size-sm); font-weight: var(--vx-font-weight-medium); }
    .vx-ac {
      height: 2.5rem; padding: 0 var(--vx-space-3); width: 100%; box-sizing: border-box;
      border: 1px solid var(--vx-color-border-strong); border-radius: var(--vx-radius-md);
      font: inherit; font-size: var(--vx-font-size-sm);
    }
    .vx-ac__list {
      list-style: none; margin: 0; padding: var(--vx-space-1); position: absolute; z-index: 5;
      width: 100%; box-sizing: border-box; background: var(--vx-color-surface);
      border: 1px solid var(--vx-color-border); border-radius: var(--vx-radius-md);
      max-height: 180px; overflow: auto;
    }
    .vx-ac__list button { width: 100%; text-align: left; border: none; background: none; padding: var(--vx-space-2); font: inherit; cursor: pointer; border-radius: var(--vx-radius-sm); }
    .vx-ac__list button:hover { background: var(--vx-color-bg-muted); }
  `,
})
export class VxAutocompleteComponent {
  readonly label = input<string>();
  readonly placeholder = input('Buscar…');
  readonly items = input<string[]>([]);
  readonly value = model('');
  readonly query = model('');
  readonly optionSelected = output<string>();

  readonly suggestions = computed(() => {
    const q = this.query().toLowerCase();
    if (!q) return [];
    return this.items().filter((i) => i.toLowerCase().includes(q)).slice(0, 8);
  });

  onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  pick(item: string): void {
    this.value.set(item);
    this.query.set(item);
    this.optionSelected.emit(item);
  }
}
