import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { VxIconComponent } from '../icon/icon.component';
import type { VxIconSet } from '../../icons/icon.types';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonIconPosition = 'start' | 'end';

const ICON_SIZE_BY_BUTTON: Record<ButtonSize, 16 | 20 | 24> = {
  sm: 16,
  md: 20,
  lg: 24,
};

@Component({
  selector: 'vx-button',
  standalone: true,
  imports: [VxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.vx-button-host]': 'true',
    '[class.vx-button-host--icon]': 'iconOnly()',
    '[class.vx-button-host--block]': 'block()',
  },
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.title]="title() || null"
      [class]="buttonClasses()"
    >
      @if (loading()) {
        <span class="vx-button__spinner" aria-hidden="true"></span>
      }
      <span class="vx-button__content" [class.vx-button__content--hidden]="loading()">
        @if (icon() && iconPosition() === 'start') {
          <vx-icon
            class="vx-button__icon"
            [name]="icon()!"
            [set]="iconSet()"
            [size]="resolvedIconSize()"
          />
        }
        @if (!iconOnly()) {
          <span class="vx-button__label"><ng-content /></span>
        } @else if (!icon()) {
          <ng-content />
        }
        @if (icon() && iconPosition() === 'end') {
          <vx-icon
            class="vx-button__icon"
            [name]="icon()!"
            [set]="iconSet()"
            [size]="resolvedIconSize()"
          />
        }
      </span>
    </button>
  `,
  styles: `
    :host {
      display: inline-flex;
      vertical-align: middle;
      max-width: 100%;
      box-sizing: border-box;
    }

    :host(.vx-button-host--icon) {
      flex-shrink: 0;
    }

    :host(.vx-button-host--block) {
      display: flex;
      width: 100%;
    }

    .vx-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--vx-space-2);
      max-width: 100%;
      box-sizing: border-box;
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

    :host(.vx-button-host--block) .vx-button {
      width: 100%;
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

    /* Icon-only: square hit area matching size height */
    .vx-button--icon.vx-button--sm {
      width: 2rem;
      min-width: 2rem;
      padding: 0;
    }
    .vx-button--icon.vx-button--md {
      width: 2.5rem;
      min-width: 2.5rem;
      padding: 0;
    }
    .vx-button--icon.vx-button--lg {
      width: 3rem;
      min-width: 3rem;
      padding: 0;
    }

    .vx-button__content {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--vx-space-2);
      line-height: 1;
    }

    .vx-button__label:empty {
      display: none;
    }

    .vx-button__icon {
      flex-shrink: 0;
    }

    .vx-button__content--hidden {
      visibility: hidden;
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
  readonly iconOnly = input(false);
  readonly block = input(false);
  readonly icon = input<string | undefined>(undefined);
  readonly iconPosition = input<ButtonIconPosition>('start');
  readonly iconSet = input<VxIconSet>('fluent');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  /** Forwarded to the native button for a11y (host attrs alone do not reach the focusable control). */
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });
  readonly title = input<string | undefined>(undefined);

  readonly resolvedIconSize = computed(() => ICON_SIZE_BY_BUTTON[this.size()]);

  readonly buttonClasses = computed(() => {
    return [
      'vx-button',
      `vx-button--${this.variant()}`,
      `vx-button--${this.size()}`,
      this.iconOnly() ? 'vx-button--icon' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });
}
