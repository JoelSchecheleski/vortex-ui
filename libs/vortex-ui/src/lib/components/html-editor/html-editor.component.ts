import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  afterNextRender,
  effect,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  VortexAIConfig,
  VortexAIIntegration,
  VortexAIRequestCreatingEvent,
} from 'vortex-ui/ai';

@Component({
  selector: 'vx-html-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-he" [attr.aria-label]="ariaLabel()">
      <div class="vx-he__toolbar" role="toolbar">
        <button type="button" class="vx-he__btn" title="Negrito" (click)="exec('bold')"><b>B</b></button>
        <button type="button" class="vx-he__btn" title="Itálico" (click)="exec('italic')"><i>I</i></button>
        <button type="button" class="vx-he__btn" title="Sublinhado" (click)="exec('underline')"><u>U</u></button>
        <span class="vx-he__sep"></span>
        <button type="button" class="vx-he__btn" title="Lista" (click)="exec('insertUnorderedList')">• Lista</button>
        <button type="button" class="vx-he__btn" title="Link" (click)="createLink()">Link</button>
        <span class="vx-he__sep"></span>
        @if (aiEnabled()) {
          <button
            type="button"
            class="vx-he__btn vx-he__btn--ai"
            [disabled]="aiBusy()"
            title="Reescrever com AI"
            (click)="rewriteWithAi()"
          >
            ✦ AI
          </button>
        }
      </div>
      <div
        #editor
        class="vx-he__editor"
        contenteditable="true"
        role="textbox"
        aria-multiline="true"
        [attr.data-placeholder]="placeholder()"
        (input)="syncFromDom()"
        (blur)="syncFromDom()"
      ></div>
      @if (aiBusy()) {
        <div class="vx-he__status">AI reescrevendo…</div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .vx-he {
        border: 1px solid var(--vx-color-border);
        border-radius: var(--vx-radius-md);
        background: var(--vx-color-surface);
        font-family: var(--vx-font-sans);
        overflow: hidden;
      }

      .vx-he__toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: var(--vx-space-1);
        padding: var(--vx-space-2);
        border-bottom: 1px solid var(--vx-color-border);
        background: var(--vx-color-bg-muted);
      }

      .vx-he__btn {
        border: 1px solid var(--vx-color-border);
        background: var(--vx-color-bg-elevated);
        color: var(--vx-color-text);
        border-radius: var(--vx-radius-md);
        padding: 0.3rem 0.55rem;
        font: inherit;
        font-size: var(--vx-font-size-sm);
        cursor: pointer;
        min-width: 2rem;
      }

      .vx-he__btn:hover:not(:disabled) {
        border-color: var(--vx-color-primary);
      }

      .vx-he__btn--ai {
        color: var(--vx-color-primary-ink, var(--vx-color-primary));
      }

      .vx-he__btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .vx-he__sep {
        width: 1px;
        background: var(--vx-color-border);
        margin: 0 var(--vx-space-1);
      }

      .vx-he__editor {
        min-height: 160px;
        padding: var(--vx-space-3) var(--vx-space-4);
        color: var(--vx-color-text);
        font-size: var(--vx-font-size-sm);
        line-height: var(--vx-line-height-normal);
        outline: none;
      }

      .vx-he__editor:empty::before {
        content: attr(data-placeholder);
        color: var(--vx-color-text-secondary);
      }

      .vx-he__status {
        padding: var(--vx-space-2) var(--vx-space-4);
        font-size: var(--vx-font-size-xs);
        color: var(--vx-color-text-secondary);
        border-top: 1px solid var(--vx-color-border);
      }
    `,
  ],
})
export class VxHtmlEditorComponent {
  readonly value = model('');
  readonly placeholder = input('Escreva aqui…');
  readonly ariaLabel = input('HTML Editor');
  readonly ai = input<VortexAIConfig | null>(null);
  readonly aiIntegration = input<VortexAIIntegration | null>(null);
  readonly aiRequestCreating = output<VortexAIRequestCreatingEvent>();
  readonly aiBusy = signal(false);

  private readonly editor = viewChild<ElementRef<HTMLDivElement>>('editor');
  private suppressWrite = false;

  constructor() {
    afterNextRender(() => this.writeToDom(this.value()));

    effect(() => {
      const html = this.value();
      untracked(() => {
        if (this.suppressWrite) return;
        this.writeToDom(html);
      });
    });
  }

  aiEnabled(): boolean {
    return !!this.ai()?.enabled && !!this.aiIntegration();
  }

  exec(command: string): void {
    this.editor()?.nativeElement.focus();
    document.execCommand(command, false);
    this.syncFromDom();
  }

  createLink(): void {
    const url = window.prompt('URL do link');
    if (!url) return;
    this.editor()?.nativeElement.focus();
    document.execCommand('createLink', false, url);
    this.syncFromDom();
  }

  syncFromDom(): void {
    const el = this.editor()?.nativeElement;
    if (!el) return;
    this.suppressWrite = true;
    this.value.set(el.innerHTML);
    queueMicrotask(() => {
      this.suppressWrite = false;
    });
  }

  async rewriteWithAi(): Promise<void> {
    const integration = this.aiIntegration();
    if (!this.aiEnabled() || !integration) return;
    const text = this.editor()?.nativeElement.innerText?.trim() || '';
    if (!text) return;

    this.aiBusy.set(true);
    try {
      const request = {
        feature: 'editor' as const,
        componentType: 'html-editor',
        prompt: `Reescreva de forma clara e profissional:\n\n${text}`,
        context: {
          schemaVersion: 1 as const,
          componentType: 'html-editor',
          meta: { length: text.length },
        },
      };
      const evt: VortexAIRequestCreatingEvent = { request, cancel: false };
      this.aiRequestCreating.emit(evt);
      if (evt.cancel) return;

      const res = await integration.sendRequest(evt.request);
      const html = `<p>${escapeHtml(res.text).replace(/\n/g, '</p><p>')}</p>`;
      this.writeToDom(html);
      this.suppressWrite = true;
      this.value.set(html);
      queueMicrotask(() => {
        this.suppressWrite = false;
      });
    } finally {
      this.aiBusy.set(false);
    }
  }

  private writeToDom(html: string): void {
    const el = this.editor()?.nativeElement;
    if (!el) return;
    if (el.innerHTML === html) return;
    el.innerHTML = html;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
