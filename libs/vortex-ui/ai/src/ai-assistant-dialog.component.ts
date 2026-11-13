import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VortexAIMessage, VortexAISuggestion } from './ai.types';

export interface VxAIChatMessage extends VortexAIMessage {
  title?: string;
}

@Component({
  selector: 'vx-ai-assistant-dialog',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="vx-ai-overlay" (click)="onOverlayClick($event)" role="presentation">
        <div
          class="vx-ai-dialog"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="title()"
          (click)="$event.stopPropagation()"
        >
          <header class="vx-ai-dialog__header">
            <h2 class="vx-ai-dialog__title">{{ title() }}</h2>
            <div class="vx-ai-dialog__actions">
              <button
                type="button"
                class="vx-ai-icon-btn"
                aria-label="Limpar conversa"
                title="Limpar conversa"
                (click)="clear.emit()"
              >
                ⌫
              </button>
              <button
                type="button"
                class="vx-ai-icon-btn"
                aria-label="Fechar"
                (click)="close()"
              >
                ✕
              </button>
            </div>
          </header>

          <div class="vx-ai-dialog__body">
            @if (messages().length === 0) {
              <div class="vx-ai-empty">
                <div class="vx-ai-empty__icon" aria-hidden="true">✦</div>
                <p class="vx-ai-empty__text">
                  Chat vazio. O assistente está pronto para responder.
                </p>
                @if (suggestions().length) {
                  <div class="vx-ai-chips">
                    @for (s of suggestions(); track s.id) {
                      <button type="button" class="vx-ai-chip" (click)="onSuggestion(s)">
                        {{ s.label }}
                      </button>
                    }
                  </div>
                }
              </div>
            } @else {
              <div class="vx-ai-messages">
                @for (m of messages(); track $index) {
                  <div class="vx-ai-msg" [class.vx-ai-msg--user]="m.role === 'user'">
                    @if (m.title) {
                      <div class="vx-ai-msg__title">{{ m.title }}</div>
                    }
                    <div class="vx-ai-msg__text">{{ m.content }}</div>
                  </div>
                }
              </div>
            }
          </div>

          <footer class="vx-ai-dialog__footer">
            <textarea
              class="vx-ai-input"
              rows="2"
              [placeholder]="placeholder()"
              [(ngModel)]="draft"
              (keydown.enter)="onEnter($event)"
              [disabled]="busy()"
            ></textarea>
            <button
              type="button"
              class="vx-ai-send"
              [disabled]="busy() || !draft.trim()"
              aria-label="Enviar"
              (click)="send()"
            >
              ➤
            </button>
          </footer>
        </div>
      </div>
    }
  `,
  styles: `
    .vx-ai-overlay {
      position: fixed;
      inset: 0;
      z-index: var(--vx-z-modal);
      display: flex;
      justify-content: flex-end;
      align-items: stretch;
      padding: var(--vx-space-4);
      background: rgb(0 0 0 / 0.25);
    }

    .vx-ai-dialog {
      width: min(380px, 100%);
      max-height: calc(100vh - 2rem);
      display: flex;
      flex-direction: column;
      background: var(--vx-color-surface);
      color: var(--vx-color-text);
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-lg);
      box-shadow: var(--vx-shadow-xl);
      font-family: var(--vx-font-sans);
      overflow: hidden;
    }

    .vx-ai-dialog__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--vx-space-2);
      padding: var(--vx-space-3) var(--vx-space-4);
      border-bottom: 1px solid var(--vx-color-border);
      flex-shrink: 0;
    }

    .vx-ai-dialog__title {
      margin: 0;
      font-size: var(--vx-font-size-md);
      font-weight: var(--vx-font-weight-semibold);
    }

    .vx-ai-dialog__actions {
      display: flex;
      gap: var(--vx-space-1);
    }

    .vx-ai-icon-btn {
      border: none;
      background: transparent;
      color: var(--vx-color-text-secondary);
      width: 2rem;
      height: 2rem;
      border-radius: var(--vx-radius-md);
      cursor: pointer;
      font-size: 1rem;
    }

    .vx-ai-icon-btn:hover {
      background: var(--vx-color-bg-hover);
      color: var(--vx-color-text);
    }

    .vx-ai-dialog__body {
      flex: 1;
      overflow: auto;
      padding: var(--vx-space-4);
      min-height: 220px;
    }

    .vx-ai-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--vx-space-3);
      padding: var(--vx-space-6) var(--vx-space-2);
    }

    .vx-ai-empty__icon {
      width: 3rem;
      height: 3rem;
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: var(--vx-color-primary-subtle);
      color: var(--vx-color-primary);
      font-size: 1.25rem;
    }

    .vx-ai-empty__text {
      margin: 0;
      color: var(--vx-color-text-secondary);
      font-size: var(--vx-font-size-sm);
      max-width: 16rem;
    }

    .vx-ai-chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--vx-space-2);
      justify-content: center;
    }

    .vx-ai-chip {
      border: 1px solid var(--vx-color-border);
      background: var(--vx-color-bg-elevated);
      color: var(--vx-color-text);
      border-radius: var(--vx-radius-md);
      padding: 0.4rem 0.75rem;
      font-size: var(--vx-font-size-xs);
      font-family: inherit;
      cursor: pointer;
    }

    .vx-ai-chip:hover {
      border-color: var(--vx-color-primary);
      color: var(--vx-color-primary-ink, var(--vx-color-primary));
    }

    .vx-ai-messages {
      display: flex;
      flex-direction: column;
      gap: var(--vx-space-3);
    }

    .vx-ai-msg {
      align-self: flex-start;
      max-width: 95%;
      padding: var(--vx-space-3);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-bg-muted);
      font-size: var(--vx-font-size-sm);
    }

    .vx-ai-msg--user {
      align-self: flex-end;
      background: var(--vx-color-primary-subtle);
      color: var(--vx-color-primary-ink, var(--vx-color-text));
    }

    .vx-ai-msg__title {
      font-weight: var(--vx-font-weight-semibold);
      margin-bottom: var(--vx-space-1);
    }

    .vx-ai-dialog__footer {
      display: flex;
      gap: var(--vx-space-2);
      padding: var(--vx-space-3);
      border-top: 1px solid var(--vx-color-border);
      flex-shrink: 0;
    }

    .vx-ai-input {
      flex: 1;
      resize: none;
      border: 1px solid var(--vx-color-border-strong);
      border-radius: var(--vx-radius-md);
      padding: var(--vx-space-2) var(--vx-space-3);
      font-family: inherit;
      font-size: var(--vx-font-size-sm);
      background: var(--vx-color-bg-elevated);
      color: var(--vx-color-text);
    }

    .vx-ai-input:focus {
      outline: none;
      box-shadow: var(--vx-focus-ring);
      border-color: var(--vx-color-border-focus);
    }

    .vx-ai-send {
      width: 2.5rem;
      border: none;
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-primary);
      color: var(--vx-color-primary-text);
      cursor: pointer;
      font-size: 1rem;
    }

    .vx-ai-send:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  `,
})
export class VxAIAssistantDialogComponent {
  readonly open = model(false);
  readonly title = input('AI Assistant');
  readonly placeholder = input('Digite uma mensagem');
  readonly messages = input<VxAIChatMessage[]>([]);
  readonly suggestions = input<VortexAISuggestion[]>([]);
  readonly busy = input(false);

  readonly sendMessage = output<string>();
  readonly suggestionSelect = output<VortexAISuggestion>();
  readonly clear = output<void>();
  readonly closed = output<void>();

  draft = '';

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }

  onOverlayClick(_: MouseEvent): void {
    this.close();
  }

  onEnter(event: Event): void {
    const ke = event as KeyboardEvent;
    if (ke.shiftKey) return;
    ke.preventDefault();
    this.send();
  }

  send(): void {
    const text = this.draft.trim();
    if (!text || this.busy()) return;
    this.sendMessage.emit(text);
    this.draft = '';
  }

  onSuggestion(s: VortexAISuggestion): void {
    this.suggestionSelect.emit(s);
  }
}
