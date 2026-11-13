import {
  Component,
  ChangeDetectionStrategy,
  contentChildren,
  effect,
  input,
  model,
  output,
} from '@angular/core';

@Component({
  selector: 'vx-multi-view-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: `
    :host {
      display: block;
      flex: 0 0 100%;
      min-width: 100%;
      box-sizing: border-box;
      padding: var(--vx-space-3);
    }
  `,
})
export class VxMultiViewItemComponent {
  readonly itemId = input.required<string>();
}

@Component({
  selector: 'vx-multi-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-mv" [attr.aria-label]="ariaLabel()">
      <div class="vx-mv__track" [style.transform]="'translateX(-' + selectedIndex() * 100 + '%)'">
        <ng-content />
      </div>
      <div class="vx-mv__dots" role="tablist">
        @for (item of items(); track item.itemId(); let i = $index) {
          <button
            type="button"
            class="vx-mv__dot"
            role="tab"
            [attr.aria-selected]="selectedIndex() === i"
            [class.vx-mv__dot--active]="selectedIndex() === i"
            [attr.aria-label]="'View ' + (i + 1)"
            (click)="select(i)"
          ></button>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .vx-mv {
      overflow: hidden;
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-surface);
      font-family: var(--vx-font-sans);
    }

    .vx-mv__track {
      display: flex;
      transition: transform var(--vx-transition-normal);
    }

    .vx-mv__dots {
      display: flex;
      justify-content: center;
      gap: var(--vx-space-2);
      padding: var(--vx-space-3);
      border-top: 1px solid var(--vx-color-border);
    }

    .vx-mv__dot {
      width: 0.55rem;
      height: 0.55rem;
      border-radius: 999px;
      border: none;
      background: var(--vx-color-border-strong);
      cursor: pointer;
      padding: 0;
    }

    .vx-mv__dot--active {
      background: var(--vx-color-primary);
      width: 1.1rem;
    }
  `,
})
export class VxMultiViewComponent {
  readonly selectedIndex = model(0);
  readonly ariaLabel = input('Multi View');
  readonly indexChange = output<number>();

  readonly items = contentChildren(VxMultiViewItemComponent);

  constructor() {
    effect(() => {
      const count = this.items().length;
      if (!count) return;
      const idx = this.selectedIndex();
      if (idx < 0) this.selectedIndex.set(0);
      if (idx >= count) this.selectedIndex.set(count - 1);
    });
  }

  select(index: number): void {
    this.selectedIndex.set(index);
    this.indexChange.emit(index);
  }
}
