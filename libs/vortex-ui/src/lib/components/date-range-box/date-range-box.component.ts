import { Component, ChangeDetectionStrategy, input, model, output } from '@angular/core';

export interface VxDateRange {
  start: string;
  end: string;
}

@Component({
  selector: 'vx-date-range-box',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset class="vx-drb" [attr.aria-label]="ariaLabel()">
      @if (label()) { <legend>{{ label() }}</legend> }
      <div class="vx-drb__row">
        <input type="date" [value]="start()" (input)="onStart($event)" aria-label="Data inicial" />
        <span>–</span>
        <input type="date" [value]="end()" (input)="onEnd($event)" aria-label="Data final" />
      </div>
    </fieldset>
  `,
  styles: `
    :host { display: block; }
    .vx-drb { border: none; margin: 0; padding: 0; font-family: var(--vx-font-sans); }
    .vx-drb legend { font-size: var(--vx-font-size-sm); font-weight: var(--vx-font-weight-medium); margin-bottom: var(--vx-space-1); }
    .vx-drb__row { display: flex; align-items: center; gap: var(--vx-space-2); flex-wrap: wrap; }
    .vx-drb__row input {
      height: 2.5rem; padding: 0 var(--vx-space-2); border: 1px solid var(--vx-color-border-strong);
      border-radius: var(--vx-radius-md); font: inherit; font-size: var(--vx-font-size-sm);
    }
  `,
})
export class VxDateRangeBoxComponent {
  readonly label = input<string>();
  readonly ariaLabel = input('Intervalo de datas');
  readonly start = model('');
  readonly end = model('');
  readonly rangeChange = output<VxDateRange>();

  onStart(event: Event): void {
    const start = (event.target as HTMLInputElement).value;
    this.start.set(start);
    this.rangeChange.emit({ start, end: this.end() });
  }

  onEnd(event: Event): void {
    const end = (event.target as HTMLInputElement).value;
    this.end.set(end);
    this.rangeChange.emit({ start: this.start(), end });
  }
}
