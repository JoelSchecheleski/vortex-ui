import { Component, ChangeDetectionStrategy, input, model, output } from '@angular/core';

export interface VxActionSheetItem {
  id: string;
  label: string;
  danger?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'vx-action-sheet',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="vx-as-overlay" (click)="close()" role="presentation">
        <div
          class="vx-as"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="title() || 'Ações'"
          (click)="$event.stopPropagation()"
        >
          @if (title()) {
            <header class="vx-as__title">{{ title() }}</header>
          }
          <div class="vx-as__list" role="menu">
            @for (item of items(); track item.id) {
              <button
                type="button"
                class="vx-as__item"
                role="menuitem"
                [class.vx-as__item--danger]="!!item.danger"
                [disabled]="!!item.disabled"
                (click)="onSelect(item)"
              >
                {{ item.label }}
              </button>
            }
          </div>
          <button type="button" class="vx-as__cancel" (click)="close()">Cancelar</button>
        </div>
      </div>
    }
  `,
  styles: `
    .vx-as-overlay {
      position: fixed;
      inset: 0;
      z-index: var(--vx-z-modal);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      background: rgb(0 0 0 / 0.4);
      padding: var(--vx-space-4);
    }

    .vx-as {
      width: min(420px, 100%);
      font-family: var(--vx-font-sans);
      display: flex;
      flex-direction: column;
      gap: var(--vx-space-2);
    }

    .vx-as__title {
      text-align: center;
      color: var(--vx-color-text-secondary);
      font-size: var(--vx-font-size-sm);
      padding: var(--vx-space-2);
    }

    .vx-as__list {
      background: var(--vx-color-surface);
      border-radius: var(--vx-radius-lg);
      overflow: hidden;
      border: 1px solid var(--vx-color-border);
    }

    .vx-as__item,
    .vx-as__cancel {
      width: 100%;
      border: none;
      background: var(--vx-color-surface);
      color: var(--vx-color-primary-ink, var(--vx-color-primary));
      font: inherit;
      font-size: var(--vx-font-size-md);
      padding: var(--vx-space-4);
      cursor: pointer;
    }

    .vx-as__item + .vx-as__item {
      border-top: 1px solid var(--vx-color-border);
    }

    .vx-as__item--danger {
      color: var(--vx-color-danger);
    }

    .vx-as__item:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .vx-as__cancel {
      border-radius: var(--vx-radius-lg);
      border: 1px solid var(--vx-color-border);
      font-weight: var(--vx-font-weight-semibold);
      color: var(--vx-color-text);
    }
  `,
})
export class VxActionSheetComponent {
  readonly open = model(false);
  readonly title = input('');
  readonly items = input<VxActionSheetItem[]>([]);
  readonly itemClick = output<VxActionSheetItem>();
  readonly closed = output<void>();

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }

  onSelect(item: VxActionSheetItem): void {
    if (item.disabled) return;
    this.itemClick.emit(item);
    this.close();
  }
}
