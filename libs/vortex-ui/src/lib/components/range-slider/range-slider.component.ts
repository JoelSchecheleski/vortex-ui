import { Component, ChangeDetectionStrategy, input, model, output } from '@angular/core';

@Component({
  selector: 'vx-range-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-rs" [attr.aria-label]="ariaLabel()">
      @if (label()) { <span class="vx-rs__label">{{ label() }}</span> }
      <div class="vx-rs__inputs">
        <input type="range" [min]="min()" [max]="max()" [step]="step()" [value]="start()" (input)="onStart($event)" aria-label="Mínimo" />
        <input type="range" [min]="min()" [max]="max()" [step]="step()" [value]="end()" (input)="onEnd($event)" aria-label="Máximo" />
      </div>
      <span class="vx-rs__val">{{ start() }} – {{ end() }}</span>
    </div>
  `,
  styles: `
    :host { display: block; }
    .vx-rs { font-family: var(--vx-font-sans); font-size: var(--vx-font-size-sm); display: flex; flex-direction: column; gap: var(--vx-space-1); }
    .vx-rs__inputs { display: flex; flex-direction: column; gap: var(--vx-space-1); }
    .vx-rs__inputs input { width: 100%; accent-color: var(--vx-color-primary); }
    .vx-rs__val { color: var(--vx-color-text-secondary); font-size: var(--vx-font-size-xs); }
  `,
})
export class VxRangeSliderComponent {
  readonly label = input<string>();
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly ariaLabel = input('Intervalo');
  readonly start = model(20);
  readonly end = model(80);
  readonly rangeChange = output<{ start: number; end: number }>();

  onStart(event: Event): void {
    const v = Number((event.target as HTMLInputElement).value);
    const end = Math.max(v, this.end());
    this.start.set(v);
    if (end !== this.end()) this.end.set(end);
    this.rangeChange.emit({ start: v, end });
  }

  onEnd(event: Event): void {
    const v = Number((event.target as HTMLInputElement).value);
    const start = Math.min(v, this.start());
    this.end.set(v);
    if (start !== this.start()) this.start.set(start);
    this.rangeChange.emit({ start, end: v });
  }
}
