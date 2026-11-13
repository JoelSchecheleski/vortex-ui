import { Component, ChangeDetectionStrategy, input, model, output } from '@angular/core';

export type VxDialogSize = 'md' | 'lg' | 'fullscreen-lds';

/**
 * Dialog / modal genérico.
 * - `md` / `lg`: popover centrado compacto
 * - `fullscreen-lds`: 80% × 80% (guideline LDS)
 */
@Component({
  selector: 'vx-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="vx-dialog-overlay" (click)="onOverlay()" role="presentation">
        <div
          class="vx-dialog"
          [class.vx-dialog--lg]="size() === 'lg'"
          [class.vx-dialog--lds]="size() === 'fullscreen-lds'"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="title() || 'Dialog'"
          (click)="$event.stopPropagation()"
        >
          <header class="vx-dialog__header">
            <h2 class="vx-dialog__title">{{ title() }}</h2>
            @if (closable()) {
              <button type="button" class="vx-dialog__close" aria-label="Fechar" (click)="close()">
                ✕
              </button>
            }
          </header>
          <div class="vx-dialog__body">
            <ng-content />
          </div>
          <footer class="vx-dialog__footer">
            <ng-content select="[vx-dialog-footer]" />
          </footer>
        </div>
      </div>
    }
  `,
  styles: `
    .vx-dialog-overlay {
      position: fixed;
      inset: 0;
      z-index: var(--vx-z-modal);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgb(0 0 0 / 0.4);
      padding: var(--vx-space-4);
    }

    .vx-dialog {
      width: min(480px, 100%);
      max-height: min(80vh, 640px);
      display: flex;
      flex-direction: column;
      background: var(--vx-color-surface);
      color: var(--vx-color-text);
      border-radius: var(--vx-radius-lg);
      box-shadow: var(--vx-shadow-xl);
      font-family: var(--vx-font-sans);
      overflow: hidden;
      border: 1px solid var(--vx-color-border);
    }

    .vx-dialog--lg {
      width: min(720px, 100%);
    }

    .vx-dialog--lds {
      width: 80%;
      height: 80%;
      max-width: 80%;
      max-height: 80%;
    }

    .vx-dialog__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--vx-space-3);
      padding: var(--vx-space-4) var(--vx-space-5);
      border-bottom: 1px solid var(--vx-color-border);
      flex-shrink: 0;
    }

    .vx-dialog__title {
      margin: 0;
      font-size: var(--vx-font-size-md);
      font-weight: var(--vx-font-weight-semibold);
    }

    .vx-dialog__close {
      border: none;
      background: transparent;
      color: var(--vx-color-text-secondary);
      width: 2rem;
      height: 2rem;
      border-radius: var(--vx-radius-md);
      cursor: pointer;
      font-size: 1rem;
    }

    .vx-dialog__close:hover {
      background: var(--vx-color-bg-hover);
      color: var(--vx-color-text);
    }

    .vx-dialog__body {
      flex: 1;
      overflow-y: auto;
      padding: var(--vx-space-4) var(--vx-space-5);
      min-height: 0;
    }

    .vx-dialog__footer:empty {
      display: none;
    }

    .vx-dialog__footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--vx-space-2);
      padding: var(--vx-space-4) var(--vx-space-5);
      border-top: 1px solid var(--vx-color-border);
      flex-shrink: 0;
    }
  `,
})
export class VxDialogComponent {
  readonly open = model(false);
  readonly title = input('');
  readonly size = input<VxDialogSize>('md');
  readonly closable = input(true);
  readonly closeOnOverlay = input(true);

  readonly closed = output<void>();

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }

  onOverlay(): void {
    if (this.closeOnOverlay()) this.close();
  }
}
