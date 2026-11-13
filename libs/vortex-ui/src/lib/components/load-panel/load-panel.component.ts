import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'vx-load-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="vx-lp" role="status" [attr.aria-label]="ariaLabel()" [attr.aria-busy]="true">
        <div class="vx-lp__spinner" aria-hidden="true"></div>
        @if (message()) { <p class="vx-lp__msg">{{ message() }}</p> }
      </div>
    }
  `,
  styles: `
    :host { display: contents; }
    .vx-lp {
      position: absolute; inset: 0; z-index: 20;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--vx-space-2);
      background: color-mix(in srgb, var(--vx-color-surface) 75%, transparent);
      font-family: var(--vx-font-sans);
    }
    .vx-lp__spinner {
      width: 2rem; height: 2rem; border-radius: 50%;
      border: 3px solid var(--vx-color-border); border-top-color: var(--vx-color-primary);
      animation: vx-spin 0.8s linear infinite;
    }
      .vx-lp__msg { margin: 0; font-size: var(--vx-font-size-sm); color: var(--vx-color-text-secondary); }
    @keyframes vx-spin { to { transform: rotate(360deg); } }
  `,
})
export class VxLoadPanelComponent {
  readonly visible = input(false);
  readonly message = input('Carregando…');
  readonly ariaLabel = input('Painel de carregamento');
}
