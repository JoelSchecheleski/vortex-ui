import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  output,
} from '@angular/core';

export interface VxSize {
  width: number;
  height: number;
}

@Component({
  selector: 'vx-resizable',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="vx-resizable"
      [style.width.px]="width()"
      [style.height.px]="height()"
      [style.min-width.px]="minWidth()"
      [style.min-height.px]="minHeight()"
    >
      <div class="vx-resizable__content">
        <ng-content />
      </div>
      @if (handles().includes('e')) {
        <div class="vx-resizable__handle vx-resizable__handle--e" (pointerdown)="start($event, 'e')"></div>
      }
      @if (handles().includes('s')) {
        <div class="vx-resizable__handle vx-resizable__handle--s" (pointerdown)="start($event, 's')"></div>
      }
      @if (handles().includes('se')) {
        <div class="vx-resizable__handle vx-resizable__handle--se" (pointerdown)="start($event, 'se')"></div>
      }
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
    }

    .vx-resizable {
      position: relative;
      box-sizing: border-box;
      border: 1px dashed var(--vx-color-border-strong);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-surface);
      overflow: hidden;
    }

    .vx-resizable__content {
      height: 100%;
      overflow: auto;
      padding: var(--vx-space-3);
    }

    .vx-resizable__handle {
      position: absolute;
      z-index: 2;
    }

    .vx-resizable__handle--e {
      top: 0;
      right: 0;
      width: 6px;
      height: 100%;
      cursor: ew-resize;
    }

    .vx-resizable__handle--s {
      left: 0;
      bottom: 0;
      width: 100%;
      height: 6px;
      cursor: ns-resize;
    }

    .vx-resizable__handle--se {
      right: 0;
      bottom: 0;
      width: 12px;
      height: 12px;
      cursor: nwse-resize;
      background: var(--vx-color-primary);
      border-radius: var(--vx-radius-sm) 0 0 0;
      opacity: 0.7;
    }
  `,
})
export class VxResizableComponent {
  readonly width = model(320);
  readonly height = model(180);
  readonly minWidth = input(120);
  readonly minHeight = input(80);
  readonly handles = input<Array<'e' | 's' | 'se'>>(['e', 's', 'se']);
  readonly sizeChange = output<VxSize>();

  start(event: PointerEvent, handle: 'e' | 's' | 'se'): void {
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startW = this.width();
    const startH = this.height();

    const onMove = (e: PointerEvent) => {
      let w = startW;
      let h = startH;
      if (handle === 'e' || handle === 'se') {
        w = Math.max(this.minWidth(), startW + (e.clientX - startX));
      }
      if (handle === 's' || handle === 'se') {
        h = Math.max(this.minHeight(), startH + (e.clientY - startY));
      }
      this.width.set(Math.round(w));
      this.height.set(Math.round(h));
      this.sizeChange.emit({ width: this.width(), height: this.height() });
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }
}
