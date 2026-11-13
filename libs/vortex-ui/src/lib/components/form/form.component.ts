import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'vx-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="vx-form" (submit)="onSubmit($event)" novalidate>
      @if (title()) {
        <header class="vx-form__header">
          <h3 class="vx-form__title">{{ title() }}</h3>
          @if (subtitle()) {
            <p class="vx-form__subtitle">{{ subtitle() }}</p>
          }
        </header>
      }
      <div class="vx-form__body">
        <ng-content />
      </div>
      <div class="vx-form__actions">
        <ng-content select="[vx-form-actions]" />
      </div>
    </form>
  `,
  styles: `
    :host {
      display: block;
    }

    .vx-form {
      display: flex;
      flex-direction: column;
      gap: var(--vx-space-4);
      font-family: var(--vx-font-sans);
    }

    .vx-form__header {
      display: flex;
      flex-direction: column;
      gap: var(--vx-space-1);
    }

    .vx-form__title {
      margin: 0;
      font-size: var(--vx-font-size-lg);
      font-weight: var(--vx-font-weight-semibold);
      color: var(--vx-color-text);
    }

    .vx-form__subtitle {
      margin: 0;
      font-size: var(--vx-font-size-sm);
      color: var(--vx-color-text-secondary);
    }

    .vx-form__body {
      display: flex;
      flex-direction: column;
      gap: var(--vx-space-4);
    }

    .vx-form__actions:empty {
      display: none;
    }

    .vx-form__actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--vx-space-2);
      padding-top: var(--vx-space-2);
    }
  `,
})
export class VxFormComponent {
  readonly title = input<string>();
  readonly subtitle = input<string>();

  readonly submitted = output<void>();

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.emit();
  }
}
