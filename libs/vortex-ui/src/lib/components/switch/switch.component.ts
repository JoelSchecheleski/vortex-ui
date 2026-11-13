import { Component, ChangeDetectionStrategy, input, model } from '@angular/core';

@Component({
  selector: 'vx-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="vx-switch" [class.vx-switch--disabled]="disabled()">
      <button
        type="button"
        class="vx-switch__track"
        role="switch"
        [attr.aria-checked]="checked()"
        [disabled]="disabled()"
        (click)="toggle()"
      >
        <span class="vx-switch__thumb"></span>
      </button>
      @if (label()) {
        <span class="vx-switch__label">{{ label() }}</span>
      }
    </label>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .vx-switch {
      display: inline-flex;
      align-items: center;
      gap: var(--vx-space-2);
      font-family: var(--vx-font-sans);
      font-size: var(--vx-font-size-sm);
      color: var(--vx-color-text);
    }

    .vx-switch--disabled {
      opacity: 0.55;
      pointer-events: none;
    }

    .vx-switch__track {
      width: 2.75rem;
      height: 1.5rem;
      border-radius: 999px;
      border: 1px solid var(--vx-color-border);
      background: var(--vx-color-bg-muted);
      padding: 0;
      cursor: pointer;
      position: relative;
      transition: background var(--vx-transition-fast);
    }

    .vx-switch__track[aria-checked='true'] {
      background: var(--vx-color-primary);
      border-color: var(--vx-color-primary);
    }

    .vx-switch__thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 1.15rem;
      height: 1.15rem;
      border-radius: 999px;
      background: var(--vx-color-bg-elevated);
      box-shadow: var(--vx-shadow-sm);
      transition: transform var(--vx-transition-fast);
    }

    .vx-switch__track[aria-checked='true'] .vx-switch__thumb {
      transform: translateX(1.2rem);
    }

    .vx-switch__track:focus-visible {
      outline: none;
      box-shadow: var(--vx-focus-ring);
    }
  `,
})
export class VxSwitchComponent {
  readonly label = input<string>();
  readonly disabled = input(false);
  readonly checked = model(false);

  toggle(): void {
    if (this.disabled()) return;
    this.checked.update((v) => !v);
  }
}
