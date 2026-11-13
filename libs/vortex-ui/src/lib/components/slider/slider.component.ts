import { Component, ChangeDetectionStrategy, input, model } from '@angular/core';

@Component({
  selector: 'vx-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="vx-slider" [attr.aria-label]="ariaLabel()">
      @if (label()) { <span class="vx-slider__label">{{ label() }}</span> }
      <input
        type="range"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [disabled]="disabled()"
        [value]="value()"
        (input)="onInput($event)"
      />
      @if (showValue()) { <span class="vx-slider__val">{{ value() }}</span> }
    </label>
  `,
  styles: `
    :host { display: block; }
    .vx-slider { display: flex; align-items: center; gap: var(--vx-space-2); font-family: var(--vx-font-sans); font-size: var(--vx-font-size-sm); width: 100%; }
    .vx-slider input { flex: 1; accent-color: var(--vx-color-primary); }
    .vx-slider__val { min-width: 2rem; text-align: right; color: var(--vx-color-text-secondary); }
  `,
})
export class VxSliderComponent {
  readonly label = input<string>();
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly disabled = input(false);
  readonly showValue = input(true);
  readonly ariaLabel = input('Controle deslizante');
  readonly value = model(0);

  onInput(event: Event): void {
    const v = Number((event.target as HTMLInputElement).value);
    this.value.set(v);
  }
}
