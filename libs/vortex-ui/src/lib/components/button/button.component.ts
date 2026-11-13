import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  HostBinding,
} from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'vx-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading()"
      [class]="buttonClasses()"
    >
      @if (loading()) {
        <span class="vx-button__spinner" aria-hidden="true"></span>
      }
      <span class="vx-button__content" [class.vx-button__content--hidden]="loading()">
        <ng-content />
      </span>
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
    }

    .vx-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--vx-space-2);
      font-family: var(--vx-font-sans);
      font-weight: var(--vx-font-weight-medium);
      border-radius: var(--vx-radius-md);
      border: 1px solid transparent;
      cursor: pointer;
      transition: all var(--vx-transition-fast);
      position: relative;
      white-space: nowrap;
      user-select: none;
    }

    .vx-button:focus-visible {
      outline: none;
      box-shadow: var(--vx-focus-ring);
    }

    .vx-button:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Sizes */
    .vx-button--sm {
      height: 2rem;
      padding: 0 var(--vx-space-3);
      font-size: var(--vx-font-size-sm);
    }
    .vx-button--md {
      height: 2.5rem;
      padding: 0 var(--vx-space-4);
      font-size: var(--vx-font-size-sm);
    }
    .vx-button--lg {
      height: 3rem;
      padding: 0 var(--vx-space-6);
      font-size: var(--vx-font-size-md);
    }

    /* Variants */
    .vx-button--primary {
      background: var(--vx-color-primary);
      color: var(--vx-color-primary-text);
    }
    .vx-button--primary:hover:not(:disabled) {
      background: var(--vx-color-primary-hover);
    }
    .vx-button--primary:active:not(:disabled) {
      background: var(--vx-color-primary-active);
    }

    .vx-button--secondary {
      background: var(--vx-color-secondary-subtle);
      color: var(--vx-color-text);
    }
    .vx-button--secondary:hover:not(:disabled) {
      background: var(--vx-color-bg-active);
    }

    .vx-button--outline {
      background: transparent;
      border-color: var(--vx-button-outline-border, var(--vx-color-border-strong));
      color: var(--vx-button-outline-color, var(--vx-color-text));
    }
    .vx-button--outline:hover:not(:disabled) {
      background: var(--vx-color-bg-hover);
      border-color: var(--vx-button-outline-border, var(--vx-color-border-strong));
    }

    .vx-button--ghost {
      background: transparent;
      color: var(--vx-button-ghost-color, var(--vx-color-text));
    }
    .vx-button--ghost:hover:not(:disabled) {
      background: var(--vx-color-bg-hover);
    }

    .vx-button--danger {
      background: var(--vx-color-danger);
      color: var(--vx-color-text-inverse);
    }
    .vx-button--danger:hover:not(:disabled) {
      filter: brightness(1.1);
    }

    .vx-button__spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: vx-spin 0.6s linear infinite;
      position: absolute;
    }

    .vx-button__content--hidden {
      visibility: hidden;
    }

    @keyframes vx-spin {
      to { transform: rotate(360deg); }
    }
  `,
})
export class VxButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  readonly buttonClasses = computed(() => {
    return [
      'vx-button',
      `vx-button--${this.variant()}`,
      `vx-button--${this.size()}`,
    ].join(' ');
  });
}
