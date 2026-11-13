import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'vx-autocomplete',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="vx-field">
      @if (label()) {
        <span class="vx-field__label">{{ label() }}</span>
      }
      <input
        class="vx-ac"
        type="search"
        [placeholder]="placeholder()"
        [value]="query()"
        (input)="onQuery($event)"
        (focus)="onFocus()"
        (keydown.escape)="close()"
        [attr.aria-expanded]="panelOpen()"
        aria-autocomplete="list"
        aria-label="Autocomplete"
      />
      @if (panelOpen()) {
        <ul class="vx-ac__list" role="listbox">
          @for (item of suggestions(); track item) {
            <li>
              <button type="button" role="option" (mousedown)="$event.preventDefault()" (click)="pick(item)">
                {{ item }}
              </button>
            </li>
          }
        </ul>
      }
    </label>
  `,
  styles: `
    :host {
      display: block;
      position: relative;
    }
    .vx-field {
      display: flex;
      flex-direction: column;
      gap: var(--vx-space-1);
      font-family: var(--vx-font-sans);
    }
    .vx-field__label {
      font-size: var(--vx-font-size-sm);
      font-weight: var(--vx-font-weight-medium);
    }
    .vx-ac {
      height: 2.5rem;
      padding: 0 var(--vx-space-3);
      width: 100%;
      box-sizing: border-box;
      border: 1px solid var(--vx-color-border-strong);
      border-radius: var(--vx-radius-md);
      font: inherit;
      font-size: var(--vx-font-size-sm);
      background: var(--vx-color-bg-elevated);
      color: var(--vx-color-text);
    }
    .vx-ac:focus {
      outline: none;
      border-color: var(--vx-color-border-focus);
      box-shadow: var(--vx-focus-ring);
    }
    .vx-ac__list {
      list-style: none;
      margin: 0;
      padding: var(--vx-space-1);
      position: absolute;
      z-index: 5;
      left: 0;
      right: 0;
      width: 100%;
      box-sizing: border-box;
      background: var(--vx-color-surface);
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      max-height: 180px;
      overflow: auto;
      box-shadow: var(--vx-shadow-md, 0 4px 12px rgb(0 0 0 / 0.12));
    }
    .vx-ac__list button {
      width: 100%;
      text-align: left;
      border: none;
      background: none;
      padding: var(--vx-space-2);
      font: inherit;
      color: var(--vx-color-text);
      cursor: pointer;
      border-radius: var(--vx-radius-sm);
    }
    .vx-ac__list button:hover {
      background: var(--vx-color-bg-muted);
    }
  `,
})
export class VxAutocompleteComponent {
  readonly label = input<string>();
  readonly placeholder = input('Buscar…');
  readonly items = input<string[]>([]);
  readonly value = model('');
  readonly query = model('');
  readonly optionSelected = output<string>();

  /** Controla abertura do painel (fecha ao selecionar). */
  private readonly open = signal(false);

  readonly suggestions = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return [];
    return this.items()
      .filter((i) => i.toLowerCase().includes(q))
      .slice(0, 8);
  });

  readonly panelOpen = computed(() => this.open() && this.suggestions().length > 0);

  onQuery(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.query.set(next);
    this.open.set(true);
  }

  onFocus(): void {
    if (this.suggestions().length) this.open.set(true);
  }

  close(): void {
    this.open.set(false);
  }

  pick(item: string): void {
    this.value.set(item);
    this.query.set(item);
    this.open.set(false);
    this.optionSelected.emit(item);
  }
}
