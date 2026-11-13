import { Component, ChangeDetectionStrategy, input, model } from '@angular/core';

@Component({
  selector: 'vx-radio-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset class="vx-rg" [disabled]="disabled()" [attr.aria-label]="ariaLabel()">
      @if (label()) { <legend class="vx-rg__legend">{{ label() }}</legend> }
      @for (item of items(); track item) {
        <label class="vx-rg__item">
          <input type="radio" [name]="groupName" [value]="item" [checked]="value() === item" (change)="value.set(item)" />
          <span>{{ item }}</span>
        </label>
      }
    </fieldset>
  `,
  styles: `
    :host { display: block; }
    .vx-rg { border: none; margin: 0; padding: 0; font-family: var(--vx-font-sans); display: flex; flex-direction: column; gap: var(--vx-space-2); }
    .vx-rg__legend { font-size: var(--vx-font-size-sm); font-weight: var(--vx-font-weight-medium); margin-bottom: var(--vx-space-1); }
    .vx-rg__item { display: flex; align-items: center; gap: var(--vx-space-2); font-size: var(--vx-font-size-sm); cursor: pointer; }
    .vx-rg:disabled { opacity: 0.55; }
  `,
})
export class VxRadioGroupComponent {
  readonly label = input<string>();
  readonly items = input<string[]>([]);
  readonly disabled = input(false);
  readonly ariaLabel = input('Grupo de opções');
  readonly value = model('');
  readonly groupName = `vx-radio-${Math.random().toString(36).slice(2)}`;
}
