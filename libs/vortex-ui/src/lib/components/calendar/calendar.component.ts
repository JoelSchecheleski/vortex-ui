import { Component, ChangeDetectionStrategy, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'vx-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-cal" [attr.aria-label]="ariaLabel()">
      <header class="vx-cal__head">
        <button type="button" aria-label="Mês anterior" (click)="shiftMonth(-1)">‹</button>
        <strong>{{ monthLabel() }}</strong>
        <button type="button" aria-label="Próximo mês" (click)="shiftMonth(1)">›</button>
      </header>
      <div class="vx-cal__grid" role="grid">
        @for (d of weekdays; track d) {
          <div class="vx-cal__wd" role="columnheader">{{ d }}</div>
        }
        @for (cell of cells(); track cell.key) {
          <button
            type="button"
            class="vx-cal__day"
            role="gridcell"
            [class.vx-cal__day--muted]="!cell.inMonth"
            [class.vx-cal__day--selected]="cell.iso === selected()"
            (click)="select(cell.iso)"
          >
            {{ cell.day }}
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .vx-cal {
      width: 280px; border: 1px solid var(--vx-color-border); border-radius: var(--vx-radius-md);
      background: var(--vx-color-surface); font-family: var(--vx-font-sans); padding: var(--vx-space-2);
    }
    .vx-cal__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--vx-space-2); font-size: var(--vx-font-size-sm); }
    .vx-cal__head button { border: 1px solid var(--vx-color-border); background: var(--vx-color-bg-elevated); border-radius: var(--vx-radius-sm); cursor: pointer; padding: 0.2rem 0.5rem; }
    .vx-cal__grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
    .vx-cal__wd { text-align: center; font-size: 10px; color: var(--vx-color-text-secondary); padding: 4px 0; }
    .vx-cal__day {
      border: none; background: none; padding: 0.35rem; font: inherit; font-size: var(--vx-font-size-sm);
      border-radius: var(--vx-radius-sm); cursor: pointer;
    }
    .vx-cal__day--muted { color: var(--vx-color-text-muted); }
    .vx-cal__day--selected { background: var(--vx-color-primary); color: var(--vx-color-primary-text); }
    .vx-cal__day:hover:not(.vx-cal__day--selected) { background: var(--vx-color-bg-muted); }
  `,
})
export class VxCalendarComponent {
  readonly viewDate = model(new Date());
  readonly selected = model('');
  readonly ariaLabel = input('Calendário');
  readonly dateSelected = output<string>();

  readonly weekdays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

  readonly monthLabel = computed(() =>
    this.viewDate().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  );

  readonly cells = computed(() => {
    const d = this.viewDate();
    const y = d.getFullYear();
    const m = d.getMonth();
    const first = new Date(y, m, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells: Array<{ key: string; day: number; inMonth: boolean; iso: string }> = [];
    for (let i = 0; i < 42; i++) {
      const dayNum = i - startPad + 1;
      const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
      const date = inMonth ? new Date(y, m, dayNum) : new Date(y, m + (dayNum < 1 ? -1 : 1), inMonth ? dayNum : dayNum - daysInMonth);
      const iso = toIsoDate(date);
      cells.push({ key: iso + i, day: date.getDate(), inMonth, iso });
    }
    return cells;
  });

  shiftMonth(delta: number): void {
    const d = new Date(this.viewDate());
    d.setMonth(d.getMonth() + delta);
    this.viewDate.set(d);
  }

  select(iso: string): void {
    this.selected.set(iso);
    this.dateSelected.emit(iso);
  }
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
