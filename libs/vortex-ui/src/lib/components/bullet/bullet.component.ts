import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

@Component({
  selector: 'vx-bullet',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="vx-bullet"
      [attr.viewBox]="'0 0 ' + width() + ' 32'"
      [attr.width]="width()"
      height="32"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      <rect class="vx-bullet__range" x="0" y="12" [attr.width]="width()" height="8" rx="2" />
      <rect
        class="vx-bullet__range-good"
        x="0"
        y="12"
        [attr.width]="goodW()"
        height="8"
        rx="2"
      />
      <rect class="vx-bullet__measure" x="0" y="10" [attr.width]="measureW()" height="12" rx="2" />
      <rect class="vx-bullet__value" x="0" y="13" [attr.width]="valueW()" height="6" rx="1" />
    </svg>
  `,
  styles: `
    :host { display: inline-block; }
    .vx-bullet__range { fill: var(--vx-color-bg-muted); }
    .vx-bullet__range-good { fill: color-mix(in srgb, var(--vx-color-primary) 25%, var(--vx-color-bg-muted)); }
    .vx-bullet__measure { fill: var(--vx-color-border); opacity: 0.5; }
    .vx-bullet__value { fill: var(--vx-color-primary); }
  `,
})
export class VxBulletComponent {
  readonly value = input(0);
  readonly target = input(0);
  readonly good = input(80);
  readonly max = input(100);
  readonly width = input(200);
  readonly ariaLabel = input('Bullet chart');

  private pct(v: number): number {
    return Math.min(1, Math.max(0, v / (this.max() || 1)));
  }

  readonly valueW = computed(() => this.width() * this.pct(this.value()));
  readonly measureW = computed(() => this.width() * this.pct(this.target()));
  readonly goodW = computed(() => this.width() * this.pct(this.good()));
}
