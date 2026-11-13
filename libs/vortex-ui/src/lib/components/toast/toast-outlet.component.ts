import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { VxToastService } from './toast.service';

@Component({
  selector: 'vx-toast-outlet',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-toasts" aria-live="polite" aria-relevant="additions">
      @for (t of toast.toasts(); track t.id) {
        <div class="vx-toast" [attr.data-variant]="t.variant" role="status">
          <span>{{ t.message }}</span>
          <button type="button" class="vx-toast__close" aria-label="Fechar" (click)="toast.dismiss(t.id)">
            ✕
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .vx-toasts {
      position: fixed;
      right: var(--vx-space-4);
      bottom: var(--vx-space-4);
      z-index: var(--vx-z-toast);
      display: flex;
      flex-direction: column;
      gap: var(--vx-space-2);
      max-width: min(360px, calc(100vw - 2rem));
      pointer-events: none;
    }

    .vx-toast {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--vx-space-3);
      padding: var(--vx-space-3) var(--vx-space-4);
      border-radius: var(--vx-radius-md);
      border: 1px solid var(--vx-color-border);
      background: var(--vx-color-surface);
      color: var(--vx-color-text);
      box-shadow: var(--vx-shadow-lg);
      font-family: var(--vx-font-sans);
      font-size: var(--vx-font-size-sm);
    }

    .vx-toast[data-variant='success'] {
      background: var(--vx-color-success-subtle);
      border-color: var(--vx-color-success);
      color: var(--vx-color-success);
    }

    .vx-toast[data-variant='danger'] {
      background: var(--vx-color-danger-subtle);
      border-color: var(--vx-color-danger);
      color: var(--vx-color-danger-ink, var(--vx-color-danger));
    }

    .vx-toast[data-variant='info'] {
      background: var(--vx-color-info-subtle);
      border-color: var(--vx-color-info-border, var(--vx-color-info));
      color: var(--vx-color-info);
    }

    .vx-toast__close {
      border: none;
      background: transparent;
      color: inherit;
      cursor: pointer;
      opacity: 0.7;
      padding: 0;
      line-height: 1;
    }
  `,
})
export class VxToastOutletComponent {
  readonly toast = inject(VxToastService);
}
