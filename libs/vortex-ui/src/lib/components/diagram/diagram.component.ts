import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

export interface VxDiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface VxDiagramEdge {
  from: string;
  to: string;
}

@Component({
  selector: 'vx-diagram',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="vx-diag"
      [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      @for (edge of edgesDrawn(); track edge.key) {
        <line class="vx-diag__edge" [attr.x1]="edge.x1" [attr.y1]="edge.y1" [attr.x2]="edge.x2" [attr.y2]="edge.y2" />
      }
      @for (node of nodes(); track node.id) {
        <g class="vx-diag__node" (click)="nodeClick.emit(node)">
          <rect
            [attr.x]="node.x"
            [attr.y]="node.y"
            [attr.width]="node.width ?? 96"
            [attr.height]="node.height ?? 40"
            rx="6"
          />
          <text
            [attr.x]="node.x + (node.width ?? 96) / 2"
            [attr.y]="node.y + (node.height ?? 40) / 2 + 4"
            text-anchor="middle"
          >
            {{ node.label }}
          </text>
        </g>
      }
    </svg>
  `,
  styles: `
    :host { display: block; }
    .vx-diag { width: 100%; height: auto; font-family: var(--vx-font-sans); }
    .vx-diag__edge { stroke: var(--vx-color-border); stroke-width: 2; }
    .vx-diag__node rect { fill: var(--vx-color-bg-elevated); stroke: var(--vx-color-primary); stroke-width: 1.5; cursor: pointer; }
    .vx-diag__node text { fill: var(--vx-color-text); font-size: 11px; pointer-events: none; }
  `,
})
export class VxDiagramComponent {
  readonly nodes = input<VxDiagramNode[]>([]);
  readonly edges = input<VxDiagramEdge[]>([]);
  readonly width = input(520);
  readonly height = input(320);
  readonly ariaLabel = input('Diagrama');
  readonly nodeClick = output<VxDiagramNode>();

  readonly edgesDrawn = computed(() => {
    const map = new Map(this.nodes().map((n) => [n.id, n]));
    return this.edges()
      .map((e, i) => {
        const a = map.get(e.from);
        const b = map.get(e.to);
        if (!a || !b) return null;
        const aw = a.width ?? 96;
        const ah = a.height ?? 40;
        const bw = b.width ?? 96;
        const bh = b.height ?? 40;
        return {
          key: `${e.from}-${e.to}-${i}`,
          x1: a.x + aw / 2,
          y1: a.y + ah,
          x2: b.x + bw / 2,
          y2: b.y,
        };
      })
      .filter((x): x is NonNullable<typeof x> => !!x);
  });
}
