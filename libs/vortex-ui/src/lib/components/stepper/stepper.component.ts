import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  model,
  output,
} from '@angular/core';

export interface VxStepItem {
  id: string;
  label: string;
  optional?: boolean;
}

@Component({
  selector: 'vx-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-stepper" [attr.aria-label]="ariaLabel()">
      <ol class="vx-stepper__list">
        @for (step of steps(); track step.id; let i = $index) {
          <li class="vx-stepper__item">
            <button
              type="button"
              class="vx-stepper__btn"
              [class.vx-stepper__btn--active]="i === activeIndex()"
              [class.vx-stepper__btn--done]="i < activeIndex()"
              [attr.aria-current]="i === activeIndex() ? 'step' : null"
              (click)="goTo(i)"
            >
              <span class="vx-stepper__index">{{ i + 1 }}</span>
              <span class="vx-stepper__label">
                {{ step.label }}
                @if (step.optional) {
                  <em class="vx-stepper__optional">(opcional)</em>
                }
              </span>
            </button>
            @if (i < steps().length - 1) {
              <div class="vx-stepper__connector" aria-hidden="true"></div>
            }
          </li>
        }
      </ol>
      <div class="vx-stepper__body">
        <ng-content />
      </div>
      <footer class="vx-stepper__footer">
        <button type="button" class="vx-stepper__nav" [disabled]="activeIndex() === 0" (click)="prev()">
          Anterior
        </button>
        <button
          type="button"
          class="vx-stepper__nav vx-stepper__nav--primary"
          [disabled]="activeIndex() >= steps().length - 1"
          (click)="next()"
        >
          Próximo
        </button>
      </footer>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .vx-stepper {
      font-family: var(--vx-font-sans);
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-surface);
      padding: var(--vx-space-4);
    }

    .vx-stepper__list {
      list-style: none;
      margin: 0 0 var(--vx-space-4);
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: var(--vx-space-2);
      align-items: center;
    }

    .vx-stepper__item {
      display: flex;
      align-items: center;
      gap: var(--vx-space-2);
    }

    .vx-stepper__btn {
      display: inline-flex;
      align-items: center;
      gap: var(--vx-space-2);
      border: none;
      background: transparent;
      cursor: pointer;
      font: inherit;
      color: var(--vx-color-text-secondary);
      padding: 0;
    }

    .vx-stepper__index {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 999px;
      display: grid;
      place-items: center;
      border: 1px solid var(--vx-color-border-strong);
      font-size: var(--vx-font-size-xs);
      font-weight: var(--vx-font-weight-semibold);
    }

    .vx-stepper__btn--active {
      color: var(--vx-color-text);
    }

    .vx-stepper__btn--active .vx-stepper__index {
      background: var(--vx-color-primary);
      border-color: var(--vx-color-primary);
      color: var(--vx-color-primary-text);
    }

    .vx-stepper__btn--done .vx-stepper__index {
      background: var(--vx-color-primary-subtle);
      border-color: var(--vx-color-primary);
      color: var(--vx-color-primary-ink, var(--vx-color-primary));
    }

    .vx-stepper__label {
      font-size: var(--vx-font-size-sm);
      font-weight: var(--vx-font-weight-medium);
    }

    .vx-stepper__optional {
      font-style: normal;
      font-weight: var(--vx-font-weight-normal);
      color: var(--vx-color-text-secondary);
      font-size: var(--vx-font-size-xs);
    }

    .vx-stepper__connector {
      width: 1.5rem;
      height: 1px;
      background: var(--vx-color-border);
    }

    .vx-stepper__body {
      min-height: 4rem;
      color: var(--vx-color-text);
      font-size: var(--vx-font-size-sm);
      margin-bottom: var(--vx-space-4);
    }

    .vx-stepper__footer {
      display: flex;
      justify-content: space-between;
      gap: var(--vx-space-2);
    }

    .vx-stepper__nav {
      border: 1px solid var(--vx-color-border);
      background: var(--vx-color-bg-elevated);
      color: var(--vx-color-text);
      border-radius: var(--vx-radius-md);
      padding: 0.45rem 0.85rem;
      font: inherit;
      font-size: var(--vx-font-size-sm);
      cursor: pointer;
    }

    .vx-stepper__nav--primary {
      background: var(--vx-color-primary);
      border-color: var(--vx-color-primary);
      color: var(--vx-color-primary-text);
    }

    .vx-stepper__nav:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  `,
})
export class VxStepperComponent {
  readonly steps = input<VxStepItem[]>([]);
  readonly activeIndex = model(0);
  readonly ariaLabel = input('Stepper');
  readonly stepChange = output<number>();

  readonly activeStep = computed(() => this.steps()[this.activeIndex()] ?? null);

  goTo(index: number): void {
    if (index < 0 || index >= this.steps().length) return;
    this.activeIndex.set(index);
    this.stepChange.emit(index);
  }

  next(): void {
    this.goTo(this.activeIndex() + 1);
  }

  prev(): void {
    this.goTo(this.activeIndex() - 1);
  }
}
