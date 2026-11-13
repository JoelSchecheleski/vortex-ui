import { Component, ChangeDetectionStrategy, input, model, output } from '@angular/core';

@Component({
  selector: 'vx-tag-box',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-tagbox" [attr.aria-label]="ariaLabel()">
      @if (label()) { <span class="vx-tagbox__label">{{ label() }}</span> }
      <div class="vx-tagbox__tags">
        @for (tag of value(); track tag) {
          <span class="vx-tagbox__tag">
            {{ tag }}
            <button type="button" [attr.aria-label]="'Remover ' + tag" (click)="remove(tag)">×</button>
          </span>
        }
        <input
          class="vx-tagbox__input"
          [placeholder]="placeholder()"
          [value]="draft()"
          (input)="draft.set(($any($event.target)).value)"
          (keydown.enter)="addFromDraft($event)"
        />
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .vx-tagbox { font-family: var(--vx-font-sans); display: flex; flex-direction: column; gap: var(--vx-space-1); }
    .vx-tagbox__label { font-size: var(--vx-font-size-sm); font-weight: var(--vx-font-weight-medium); }
    .vx-tagbox__tags {
      display: flex; flex-wrap: wrap; gap: var(--vx-space-1); align-items: center;
      min-height: 2.5rem; padding: var(--vx-space-1) var(--vx-space-2);
      border: 1px solid var(--vx-color-border-strong); border-radius: var(--vx-radius-md); background: var(--vx-color-bg-elevated);
    }
    .vx-tagbox__tag { display: inline-flex; align-items: center; gap: 4px; padding: 0 6px; border-radius: var(--vx-radius-sm); background: var(--vx-color-bg-muted); font-size: var(--vx-font-size-xs); }
    .vx-tagbox__tag button { border: none; background: none; cursor: pointer; font-size: 14px; line-height: 1; }
    .vx-tagbox__input { border: none; outline: none; flex: 1; min-width: 80px; font: inherit; font-size: var(--vx-font-size-sm); background: transparent; }
  `,
})
export class VxTagBoxComponent {
  readonly label = input<string>();
  readonly placeholder = input('Adicionar tag…');
  readonly ariaLabel = input('Tags');
  readonly value = model<string[]>([]);
  readonly tagsChange = output<string[]>();
  readonly draft = model('');

  addFromDraft(event: Event): void {
    event.preventDefault();
    const t = this.draft().trim();
    if (!t || this.value().includes(t)) return;
    const next = [...this.value(), t];
    this.value.set(next);
    this.tagsChange.emit(next);
    this.draft.set('');
  }

  remove(tag: string): void {
    const next = this.value().filter((t) => t !== tag);
    this.value.set(next);
    this.tagsChange.emit(next);
  }
}
