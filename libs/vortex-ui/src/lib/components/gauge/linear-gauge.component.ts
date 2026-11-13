import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

@Component({
  selector: 'vx-linear-gauge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="vx-lg"
      role="meter"
      [attr.aria-valuenow]="value()"
      [attr.aria-valuemin]="min()"
      [attr.aria-valuemax]="max()"
      [attr.aria-label]="ariaLabel()"
    >
      <div class="vx-lg__track">
        <div class="vx-lg__fill" [style.width.%]="pct() * 100"></div>
        <div class="vx-lg__marker" [style.left.%]="pct() * 100"></div>
      </div>
      <span class="vx-lg__text">{{ value() }}</span>
    </div>
  `,
  styles: `
    :host { display: block; }
    .vx-lg {
      display: flex;
      align-items: center;
      gap: var(--vx-space-2);
      font-family: var(--vx-font-sans);
      font-size: var(--vx-font-size-sm);
    }
    .vx-lg__track {
      flex: 1;
      position: relative;
      height: 8px;
      border-radius: var(--vx-radius-full);
      background: var(--vx-color-bg-muted);
    }
    .vx-lg__fill {
      height: 100%;
      background: var(--vx-color-primary);
      border-radius: inherit;
    }
    .vx-lg__marker {
      position: absolute;
      top: 50%;
      width: 2px;
      height: 14px;
      background: var(--vx-color-text);
      transform: translate(-50%, -50%);
    }
    .vx-lg__text { color: var(--vx-color-text-secondary); min-width: 2.5rem; text-align: right; }
  `,
})
export class VxLinearGaugeComponent {
  readonly value = input(0);
  readonly min = input(0);
  readonly max = input(100);
  readonly ariaLabel = input('Medidor linear');

  readonly pct = computed(() => {
    const span = this.max() - this.min() || 1;
    return Math.min(1, Math.max(0, (this.value() - this.min()) / span));
  });
}
