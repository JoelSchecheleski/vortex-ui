import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'vx-validation-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (errors().length) {
      <div class="vx-val" role="alert">
        <p class="vx-val__title">{{ title() }}</p>
        <ul class="vx-val__list">
          @for (err of errors(); track err) {
            <li>{{ err }}</li>
          }
        </ul>
      </div>
    }
  `,
  styles: `
    .vx-val {
      padding: var(--vx-space-3) var(--vx-space-4);
      border-radius: var(--vx-radius-md);
      border: 1px solid var(--vx-color-danger);
      background: var(--vx-color-danger-subtle);
      color: var(--vx-color-danger-ink, var(--vx-color-danger));
      font-family: var(--vx-font-sans);
      font-size: var(--vx-font-size-sm);
    }

    .vx-val__title {
      margin: 0 0 var(--vx-space-2);
      font-weight: var(--vx-font-weight-semibold);
    }

    .vx-val__list {
      margin: 0;
      padding-left: 1.1rem;
    }
  `,
})
export class VxValidationSummaryComponent {
  readonly title = input('Corrija os erros abaixo');
  readonly errors = input<string[]>([]);
}
