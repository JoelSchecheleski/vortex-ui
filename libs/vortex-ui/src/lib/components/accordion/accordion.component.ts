import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  output,
} from '@angular/core';

export interface VxAccordionItem {
  id: string;
  title: string;
  content?: string;
  disabled?: boolean;
}

@Component({
  selector: 'vx-accordion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-accordion" [attr.aria-label]="ariaLabel()">
      @for (item of items(); track item.id) {
        <div class="vx-accordion__item" [class.vx-accordion__item--open]="isOpen(item.id)">
          <h3 class="vx-accordion__heading">
            <button
              type="button"
              class="vx-accordion__trigger"
              [id]="'vx-acc-btn-' + item.id"
              [attr.aria-expanded]="isOpen(item.id)"
              [attr.aria-controls]="'vx-acc-panel-' + item.id"
              [disabled]="!!item.disabled"
              (click)="toggle(item.id)"
            >
              <span>{{ item.title }}</span>
              <span class="vx-accordion__chevron" aria-hidden="true">▾</span>
            </button>
          </h3>
          @if (isOpen(item.id)) {
            <div
              class="vx-accordion__panel"
              role="region"
              [id]="'vx-acc-panel-' + item.id"
              [attr.aria-labelledby]="'vx-acc-btn-' + item.id"
            >
              @if (item.content) {
                <p class="vx-accordion__text">{{ item.content }}</p>
              }
              <ng-content />
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .vx-accordion {
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      overflow: hidden;
      background: var(--vx-color-surface);
      font-family: var(--vx-font-sans);
    }

    .vx-accordion__item + .vx-accordion__item {
      border-top: 1px solid var(--vx-color-border);
    }

    .vx-accordion__heading {
      margin: 0;
      font-size: inherit;
    }

    .vx-accordion__trigger {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--vx-space-3);
      border: none;
      background: transparent;
      color: var(--vx-color-text);
      font: inherit;
      font-weight: var(--vx-font-weight-medium);
      font-size: var(--vx-font-size-sm);
      padding: var(--vx-space-3) var(--vx-space-4);
      cursor: pointer;
      text-align: left;
    }

    .vx-accordion__trigger:hover:not(:disabled) {
      background: var(--vx-color-bg-hover);
    }

    .vx-accordion__trigger:focus-visible {
      outline: none;
      box-shadow: var(--vx-focus-ring);
    }

    .vx-accordion__trigger:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .vx-accordion__chevron {
      transition: transform var(--vx-transition-fast);
      color: var(--vx-color-text-secondary);
    }

    .vx-accordion__item--open .vx-accordion__chevron {
      transform: rotate(180deg);
    }

    .vx-accordion__panel {
      padding: 0 var(--vx-space-4) var(--vx-space-4);
    }

    .vx-accordion__text {
      margin: 0;
      color: var(--vx-color-text-secondary);
      font-size: var(--vx-font-size-sm);
      line-height: var(--vx-line-height-normal);
    }
  `,
})
export class VxAccordionComponent {
  readonly items = input<VxAccordionItem[]>([]);
  readonly multiple = input(false);
  readonly ariaLabel = input('Accordion');
  /** IDs abertos. */
  readonly openIds = model<string[]>([]);
  readonly openChange = output<string[]>();

  isOpen(id: string): boolean {
    return this.openIds().includes(id);
  }

  toggle(id: string): void {
    const current = this.openIds();
    let next: string[];
    if (current.includes(id)) {
      next = current.filter((x) => x !== id);
    } else {
      next = this.multiple() ? [...current, id] : [id];
    }
    this.openIds.set(next);
    this.openChange.emit(next);
  }
}
