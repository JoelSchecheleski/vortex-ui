import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export type VxFabPosition = 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start';

@Component({
  selector: 'vx-fab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="vx-fab"
      [class.vx-fab--bottom-end]="position() === 'bottom-end'"
      [class.vx-fab--bottom-start]="position() === 'bottom-start'"
      [class.vx-fab--top-end]="position() === 'top-end'"
      [class.vx-fab--top-start]="position() === 'top-start'"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      (click)="pressed.emit()"
    >
      <ng-content />
    </button>
  `,
  styles: `
    :host {
      display: contents;
    }

    .vx-fab {
      position: fixed;
      z-index: var(--vx-z-sticky);
      width: 3.25rem;
      height: 3.25rem;
      border: none;
      border-radius: 999px;
      background: var(--vx-color-primary);
      color: var(--vx-color-primary-text);
      box-shadow: var(--vx-shadow-lg);
      cursor: pointer;
      font: inherit;
      font-size: 1.25rem;
      display: grid;
      place-items: center;
    }

    .vx-fab:hover:not(:disabled) {
      filter: brightness(1.05);
    }

    .vx-fab:focus-visible {
      outline: none;
      box-shadow: var(--vx-shadow-lg), var(--vx-focus-ring);
    }

    .vx-fab:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .vx-fab--bottom-end {
      right: var(--vx-space-6);
      bottom: var(--vx-space-6);
    }

    .vx-fab--bottom-start {
      left: var(--vx-space-6);
      bottom: var(--vx-space-6);
    }

    .vx-fab--top-end {
      right: var(--vx-space-6);
      top: var(--vx-space-6);
    }

    .vx-fab--top-start {
      left: var(--vx-space-6);
      top: var(--vx-space-6);
    }
  `,
})
export class VxFabComponent {
  readonly position = input<VxFabPosition>('bottom-end');
  readonly ariaLabel = input('Ação flutuante');
  readonly disabled = input(false);
  readonly pressed = output<void>();
}
