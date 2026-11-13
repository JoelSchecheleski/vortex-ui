import { Component, ChangeDetectionStrategy, input, model } from '@angular/core';

@Component({
  selector: 'vx-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="vx-pop">
      <button type="button" class="vx-pop__trigger" (click)="open.set(!open())" [attr.aria-expanded]="open()" [attr.aria-controls]="panelId">
        <ng-content select="[vxPopoverTrigger]" />
        <span aria-hidden="true">ⓘ</span>
      </button>
      @if (open()) {
        <div class="vx-pop__panel" [id]="panelId" role="dialog" [attr.aria-label]="title()">
          @if (title()) { <strong class="vx-pop__title">{{ title() }}</strong> }
          <div class="vx-pop__body"><ng-content /></div>
        </div>
      }
    </span>
  `,
  styles: `
    :host { display: inline-block; position: relative; }
    .vx-pop__trigger { border: none; background: none; padding: 0; font: inherit; cursor: pointer; color: inherit; }
    .vx-pop__panel {
      position: absolute; top: 100%; left: 0; margin-top: var(--vx-space-1); min-width: 200px; max-width: 280px;
      padding: var(--vx-space-3); background: var(--vx-color-surface); border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md); box-shadow: var(--vx-shadow-md); z-index: 40;
      font-family: var(--vx-font-sans); font-size: var(--vx-font-size-sm);
    }
    .vx-pop__title { display: block; margin-bottom: var(--vx-space-2); font-weight: var(--vx-font-weight-semibold); }
  `,
})
export class VxPopoverComponent {
  readonly title = input('');
  readonly open = model(false);
  readonly panelId = `vx-pop-${Math.random().toString(36).slice(2)}`;
}
