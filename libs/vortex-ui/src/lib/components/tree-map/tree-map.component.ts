import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

export interface VxTreeMapNode {
  name: string;
  value: number;
  color?: string;
}

@Component({
  selector: 'vx-tree-map',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="vx-tm"
      [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      @for (cell of cells(); track cell.key) {
        <g (click)="cellClick.emit(cell.node)">
          <rect
            [attr.x]="cell.x"
            [attr.y]="cell.y"
            [attr.width]="cell.w"
            [attr.height]="cell.h"
            [attr.fill]="cell.color"
            stroke="var(--vx-color-surface)"
            stroke-width="2"
            rx="2"
          />
          @if (cell.w > 40 && cell.h > 24) {
            <text [attr.x]="cell.x + 6" [attr.y]="cell.y + 16" class="vx-tm__label">{{ cell.node.name }}</text>
          }
        </g>
      }
    </svg>
  `,
  styles: `
    :host { display: block; }
    .vx-tm { width: 100%; height: auto; font-family: var(--vx-font-sans); }
    .vx-tm__label { fill: #fff; font-size: 11px; pointer-events: none; }
  `,
})
export class VxTreeMapComponent {
  readonly data = input<VxTreeMapNode[]>([]);
  readonly width = input(400);
  readonly height = input(260);
  readonly ariaLabel = input('Tree map');
  readonly cellClick = output<VxTreeMapNode>();

  readonly cells = computed(() => {
    const nodes = this.data();
    const total = nodes.reduce((s, n) => s + Math.max(n.value, 0), 0) || 1;
    const w = this.width();
    const h = this.height();
    let x = 0;
    const palette = ['#0f6cbd', '#13a10e', '#8764b8', '#c19c00', '#038387'];
    return nodes.map((node, i) => {
      const frac = Math.max(node.value, 0) / total;
      const cw = Math.max(w * frac, 2);
      const cell = {
        key: node.name,
        node,
        x,
        y: 0,
        w: cw,
        h,
        color: node.color ?? palette[i % palette.length]!,
      };
      x += cw;
      return cell;
    });
  });
}
