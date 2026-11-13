import { Component, ChangeDetectionStrategy, input, model } from '@angular/core';

@Component({
  selector: 'vx-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="vx-check" [class.vx-check--disabled]="disabled()">
      <input
        type="checkbox"
        class="vx-check__input"
        [checked]="checked()"
        [disabled]="disabled()"
        (change)="onChange($event)"
      />
      <span class="vx-check__box" aria-hidden="true"></span>
      @if (label()) {
        <span class="vx-check__label">{{ label() }}</span>
      }
    </label>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .vx-check {
      display: inline-flex;
      align-items: center;
      gap: var(--vx-space-2);
      cursor: pointer;
      font-family: var(--vx-font-sans);
      font-size: var(--vx-font-size-sm);
      color: var(--vx-color-text);
      user-select: none;
    }

    .vx-check--disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .vx-check__input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .vx-check__box {
      width: 1.125rem;
      height: 1.125rem;
      border: 2px solid var(--vx-color-border-strong);
      border-radius: var(--vx-radius-sm);
      background: var(--vx-color-bg-elevated);
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }

    .vx-check__input:checked + .vx-check__box {
      background: var(--vx-color-primary);
      border-color: var(--vx-color-primary);
    }

    .vx-check__input:checked + .vx-check__box::after {
      content: '';
      width: 0.35rem;
      height: 0.65rem;
      border: solid var(--vx-color-primary-text);
      border-width: 0 2px 2px 0;
      transform: rotate(45deg) translate(-1px, -1px);
    }

    .vx-check__input:focus-visible + .vx-check__box {
      box-shadow: var(--vx-focus-ring);
    }
  `,
})
export class VxCheckboxComponent {
  readonly label = input<string>();
  readonly disabled = input(false);
  readonly checked = model(false);

  onChange(event: Event): void {
    this.checked.set((event.target as HTMLInputElement).checked);
  }
}
