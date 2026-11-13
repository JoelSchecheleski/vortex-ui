import { Component, ChangeDetectionStrategy, input, model, output } from '@angular/core';

@Component({
  selector: 'vx-drop-down-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-ddb">
      <button type="button" class="vx-ddb__main" (click)="mainClick.emit()" [attr.aria-label]="label()">
        {{ label() }}
      </button>
      <button
        type="button"
        class="vx-ddb__toggle"
        [attr.aria-expanded]="open()"
        aria-label="Abrir menu"
        (click)="open.set(!open())"
      >
        ▾
      </button>
      @if (open()) {
        <ul class="vx-ddb__menu" role="menu">
          @for (item of items(); track item) {
            <li role="none">
              <button type="button" role="menuitem" (click)="pick(item)">{{ item }}</button>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: `
    :host { display: inline-block; position: relative; font-family: var(--vx-font-sans); }
    .vx-ddb { display: inline-flex; border-radius: var(--vx-radius-md); overflow: visible; }
    .vx-ddb__main, .vx-ddb__toggle {
      border: 1px solid var(--vx-color-primary); background: var(--vx-color-primary); color: var(--vx-color-primary-text);
      font: inherit; font-size: var(--vx-font-size-sm); padding: 0.45rem 0.75rem; cursor: pointer;
    }
    .vx-ddb__toggle { border-left: 1px solid color-mix(in srgb, #fff 25%, var(--vx-color-primary)); padding-inline: 0.5rem; }
    .vx-ddb__menu {
      position: absolute; top: 100%; right: 0; margin: var(--vx-space-1) 0 0; padding: var(--vx-space-1); list-style: none;
      min-width: 140px; background: var(--vx-color-surface); border: 1px solid var(--vx-color-border); border-radius: var(--vx-radius-md); z-index: 8;
    }
    .vx-ddb__menu button { width: 100%; text-align: left; border: none; background: none; padding: var(--vx-space-2); font: inherit; cursor: pointer; }
    .vx-ddb__menu button:hover { background: var(--vx-color-bg-muted); }
  `,
})
export class VxDropDownButtonComponent {
  readonly label = input('Ações');
  readonly items = input<string[]>([]);
  readonly open = model(false);
  readonly mainClick = output<void>();
  readonly itemClick = output<string>();

  pick(item: string): void {
    this.open.set(false);
    this.itemClick.emit(item);
  }
}
