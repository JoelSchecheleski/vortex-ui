import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

export interface VxGanttTask {
  id: string;
  title: string;
  start: string; // yyyy-MM-dd or ISO
  end: string;
  progress?: number; // 0–100
  color?: string;
  parentId?: string | null;
}

interface LaidOutTask {
  task: VxGanttTask;
  left: number;
  width: number;
  row: number;
}

@Component({
  selector: 'vx-gantt',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-gantt" [attr.aria-label]="ariaLabel()">
      <div class="vx-gantt__list">
        <div class="vx-gantt__list-head">Tarefa</div>
        @for (task of tasks(); track task.id) {
          <button type="button" class="vx-gantt__row-label" (click)="taskClick.emit(task)">
            {{ task.title }}
          </button>
        }
      </div>
      <div class="vx-gantt__timeline">
        <div class="vx-gantt__scale">
          @for (tick of scale(); track tick.label) {
            <span [style.left.%]="tick.left">{{ tick.label }}</span>
          }
        </div>
        <div class="vx-gantt__bars" [style.height.px]="tasks().length * rowHeight()">
          @for (item of laidOut(); track item.task.id) {
            <button
              type="button"
              class="vx-gantt__bar"
              [style.top.px]="item.row * rowHeight() + 8"
              [style.left.%]="item.left"
              [style.width.%]="item.width"
              [style.background]="item.task.color || 'var(--vx-color-primary)'"
              [title]="item.task.title"
              (click)="taskClick.emit(item.task)"
            >
              <span class="vx-gantt__progress" [style.width.%]="item.task.progress ?? 0"></span>
              <span class="vx-gantt__bar-text">{{ item.task.title }}</span>
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .vx-gantt {
        display: grid;
        grid-template-columns: minmax(140px, 220px) 1fr;
        height: 100%;
        min-height: 240px;
        border: 1px solid var(--vx-color-border);
        border-radius: var(--vx-radius-md);
        background: var(--vx-color-surface);
        font-family: var(--vx-font-sans);
        overflow: hidden;
      }

      .vx-gantt__list {
        border-right: 1px solid var(--vx-color-border);
        overflow: auto;
      }

      .vx-gantt__list-head,
      .vx-gantt__row-label {
        height: 40px;
        display: flex;
        align-items: center;
        padding: 0 var(--vx-space-3);
        border-bottom: 1px solid var(--vx-color-border);
        font-size: var(--vx-font-size-sm);
      }

      .vx-gantt__list-head {
        font-weight: var(--vx-font-weight-semibold);
        background: var(--vx-color-bg-muted);
        position: sticky;
        top: 0;
      }

      .vx-gantt__row-label {
        width: 100%;
        border: none;
        background: transparent;
        color: var(--vx-color-text);
        text-align: left;
        cursor: pointer;
        font: inherit;
      }

      .vx-gantt__row-label:hover {
        background: var(--vx-color-bg-hover);
      }

      .vx-gantt__timeline {
        overflow: auto;
        position: relative;
      }

      .vx-gantt__scale {
        height: 40px;
        position: sticky;
        top: 0;
        z-index: 1;
        background: var(--vx-color-bg-muted);
        border-bottom: 1px solid var(--vx-color-border);
      }

      .vx-gantt__scale span {
        position: absolute;
        top: 12px;
        font-size: 10px;
        color: var(--vx-color-text-secondary);
        transform: translateX(-50%);
      }

      .vx-gantt__bars {
        position: relative;
        min-width: 100%;
      }

      .vx-gantt__bar {
        position: absolute;
        height: 24px;
        border: none;
        border-radius: var(--vx-radius-sm);
        color: #fff;
        overflow: hidden;
        cursor: pointer;
        text-align: left;
        padding: 0 var(--vx-space-2);
        font: inherit;
        font-size: 11px;
      }

      .vx-gantt__progress {
        position: absolute;
        inset: 0 auto 0 0;
        background: rgb(255 255 255 / 0.28);
      }

      .vx-gantt__bar-text {
        position: relative;
        z-index: 1;
        white-space: nowrap;
      }
    `,
  ],
})
export class VxGanttComponent {
  readonly tasks = input<VxGanttTask[]>([]);
  readonly rowHeight = input(40);
  readonly ariaLabel = input('Gantt');
  readonly taskClick = output<VxGanttTask>();

  private readonly range = computed(() => {
    const tasks = this.tasks();
    if (!tasks.length) {
      const now = Date.now();
      return { min: now, max: now + 7 * 86400000 };
    }
    const starts = tasks.map((t) => parseDate(t.start).getTime());
    const ends = tasks.map((t) => parseDate(t.end).getTime());
    return { min: Math.min(...starts), max: Math.max(...ends) };
  });

  readonly scale = computed(() => {
    const { min, max } = this.range();
    const span = Math.max(max - min, 86400000);
    const steps = 6;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const t = min + (span * i) / steps;
      return {
        left: (i / steps) * 100,
        label: new Date(t).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      };
    });
  });

  readonly laidOut = computed(() => {
    const { min, max } = this.range();
    const span = Math.max(max - min, 1);
    return this.tasks().map((task, row) => {
      const start = parseDate(task.start).getTime();
      const end = parseDate(task.end).getTime();
      const left = ((start - min) / span) * 100;
      const width = Math.max(((end - start) / span) * 100, 1.5);
      return { task, left, width, row } satisfies LaidOutTask;
    });
  });
}

function parseDate(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`);
  }
  return new Date(value);
}
