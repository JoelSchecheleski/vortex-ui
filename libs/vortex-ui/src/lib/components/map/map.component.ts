import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

export interface VxMapMarker {
  lat: number;
  lng: number;
  label?: string;
}

@Component({
  selector: 'vx-map',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-map" [attr.aria-label]="ariaLabel()">
      <div class="vx-map__canvas" role="img">
        @for (m of markersPx(); track m.key) {
          <button
            type="button"
            class="vx-map__pin"
            [style.left.%]="m.x"
            [style.top.%]="m.y"
            [attr.aria-label]="m.marker.label ?? 'Marcador'"
            (click)="markerClick.emit(m.marker)"
          >
            <span>●</span>
            @if (m.marker.label) {
              <small>{{ m.marker.label }}</small>
            }
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .vx-map {
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      overflow: hidden;
      font-family: var(--vx-font-sans);
    }
    .vx-map__canvas {
      position: relative;
      height: 280px;
      background: linear-gradient(180deg, var(--vx-color-bg-muted), color-mix(in srgb, var(--vx-color-primary) 8%, var(--vx-color-bg-muted)));
    }
    .vx-map__pin {
      position: absolute;
      transform: translate(-50%, -100%);
      border: none;
      background: none;
      color: var(--vx-color-primary);
      font: inherit;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .vx-map__pin small { font-size: 10px; color: var(--vx-color-text); background: var(--vx-color-surface); padding: 0 4px; border-radius: 2px; }
  `,
})
export class VxMapComponent {
  readonly markers = input<VxMapMarker[]>([]);
  readonly ariaLabel = input('Mapa');
  readonly markerClick = output<VxMapMarker>();

  readonly markersPx = computed(() => {
    const ms = this.markers();
    if (!ms.length) return [];
    const lats = ms.map((m) => m.lat);
    const lngs = ms.map((m) => m.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    return ms.map((marker, i) => {
      const x = ((marker.lng - minLng) / (maxLng - minLng || 1)) * 80 + 10;
      const y = 90 - ((marker.lat - minLat) / (maxLat - minLat || 1)) * 80;
      return { key: `${marker.lat}-${marker.lng}-${i}`, marker, x, y };
    });
  });
}
