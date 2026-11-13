import { Component, ChangeDetectionStrategy, input, model, output } from '@angular/core';

export interface VxChatMessage {
  id: string;
  author: string;
  text: string;
  mine?: boolean;
}

@Component({
  selector: 'vx-chat',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-chat" [attr.aria-label]="ariaLabel()">
      <ul class="vx-chat__messages" role="log" aria-live="polite">
        @for (msg of messages(); track msg.id) {
          <li class="vx-chat__msg" [class.vx-chat__msg--mine]="msg.mine">
            <span class="vx-chat__author">{{ msg.author }}</span>
            <p class="vx-chat__text">{{ msg.text }}</p>
          </li>
        }
      </ul>
      <form class="vx-chat__composer" (submit)="send($event)">
        <input
          class="vx-chat__input"
          type="text"
          [placeholder]="placeholder()"
          [value]="draft()"
          (input)="onInput($event)"
          aria-label="Mensagem"
        />
        <button type="submit" class="vx-chat__send" [disabled]="!draft().trim()">Enviar</button>
      </form>
    </div>
  `,
  styles: `
    :host { display: block; }
    .vx-chat {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 240px;
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-surface);
      font-family: var(--vx-font-sans);
    }
    .vx-chat__messages {
      list-style: none;
      margin: 0;
      padding: var(--vx-space-3);
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: var(--vx-space-2);
    }
    .vx-chat__msg {
      max-width: 80%;
      padding: var(--vx-space-2);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-bg-muted);
      align-self: flex-start;
    }
    .vx-chat__msg--mine {
      align-self: flex-end;
      background: color-mix(in srgb, var(--vx-color-primary) 18%, var(--vx-color-bg-muted));
    }
    .vx-chat__author {
      font-size: var(--vx-font-size-xs);
      font-weight: var(--vx-font-weight-semibold);
      color: var(--vx-color-text-secondary);
    }
    .vx-chat__text { margin: var(--vx-space-1) 0 0; font-size: var(--vx-font-size-sm); }
    .vx-chat__composer {
      display: flex;
      gap: var(--vx-space-2);
      padding: var(--vx-space-3);
      border-top: 1px solid var(--vx-color-border);
    }
    .vx-chat__input {
      flex: 1;
      height: 2.25rem;
      padding: 0 var(--vx-space-3);
      border: 1px solid var(--vx-color-border-strong);
      border-radius: var(--vx-radius-md);
      font: inherit;
      font-size: var(--vx-font-size-sm);
    }
    .vx-chat__send {
      border: none;
      border-radius: var(--vx-radius-md);
      padding: 0 var(--vx-space-3);
      background: var(--vx-color-primary);
      color: var(--vx-color-primary-text);
      font: inherit;
      cursor: pointer;
    }
    .vx-chat__send:disabled { opacity: 0.5; cursor: not-allowed; }
  `,
})
export class VxChatComponent {
  readonly messages = input<VxChatMessage[]>([]);
  readonly placeholder = input('Digite uma mensagem…');
  readonly ariaLabel = input('Chat');
  readonly draft = model('');
  readonly messageSent = output<string>();

  onInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  send(event: Event): void {
    event.preventDefault();
    const text = this.draft().trim();
    if (!text) return;
    this.messageSent.emit(text);
    this.draft.set('');
  }
}
