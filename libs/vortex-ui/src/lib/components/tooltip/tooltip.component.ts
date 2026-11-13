import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'vx-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="vx-tip" [attr.data-tip]="text()" [attr.aria-label]="text()" tabindex="0">
      <ng-content />
    </span>
  `,
  styles: `
    :host { display: inline; }
    .vx-tip { position: relative; cursor: help; }
    .vx-tip::after {
      content: attr(data-tip);
      position: absolute; left: 50%; bottom: calc(100% + 6px); transform: translateX(-50%);
      padding: var(--vx-space-1) var(--vx-space-2);
      background: var(--vx-color-text); color: var(--vx-color-bg-elevated);
      font-family: var(--vx-font-sans); font-size: var(--vx-font-size-xs);
      border-radius: var(--vx-radius-sm); white-space: nowrap; opacity: 0; pointer-events: none;
      transition: opacity var(--vx-transition-fast);
      z-index: 30;
    }
    .vx-tip:hover::after, .vx-tip:focus-visible::after { opacity: 1; }
  `,
})
export class VxTooltipComponent {
  readonly text = input('Dica');
}
