import { Component, ChangeDetectionStrategy, input, model } from '@angular/core';

@Component({
  selector: 'vx-text-box',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="vx-field" [class.vx-field--disabled]="disabled()">
      @if (label()) {
        <span class="vx-field__label">{{ label() }}</span>
      }
      <input
        class="vx-text-box"
        [type]="type()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [attr.aria-invalid]="invalid() || null"
        [value]="value()"
        (input)="onInput($event)"
      />
      @if (hint()) {
        <span class="vx-field__hint" [class.vx-field__hint--error]="invalid()">{{ hint() }}</span>
      }
    </label>
  `,
  styles: `
    :host {
      display: block;
    }

    .vx-field {
      display: flex;
      flex-direction: column;
      gap: var(--vx-space-1);
      font-family: var(--vx-font-sans);
    }

    .vx-field--disabled {
      opacity: 0.55;
    }

    .vx-field__label {
      font-size: var(--vx-font-size-sm);
      font-weight: var(--vx-font-weight-medium);
      color: var(--vx-color-text);
    }

    .vx-text-box {
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

    .vx-text-box:focus {
      outline: none;
      box-shadow: var(--vx-focus-ring);
      border-color: var(--vx-color-border-focus);
    }

    .vx-text-box[aria-invalid='true'] {
      border-color: var(--vx-color-danger);
    }

    .vx-field__hint {
      font-size: var(--vx-font-size-xs);
      color: var(--vx-color-text-muted);
    }

    .vx-field__hint--error {
      color: var(--vx-color-danger);
    }
  `,
})
export class VxTextBoxComponent {
  readonly label = input<string>();
  readonly placeholder = input('');
  readonly type = input<'text' | 'email' | 'password' | 'search'>('text');
  readonly disabled = input(false);
  readonly invalid = input(false);
  readonly hint = input<string>();
  readonly value = model('');

  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
