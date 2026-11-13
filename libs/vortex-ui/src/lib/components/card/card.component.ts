import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'vx-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-card" [class.vx-card--elevated]="elevated()">
      @if (title()) {
        <div class="vx-card__header">
          <h3 class="vx-card__title">{{ title() }}</h3>
          @if (subtitle()) {
            <p class="vx-card__subtitle">{{ subtitle() }}</p>
          }
        </div>
      }
      <div class="vx-card__body">
        <ng-content />
      </div>
      <ng-content select="[vx-card-footer]" />
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    :host(.vx-card-host--fill) {
      height: 100%;
    }

    :host(.vx-card-host--fill) .vx-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    :host(.vx-card-host--fill) .vx-card__body {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .vx-card {
      background: var(--vx-color-surface);
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-lg);
      overflow: hidden;
      transition: box-shadow var(--vx-transition-fast);
    }

    .vx-card--elevated {
      box-shadow: var(--vx-shadow-md);
      border-color: transparent;
    }

    .vx-card__header {
      padding: var(--vx-space-4) var(--vx-space-5);
      border-bottom: 1px solid var(--vx-color-border);
      flex-shrink: 0;
    }

    .vx-card__title {
      margin: 0;
      font-size: var(--vx-font-size-lg);
      font-weight: var(--vx-font-weight-semibold);
      color: var(--vx-color-text);
      line-height: var(--vx-line-height-tight);
    }

    .vx-card__subtitle {
      margin: var(--vx-space-1) 0 0;
      font-size: var(--vx-font-size-sm);
      color: var(--vx-color-text-secondary);
    }

    .vx-card__body {
      padding: var(--vx-space-5);
    }
  `,
  host: {
    '[class.vx-card-host--fill]': 'fill()',
  },
})
export class VxCardComponent {
  readonly title = input<string>();
  readonly subtitle = input<string>();
  readonly elevated = input(false);
  /** Preenche a altura do host (útil para embutir DataGrid). */
  readonly fill = input(false);
}
