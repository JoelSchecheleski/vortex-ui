import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

export interface VxSankeyNode {
  id: string;
  label?: string;
}

export interface VxSankeyLink {
  source: string;
  target: string;
  value: number;
}

@Component({
  selector: 'vx-sankey',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.viewBox]="'0 0 ' + width() + ' ' + height()" class="vx-sankey" role="img" [attr.aria-label]="ariaLabel()">
      @for (link of layout().links; track link.key) {
        <path class="vx-sankey__link" [attr.d]="link.d" [attr.stroke-width]="link.stroke" />
      }
      @for (node of layout().nodes; track node.id) {
        <rect
          class="vx-sankey__node"
          [attr.x]="node.x"
          [attr.y]="node.y"
          [attr.width]="node.w"
          [attr.height]="node.h"
          rx="2"
        />
        <text [attr.x]="node.x + node.w + 4" [attr.y]="node.y + node.h / 2 + 4" class="vx-sankey__label">
          {{ node.label }}
        </text>
      }
    </svg>
  `,
  styles: `
    :host { display: block; }
    .vx-sankey { width: 100%; height: auto; font-family: var(--vx-font-sans); }
    .vx-sankey__link { fill: none; stroke: var(--vx-color-primary); opacity: 0.35; }
    .vx-sankey__node { fill: var(--vx-color-primary); }
    .vx-sankey__label { fill: var(--vx-color-text-secondary); font-size: 11px; }
  `,
})
export class VxSankeyComponent {
  readonly nodes = input<VxSankeyNode[]>([]);
  readonly links = input<VxSankeyLink[]>([]);
  readonly width = input(480);
  readonly height = input(280);
  readonly ariaLabel = input('Diagrama Sankey');

  readonly layout = computed(() => {
    const nodes = this.nodes();
    const links = this.links();
    const w = this.width();
    const h = this.height();
    const colW = 12;
    const gap = h / Math.max(nodes.length, 1);
    const nodeMap = new Map(
      nodes.map((n, i) => [
        n.id,
        {
          id: n.id,
          label: n.label ?? n.id,
          x: i % 2 === 0 ? 24 : w - 24 - colW,
          y: 16 + i * gap,
          w: colW,
          h: Math.max(gap - 8, 16),
        },
      ])
    );
    const laidLinks = links.map((l, i) => {
      const s = nodeMap.get(l.source);
      const t = nodeMap.get(l.target);
      if (!s || !t) return { key: String(i), d: '', stroke: 1 };
      const sx = s.x + s.w;
      const tx = t.x;
      const sy = s.y + s.h / 2;
      const ty = t.y + t.h / 2;
      const stroke = Math.max(1, Math.min(12, l.value));
      const mx = (sx + tx) / 2;
      return {
        key: `${l.source}-${l.target}-${i}`,
        stroke,
        d: `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}`,
      };
    });
    return { nodes: [...nodeMap.values()], links: laidLinks };
  });
}
