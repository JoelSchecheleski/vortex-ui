import { Component, ChangeDetectionStrategy, input, model } from '@angular/core';

@Component({
  selector: 'vx-color-box',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="vx-field" [class.vx-field--disabled]="disabled()">
      @if (label()) { <span class="vx-field__label">{{ label() }}</span> }
      <div class="vx-color-box">
        <input type="color" [disabled]="disabled()" [value]="value()" (input)="onInput($event)" aria-label="Cor" />
        <span class="vx-color-box__hex">{{ value() }}</span>
      </div>
    </label>
  `,
  styles: `
    :host { display: block; }
    .vx-field { display: flex; flex-direction: column; gap: var(--vx-space-1); font-family: var(--vx-font-sans); }
    .vx-field--disabled { opacity: 0.55; }
    .vx-field__label { font-size: var(--vx-font-size-sm); font-weight: var(--vx-font-weight-medium); }
    .vx-color-box { display: flex; align-items: center; gap: var(--vx-space-2); }
    .vx-color-box input { width: 2.5rem; height: 2.5rem; padding: 0; border: 1px solid var(--vx-color-border); border-radius: var(--vx-radius-md); cursor: pointer; }
    .vx-color-box__hex { font-size: var(--vx-font-size-sm); color: var(--vx-color-text-secondary); }
  `,
})
export class VxColorBoxComponent {
  readonly label = input<string>();
  readonly disabled = input(false);
  readonly value = model('#0f6cbd');

  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
