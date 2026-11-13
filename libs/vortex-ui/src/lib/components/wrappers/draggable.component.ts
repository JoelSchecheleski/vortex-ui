import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  output,
} from '@angular/core';

export interface VxPoint {
  x: number;
  y: number;
}

@Component({
  selector: 'vx-draggable',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="vx-draggable"
      [style.transform]="'translate(' + x() + 'px,' + y() + 'px)'"
      [attr.aria-grabbed]="dragging()"
      (pointerdown)="onDown($event)"
    >
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
    }

    .vx-draggable {
      display: inline-block;
      cursor: grab;
      touch-action: none;
      user-select: none;
    }

    .vx-draggable:active {
      cursor: grabbing;
    }
  `,
})
export class VxDraggableComponent {
  readonly x = model(0);
  readonly y = model(0);
  readonly disabled = input(false);
  readonly positionChange = output<VxPoint>();

  readonly dragging = model(false);

  onDown(event: PointerEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.dragging.set(true);
    const startX = event.clientX;
    const startY = event.clientY;
    const originX = this.x();
    const originY = this.y();

    const onMove = (e: PointerEvent) => {
      const next = {
        x: Math.round(originX + (e.clientX - startX)),
        y: Math.round(originY + (e.clientY - startY)),
      };
      this.x.set(next.x);
      this.y.set(next.y);
      this.positionChange.emit(next);
    };

    const onUp = () => {
      this.dragging.set(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }
}
