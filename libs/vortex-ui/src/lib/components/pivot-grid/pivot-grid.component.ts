import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import type { VxPivotFieldState } from './pivot-field-chooser.component';

@Component({
  selector: 'vx-pivot-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-pivot" [attr.aria-label]="ariaLabel()">
      <table class="vx-pivot__table">
        <thead>
          <tr>
            @for (col of columns(); track col) {
              <th scope="col">{{ col }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.label) {
            <tr>
              <th scope="row">{{ row.label }}</th>
              @for (cell of row.cells; track $index) {
                <td>{{ cell }}</td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    :host { display: block; }
    .vx-pivot {
      overflow: auto;
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      font-family: var(--vx-font-sans);
      font-size: var(--vx-font-size-sm);
    }
    .vx-pivot__table { width: 100%; border-collapse: collapse; }
    .vx-pivot__table th, .vx-pivot__table td {
      border: 1px solid var(--vx-color-border);
      padding: var(--vx-space-2);
      text-align: left;
    }
    .vx-pivot__table th { background: var(--vx-color-bg-muted); font-weight: var(--vx-font-weight-semibold); }
  `,
})
export class VxPivotGridComponent {
  readonly data = input<Record<string, unknown>[]>([]);
  readonly fields = input<VxPivotFieldState>({ available: [], rows: [], columns: [], values: [] });
  readonly ariaLabel = input('Tabela pivot');

  readonly columns = computed(() => {
    const cols = this.fields().columns;
    const vals = this.fields().values;
    if (!cols.length) return vals.length ? ['', ...vals] : ['Total'];
    const headers: string[] = [''];
    for (const c of cols) {
      if (vals.length) {
        for (const v of vals) headers.push(`${c} / ${v}`);
      } else {
        headers.push(c);
      }
    }
    return headers;
  });

  readonly rows = computed(() => {
    const rowField = this.fields().rows[0];
    const colField = this.fields().columns[0];
    const valueField = this.fields().values[0];
    const data = this.data();
    if (!rowField || !valueField) {
      return [{ label: '—', cells: ['0'] }];
    }
    const rowKeys = [...new Set(data.map((r) => String(r[rowField] ?? '')))];
    const colKeys = colField
      ? [...new Set(data.map((r) => String(r[colField] ?? '')))]
      : [''];

    return rowKeys.map((rk) => {
      const cells = colKeys.map((ck) => {
        const sum = data
          .filter((r) => String(r[rowField]) === rk && (!colField || String(r[colField]) === ck))
          .reduce((s, r) => s + Number(r[valueField] ?? 0), 0);
        return String(sum);
      });
      return { label: rk, cells };
    });
  });
}
