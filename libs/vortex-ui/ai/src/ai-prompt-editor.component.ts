import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'vx-ai-prompt-editor',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="vx-pe-overlay" (click)="close()" role="presentation">
        <div
          class="vx-pe"
          role="dialog"
          aria-modal="true"
          aria-label="AI Prompt Editor"
          (click)="$event.stopPropagation()"
        >
          <header class="vx-pe__header">
            <h2 class="vx-pe__title">{{ title() }}</h2>
            <button type="button" class="vx-pe__close" aria-label="Fechar" (click)="close()">
              ✕
            </button>
          </header>

          <textarea
            class="vx-pe__textarea"
            rows="5"
            [ngModel]="prompt()"
            (ngModelChange)="prompt.set($event)"
            [placeholder]="placeholder()"
          ></textarea>

          <footer class="vx-pe__footer">
            <button type="button" class="vx-pe__btn" (click)="regenerate.emit(prompt())">
              ↻ Regenerar dados
            </button>
            <button
              type="button"
              class="vx-pe__btn vx-pe__btn--primary"
              [disabled]="!canApply()"
              (click)="apply.emit(prompt())"
            >
              Aplicar
            </button>
          </footer>
        </div>
      </div>
    }
  `,
  styles: `
    .vx-pe-overlay {
      position: fixed;
      inset: 0;
      z-index: var(--vx-z-modal);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgb(0 0 0 / 0.3);
      padding: var(--vx-space-4);
    }

    .vx-pe {
      width: min(420px, 100%);
      background: var(--vx-color-surface);
      color: var(--vx-color-text);
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-lg);
      box-shadow: var(--vx-shadow-xl);
      font-family: var(--vx-font-sans);
      padding: var(--vx-space-4);
      display: flex;
      flex-direction: column;
      gap: var(--vx-space-3);
    }

    .vx-pe__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .vx-pe__title {
      margin: 0;
      font-size: var(--vx-font-size-md);
      font-weight: var(--vx-font-weight-semibold);
    }

    .vx-pe__close {
      border: none;
      background: transparent;
      cursor: pointer;
      color: var(--vx-color-text-secondary);
      width: 2rem;
      height: 2rem;
      border-radius: var(--vx-radius-md);
    }

    .vx-pe__textarea {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid var(--vx-color-border-strong);
      border-radius: var(--vx-radius-md);
      padding: var(--vx-space-3);
      font-family: inherit;
      font-size: var(--vx-font-size-sm);
      background: var(--vx-color-bg-elevated);
      color: var(--vx-color-text);
      resize: vertical;
      min-height: 6rem;
    }

    .vx-pe__footer {
      display: flex;
      justify-content: space-between;
      gap: var(--vx-space-2);
    }

    .vx-pe__btn {
      border: 1px solid var(--vx-color-border);
      background: var(--vx-color-bg-elevated);
      color: var(--vx-color-text);
      border-radius: var(--vx-radius-md);
      padding: 0.5rem 0.85rem;
      font-family: inherit;
      font-size: var(--vx-font-size-sm);
      cursor: pointer;
    }

    .vx-pe__btn--primary {
      background: var(--vx-color-primary);
      border-color: var(--vx-color-primary);
      color: var(--vx-color-primary-text);
    }

    .vx-pe__btn--primary:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  `,
})
export class VxAIPromptEditorComponent {
  readonly open = model(false);
  readonly title = input('AI Prompt Editor');
  readonly placeholder = input('Descreva o que a coluna AI deve gerar…');
  readonly prompt = model('');
  readonly canApply = input(false);

  readonly regenerate = output<string>();
  readonly apply = output<string>();
  readonly closed = output<void>();

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }
}
