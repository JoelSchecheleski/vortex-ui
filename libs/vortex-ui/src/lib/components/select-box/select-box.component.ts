import { Component, ChangeDetectionStrategy, computed, input, model } from '@angular/core';

export interface VxSelectItem {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'vx-select-box',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="vx-field" [class.vx-field--disabled]="disabled()">
      @if (label()) {
        <span class="vx-field__label">{{ label() }}</span>
      }
      <select
        class="vx-select"
        [disabled]="disabled()"
        [attr.aria-invalid]="invalid() || null"
        [value]="value()"
        (change)="onChange($event)"
      >
        @if (placeholder()) {
          <option value="" disabled [selected]="!value()">{{ placeholder() }}</option>
        }
        @for (item of normalizedItems(); track item.value) {
          <option [value]="item.value" [disabled]="!!item.disabled">{{ item.label }}</option>
        }
      </select>
      @if (hint()) {
        <span class="vx-field__hint" [class.vx-field__hint--error]="invalid()">{{ hint() }}</span>
      }
    </label>
  `,
  styles: `
    :host { display: block; }

    .vx-field {
      display: flex;
      flex-direction: column;
      gap: var(--vx-space-1);
      font-family: var(--vx-font-sans);
    }
    .vx-field--disabled { opacity: 0.55; }
    .vx-field__label {
      font-size: var(--vx-font-size-sm);
      font-weight: var(--vx-font-weight-medium);
      color: var(--vx-color-text);
    }
    .vx-select {
      width: 100%;
      box-sizing: border-box;
      height: 2.5rem;
      padding: 0 var(--vx-space-3);
      border: 1px solid var(--vx-color-border-strong);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-bg-elevated);
      color: var(--vx-color-text);
      font: inherit;
      font-size: var(--vx-font-size-sm);
    }
    .vx-select:focus {
      outline: none;
      box-shadow: var(--vx-focus-ring);
      border-color: var(--vx-color-border-focus);
    }
    .vx-select[aria-invalid='true'] { border-color: var(--vx-color-danger); }
    .vx-field__hint {
      font-size: var(--vx-font-size-xs);
      color: var(--vx-color-text-muted);
    }
    .vx-field__hint--error { color: var(--vx-color-danger); }
  `,
})
export class VxSelectBoxComponent {
  readonly label = input<string>();
  readonly placeholder = input('Selecione');
  readonly disabled = input(false);
  readonly invalid = input(false);
  readonly hint = input<string>();
  /** Aceita `VxSelectItem[]` ou `string[]`. */
  readonly items = input<Array<VxSelectItem | string>>([]);
  readonly value = model('');

  readonly normalizedItems = computed<VxSelectItem[]>(() =>
    this.items().map((item) =>
      typeof item === 'string' ? { value: item, label: item } : item
    )
  );

  onChange(event: Event): void {
    this.value.set((event.target as HTMLSelectElement).value);
  }
}
