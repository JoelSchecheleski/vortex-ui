import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'vx-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-toolbar" [attr.aria-label]="ariaLabel()">
      <div class="vx-toolbar__start">
        <ng-content select="[vx-toolbar-start]" />
      </div>
      <div class="vx-toolbar__center">
        <ng-content select="[vx-toolbar-center]" />
      </div>
      <div class="vx-toolbar__end">
        <ng-content select="[vx-toolbar-end]" />
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }

    .vx-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--vx-space-3);
      min-height: 2.75rem;
      padding: var(--vx-space-2) var(--vx-space-3);
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-bg-subtle);
      font-family: var(--vx-font-sans);
    }

    .vx-toolbar__start,
    .vx-toolbar__center,
    .vx-toolbar__end {
      display: flex;
      align-items: center;
      gap: var(--vx-space-2);
      flex-wrap: wrap;
      min-width: 0;
    }

    .vx-toolbar__center {
      flex: 1;
      justify-content: center;
    }

    .vx-toolbar__end {
      justify-content: flex-end;
    }

    .vx-toolbar__start:empty,
    .vx-toolbar__center:empty,
    .vx-toolbar__end:empty {
      display: none;
    }
  `,
})
export class VxToolbarComponent {
  readonly ariaLabel = input('Toolbar');
}
