import { Component, ChangeDetectionStrategy, input, model } from '@angular/core';

@Component({
  selector: 'vx-number-box',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="vx-field" [class.vx-field--disabled]="disabled()">
      @if (label()) { <span class="vx-field__label">{{ label() }}</span> }
      <input
        class="vx-number-box"
        type="number"
        [min]="min() ?? null"
        [max]="max() ?? null"
        [step]="step()"
        [disabled]="disabled()"
        [value]="value()"
        (input)="onInput($event)"
        aria-label="Número"
      />
    </label>
  `,
  styles: `
    :host { display: block; }
    .vx-field { display: flex; flex-direction: column; gap: var(--vx-space-1); font-family: var(--vx-font-sans); }
    .vx-field--disabled { opacity: 0.55; }
    .vx-field__label { font-size: var(--vx-font-size-sm); font-weight: var(--vx-font-weight-medium); }
    .vx-number-box {
      height: 2.5rem;
      padding: 0 var(--vx-space-3);
      border: 1px solid var(--vx-color-border-strong);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-bg-elevated);
      font: inherit;
      font-size: var(--vx-font-size-sm);
    }
  `,
})
export class VxNumberBoxComponent {
  readonly label = input<string>();
  readonly disabled = input(false);
  readonly min = input<number | undefined>();
  readonly max = input<number | undefined>();
  readonly step = input(1);
  readonly value = model(0);

  onInput(event: Event): void {
    const v = Number((event.target as HTMLInputElement).value);
    this.value.set(v);
  }
}
