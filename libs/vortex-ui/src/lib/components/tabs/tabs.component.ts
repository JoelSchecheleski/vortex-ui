import {
  Component,
  ChangeDetectionStrategy,
  contentChildren,
  input,
  model,
  output,
  effect,
} from '@angular/core';

export interface VxTabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'vx-tab-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: [
    `
      :host {
        display: block;
      }
      :host.vx-tab-panel--inactive {
        display: none;
      }
    `,
  ],
  host: {
    '[class.vx-tab-panel--inactive]': '!active()',
    role: 'tabpanel',
    '[attr.id]': 'panelDomId()',
    '[attr.aria-labelledby]': 'tabDomId()',
  },
})
export class VxTabPanelComponent {
  readonly tabId = input.required<string>();
  readonly label = input.required<string>();
  readonly disabled = input(false);
  readonly active = model(false);

  panelDomId(): string {
    return 'vx-tabpanel-' + this.tabId();
  }

  tabDomId(): string {
    return 'vx-tab-' + this.tabId();
  }
}

@Component({
  selector: 'vx-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-tabs">
      <div class="vx-tabs__list" role="tablist" [attr.aria-label]="ariaLabel()">
        @for (panel of panels(); track panel.tabId()) {
          <button
            type="button"
            class="vx-tabs__tab"
            role="tab"
            [id]="tabButtonId(panel.tabId())"
            [attr.aria-selected]="selected() === panel.tabId()"
            [attr.aria-controls]="tabPanelId(panel.tabId())"
            [disabled]="panel.disabled()"
            [class.vx-tabs__tab--active]="selected() === panel.tabId()"
            (click)="select(panel.tabId())"
          >
            {{ panel.label() }}
          </button>
        }
      </div>
      <div class="vx-tabs__panels">
        <ng-content />
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .vx-tabs {
        font-family: var(--vx-font-sans);
        color: var(--vx-color-text);
      }

      .vx-tabs__list {
        display: flex;
        gap: var(--vx-space-1);
        border-bottom: 1px solid var(--vx-color-border);
        overflow-x: auto;
      }

      .vx-tabs__tab {
        border: none;
        background: transparent;
        color: var(--vx-color-text-secondary);
        font: inherit;
        font-size: var(--vx-font-size-sm);
        font-weight: var(--vx-font-weight-medium);
        padding: var(--vx-space-3) var(--vx-space-4);
        cursor: pointer;
        border-bottom: 2px solid transparent;
        margin-bottom: -1px;
        white-space: nowrap;
      }

      .vx-tabs__tab:hover:not(:disabled) {
        color: var(--vx-color-text);
        background: var(--vx-color-bg-hover);
      }

      .vx-tabs__tab--active {
        color: var(--vx-color-primary-ink, var(--vx-color-primary));
        border-bottom-color: var(--vx-color-primary);
      }

      .vx-tabs__tab:focus-visible {
        outline: none;
        box-shadow: var(--vx-focus-ring);
      }

      .vx-tabs__tab:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .vx-tabs__panels {
        padding: var(--vx-space-4) 0;
      }
    `,
  ],
})
export class VxTabsComponent {
  readonly selected = model<string>('');
  readonly ariaLabel = input('Abas');
  readonly selectionChange = output<string>();

  readonly panels = contentChildren(VxTabPanelComponent);

  constructor() {
    effect(() => {
      const list = this.panels();
      const sel = this.selected();
      if (!list.length) return;
      const firstEnabled = list.find((p) => !p.disabled());
      const current = list.find((p) => p.tabId() === sel && !p.disabled());
      const next = current?.tabId() ?? firstEnabled?.tabId() ?? '';
      if (next && next !== sel) {
        this.selected.set(next);
      }
      for (const p of list) {
        p.active.set(p.tabId() === this.selected());
      }
    });
  }

  select(id: string): void {
    this.selected.set(id);
    this.selectionChange.emit(id);
  }

  tabButtonId(id: string): string {
    return 'vx-tab-' + id;
  }

  tabPanelId(id: string): string {
    return 'vx-tabpanel-' + id;
  }
}
