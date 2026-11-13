import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'vx-field-set',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset class="vx-fs" [disabled]="disabled()">
      @if (legend()) { <legend class="vx-fs__legend">{{ legend() }}</legend> }
      <div class="vx-fs__body"><ng-content /></div>
    </fieldset>
  `,
  styles: `
    :host { display: block; }
    .vx-fs {
      margin: 0; padding: var(--vx-space-3);
      border: 1px solid var(--vx-color-border); border-radius: var(--vx-radius-md);
      font-family: var(--vx-font-sans);
    }
    .vx-fs:disabled { opacity: 0.55; }
    .vx-fs__legend {
      padding: 0 var(--vx-space-1);
      font-size: var(--vx-font-size-sm);
      font-weight: var(--vx-font-weight-semibold);
    }
    .vx-fs__body { display: flex; flex-direction: column; gap: var(--vx-space-3); }
  `,
})
export class VxFieldSetComponent {
  readonly legend = input('');
  readonly disabled = input(false);
}
