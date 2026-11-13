import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

export interface VxBarGaugeItem {
  label: string;
  value: number;
  color?: string;
}

@Component({
  selector: 'vx-bar-gauge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-bg" [attr.aria-label]="ariaLabel()">
      @for (bar of bars(); track bar.label) {
        <div class="vx-bg__row">
          <span class="vx-bg__label">{{ bar.label }}</span>
          <div class="vx-bg__track">
            <div
              class="vx-bg__fill"
              [style.width.%]="bar.pct"
              [style.background]="bar.color"
            ></div>
          </div>
          <span class="vx-bg__val">{{ bar.value }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .vx-bg {
      display: flex;
      flex-direction: column;
      gap: var(--vx-space-2);
      font-family: var(--vx-font-sans);
      font-size: var(--vx-font-size-sm);
    }
    .vx-bg__row { display: grid; grid-template-columns: auto 1fr auto; gap: var(--vx-space-2); align-items: center; }
    .vx-bg__track { height: 10px; background: var(--vx-color-bg-muted); border-radius: var(--vx-radius-sm); overflow: hidden; }
    .vx-bg__fill { height: 100%; background: var(--vx-color-primary); }
    .vx-bg__val { font-size: var(--vx-font-size-xs); color: var(--vx-color-text-secondary); }
  `,
})
export class VxBarGaugeComponent {
  readonly items = input<VxBarGaugeItem[]>([]);
  readonly max = input<number | null>(null);
  readonly ariaLabel = input('Medidor em barras');

  readonly bars = computed(() => {
    const items = this.items();
    const max =
      this.max() ?? (items.length ? Math.max(...items.map((i) => i.value), 1) : 1);
    return items.map((item) => ({
      ...item,
      pct: Math.min(100, (item.value / max) * 100),
      color: item.color ?? 'var(--vx-color-primary)',
    }));
  });
}
