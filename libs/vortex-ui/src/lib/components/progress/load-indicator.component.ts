import { Component, ChangeDetectionStrategy, input } from '@angular/core';

export type VxLoadIndicatorSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'vx-load-indicator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="vx-li"
      [class.vx-li--sm]="size() === 'sm'"
      [class.vx-li--md]="size() === 'md'"
      [class.vx-li--lg]="size() === 'lg'"
      role="status"
      [attr.aria-label]="ariaLabel()"
    ></span>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        line-height: 0;
      }

      .vx-li {
        display: inline-block;
        border: 2px solid var(--vx-color-border);
        border-top-color: var(--vx-color-primary);
        border-radius: 999px;
        animation: vx-li-spin 0.7s linear infinite;
      }

      .vx-li--sm {
        width: 1rem;
        height: 1rem;
      }

      .vx-li--md {
        width: 1.5rem;
        height: 1.5rem;
      }

      .vx-li--lg {
        width: 2.25rem;
        height: 2.25rem;
        border-width: 3px;
      }

      @keyframes vx-li-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class VxLoadIndicatorComponent {
  readonly size = input<VxLoadIndicatorSize>('md');
  readonly ariaLabel = input('Carregando');
}
