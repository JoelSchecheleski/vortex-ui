import { Component, ChangeDetectionStrategy, input } from '@angular/core';

export type VxBoxDirection = 'row' | 'col';
export type VxBoxAlign = 'start' | 'center' | 'end' | 'stretch';
export type VxBoxJustify = 'start' | 'center' | 'end' | 'between' | 'around';

@Component({
  selector: 'vx-box',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: `
    :host {
      display: flex;
      flex-direction: var(--vx-box-dir, row);
      align-items: var(--vx-box-align, stretch);
      justify-content: var(--vx-box-justify, flex-start);
      gap: var(--vx-box-gap, var(--vx-space-3));
      flex-wrap: var(--vx-box-wrap, nowrap);
    }
  `,
  host: {
    '[style.--vx-box-dir]': 'dirCss()',
    '[style.--vx-box-align]': 'alignCss()',
    '[style.--vx-box-justify]': 'justifyCss()',
    '[style.--vx-box-gap]': 'gap()',
    '[style.--vx-box-wrap]': 'wrap() ? "wrap" : "nowrap"',
  },
})
export class VxBoxComponent {
  readonly direction = input<VxBoxDirection>('row');
  readonly align = input<VxBoxAlign>('stretch');
  readonly justify = input<VxBoxJustify>('start');
  readonly gap = input('var(--vx-space-3)');
  readonly wrap = input(false);

  dirCss(): string {
    return this.direction() === 'col' ? 'column' : 'row';
  }

  alignCss(): string {
    const map: Record<VxBoxAlign, string> = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch',
    };
    return map[this.align()];
  }

  justifyCss(): string {
    const map: Record<VxBoxJustify, string> = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      between: 'space-between',
      around: 'space-around',
    };
    return map[this.justify()];
  }
}
