import { Component, ChangeDetectionStrategy, input, model, output } from '@angular/core';

export interface VxLookupItem {
  id: string;
  label: string;
}

@Component({
  selector: 'vx-lookup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-lookup">
      @if (label()) { <span class="vx-lookup__label">{{ label() }}</span> }
      <button type="button" class="vx-lookup__trigger" (click)="open.set(!open())" aria-haspopup="listbox" [attr.aria-expanded]="open()">
        {{ selectedLabel() || placeholder() }}
        <span aria-hidden="true">▾</span>
      </button>
      @if (open()) {
        <ul class="vx-lookup__menu" role="listbox" [attr.aria-label]="ariaLabel()">
          @for (item of items(); track item.id) {
            <li>
              <button type="button" role="option" (click)="select(item)">{{ item.label }}</button>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: `
    :host { display: block; position: relative; font-family: var(--vx-font-sans); }
    .vx-lookup { display: flex; flex-direction: column; gap: var(--vx-space-1); }
    .vx-lookup__label { font-size: var(--vx-font-size-sm); font-weight: var(--vx-font-weight-medium); }
    .vx-lookup__trigger {
      display: flex; justify-content: space-between; align-items: center; gap: var(--vx-space-2);
      height: 2.5rem; padding: 0 var(--vx-space-3); width: 100%;
      border: 1px solid var(--vx-color-border-strong); border-radius: var(--vx-radius-md);
      background: var(--vx-color-bg-elevated); font: inherit; font-size: var(--vx-font-size-sm); cursor: pointer; text-align: left;
    }
    .vx-lookup__menu {
      list-style: none; margin: 0; padding: var(--vx-space-1); position: absolute; z-index: 6; top: 100%; width: 100%;
      background: var(--vx-color-surface); border: 1px solid var(--vx-color-border); border-radius: var(--vx-radius-md); max-height: 200px; overflow: auto;
    }
    .vx-lookup__menu button { width: 100%; text-align: left; border: none; background: none; padding: var(--vx-space-2); font: inherit; cursor: pointer; }
    .vx-lookup__menu button:hover { background: var(--vx-color-bg-muted); }
  `,
})
export class VxLookupComponent {
  readonly label = input<string>();
  readonly placeholder = input('Selecionar…');
  readonly items = input<VxLookupItem[]>([]);
  readonly ariaLabel = input('Lookup');
  readonly value = model('');
  readonly open = model(false);
  readonly itemSelected = output<VxLookupItem>();

  selectedLabel(): string {
    return this.items().find((i) => i.id === this.value())?.label ?? '';
  }

  select(item: VxLookupItem): void {
    this.value.set(item.id);
    this.open.set(false);
    this.itemSelected.emit(item);
  }
}
