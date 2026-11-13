import { Component, ChangeDetectionStrategy, input, model, output } from '@angular/core';

export type VxDrawerPosition = 'start' | 'end';
export type VxDrawerMode = 'overlay' | 'push';

@Component({
  selector: 'vx-drawer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="vx-drawer"
      [class.vx-drawer--open]="open()"
      [class.vx-drawer--end]="position() === 'end'"
      [class.vx-drawer--push]="mode() === 'push'"
    >
      @if (open() && mode() === 'overlay') {
        <div class="vx-drawer__backdrop" (click)="close()" role="presentation"></div>
      }
      <aside
        class="vx-drawer__panel"
        [style.width]="width()"
        role="dialog"
        [attr.aria-modal]="mode() === 'overlay' ? 'true' : null"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-hidden]="!open()"
      >
        <header class="vx-drawer__header">
          <h2 class="vx-drawer__title">{{ title() }}</h2>
          @if (closable()) {
            <button type="button" class="vx-drawer__close" aria-label="Fechar" (click)="close()">
              ✕
            </button>
          }
        </header>
        <div class="vx-drawer__body">
          <ng-content />
        </div>
      </aside>
      <div class="vx-drawer__content">
        <ng-content select="[vx-drawer-content]" />
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .vx-drawer {
      position: relative;
      display: flex;
      height: 100%;
      min-height: 240px;
      overflow: hidden;
      font-family: var(--vx-font-sans);
    }

    .vx-drawer__backdrop {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: rgb(0 0 0 / 0.35);
    }

    .vx-drawer__panel {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
      background: var(--vx-color-surface);
      color: var(--vx-color-text);
      border-right: 1px solid var(--vx-color-border);
      box-shadow: var(--vx-shadow-lg);
      transform: translateX(-105%);
      transition: transform var(--vx-transition-normal);
    }

    .vx-drawer--end .vx-drawer__panel {
      left: auto;
      right: 0;
      border-right: none;
      border-left: 1px solid var(--vx-color-border);
      transform: translateX(105%);
    }

    .vx-drawer--open .vx-drawer__panel {
      transform: translateX(0);
    }

    .vx-drawer--push .vx-drawer__panel {
      position: relative;
      transform: none;
      width: 0 !important;
      overflow: hidden;
      border: none;
      box-shadow: none;
      transition: width var(--vx-transition-normal);
    }

    .vx-drawer--push.vx-drawer--open .vx-drawer__panel {
      width: var(--vx-drawer-width, 280px) !important;
      border-right: 1px solid var(--vx-color-border);
    }

    .vx-drawer--push.vx-drawer--end {
      flex-direction: row-reverse;
    }

    .vx-drawer__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--vx-space-2);
      padding: var(--vx-space-3) var(--vx-space-4);
      border-bottom: 1px solid var(--vx-color-border);
      flex-shrink: 0;
    }

    .vx-drawer__title {
      margin: 0;
      font-size: var(--vx-font-size-md);
      font-weight: var(--vx-font-weight-semibold);
    }

    .vx-drawer__close {
      border: none;
      background: transparent;
      color: var(--vx-color-text-secondary);
      width: 2rem;
      height: 2rem;
      border-radius: var(--vx-radius-md);
      cursor: pointer;
    }

    .vx-drawer__close:hover {
      background: var(--vx-color-bg-hover);
      color: var(--vx-color-text);
    }

    .vx-drawer__body {
      flex: 1;
      overflow: auto;
      padding: var(--vx-space-4);
    }

    .vx-drawer__content {
      flex: 1;
      min-width: 0;
      overflow: auto;
    }
  `,
})
export class VxDrawerComponent {
  readonly open = model(false);
  readonly title = input('Menu');
  readonly ariaLabel = input('Drawer');
  readonly position = input<VxDrawerPosition>('start');
  readonly mode = input<VxDrawerMode>('overlay');
  readonly width = input('280px');
  readonly closable = input(true);
  readonly closed = output<void>();

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }
}
