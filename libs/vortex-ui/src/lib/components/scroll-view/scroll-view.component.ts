import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'vx-scroll-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-sv" [class.vx-sv--h]="direction() === 'horizontal'" [style.max-height.px]="maxHeight() || null" [attr.aria-label]="ariaLabel()">
      <ng-content />
    </div>
  `,
  styles: `
    :host { display: block; }
    .vx-sv { overflow: auto; font-family: var(--vx-font-sans); }
    .vx-sv--h { overflow-x: auto; overflow-y: hidden; white-space: nowrap; }
  `,
})
export class VxScrollViewComponent {
  readonly direction = input<'vertical' | 'horizontal'>('vertical');
  readonly maxHeight = input<number | null>(320);
  readonly ariaLabel = input('Área com rolagem');
}
