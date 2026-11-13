import { Component, ChangeDetectionStrategy, input, model, output } from '@angular/core';

@Component({
  selector: 'vx-button-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-bg" role="group" [attr.aria-label]="ariaLabel()">
      @for (item of items(); track item) {
        <button
          type="button"
          class="vx-bg__btn"
          [class.vx-bg__btn--active]="value() === item"
          (click)="select(item)"
        >
          {{ item }}
        </button>
      }
    </div>
  `,
  styles: `
    :host { display: inline-flex; }
    .vx-bg { display: inline-flex; border: 1px solid var(--vx-color-border); border-radius: var(--vx-radius-md); overflow: hidden; font-family: var(--vx-font-sans); }
    .vx-bg__btn {
      border: none; background: var(--vx-color-bg-elevated); padding: 0.4rem 0.75rem;
      font: inherit; font-size: var(--vx-font-size-sm); cursor: pointer; color: var(--vx-color-text);
      border-right: 1px solid var(--vx-color-border);
    }
    .vx-bg__btn:last-child { border-right: none; }
    .vx-bg__btn--active { background: var(--vx-color-primary); color: var(--vx-color-primary-text); }
  `,
})
export class VxButtonGroupComponent {
  readonly items = input<string[]>([]);
  readonly ariaLabel = input('Grupo de botões');
  readonly value = model('');
  readonly selectionChange = output<string>();

  select(item: string): void {
    this.value.set(item);
    this.selectionChange.emit(item);
  }
}
