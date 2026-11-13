import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

@Component({
  selector: 'vx-sparkline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="vx-spark"
      [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
      [attr.width]="width()"
      [attr.height]="height()"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      <polyline
        class="vx-spark__line"
        fill="none"
        [attr.stroke]="color()"
        stroke-width="1.5"
        stroke-linejoin="round"
        stroke-linecap="round"
        [attr.points]="points()"
      />
      @if (showArea()) {
        <polygon class="vx-spark__area" [attr.points]="areaPoints()" [attr.fill]="color()" opacity="0.12" />
      }
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        line-height: 0;
      }

      .vx-spark {
        display: block;
      }
    `,
  ],
})
export class VxSparklineComponent {
  readonly data = input<number[]>([]);
  readonly width = input(120);
  readonly height = input(32);
  readonly color = input('var(--vx-color-primary)');
  readonly showArea = input(true);
  readonly ariaLabel = input('Sparkline');

  readonly points = computed(() => {
    const values = this.data();
    if (!values.length) return '';
    const w = this.width();
    const h = this.height();
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const step = values.length === 1 ? 0 : w / (values.length - 1);
    return values
      .map((v, i) => {
        const x = i * step;
        const y = h - ((v - min) / span) * (h - 4) - 2;
        return `${x},${y}`;
      })
      .join(' ');
  });

  readonly areaPoints = computed(() => {
    const line = this.points();
    if (!line) return '';
    const w = this.width();
    const h = this.height();
    return `0,${h} ${line} ${w},${h}`;
  });
}
