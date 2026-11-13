import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export interface VxMenuItem {
  id: string;
  label: string;
  disabled?: boolean;
  separator?: boolean;
  children?: VxMenuItem[];
}

@Component({
  selector: 'vx-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="vx-menu" [class.vx-menu--vertical]="orientation() === 'vertical'" [attr.aria-label]="ariaLabel()">
      <ul class="vx-menu__list" role="menubar" [attr.aria-orientation]="orientation()">
        @for (item of items(); track item.id) {
          @if (item.separator) {
            <li class="vx-menu__sep" role="separator"></li>
          } @else {
            <li class="vx-menu__item" role="none">
              <button
                type="button"
                class="vx-menu__btn"
                role="menuitem"
                [disabled]="!!item.disabled"
                (click)="onSelect(item)"
              >
                {{ item.label }}
                @if (item.children?.length) {
                  <span class="vx-menu__caret" aria-hidden="true">▾</span>
                }
              </button>
              @if (item.children?.length) {
                <ul class="vx-menu__sub" role="menu">
                  @for (child of item.children; track child.id) {
                    <li role="none">
                      <button
                        type="button"
                        class="vx-menu__btn vx-menu__btn--sub"
                        role="menuitem"
                        [disabled]="!!child.disabled"
                        (click)="onSelect(child); $event.stopPropagation()"
                      >
                        {{ child.label }}
                      </button>
                    </li>
                  }
                </ul>
              }
            </li>
          }
        }
      </ul>
    </nav>
  `,
  styles: `
    :host {
      display: block;
    }

    .vx-menu {
      font-family: var(--vx-font-sans);
    }

    .vx-menu__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: var(--vx-space-1);
      flex-wrap: wrap;
    }

    .vx-menu--vertical .vx-menu__list {
      flex-direction: column;
      align-items: stretch;
    }

    .vx-menu__item {
      position: relative;
    }

    .vx-menu__btn {
      display: inline-flex;
      align-items: center;
      gap: var(--vx-space-1);
      border: none;
      background: transparent;
      color: var(--vx-color-text);
      font: inherit;
      font-size: var(--vx-font-size-sm);
      padding: var(--vx-space-2) var(--vx-space-3);
      border-radius: var(--vx-radius-md);
      cursor: pointer;
      white-space: nowrap;
    }

    .vx-menu__btn:hover:not(:disabled) {
      background: var(--vx-color-bg-hover);
    }

    .vx-menu__btn:focus-visible {
      outline: none;
      box-shadow: var(--vx-focus-ring);
    }

    .vx-menu__btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .vx-menu__caret {
      font-size: 0.7em;
      color: var(--vx-color-text-secondary);
    }

    .vx-menu__sub {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      z-index: var(--vx-z-dropdown);
      list-style: none;
      margin: 0;
      padding: var(--vx-space-1);
      min-width: 10rem;
      background: var(--vx-color-surface);
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      box-shadow: var(--vx-shadow-lg);
    }

    .vx-menu--vertical .vx-menu__sub {
      top: 0;
      left: 100%;
    }

    .vx-menu__item:hover > .vx-menu__sub,
    .vx-menu__item:focus-within > .vx-menu__sub {
      display: block;
    }

    .vx-menu__btn--sub {
      width: 100%;
      justify-content: flex-start;
    }

    .vx-menu__sep {
      width: 1px;
      background: var(--vx-color-border);
      margin: var(--vx-space-1) var(--vx-space-2);
      align-self: stretch;
    }

    .vx-menu--vertical .vx-menu__sep {
      width: auto;
      height: 1px;
      margin: var(--vx-space-2) 0;
    }
  `,
})
export class VxMenuComponent {
  readonly items = input<VxMenuItem[]>([]);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly ariaLabel = input('Menu');
  readonly itemClick = output<VxMenuItem>();

  onSelect(item: VxMenuItem): void {
    if (item.disabled || item.children?.length) return;
    this.itemClick.emit(item);
  }
}
