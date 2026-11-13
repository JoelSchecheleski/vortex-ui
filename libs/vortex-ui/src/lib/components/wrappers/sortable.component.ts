import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  output,
} from '@angular/core';

export interface VxSortableItem {
  id: string;
  text: string;
}

@Component({
  selector: 'vx-sortable',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="vx-sortable" role="list" [attr.aria-label]="ariaLabel()">
      @for (item of items(); track item.id; let i = $index) {
        <li
          class="vx-sortable__item"
          draggable="true"
          [class.vx-sortable__item--dragging]="dragIndex() === i"
          [class.vx-sortable__item--over]="overIndex() === i && dragIndex() !== i"
          (dragstart)="onDragStart(i, $event)"
          (dragover)="onDragOver(i, $event)"
          (drop)="onDrop(i, $event)"
          (dragend)="onDragEnd()"
        >
          <span class="vx-sortable__handle" aria-hidden="true">⋮⋮</span>
          <span class="vx-sortable__text">{{ item.text }}</span>
        </li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: block;
    }

    .vx-sortable {
      list-style: none;
      margin: 0;
      padding: var(--vx-space-2);
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-surface);
      font-family: var(--vx-font-sans);
      display: flex;
      flex-direction: column;
      gap: var(--vx-space-1);
    }

    .vx-sortable__item {
      display: flex;
      align-items: center;
      gap: var(--vx-space-2);
      padding: var(--vx-space-2) var(--vx-space-3);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-bg-elevated);
      border: 1px solid var(--vx-color-border);
      cursor: grab;
      font-size: var(--vx-font-size-sm);
      color: var(--vx-color-text);
    }

    .vx-sortable__item--dragging {
      opacity: 0.5;
    }

    .vx-sortable__item--over {
      border-color: var(--vx-color-primary);
      box-shadow: var(--vx-focus-ring);
    }

    .vx-sortable__handle {
      color: var(--vx-color-text-secondary);
      letter-spacing: -0.15em;
      user-select: none;
    }
  `,
})
export class VxSortableComponent {
  readonly items = model<VxSortableItem[]>([]);
  readonly ariaLabel = input('Lista ordenável');
  readonly reorder = output<VxSortableItem[]>();

  readonly dragIndex = model<number | null>(null);
  readonly overIndex = model<number | null>(null);

  onDragStart(index: number, event: DragEvent): void {
    this.dragIndex.set(index);
    event.dataTransfer?.setData('text/plain', String(index));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  onDragOver(index: number, event: DragEvent): void {
    event.preventDefault();
    this.overIndex.set(index);
  }

  onDrop(index: number, event: DragEvent): void {
    event.preventDefault();
    const from = this.dragIndex();
    if (from == null || from === index) {
      this.onDragEnd();
      return;
    }
    const next = [...this.items()];
    const [moved] = next.splice(from, 1);
    if (!moved) {
      this.onDragEnd();
      return;
    }
    next.splice(index, 0, moved);
    this.items.set(next);
    this.reorder.emit(next);
    this.onDragEnd();
  }

  onDragEnd(): void {
    this.dragIndex.set(null);
    this.overIndex.set(null);
  }
}
