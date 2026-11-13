import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

@Component({
  selector: 'vx-circular-gauge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-cg" [attr.aria-label]="ariaLabel()" role="img">
      <svg viewBox="0 0 120 120" class="vx-cg__svg">
        <circle cx="60" cy="60" r="48" class="vx-cg__track" fill="none" stroke-width="10" />
        <circle
          cx="60"
          cy="60"
          r="48"
          class="vx-cg__value"
          fill="none"
          stroke-width="10"
          stroke-linecap="round"
          [attr.stroke-dasharray]="dash()"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="64" text-anchor="middle" class="vx-cg__label">{{ display() }}</text>
      </svg>
    </div>
  `,
  styles: `
    :host { display: inline-block; }
    .vx-cg__svg { width: 120px; height: 120px; }
    .vx-cg__track { stroke: var(--vx-color-bg-muted); }
    .vx-cg__value { stroke: var(--vx-color-primary); transition: stroke-dasharray var(--vx-transition-normal); }
    .vx-cg__label { fill: var(--vx-color-text); font: 600 16px var(--vx-font-sans); }
  `,
})
export class VxCircularGaugeComponent {
  readonly value = input(0);
  readonly min = input(0);
  readonly max = input(100);
  readonly ariaLabel = input('Medidor circular');

  readonly pct = computed(() => {
    const span = this.max() - this.min() || 1;
    return Math.min(1, Math.max(0, (this.value() - this.min()) / span));
  });

  readonly dash = computed(() => {
    const c = 2 * Math.PI * 48;
    const filled = c * this.pct();
    return `${filled} ${c}`;
  });

  readonly display = computed(() => String(Math.round(this.value())));
}
