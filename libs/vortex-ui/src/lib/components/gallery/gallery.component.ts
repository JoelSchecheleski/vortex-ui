import { Component, ChangeDetectionStrategy, computed, input, model, output } from '@angular/core';

export interface VxGalleryItem {
  id: string;
  src: string;
  alt?: string;
}

@Component({
  selector: 'vx-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-gal" [attr.aria-label]="ariaLabel()">
      <figure class="vx-gal__main">
        @if (activeItem(); as item) {
          <img [src]="item.src" [alt]="item.alt ?? ''" (click)="imageClick.emit(item)" />
        }
      </figure>
      <div class="vx-gal__thumbs" role="list">
        @for (item of items(); track item.id) {
          <button type="button" role="listitem" [class.vx-gal__thumb--active]="item.id === selectedId()" (click)="selectedId.set(item.id)">
            <img [src]="item.src" [alt]="item.alt ?? ''" />
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .vx-gal { font-family: var(--vx-font-sans); border: 1px solid var(--vx-color-border); border-radius: var(--vx-radius-md); overflow: hidden; }
    .vx-gal__main { margin: 0; background: var(--vx-color-bg-muted); display: flex; align-items: center; justify-content: center; min-height: 200px; }
    .vx-gal__main img { max-width: 100%; max-height: 280px; object-fit: contain; cursor: zoom-in; }
    .vx-gal__thumbs { display: flex; gap: var(--vx-space-1); padding: var(--vx-space-2); overflow-x: auto; }
    .vx-gal__thumbs button { border: 2px solid transparent; padding: 0; background: none; border-radius: var(--vx-radius-sm); cursor: pointer; }
    .vx-gal__thumbs img { width: 56px; height: 56px; object-fit: cover; display: block; border-radius: inherit; }
    .vx-gal__thumb--active { border-color: var(--vx-color-primary) !important; }
  `,
})
export class VxGalleryComponent {
  readonly items = input<VxGalleryItem[]>([]);
  readonly selectedId = model('');
  readonly ariaLabel = input('Galeria');
  readonly imageClick = output<VxGalleryItem>();

  readonly activeItem = computed(() => {
    const items = this.items();
    const id = this.selectedId() || items[0]?.id;
    return items.find((i) => i.id === id) ?? items[0];
  });
}
