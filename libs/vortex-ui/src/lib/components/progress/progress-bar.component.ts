import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

@Component({
  selector: 'vx-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="vx-pb"
      role="progressbar"
      [attr.aria-valuenow]="clamped()"
      aria-valuemin="0"
      aria-valuemax="100"
      [attr.aria-label]="ariaLabel()"
    >
      @if (label()) {
        <div class="vx-pb__label">
          <span>{{ label() }}</span>
          @if (showValue()) {
            <span>{{ clamped() }}%</span>
          }
        </div>
      }
      <div class="vx-pb__track">
        <div class="vx-pb__fill" [style.width.%]="clamped()"></div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .vx-pb {
        font-family: var(--vx-font-sans);
      }

      .vx-pb__label {
        display: flex;
        justify-content: space-between;
        margin-bottom: var(--vx-space-1);
        font-size: var(--vx-font-size-xs);
        color: var(--vx-color-text-secondary);
      }

      .vx-pb__track {
        height: 0.5rem;
        border-radius: var(--vx-radius-full);
        background: var(--vx-color-bg-muted);
        overflow: hidden;
      }

      .vx-pb__fill {
        height: 100%;
        background: var(--vx-color-primary);
        border-radius: inherit;
        transition: width var(--vx-transition-normal);
      }
    `,
  ],
})
export class VxProgressBarComponent {
  readonly value = input(0);
  readonly label = input('');
  readonly showValue = input(true);
  readonly ariaLabel = input('Progresso');

  readonly clamped = computed(() => Math.min(100, Math.max(0, Math.round(this.value()))));
}
