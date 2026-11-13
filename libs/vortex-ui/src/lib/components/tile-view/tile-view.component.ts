import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export interface VxTileItem {
  id: string;
  title: string;
  subtitle?: string;
}

@Component({
  selector: 'vx-tile-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-tv" role="list" [attr.aria-label]="ariaLabel()">
      @for (item of items(); track item.id) {
        <button type="button" class="vx-tv__tile" role="listitem" (click)="tileClick.emit(item)">
          <strong>{{ item.title }}</strong>
          @if (item.subtitle) { <span>{{ item.subtitle }}</span> }
        </button>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .vx-tv { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--vx-space-2); font-family: var(--vx-font-sans); }
    .vx-tv__tile {
      display: flex; flex-direction: column; align-items: flex-start; gap: var(--vx-space-1);
      padding: var(--vx-space-3); text-align: left;
      border: 1px solid var(--vx-color-border); border-radius: var(--vx-radius-md);
      background: var(--vx-color-surface); cursor: pointer; font: inherit;
    }
    .vx-tv__tile strong { font-size: var(--vx-font-size-sm); }
    .vx-tv__tile span { font-size: var(--vx-font-size-xs); color: var(--vx-color-text-secondary); }
    .vx-tv__tile:hover { border-color: var(--vx-color-primary); }
  `,
})
export class VxTileViewComponent {
  readonly items = input<VxTileItem[]>([]);
  readonly ariaLabel = input('Mosaico');
  readonly tileClick = output<VxTileItem>();
}
