import { Component, ChangeDetectionStrategy, input, model } from '@angular/core';

@Component({
  selector: 'vx-text-area',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="vx-field" [class.vx-field--disabled]="disabled()">
      @if (label()) { <span class="vx-field__label">{{ label() }}</span> }
      <textarea
        class="vx-text-area"
        [rows]="rows()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [value]="value()"
        (input)="onInput($event)"
        aria-label="Área de texto"
      ></textarea>
    </label>
  `,
  styles: `
    :host { display: block; }
    .vx-field { display: flex; flex-direction: column; gap: var(--vx-space-1); font-family: var(--vx-font-sans); }
    .vx-field--disabled { opacity: 0.55; }
    .vx-field__label { font-size: var(--vx-font-size-sm); font-weight: var(--vx-font-weight-medium); }
    .vx-text-area {
      width: 100%;
      box-sizing: border-box;
      padding: var(--vx-space-2) var(--vx-space-3);
      border: 1px solid var(--vx-color-border-strong);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-bg-elevated);
      font: inherit;
      font-size: var(--vx-font-size-sm);
      resize: vertical;
    }
  `,
})
export class VxTextAreaComponent {
  readonly label = input<string>();
  readonly placeholder = input('');
  readonly rows = input(4);
  readonly disabled = input(false);
  readonly value = model('');

  onInput(event: Event): void {
    this.value.set((event.target as HTMLTextAreaElement).value);
  }
}
