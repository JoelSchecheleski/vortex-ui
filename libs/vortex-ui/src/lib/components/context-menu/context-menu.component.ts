import { Component, ChangeDetectionStrategy, input, model, output } from '@angular/core';

export interface VxContextMenuItem {
  id: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'vx-context-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-cm-host" (contextmenu)="onContext($event)">
      <ng-content />
    </div>
    @if (open()) {
      <ul
        class="vx-cm"
        role="menu"
        [style.left.px]="x()"
        [style.top.px]="y()"
        [attr.aria-label]="ariaLabel()"
      >
        @for (item of items(); track item.id) {
          <li role="none">
            <button type="button" role="menuitem" [disabled]="item.disabled" (click)="select(item)">
              {{ item.label }}
            </button>
          </li>
        }
      </ul>
    }
  `,
  styles: `
    :host { display: block; position: relative; }
    .vx-cm-host { min-height: 1rem; }
    .vx-cm {
      position: fixed; z-index: 50; margin: 0; padding: var(--vx-space-1); list-style: none;
      min-width: 160px; background: var(--vx-color-surface); border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md); box-shadow: var(--vx-shadow-md); font-family: var(--vx-font-sans); font-size: var(--vx-font-size-sm);
    }
    .vx-cm button {
      width: 100%; text-align: left; border: none; background: none; padding: var(--vx-space-2);
      font: inherit; cursor: pointer; border-radius: var(--vx-radius-sm);
    }
    .vx-cm button:hover:not(:disabled) { background: var(--vx-color-bg-muted); }
    .vx-cm button:disabled { opacity: 0.5; cursor: not-allowed; }
  `,
})
export class VxContextMenuComponent {
  readonly items = input<VxContextMenuItem[]>([]);
  readonly ariaLabel = input('Menu de contexto');
  readonly open = model(false);
  readonly x = model(0);
  readonly y = model(0);
  readonly itemClick = output<VxContextMenuItem>();

  onContext(event: MouseEvent): void {
    event.preventDefault();
    this.x.set(event.clientX);
    this.y.set(event.clientY);
    this.open.set(true);
  }

  select(item: VxContextMenuItem): void {
    if (item.disabled) return;
    this.open.set(false);
    this.itemClick.emit(item);
  }
}
