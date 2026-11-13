import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

export interface VxFunnelPoint {
  argument: string;
  value: number;
}

@Component({
  selector: 'vx-funnel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="vx-funnel"
      [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      @for (seg of segments(); track seg.key) {
        <polygon
          class="vx-funnel__seg"
          [attr.points]="seg.points"
          [attr.fill]="seg.color"
          (click)="segmentClick.emit(seg.point)"
        />
        <text [attr.x]="width() / 2" [attr.y]="seg.labelY" text-anchor="middle" class="vx-funnel__label">
          {{ seg.point.argument }}
        </text>
      }
    </svg>
  `,
  styles: `
    :host { display: block; }
    .vx-funnel { width: 100%; height: auto; max-width: 100%; font-family: var(--vx-font-sans); }
    .vx-funnel__seg { cursor: pointer; opacity: 0.92; }
    .vx-funnel__label { fill: var(--vx-color-text); font-size: 11px; }
  `,
})
export class VxFunnelComponent {
  readonly data = input<VxFunnelPoint[]>([]);
  readonly width = input(320);
  readonly height = input(240);
  readonly ariaLabel = input('Funil');
  readonly segmentClick = output<VxFunnelPoint>();

  readonly segments = computed(() => {
    const data = this.data();
    const w = this.width();
    const h = this.height();
    const maxVal = Math.max(...data.map((d) => d.value), 1);
    const step = h / Math.max(data.length, 1);
    const palette = ['#0f6cbd', '#13a10e', '#c19c00', '#8764b8', '#d13438'];
    return data.map((point, i) => {
      const topW = w * (point.value / maxVal);
      const next = data[i + 1];
      const botW = next ? w * (next.value / maxVal) : topW * 0.7;
      const y0 = i * step;
      const y1 = y0 + step;
      const x0t = (w - topW) / 2;
      const x1t = x0t + topW;
      const x0b = (w - botW) / 2;
      const x1b = x0b + botW;
      return {
        key: point.argument,
        point,
        color: palette[i % palette.length]!,
        labelY: y0 + step / 2 + 4,
        points: `${x0t},${y0} ${x1t},${y0} ${x1b},${y1} ${x0b},${y1}`,
      };
    });
  });
}
