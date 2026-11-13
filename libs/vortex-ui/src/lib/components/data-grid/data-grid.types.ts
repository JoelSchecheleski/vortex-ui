export interface VxAIColumnOptions {
  /** Prompt padrão da coluna (editável no Prompt Editor). */
  prompt?: string;
  /** Texto quando não há valor gerado. Default: "No data". */
  noDataText?: string;
  /** Nome lógico da coluna AI (cache / telemetria). Default: field. */
  name?: string;
}

export interface VxColumnDef<T = unknown> {
  field: string;
  header: string;
  /**
   * Largura fixa (px ou CSS). Se omitida, a coluna é **fluida** e reparte
   * o espaço restante do grid (comportamento padrão tipo DevExtreme).
   */
  width?: number | string;
  /** Largura mínima quando a coluna é fluida (default 80). */
  minWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  /** Edição inline (requer `editable` no grid). */
  editable?: boolean;
  frozen?: 'left' | 'right';
  /** `ai` = coluna gerada (não bound ao dataSource). */
  type?: 'data' | 'ai';
  ai?: VxAIColumnOptions;
  cellTemplate?: unknown;
  valueGetter?: (row: T) => unknown;
}

export interface VxCellEditEvent<T = unknown> {
  row: T;
  field: string;
  value: unknown;
  previousValue: unknown;
}

export interface VxSortState {
  field: string;
  direction: 'asc' | 'desc';
}

export interface VxDataGridConfig {
  rowHeight?: number;
  headerHeight?: number;
  virtualScroll?: boolean;
  pageSize?: number;
}

export interface VxVirtualRange {
  startIndex: number;
  endIndex: number;
  offsetY: number;
}
