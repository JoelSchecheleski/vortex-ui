import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  input,
  model,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'vx-splitter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="vx-splitter"
      [class.vx-splitter--vertical]="orientation() === 'vertical'"
      #root
    >
      <div class="vx-splitter__pane" [style.flex-basis.%]="ratio()">
        <ng-content select="[vx-splitter-pane-1]" />
      </div>
      <div
        class="vx-splitter__gutter"
        role="separator"
        [attr.aria-orientation]="orientation()"
        [attr.aria-valuenow]="ratio()"
        aria-valuemin="10"
        aria-valuemax="90"
        tabindex="0"
        (pointerdown)="onPointerDown($event)"
        (keydown)="onKey($event)"
      ></div>
      <div class="vx-splitter__pane vx-splitter__pane--grow">
        <ng-content select="[vx-splitter-pane-2]" />
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .vx-splitter {
      display: flex;
      height: 100%;
      min-height: 160px;
      overflow: hidden;
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-surface);
    }

    .vx-splitter--vertical {
      flex-direction: column;
    }

    .vx-splitter__pane {
      min-width: 0;
      min-height: 0;
      overflow: auto;
      padding: var(--vx-space-3);
    }

    .vx-splitter__pane--grow {
      flex: 1;
    }

    .vx-splitter__gutter {
      flex: 0 0 6px;
      background: var(--vx-color-border);
      cursor: col-resize;
      position: relative;
    }

    .vx-splitter--vertical .vx-splitter__gutter {
      cursor: row-resize;
    }

    .vx-splitter__gutter:hover,
    .vx-splitter__gutter:focus-visible {
      background: var(--vx-color-primary);
      outline: none;
    }
  `,
})
export class VxSplitterComponent {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  /** Percentual do primeiro painel (10–90). */
  readonly ratio = model(40);

  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  private dragging = false;

  onPointerDown(event: PointerEvent): void {
    event.preventDefault();
    this.dragging = true;
    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture(event.pointerId);

    const onMove = (e: PointerEvent) => {
      if (!this.dragging) return;
      const el = this.root()?.nativeElement;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      let next: number;
      if (this.orientation() === 'vertical') {
        next = ((e.clientY - rect.top) / rect.height) * 100;
      } else {
        next = ((e.clientX - rect.left) / rect.width) * 100;
      }
      this.setRatio(next);
    };

    const onUp = () => {
      this.dragging = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  onKey(event: KeyboardEvent): void {
    const step = event.shiftKey ? 10 : 2;
    if (this.orientation() === 'vertical') {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.setRatio(this.ratio() - step);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.setRatio(this.ratio() + step);
      }
    } else {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.setRatio(this.ratio() - step);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.setRatio(this.ratio() + step);
      }
    }
  }

  private setRatio(value: number): void {
    const next = Math.min(90, Math.max(10, Math.round(value)));
    this.ratio.set(next);
  }
}
