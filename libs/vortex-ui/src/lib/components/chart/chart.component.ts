import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

export type VxChartType = 'line' | 'bar' | 'area' | 'pie' | 'funnel' | 'polar';

export interface VxChartPoint {
  argument: string;
  value: number;
  color?: string;
}

export interface VxChartSeries {
  name: string;
  data: VxChartPoint[];
  color?: string;
}

const DEFAULT_PALETTE = [
  'var(--vx-color-primary)',
  '#0f6cbd',
  '#13a10e',
  '#c19c00',
  '#d13438',
  '#8764b8',
  '#038387',
];

@Component({
  selector: 'vx-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-chart" [attr.aria-label]="ariaLabel()">
      @if (title()) {
        <header class="vx-chart__title">{{ title() }}</header>
      }
      <svg
        class="vx-chart__svg"
        [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
        [attr.width]="width()"
        [attr.height]="height()"
        role="img"
      >
        @if (type() !== 'pie' && type() !== 'polar') {
          @for (tick of yTicks(); track tick.label) {
            <line
              class="vx-chart__grid"
              [attr.x1]="pad().left"
              [attr.x2]="width() - pad().right"
              [attr.y1]="tick.y"
              [attr.y2]="tick.y"
            />
            <text class="vx-chart__axis" [attr.x]="pad().left - 6" [attr.y]="tick.y + 3" text-anchor="end">
              {{ tick.label }}
            </text>
          }
          @for (tick of xTicks(); track tick.label) {
            <text
              class="vx-chart__axis"
              [attr.x]="tick.x"
              [attr.y]="height() - pad().bottom + 14"
              text-anchor="middle"
            >
              {{ tick.label }}
            </text>
          }
        }

        @if (type() === 'bar') {
          @for (bar of bars(); track bar.key) {
            <rect
              class="vx-chart__bar"
              [attr.x]="bar.x"
              [attr.y]="bar.y"
              [attr.width]="bar.w"
              [attr.height]="bar.h"
              [attr.fill]="bar.color"
              (click)="pointClick.emit(bar.point)"
            />
          }
        }

        @if (type() === 'line' || type() === 'area') {
          @for (series of lineSeries(); track series.name) {
            @if (type() === 'area') {
              <polygon class="vx-chart__area" [attr.points]="series.area" [attr.fill]="series.color" opacity="0.18" />
            }
            <polyline
              class="vx-chart__line"
              fill="none"
              stroke-width="2"
              stroke-linejoin="round"
              stroke-linecap="round"
              [attr.stroke]="series.color"
              [attr.points]="series.line"
            />
            @for (pt of series.dots; track pt.key) {
              <circle
                class="vx-chart__dot"
                [attr.cx]="pt.x"
                [attr.cy]="pt.y"
                r="3.5"
                [attr.fill]="series.color"
                (click)="pointClick.emit(pt.point)"
              />
            }
          }
        }

        @if (type() === 'pie' || type() === 'funnel') {
          @for (slice of pieSlices(); track slice.key) {
            <path
              class="vx-chart__slice"
              [attr.d]="slice.d"
              [attr.fill]="slice.color"
              (click)="pointClick.emit(slice.point)"
            />
          }
        }

        @if (type() === 'polar') {
          @for (ring of polarRings(); track ring.key) {
            <polygon
              class="vx-chart__area"
              [attr.points]="ring.points"
              [attr.fill]="ring.color"
              opacity="0.2"
              [attr.stroke]="ring.color"
              stroke-width="1.5"
            />
          }
          @for (lab of polarLabels(); track lab.key) {
            <text class="vx-chart__axis" [attr.x]="lab.x" [attr.y]="lab.y" text-anchor="middle">{{ lab.label }}</text>
          }
        }
      </svg>

      @if (legend()) {
        <ul class="vx-chart__legend">
          @for (item of legendItems(); track item.name) {
            <li>
              <span class="vx-chart__swatch" [style.background]="item.color"></span>
              {{ item.name }}
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .vx-chart {
        font-family: var(--vx-font-sans);
        color: var(--vx-color-text);
        border: 1px solid var(--vx-color-border);
        border-radius: var(--vx-radius-md);
        background: var(--vx-color-surface);
        padding: var(--vx-space-3);
      }

      .vx-chart__title {
        font-size: var(--vx-font-size-sm);
        font-weight: var(--vx-font-weight-semibold);
        margin-bottom: var(--vx-space-2);
      }

      .vx-chart__svg {
        display: block;
        width: 100%;
        height: auto;
        max-width: 100%;
      }

      .vx-chart__grid {
        stroke: var(--vx-color-border);
        stroke-width: 1;
      }

      .vx-chart__axis {
        fill: var(--vx-color-text-secondary);
        font-size: 10px;
      }

      .vx-chart__bar,
      .vx-chart__dot,
      .vx-chart__slice {
        cursor: pointer;
      }

      .vx-chart__legend {
        list-style: none;
        margin: var(--vx-space-3) 0 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: var(--vx-space-3);
        font-size: var(--vx-font-size-xs);
        color: var(--vx-color-text-secondary);
      }

      .vx-chart__legend li {
        display: inline-flex;
        align-items: center;
        gap: var(--vx-space-1);
      }

      .vx-chart__swatch {
        width: 0.65rem;
        height: 0.65rem;
        border-radius: 2px;
      }
    `,
  ],
})
export class VxChartComponent {
  readonly type = input<VxChartType>('bar');
  readonly series = input<VxChartSeries[]>([]);
  /** Atalho single-series: pontos diretos. */
  readonly data = input<VxChartPoint[]>([]);
  readonly title = input('');
  readonly width = input(480);
  readonly height = input(260);
  readonly legend = input(true);
  readonly ariaLabel = input('Chart');
  readonly pointClick = output<VxChartPoint>();

  readonly pad = computed(() =>
    this.type() === 'pie' || this.type() === 'funnel' || this.type() === 'polar'
      ? { top: 8, right: 8, bottom: 8, left: 8 }
      : { top: 16, right: 16, bottom: 32, left: 40 }
  );

  private readonly resolvedSeries = computed(() => {
    const series = this.series();
    if (series.length) return series;
    const data = this.data();
    return data.length ? [{ name: 'Series 1', data }] : [];
  });

  private readonly allValues = computed(() => {
    const values: number[] = [];
    for (const s of this.resolvedSeries()) {
      for (const p of s.data) values.push(p.value);
    }
    return values;
  });

  private readonly valueRange = computed(() => {
    const values = this.allValues();
    if (!values.length) return { min: 0, max: 1 };
    const max = Math.max(...values, 0);
    const min = Math.min(...values, 0);
    return { min, max: max === min ? max + 1 : max };
  });

  readonly yTicks = computed(() => {
    const { min, max } = this.valueRange();
    const pad = this.pad();
    const h = this.height() - pad.top - pad.bottom;
    const steps = 4;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const t = i / steps;
      const value = max - t * (max - min);
      return { y: pad.top + t * h, label: formatTick(value) };
    });
  });

  readonly xTicks = computed(() => {
    const series = this.resolvedSeries()[0];
    if (!series?.data.length) return [];
    const pad = this.pad();
    const w = this.width() - pad.left - pad.right;
    const n = series.data.length;
    return series.data.map((p, i) => ({
      x: pad.left + (n === 1 ? w / 2 : (i / (n - 1)) * w),
      label: p.argument,
    }));
  });

  readonly bars = computed(() => {
    const series = this.resolvedSeries();
    if (!series.length) return [];
    const pad = this.pad();
    const w = this.width() - pad.left - pad.right;
    const h = this.height() - pad.top - pad.bottom;
    const { min, max } = this.valueRange();
    const span = max - min || 1;
    const categories = series[0]!.data;
    const groupW = w / Math.max(categories.length, 1);
    const barW = Math.max(4, (groupW * 0.7) / series.length);
    const out: Array<{
      key: string;
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      point: VxChartPoint;
    }> = [];

    categories.forEach((_, i) => {
      series.forEach((s, si) => {
        const point = s.data[i];
        if (!point) return;
        const bh = ((point.value - min) / span) * h;
        const x = pad.left + i * groupW + (groupW - barW * series.length) / 2 + si * barW;
        const y = pad.top + h - bh;
        out.push({
          key: `${s.name}-${i}`,
          x,
          y,
          w: barW - 2,
          h: Math.max(bh, 0),
          color: point.color ?? s.color ?? DEFAULT_PALETTE[si % DEFAULT_PALETTE.length]!,
          point,
        });
      });
    });
    return out;
  });

  readonly lineSeries = computed(() => {
    const pad = this.pad();
    const w = this.width() - pad.left - pad.right;
    const h = this.height() - pad.top - pad.bottom;
    const { min, max } = this.valueRange();
    const span = max - min || 1;

    return this.resolvedSeries().map((s, si) => {
      const color = s.color ?? DEFAULT_PALETTE[si % DEFAULT_PALETTE.length]!;
      const n = s.data.length;
      const dots = s.data.map((point, i) => {
        const x = pad.left + (n === 1 ? w / 2 : (i / (n - 1)) * w);
        const y = pad.top + h - ((point.value - min) / span) * h;
        return { key: `${s.name}-${i}`, x, y, point };
      });
      const line = dots.map((d) => `${d.x},${d.y}`).join(' ');
      const area = dots.length
        ? `${pad.left},${pad.top + h} ${line} ${pad.left + w},${pad.top + h}`
        : '';
      return { name: s.name, color, line, area, dots };
    });
  });

  readonly pieSlices = computed(() => {
    const points = this.resolvedSeries()[0]?.data ?? [];
    const total = points.reduce((sum, p) => sum + Math.max(p.value, 0), 0) || 1;
    const cx = this.width() / 2;
    const cy = this.height() / 2;
    const r = Math.min(cx, cy) - 12;
    let angle = -Math.PI / 2;
    return points.map((point, i) => {
      const slice = (Math.max(point.value, 0) / total) * Math.PI * 2;
      const start = angle;
      angle += slice;
      const d = arcPath(cx, cy, r, start, angle);
      return {
        key: `${point.argument}-${i}`,
        d,
        color: point.color ?? DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]!,
        point,
      };
    });
  });

  readonly polarRings = computed(() => {
    const series = this.resolvedSeries();
    const w = this.width();
    const h = this.height();
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(cx, cy) - 16;
    const { min, max } = this.valueRange();
    const span = max - min || 1;
    return series.map((s, si) => {
      const color = s.color ?? DEFAULT_PALETTE[si % DEFAULT_PALETTE.length]!;
      const n = Math.max(s.data.length, 1);
      const pts = s.data.map((point, i) => {
        const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
        const rad = r * ((point.value - min) / span);
        return `${cx + rad * Math.cos(angle)},${cy + rad * Math.sin(angle)}`;
      });
      return { key: s.name, points: pts.join(' '), color };
    });
  });

  readonly polarLabels = computed(() => {
    const points = this.resolvedSeries()[0]?.data ?? [];
    const w = this.width();
    const h = this.height();
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(cx, cy) - 4;
    const n = Math.max(points.length, 1);
    return points.map((p, i) => {
      const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
      return {
        key: p.argument,
        label: p.argument,
        x: cx + (r + 10) * Math.cos(angle),
        y: cy + (r + 10) * Math.sin(angle) + 3,
      };
    });
  });

  readonly legendItems = computed(() => {
    if (this.type() === 'pie' || this.type() === 'funnel') {
      return (this.resolvedSeries()[0]?.data ?? []).map((p, i) => ({
        name: p.argument,
        color: p.color ?? DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]!,
      }));
    }
    return this.resolvedSeries().map((s, i) => ({
      name: s.name,
      color: s.color ?? DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]!,
    }));
  });
}

function formatTick(value: number): string {
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number): string {
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}
