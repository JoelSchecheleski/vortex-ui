import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export interface VxVectorRegion {
  id: string;
  name: string;
  /** SVG path d */
  d: string;
}

@Component({
  selector: 'vx-vector-map',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 400 300" class="vx-vm" role="img" [attr.aria-label]="ariaLabel()">
      @for (region of regions(); track region.id) {
        <path
          class="vx-vm__region"
          [class.vx-vm__region--selected]="region.id === selected()"
          [attr.d]="region.d"
          (click)="select(region)"
        >
          <title>{{ region.name }}</title>
        </path>
      }
    </svg>
  `,
  styles: `
    :host { display: block; }
    .vx-vm { width: 100%; height: auto; font-family: var(--vx-font-sans); }
    .vx-vm__region {
      fill: color-mix(in srgb, var(--vx-color-primary) 35%, var(--vx-color-bg-muted));
      stroke: var(--vx-color-border);
      stroke-width: 1;
      cursor: pointer;
      transition: fill var(--vx-transition-fast);
    }
    .vx-vm__region:hover { fill: color-mix(in srgb, var(--vx-color-primary) 55%, var(--vx-color-bg-muted)); }
    .vx-vm__region--selected { fill: var(--vx-color-primary); }
  `,
})
export class VxVectorMapComponent {
  readonly regions = input<VxVectorRegion[]>([]);
  readonly selected = input('');
  readonly ariaLabel = input('Mapa vetorial');
  readonly regionClick = output<VxVectorRegion>();

  select(region: VxVectorRegion): void {
    this.regionClick.emit(region);
  }
}
