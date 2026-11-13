import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  model,
  output,
} from '@angular/core';

export type VxSchedulerView = 'day' | 'week' | 'month';

export interface VxAppointment {
  id: string;
  text: string;
  start: string; // ISO
  end: string; // ISO
  color?: string;
}

interface LaidOutAppt {
  appt: VxAppointment;
  dayIndex: number;
  top: number;
  height: number;
  label: string;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 07–18

@Component({
  selector: 'vx-scheduler',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-sch" [attr.aria-label]="ariaLabel()">
      <header class="vx-sch__header">
        <div class="vx-sch__nav">
          <button type="button" class="vx-sch__btn" (click)="shift(-1)" aria-label="Anterior">‹</button>
          <strong>{{ rangeLabel() }}</strong>
          <button type="button" class="vx-sch__btn" (click)="shift(1)" aria-label="Próximo">›</button>
          <button type="button" class="vx-sch__btn" (click)="goToday()">Hoje</button>
        </div>
        <div class="vx-sch__views" role="group" aria-label="Visão">
          <button
            type="button"
            class="vx-sch__btn"
            [class.vx-sch__btn--active]="view() === 'day'"
            (click)="view.set('day')"
          >
            Dia
          </button>
          <button
            type="button"
            class="vx-sch__btn"
            [class.vx-sch__btn--active]="view() === 'week'"
            (click)="view.set('week')"
          >
            Semana
          </button>
          <button
            type="button"
            class="vx-sch__btn"
            [class.vx-sch__btn--active]="view() === 'month'"
            (click)="view.set('month')"
          >
            Mês
          </button>
        </div>
      </header>

      @if (view() === 'month') {
        <div class="vx-sch__month" role="grid" aria-label="Grade mensal">
          @for (wd of monthWeekdays; track wd) {
            <div class="vx-sch__month-wd" role="columnheader">{{ wd }}</div>
          }
          @for (cell of monthCells(); track cell.key) {
            <div
              class="vx-sch__month-cell"
              role="gridcell"
              [class.vx-sch__month-cell--muted]="!cell.inMonth"
              [class.vx-sch__month-cell--today]="cell.isToday"
            >
              <span class="vx-sch__month-day">{{ cell.dayNum }}</span>
              <div class="vx-sch__month-appts">
                @for (appt of cell.appointments; track appt.id) {
                  <button
                    type="button"
                    class="vx-sch__month-dot"
                    [style.background]="appt.color || 'var(--vx-color-primary)'"
                    [attr.title]="appt.text"
                    (click)="appointmentClick.emit(appt)"
                  >
                    <span class="vx-sch__month-dot-label">{{ appt.text }}</span>
                  </button>
                }
              </div>
            </div>
          }
        </div>
      } @else {
      <div class="vx-sch__grid" [style.--vx-sch-cols]="days().length">
        <div class="vx-sch__corner"></div>
        @for (day of days(); track day.key) {
          <div class="vx-sch__day-head" [class.vx-sch__day-head--today]="day.isToday">
            <span>{{ day.weekday }}</span>
            <strong>{{ day.dayNum }}</strong>
          </div>
        }

        @for (hour of hours; track hour) {
          <div class="vx-sch__hour">{{ formatHour(hour) }}</div>
          @for (day of days(); track day.key) {
            <div class="vx-sch__cell" (dblclick)="onSlotDblClick(day.date, hour)"></div>
          }
        }

        <div class="vx-sch__events" [style.grid-column]="'2 / -1'" [style.grid-row]="'2 / -1'">
          @for (item of laidOut(); track item.appt.id) {
            <button
              type="button"
              class="vx-sch__event"
              [style.left.%]="item.dayIndex * (100 / days().length)"
              [style.width.%]="100 / days().length"
              [style.top.px]="item.top"
              [style.height.px]="item.height"
              [style.background]="item.appt.color || 'var(--vx-color-primary)'"
              (click)="appointmentClick.emit(item.appt)"
            >
              {{ item.label }}
            </button>
          }
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .vx-sch {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 360px;
        border: 1px solid var(--vx-color-border);
        border-radius: var(--vx-radius-md);
        background: var(--vx-color-surface);
        font-family: var(--vx-font-sans);
        overflow: hidden;
      }

      .vx-sch__header {
        display: flex;
        justify-content: space-between;
        gap: var(--vx-space-3);
        flex-wrap: wrap;
        padding: var(--vx-space-3);
        border-bottom: 1px solid var(--vx-color-border);
      }

      .vx-sch__nav,
      .vx-sch__views {
        display: flex;
        align-items: center;
        gap: var(--vx-space-2);
      }

      .vx-sch__btn {
        border: 1px solid var(--vx-color-border);
        background: var(--vx-color-bg-elevated);
        color: var(--vx-color-text);
        border-radius: var(--vx-radius-md);
        padding: 0.3rem 0.6rem;
        font: inherit;
        font-size: var(--vx-font-size-sm);
        cursor: pointer;
      }

      .vx-sch__btn--active {
        background: var(--vx-color-primary);
        border-color: var(--vx-color-primary);
        color: var(--vx-color-primary-text);
      }

      .vx-sch__grid {
        --vx-sch-hour-h: 48px;
        position: relative;
        display: grid;
        grid-template-columns: 56px repeat(var(--vx-sch-cols, 1), minmax(0, 1fr));
        grid-auto-rows: var(--vx-sch-hour-h);
        flex: 1;
        overflow: auto;
      }

      .vx-sch__corner,
      .vx-sch__day-head {
        position: sticky;
        top: 0;
        z-index: 2;
        background: var(--vx-color-bg-muted);
        border-bottom: 1px solid var(--vx-color-border);
        border-right: 1px solid var(--vx-color-border);
      }

      .vx-sch__day-head {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: var(--vx-font-size-xs);
        color: var(--vx-color-text-secondary);
        min-height: 48px;
      }

      .vx-sch__day-head--today strong {
        color: var(--vx-color-primary);
      }

      .vx-sch__hour {
        font-size: 10px;
        color: var(--vx-color-text-secondary);
        padding: var(--vx-space-1);
        border-right: 1px solid var(--vx-color-border);
        border-bottom: 1px solid var(--vx-color-border);
      }

      .vx-sch__cell {
        border-right: 1px solid var(--vx-color-border);
        border-bottom: 1px solid var(--vx-color-border);
      }

      .vx-sch__events {
        position: relative;
        pointer-events: none;
      }

      .vx-sch__event {
        position: absolute;
        pointer-events: auto;
        border: none;
        border-radius: var(--vx-radius-sm);
        color: #fff;
        font: inherit;
        font-size: 11px;
        text-align: left;
        padding: 2px 6px;
        overflow: hidden;
        cursor: pointer;
        box-sizing: border-box;
        opacity: 0.92;
      }

      .vx-sch__month {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        flex: 1;
        overflow: auto;
        border-top: 1px solid var(--vx-color-border);
      }

      .vx-sch__month-wd {
        padding: var(--vx-space-2);
        text-align: center;
        font-size: var(--vx-font-size-xs);
        color: var(--vx-color-text-secondary);
        background: var(--vx-color-bg-muted);
        border-bottom: 1px solid var(--vx-color-border);
        border-right: 1px solid var(--vx-color-border);
      }

      .vx-sch__month-cell {
        min-height: 88px;
        padding: var(--vx-space-1);
        border-right: 1px solid var(--vx-color-border);
        border-bottom: 1px solid var(--vx-color-border);
        font-size: var(--vx-font-size-xs);
      }

      .vx-sch__month-cell--muted {
        color: var(--vx-color-text-muted);
        background: color-mix(in srgb, var(--vx-color-bg-muted) 40%, transparent);
      }

      .vx-sch__month-cell--today .vx-sch__month-day {
        color: var(--vx-color-primary);
        font-weight: var(--vx-font-weight-bold);
      }

      .vx-sch__month-day {
        display: block;
        margin-bottom: var(--vx-space-1);
      }

      .vx-sch__month-appts {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .vx-sch__month-dot {
        border: none;
        border-radius: var(--vx-radius-sm);
        color: #fff;
        font: inherit;
        font-size: 10px;
        text-align: left;
        padding: 1px 4px;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 100%;
      }

      .vx-sch__month-dot-label {
        display: inline;
      }
    `,
  ],
})
export class VxSchedulerComponent {
  readonly appointments = input<VxAppointment[]>([]);
  readonly view = model<VxSchedulerView>('week');
  readonly currentDate = model<Date>(startOfDay(new Date()));
  readonly ariaLabel = input('Scheduler');
  readonly appointmentClick = output<VxAppointment>();
  readonly slotDblClick = output<{ start: Date; end: Date }>();

  readonly hours = HOURS;
  readonly monthWeekdays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

  readonly days = computed(() => {
    const base = startOfDay(this.currentDate());
    if (this.view() === 'day') return [describeDay(base)];
    if (this.view() === 'month') return monthDays(base);
    const monday = startOfWeek(base);
    return Array.from({ length: 7 }, (_, i) => describeDay(addDays(monday, i)));
  });

  readonly rangeLabel = computed(() => {
    if (this.view() === 'month') {
      const d = this.currentDate();
      return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    }
    const days = this.days();
    if (days.length === 1) return days[0]!.longLabel;
    return `${days[0]!.shortLabel} – ${days[days.length - 1]!.shortLabel}`;
  });

  readonly monthCells = computed(() => {
    const base = startOfDay(this.currentDate());
    const y = base.getFullYear();
    const m = base.getMonth();
    const first = new Date(y, m, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const appts = this.appointments();
    const today = startOfDay(new Date());
    const cells: Array<{
      key: string;
      date: Date;
      dayNum: number;
      inMonth: boolean;
      isToday: boolean;
      appointments: VxAppointment[];
    }> = [];

    for (let i = 0; i < 42; i++) {
      const dayNum = i - startPad + 1;
      const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
      const date = inMonth
        ? new Date(y, m, dayNum)
        : new Date(y, m + (dayNum < 1 ? -1 : 1), inMonth ? dayNum : dayNum - daysInMonth);
      const dayAppts = appts.filter((a) => sameDay(new Date(a.start), date));
      cells.push({
        key: date.toISOString(),
        date,
        dayNum: date.getDate(),
        inMonth,
        isToday: sameDay(date, today),
        appointments: dayAppts.slice(0, 3),
      });
    }
    return cells;
  });

  readonly laidOut = computed(() => {
    const days = this.days();
    const hourH = 48;
    const startHour = HOURS[0]!;
    const out: LaidOutAppt[] = [];

    for (const appt of this.appointments()) {
      const start = new Date(appt.start);
      const end = new Date(appt.end);
      const dayIndex = days.findIndex((d) => sameDay(d.date, start));
      if (dayIndex < 0) continue;
      const startMin = start.getHours() * 60 + start.getMinutes();
      const endMin = end.getHours() * 60 + end.getMinutes();
      const top = ((startMin - startHour * 60) / 60) * hourH;
      const height = Math.max(((endMin - startMin) / 60) * hourH, 18);
      out.push({
        appt,
        dayIndex,
        top: Math.max(top, 0),
        height,
        label: `${formatHour(start.getHours())} ${appt.text}`,
      });
    }
    return out;
  });

  shift(delta: number): void {
    if (this.view() === 'month') {
      const d = new Date(this.currentDate());
      d.setMonth(d.getMonth() + delta);
      this.currentDate.set(startOfDay(d));
      return;
    }
    const days = this.view() === 'day' ? 1 : 7;
    this.currentDate.set(addDays(this.currentDate(), delta * days));
  }

  goToday(): void {
    this.currentDate.set(startOfDay(new Date()));
  }

  formatHour(hour: number): string {
    return formatHour(hour);
  }

  onSlotDblClick(day: Date, hour: number): void {
    const start = new Date(day);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(hour + 1, 0, 0, 0);
    this.slotDblClick.emit({ start, end });
  }
}

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d: Date): Date {
  const x = startOfDay(d);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(x, diff);
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function monthDays(anchor: Date) {
  const y = anchor.getFullYear();
  const m = anchor.getMonth();
  const len = new Date(y, m + 1, 0).getDate();
  return Array.from({ length: len }, (_, i) => describeDay(new Date(y, m, i + 1)));
}

function describeDay(date: Date) {
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' });
  const dayNum = date.getDate();
  const shortLabel = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const longLabel = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
  const today = startOfDay(new Date());
  return {
    key: date.toISOString(),
    date,
    weekday,
    dayNum,
    shortLabel,
    longLabel,
    isToday: sameDay(date, today),
  };
}
