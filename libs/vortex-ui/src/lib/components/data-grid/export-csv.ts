import { VxColumnDef } from './data-grid.types';

/** Exporta linhas client-side para CSV (UTF-8 BOM). */
export function exportRowsToCsv<T>(
  rows: T[],
  columns: VxColumnDef<T>[],
  filename = 'vortex-export.csv'
): void {
  const cols = columns.filter((c) => c.type !== 'ai');
  const header = cols.map((c) => csvEscape(c.header)).join(',');
  const lines = rows.map((row) =>
    cols
      .map((col) => {
        const raw = col.valueGetter
          ? col.valueGetter(row)
          : (row as Record<string, unknown>)[col.field];
        return csvEscape(raw == null ? '' : String(raw));
      })
      .join(',')
  );
  const csv = '\uFEFF' + [header, ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
