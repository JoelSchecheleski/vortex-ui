import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
  DestroyRef,
} from '@angular/core';
import { DecimalPipe, NgStyle } from '@angular/common';
import { VxCellEditEvent, VxColumnDef, VxSortState } from './data-grid.types';
import { VxDataSource, VxFilterState } from './data-source';
import { exportRowsToCsv } from './export-csv';
import {
  VortexAICommand,
  VortexAIConfig,
  VortexAIIntegration,
  VortexAIRequest,
  VortexAIRequestCreatingEvent,
  VortexAISuggestion,
  projectRowsForAI,
  VxAIAssistantDialogComponent,
  VxAIChatMessage,
  VxAIPromptEditorComponent,
} from 'vortex-ui/ai';

export type {
  VxColumnDef,
  VxSortState,
  VxDataGridConfig,
  VxVirtualRange,
  VxCellEditEvent,
} from './data-grid.types';
export type {
  VxDataSource,
  VxDataSourceLoadOptions,
  VxDataSourceLoadResult,
  VxFilterState,
} from './data-source';
export { VxArrayDataSource, VxRemoteMockDataSource } from './data-source';
export { exportRowsToCsv } from './export-csv';

const MAX_SPACER_PX = 5_000_000;

const DEFAULT_AI: Required<
  Pick<VortexAIConfig, 'enabled' | 'maxRowsInContext'>
> & { assistant: { enabled: boolean; title: string } } = {
  enabled: false,
  maxRowsInContext: 100,
  assistant: { enabled: true, title: 'AI Assistant' },
};

/** Linha sintética de agrupamento no viewport. */
export interface VxGroupRow {
  __vxGroup: true;
  key: string;
  label: string;
  count: number;
}

@Component({
  selector: 'vx-data-grid',
  standalone: true,
  imports: [DecimalPipe, NgStyle, VxAIAssistantDialogComponent, VxAIPromptEditorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="vx-grid"
      role="grid"
      [class.vx-grid--column-lines]="showColumnLines()"
      [class.vx-grid--row-lines]="showRowLines()"
      [attr.aria-rowcount]="totalRows()"
      [attr.aria-colcount]="columns().length"
      [attr.aria-busy]="loading() || remoteLoading() || aiBusy()"
    >
      <div class="vx-grid__toolbar">
        <div class="vx-grid__toolbar-left">
          @if (filter(); as f) {
            <span class="vx-grid__filter-pill">
              Filtro: {{ f.field }} ≈ {{ f.value }}
              <button type="button" class="vx-grid__filter-clear" (click)="clearFilter()">
                limpar
              </button>
            </span>
          }
          @if (groupBy(); as g) {
            <span class="vx-grid__filter-pill">
              Grupo: {{ g }}
              <button type="button" class="vx-grid__filter-clear" (click)="clearGroup()">
                limpar
              </button>
            </span>
          } @else if (!filter()) {
            <span class="vx-grid__toolbar-hint">
              {{ editable() ? 'Duplo clique para editar · ' : '' }}Agrupe via menu / AI
            </span>
          }
          @if (groupableFields().length) {
            <label class="vx-grid__group-label">
              Agrupar
              <select
                class="vx-grid__group-select"
                [value]="groupBy() ?? ''"
                (change)="onGroupSelect($event)"
              >
                <option value="">(nenhum)</option>
                @for (f of groupableFields(); track f.field) {
                  <option [value]="f.field">{{ f.header }}</option>
                }
              </select>
            </label>
          }
        </div>
        <div class="vx-grid__toolbar-right">
          @if (exportEnabled()) {
            <button
              type="button"
              class="vx-grid__tool-btn"
              aria-label="Exportar CSV"
              title="Exportar CSV"
              (click)="exportCsv()"
            >
              <span class="vx-grid__tool-btn-icon" aria-hidden="true">↓</span>
              CSV
            </button>
          }
          @if (aiEnabled()) {
            <button
              type="button"
              class="vx-grid__ai-btn"
              aria-label="Abrir AI Assistant"
              title="AI Assistant"
              (click)="openAssistant()"
            >
              ✦
            </button>
            <button
              type="button"
              class="vx-grid__ai-btn vx-grid__ai-btn--ghost"
              aria-label="AI Prompt Editor"
              title="AI Prompt Editor"
              (click)="openPromptEditor()"
            >
              ⌘
            </button>
          }
        </div>
      </div>

      <div
        class="vx-grid__header"
        #headerRef
        role="row"
        [style.padding-inline-end.px]="scrollbarWidth()"
      >
        @for (col of columns(); track col.field) {
          <div
            class="vx-grid__header-cell"
            role="columnheader"
            [class.vx-grid__header-cell--ai]="isAiColumn(col)"
            [ngStyle]="colStyle(col)"
            (click)="onHeaderClick(col)"
          >
            @if (isAiColumn(col)) {
              <span class="vx-grid__ai-col-icon" aria-hidden="true">✦</span>
            }
            <span class="vx-grid__header-text">{{ col.header }}</span>
            @if (!isAiColumn(col) && sort()?.field === col.field) {
              <span class="vx-grid__sort-icon" aria-hidden="true">
                {{ sort()?.direction === 'asc' ? '↑' : '↓' }}
              </span>
            }
          </div>
        }
      </div>

      <div class="vx-grid__body" #bodyRef role="rowgroup" (scroll)="onScroll($event)">
        @if ((loading() || remoteLoading()) && windowRows().length === 0) {
          <div class="vx-grid__loading">Carregando dados...</div>
        } @else if (!loading() && !remoteLoading() && totalRows() === 0) {
          <div class="vx-grid__empty">Nenhum registro encontrado</div>
        } @else {
          <div class="vx-grid__spacer" [style.height.px]="spacerHeight()"></div>
          <div class="vx-grid__window" [style.transform]="'translateY(' + offsetY() + 'px)'">
            @for (row of windowRows(); track trackDisplay(row, i); let i = $index) {
              @if (isGroupRow(row)) {
                <div
                  class="vx-grid__row vx-grid__row--group"
                  role="row"
                  [style.height.px]="rowHeight()"
                  (click)="toggleGroupExpand(groupKey(row))"
                >
                  <div class="vx-grid__cell vx-grid__cell--group" role="gridcell">
                    <span class="vx-grid__group-chevron" [class.vx-grid__group-chevron--open]="isGroupExpanded(groupKey(row))">▸</span>
                    {{ groupLabel(row) }}
                    <span class="vx-grid__group-count">({{ groupCount(row) }})</span>
                  </div>
                </div>
              } @else {
                <div
                  class="vx-grid__row"
                  role="row"
                  [attr.aria-rowindex]="startIndex() + i + 1"
                  [class.vx-grid__row--selected]="isSelected(asDataRow(row))"
                  [class.vx-grid__row--stripe]="(startIndex() + i) % 2 === 1"
                  [style.height.px]="rowHeight()"
                  (click)="toggleSelection(asDataRow(row))"
                >
                  @for (col of columns(); track col.field) {
                    <div
                      class="vx-grid__cell"
                      role="gridcell"
                      [class.vx-grid__cell--ai]="isAiColumn(col)"
                      [class.vx-grid__cell--ai-empty]="isAiColumn(col) && !aiCellValue(asDataRow(row), col)"
                      [class.vx-grid__cell--ai-loading]="isAiColumn(col) && isAiCellLoading(asDataRow(row), col)"
                      [class.vx-grid__cell--editing]="isEditing(asDataRow(row), col)"
                      [ngStyle]="colStyle(col)"
                      (dblclick)="startEdit(asDataRow(row), col, $event)"
                    >
                      @if (isAiColumn(col)) {
                        @if (isAiCellLoading(asDataRow(row), col)) {
                          <span class="vx-grid__ai-skeleton">…</span>
                        } @else {
                          {{ aiCellValue(asDataRow(row), col) || aiNoDataText(col) }}
                        }
                      } @else if (isEditing(asDataRow(row), col)) {
                        <input
                          class="vx-grid__edit-input"
                          [value]="editDraft()"
                          (input)="editDraft.set($any($event.target).value)"
                          (click)="$event.stopPropagation()"
                          (keydown.enter)="commitEdit()"
                          (keydown.escape)="cancelEdit()"
                          (blur)="commitEdit()"
                        />
                      } @else {
                        {{ getCellValue(asDataRow(row), col) }}
                      }
                    </div>
                  }
                </div>
              }
            }
          </div>
        }
      </div>

      <div class="vx-grid__footer">
        <span>
          {{ totalRows() | number }} registros
          @if (virtualScroll()) {
            · janela {{ windowRows().length | number }}
            ({{ startIndex() + 1 }}–{{ endIndexDisplay() }})
          }
        </span>
        @if (selectedCount() > 0) {
          <span>{{ selectedCount() }} selecionado(s)</span>
        }
      </div>
    </div>

    @if (aiEnabled()) {
      <vx-ai-assistant-dialog
        [open]="assistantOpen()"
        (openChange)="assistantOpen.set($event)"
        [title]="assistantTitle()"
        [messages]="aiMessages()"
        [suggestions]="aiSuggestions()"
        [busy]="aiBusy()"
        (sendMessage)="onAssistantSend($event)"
        (suggestionSelect)="onSuggestion($event)"
        (clear)="clearChat()"
      />

      <vx-ai-prompt-editor
        [open]="promptEditorOpen()"
        (openChange)="onPromptEditorOpenChange($event)"
        [prompt]="aiColumnPrompt()"
        (promptChange)="aiColumnPrompt.set($event)"
        [canApply]="aiColumnCanApply()"
        (regenerate)="onPromptRegenerate($event)"
        (apply)="onPromptApply($event)"
      />
    }
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
      min-height: 300px;
      position: relative;
    }

    .vx-grid {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 300px;
      border: 1px solid var(--vx-grid-border);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-surface);
      overflow: hidden;
      font-size: var(--vx-font-size-sm);
      font-family: var(--vx-font-sans);
      position: relative;
    }

    .vx-grid__toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--vx-space-2);
      padding: var(--vx-space-2) var(--vx-space-3);
      border-bottom: 1px solid var(--vx-grid-border);
      background: var(--vx-color-bg-subtle);
      flex-shrink: 0;
      min-height: 2.75rem;
      box-sizing: border-box;
      overflow: visible;
    }

    .vx-grid__toolbar-left,
    .vx-grid__toolbar-right {
      display: flex;
      align-items: center;
      gap: var(--vx-space-2);
      min-width: 0;
    }

    .vx-grid__toolbar-right {
      flex-shrink: 0;
    }

    .vx-grid__toolbar-hint {
      color: var(--vx-color-text-muted);
      font-size: var(--vx-font-size-xs);
    }

    .vx-grid__filter-pill {
      display: inline-flex;
      align-items: center;
      gap: var(--vx-space-2);
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      background: var(--vx-color-badge-bg, var(--vx-color-primary-subtle));
      color: var(--vx-color-badge-fg, var(--vx-color-primary-ink));
      font-size: var(--vx-font-size-xs);
    }

    .vx-grid__group-label {
      display: inline-flex;
      align-items: center;
      gap: var(--vx-space-2);
      font-size: var(--vx-font-size-xs);
      color: var(--vx-color-text-secondary);
    }

    .vx-grid__group-select {
      height: 1.75rem;
      border: 1px solid var(--vx-color-border-strong);
      border-radius: var(--vx-radius-md);
      background: var(--vx-color-bg-elevated);
      color: var(--vx-color-text);
      font: inherit;
      font-size: var(--vx-font-size-xs);
    }

    .vx-grid__row--group {
      background: var(--vx-color-bg-muted);
      font-weight: var(--vx-font-weight-semibold);
      cursor: pointer;
    }

    .vx-grid__cell--group {
      flex: 1;
      width: 100% !important;
      gap: var(--vx-space-2);
    }

    .vx-grid__group-chevron {
      display: inline-block;
      transition: transform var(--vx-transition-fast);
      color: var(--vx-color-text-secondary);
    }

    .vx-grid__group-chevron--open {
      transform: rotate(90deg);
    }

    .vx-grid__group-count {
      color: var(--vx-color-text-secondary);
      font-weight: var(--vx-font-weight-normal);
    }

    .vx-grid__edit-input {
      width: 100%;
      height: 1.6rem;
      border: 1px solid var(--vx-color-border-focus);
      border-radius: var(--vx-radius-sm);
      background: var(--vx-color-bg-elevated);
      color: var(--vx-color-text);
      font: inherit;
      padding: 0 var(--vx-space-1);
      box-shadow: var(--vx-focus-ring);
    }

    .vx-grid__cell--editing {
      padding: 2px var(--vx-space-1);
    }

    .vx-grid__filter-clear {
      border: none;
      background: transparent;
      color: inherit;
      cursor: pointer;
      text-decoration: underline;
      font: inherit;
      padding: 0;
    }

    .vx-grid__tool-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
      height: 2rem;
      min-width: 2rem;
      padding: 0 0.7rem;
      border-radius: var(--vx-radius-md);
      border: 1px solid var(--vx-color-border);
      background: var(--vx-color-surface);
      color: var(--vx-color-text);
      cursor: pointer;
      font: inherit;
      font-size: var(--vx-font-size-xs);
      font-weight: var(--vx-font-weight-semibold);
      line-height: 1;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .vx-grid__tool-btn:hover {
      border-color: var(--vx-color-primary);
      background: var(--vx-color-primary-subtle);
      color: var(--vx-color-primary-ink, var(--vx-color-primary));
    }

    .vx-grid__tool-btn-icon {
      font-size: 0.85rem;
      line-height: 1;
    }

    .vx-grid__ai-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      padding: 0;
      border-radius: 999px;
      border: 1px solid var(--vx-color-border);
      background: var(--vx-color-surface);
      color: var(--vx-color-primary);
      cursor: pointer;
      font-size: 0.95rem;
      line-height: 1;
      flex-shrink: 0;
    }

    .vx-grid__ai-btn:hover {
      border-color: var(--vx-color-primary);
      background: var(--vx-color-primary-subtle);
    }

    .vx-grid__ai-btn--ghost {
      color: var(--vx-color-text-secondary);
    }

    .vx-grid__header {
      display: flex;
      width: 100%;
      box-sizing: border-box;
      background: var(--vx-grid-header-bg);
      border-bottom: 1px solid var(--vx-grid-border);
      font-weight: var(--vx-font-weight-semibold);
      color: var(--vx-color-text);
      flex-shrink: 0;
      overflow: hidden;
      user-select: none;
      z-index: 2;
    }

    .vx-grid__header-cell {
      display: flex;
      align-items: center;
      gap: var(--vx-space-1);
      padding: 0 var(--vx-space-3);
      height: 40px;
      border-right: none;
      cursor: pointer;
      box-sizing: border-box;
      overflow: hidden;
      min-width: 0;
    }

    .vx-grid--column-lines .vx-grid__header-cell {
      border-right: 1px solid var(--vx-grid-border);
    }

    .vx-grid--column-lines .vx-grid__header-cell:last-child {
      border-right: none;
    }

    .vx-grid__header-cell:hover {
      background: var(--vx-color-bg-hover);
    }

    .vx-grid__header-cell--ai {
      color: var(--vx-color-primary);
      gap: var(--vx-space-2);
    }

    .vx-grid__ai-col-icon {
      font-size: 0.85rem;
    }

    .vx-grid__cell--ai {
      font-style: italic;
      color: var(--vx-color-text-secondary);
    }

    .vx-grid__cell--ai-empty {
      color: var(--vx-color-text-muted);
      font-style: normal;
    }

    .vx-grid__cell--ai-loading {
      opacity: 0.7;
    }

    .vx-grid__ai-skeleton {
      letter-spacing: 0.15em;
      color: var(--vx-color-text-muted);
    }

    .vx-grid__body {
      flex: 1;
      overflow: auto;
      position: relative;
      min-height: 0;
      contain: strict;
      scrollbar-gutter: stable;
    }

    .vx-grid__spacer {
      width: 1px;
      pointer-events: none;
    }

    .vx-grid__window {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      will-change: transform;
    }

    .vx-grid__row {
      display: flex;
      width: 100%;
      border-bottom: none;
      cursor: pointer;
      box-sizing: border-box;
      background: var(--vx-color-surface);
    }

    .vx-grid--row-lines .vx-grid__row {
      border-bottom: 1px solid var(--vx-grid-border);
    }

    .vx-grid__row--stripe {
      background: var(--vx-grid-stripe);
    }

    .vx-grid__row:hover {
      background: var(--vx-grid-row-hover);
    }

    .vx-grid__row--selected {
      background: var(--vx-grid-row-selected);
    }

    .vx-grid__cell {
      padding: 0 var(--vx-space-3);
      display: flex;
      align-items: center;
      border-right: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--vx-color-text);
      box-sizing: border-box;
      min-width: 0;
    }

    .vx-grid--column-lines .vx-grid__cell {
      border-right: 1px solid var(--vx-grid-border);
    }

    .vx-grid--column-lines .vx-grid__cell:last-child {
      border-right: none;
    }

    .vx-grid__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--vx-space-3);
      padding: var(--vx-space-2) var(--vx-space-4);
      border-top: 1px solid var(--vx-grid-border);
      background: var(--vx-grid-header-bg);
      font-size: var(--vx-font-size-xs);
      color: var(--vx-color-text-secondary);
      flex-shrink: 0;
    }

    .vx-grid__loading,
    .vx-grid__empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: var(--vx-color-text-muted);
    }
  `,
})
export class VxDataGridComponent<T = unknown> {
  private readonly destroyRef = inject(DestroyRef);

  readonly columns = input.required<VxColumnDef<T>[]>();
  readonly data = input<T[]>([]);
  readonly dataSource = input<VxDataSource<T> | null>(null);
  readonly totalCount = input<number | null>(null);
  readonly loading = input(false);
  readonly rowHeight = input(36);
  readonly overscan = input(8);
  readonly virtualScroll = input(true);
  readonly trackByField = input<string>('id');
  readonly selectable = input(true);
  readonly multiSelect = input(true);
  /**
   * Linhas verticais entre colunas (header + cells).
   * Default `false` — visual Fluent / DevExtreme sem grade vertical.
   */
  readonly showColumnLines = input(false);
  /** Linhas horizontais entre rows. Default `true`. */
  readonly showRowLines = input(true);
  /** Habilita edição inline (duplo clique). */
  readonly editable = input(false);
  readonly exportEnabled = input(true);
  /** Campo de agrupamento (client-side). */
  readonly groupBy = model<string | null>(null);

  /** Opt-in AI (default off). */
  readonly ai = input<VortexAIConfig | null>(null);
  readonly aiIntegration = input<VortexAIIntegration | null>(null);

  readonly sortChange = output<VxSortState | null>();
  readonly filterChange = output<VxFilterState | null>();
  readonly selectionChange = output<T[]>();
  readonly rowClick = output<T>();
  readonly cellEdit = output<VxCellEditEvent<T>>();
  readonly exported = output<{ format: 'csv'; count: number }>();
  readonly loadRequest = output<{
    skip: number;
    take: number;
    sort: VxSortState | null;
    filter: VxFilterState | null;
  }>();
  readonly aiRequestCreating = output<VortexAIRequestCreatingEvent>();
  readonly aiCommandExecuted = output<VortexAICommand>();
  readonly aiRequestCompleted = output<{ text: string }>();
  readonly aiRequestFailed = output<{ error: unknown }>();

  private readonly bodyRef = viewChild<ElementRef<HTMLElement>>('bodyRef');
  private readonly headerRef = viewChild<ElementRef<HTMLElement>>('headerRef');

  readonly sort = signal<VxSortState | null>(null);
  readonly filter = signal<VxFilterState | null>(null);
  readonly selected = signal<Set<unknown>>(new Set());
  readonly scrollTop = signal(0);
  readonly viewportHeight = signal(400);
  /** Compensa a barra de rolagem do body para alinhar header ↔ rows. */
  readonly scrollbarWidth = signal(0);

  readonly windowRows = signal<Array<T | VxGroupRow>>([]);
  readonly startIndex = signal(0);
  readonly remoteLoading = signal(false);
  readonly remoteTotal = signal(0);
  readonly collapsedGroups = signal<Set<string>>(new Set());
  readonly editDraft = signal('');
  readonly editingKey = signal<string | null>(null);
  readonly editingField = signal<string | null>(null);

  readonly assistantOpen = signal(false);
  readonly promptEditorOpen = signal(false);
  readonly aiColumnPrompt = signal('Resuma a linha em uma frase curta');
  readonly activeAiColumnField = signal<string | null>(null);
  /** Cache em memória: `${columnField}::${rowKey}` → valor gerado (não grava no dataSource). */
  readonly aiCellValues = signal<Record<string, string>>({});
  readonly aiCellLoading = signal<Record<string, boolean>>({});
  readonly aiColumnDirty = signal(false);
  readonly aiMessages = signal<VxAIChatMessage[]>([]);
  readonly aiBusy = signal(false);

  readonly aiColumnCanApply = computed(
    () => this.aiColumnDirty() && this.aiColumnPrompt().trim().length > 0
  );

  private loadSeq = 0;
  private resizeObserver: ResizeObserver | null = null;
  private scrollRaf = 0;
  private lastRemoteKey = '';
  private lastClientKey = '';
  private lastViewportH = 0;

  readonly aiEnabled = computed(() => !!this.ai()?.enabled);

  readonly assistantTitle = computed(
    () => this.ai()?.assistant?.title ?? DEFAULT_AI.assistant.title
  );

  readonly aiSuggestions = computed<VortexAISuggestion[]>(() => [
    { id: 'help', label: 'Ajuda', prompt: 'ajuda' },
    {
      id: 'filter-health',
      label: 'Filtrar setor por Saúde',
      command: {
        type: 'filter.set',
        payload: { field: 'sector', value: 'Saúde', operator: 'contains' },
      },
    },
    {
      id: 'sort-region',
      label: 'Ordenar por região',
      command: { type: 'sort.set', payload: { field: 'region', direction: 'asc' } },
    },
    {
      id: 'group-product',
      label: 'Agrupar por produto',
      command: { type: 'group.set', payload: { field: 'product' } },
    },
  ]);

  readonly groupableFields = computed(() =>
    this.columns().filter((c) => c.type !== 'ai' && c.field)
  );

  readonly totalRows = computed(() => {
    if (this.dataSource() && !this.groupBy()) return this.remoteTotal();
    return this.displayRows().length;
  });

  readonly selectedCount = computed(() => this.selected().size);

  readonly spacerHeight = computed(() =>
    Math.min(this.totalRows() * this.rowHeight(), MAX_SPACER_PX)
  );

  readonly offsetY = computed(() => {
    const total = this.totalRows();
    const rh = this.rowHeight();
    const natural = total * rh;
    const spacer = this.spacerHeight();
    if (natural <= spacer || natural === 0) return this.startIndex() * rh;
    return this.startIndex() * rh * (spacer / natural);
  });

  readonly endIndexDisplay = computed(() =>
    Math.min(this.totalRows(), this.startIndex() + this.windowRows().length)
  );

  private readonly filteredClientRows = computed(() => {
    const rows = this.data() as Record<string, unknown>[];
    const filter = this.filter();
    const sort = this.sort();
    let next = rows;
    if (filter?.field && filter.value) {
      const needle = String(filter.value).toLowerCase();
      const op = filter.operator ?? 'contains';
      next = next.filter((row) => {
        const hay = String(row[filter.field] ?? '').toLowerCase();
        return op === 'equals' ? hay === needle : hay.includes(needle);
      });
    }
    if (sort) {
      const dir = sort.direction === 'asc' ? 1 : -1;
      next = next.slice().sort((a, b) => {
        const av = a[sort.field];
        const bv = b[sort.field];
        if (av == null && bv == null) return 0;
        if (av == null) return -1 * dir;
        if (bv == null) return 1 * dir;
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    }
    return next as T[];
  });

  /** Linhas exibidas (dados + headers de grupo quando `groupBy` ativo). */
  private readonly displayRows = computed(() => {
    const rows = this.filteredClientRows();
    const field = this.groupBy();
    if (!field) return rows as Array<T | VxGroupRow>;

    const collapsed = this.collapsedGroups();
    const buckets = new Map<string, T[]>();
    for (const row of rows) {
      const key = String((row as Record<string, unknown>)[field] ?? '(vazio)');
      const list = buckets.get(key) ?? [];
      list.push(row);
      buckets.set(key, list);
    }

    const out: Array<T | VxGroupRow> = [];
    for (const [key, list] of buckets) {
      out.push({ __vxGroup: true, key, label: `${field}: ${key}`, count: list.length });
      if (!collapsed.has(key)) {
        out.push(...list);
      }
    }
    return out;
  });

  constructor() {
    afterNextRender(() => {
      this.setupViewportObservers();
      void this.refreshWindow(true);
    });

    effect(() => {
      this.data();
      this.dataSource();
      this.sort();
      this.filter();
      this.groupBy();
      this.collapsedGroups();
      this.rowHeight();
      this.overscan();
      this.virtualScroll();
      untracked(() => {
        this.lastRemoteKey = '';
        this.lastClientKey = '';
        void this.refreshWindow(true);
      });
    });

    this.destroyRef.onDestroy(() => {
      this.resizeObserver?.disconnect();
      if (this.scrollRaf) cancelAnimationFrame(this.scrollRaf);
    });
  }

  private setupViewportObservers(): void {
    const body = this.bodyRef()?.nativeElement;
    if (!body) return;
    const measure = () => {
      this.syncScrollbarGap(body);
      const h = body.clientHeight || 400;
      if (Math.abs(h - this.lastViewportH) < 2) return;
      this.lastViewportH = h;
      this.viewportHeight.set(h);
      void this.refreshWindow(false);
    };
    measure();
    this.resizeObserver = new ResizeObserver(() => measure());
    this.resizeObserver.observe(body);
  }

  private syncScrollbarGap(body: HTMLElement): void {
    const gap = Math.max(0, body.offsetWidth - body.clientWidth);
    if (gap !== this.scrollbarWidth()) this.scrollbarWidth.set(gap);
  }

  onScroll(event: Event): void {
    const body = event.target as HTMLElement;
    const header = this.headerRef()?.nativeElement;
    this.syncScrollbarGap(body);
    if (header) header.scrollLeft = body.scrollLeft;
    if (this.scrollRaf) cancelAnimationFrame(this.scrollRaf);
    this.scrollRaf = requestAnimationFrame(() => {
      this.scrollTop.set(body.scrollTop);
      void this.refreshWindow(false);
    });
  }

  private scrollTopToIndex(scrollTop: number, total: number): number {
    const rh = this.rowHeight();
    const natural = total * rh;
    const spacer = Math.min(natural, MAX_SPACER_PX);
    if (natural <= spacer || spacer <= 0) return Math.floor(scrollTop / rh);
    return Math.floor((scrollTop / spacer) * total);
  }

  private computeRange(total: number): { start: number; take: number } {
    const rh = this.rowHeight();
    const overscan = this.overscan();
    const vh = this.viewportHeight();
    if (!this.virtualScroll()) return { start: 0, take: Math.min(total, 500) };
    if (total <= 0) return { start: 0, take: 0 };
    const visibleCount = Math.ceil(vh / rh) + 1;
    let start = Math.max(0, this.scrollTopToIndex(this.scrollTop(), total) - overscan);
    let end = Math.min(total, start + visibleCount + overscan * 2);
    start = Math.min(start, Math.max(0, total - 1));
    return { start, take: Math.max(0, end - start) };
  }

  private async refreshWindow(force: boolean): Promise<void> {
    const ds = this.dataSource();
    // Agrupamento é client-side — ignora dataSource enquanto groupBy estiver ativo.
    if (ds && !this.groupBy()) {
      const knownTotal = this.remoteTotal();
      const probeTotal = knownTotal > 0 ? knownTotal : 1_000_000;
      const { start, take } = this.computeRange(probeTotal);
      await this.loadFromSource(ds, start, Math.max(take, 1), force);
      return;
    }

    const rows = this.displayRows();
    const total = rows.length;
    const { start, take } = this.computeRange(total);
    const key = `${start}:${take}:${this.sort()?.field ?? ''}:${this.filter()?.field ?? ''}:${this.filter()?.value ?? ''}`;
    if (!force && key === this.lastClientKey) return;
    this.lastClientKey = key;
    this.startIndex.set(start);
    this.windowRows.set(rows.slice(start, start + take));
  }

  private async loadFromSource(
    ds: VxDataSource<T>,
    skip: number,
    take: number,
    force: boolean
  ): Promise<void> {
    const sort = this.sort();
    const filter = this.filter();
    const key = `${skip}:${take}:${sort?.field ?? ''}:${sort?.direction ?? ''}:${filter?.field ?? ''}:${filter?.value ?? ''}`;
    if (!force && key === this.lastRemoteKey) return;

    const seq = ++this.loadSeq;
    if (this.windowRows().length === 0) this.remoteLoading.set(true);
    this.loadRequest.emit({ skip, take, sort, filter });

    try {
      const result = await Promise.resolve(ds.load({ skip, take, sort, filter }));
      if (seq !== this.loadSeq) return;
      this.lastRemoteKey = key;
      this.remoteTotal.set(result.totalCount);
      this.startIndex.set(skip);
      this.windowRows.set(result.data);
    } finally {
      if (seq === this.loadSeq) this.remoteLoading.set(false);
    }
  }

  // —— AI ——
  isAiColumn(col: VxColumnDef<T>): boolean {
    return col.type === 'ai';
  }

  aiNoDataText(col: VxColumnDef<T>): string {
    return col.ai?.noDataText ?? 'No data';
  }

  private aiCacheKey(row: T, col: VxColumnDef<T>): string {
    return `${col.field}::${String(this.trackBy(row))}`;
  }

  aiCellValue(row: T, col: VxColumnDef<T>): string | null {
    return this.aiCellValues()[this.aiCacheKey(row, col)] ?? null;
  }

  isAiCellLoading(row: T, col: VxColumnDef<T>): boolean {
    return !!this.aiCellLoading()[this.aiCacheKey(row, col)];
  }

  onHeaderClick(col: VxColumnDef<T>): void {
    if (this.isAiColumn(col)) {
      this.openPromptEditor(col);
      return;
    }
    this.onSort(col);
  }

  openAssistant(): void {
    if (!this.aiEnabled()) return;
    this.assistantOpen.set(true);
  }

  openPromptEditor(col?: VxColumnDef<T>): void {
    if (!this.aiEnabled()) return;
    const aiCol =
      col && this.isAiColumn(col)
        ? col
        : this.columns().find((c) => c.type === 'ai') ?? null;
    if (aiCol) {
      this.activeAiColumnField.set(aiCol.field);
      this.aiColumnPrompt.set(aiCol.ai?.prompt ?? this.aiColumnPrompt());
    } else {
      this.activeAiColumnField.set(null);
    }
    this.promptEditorOpen.set(true);
  }

  onPromptEditorOpenChange(open: boolean): void {
    this.promptEditorOpen.set(open);
  }

  clearChat(): void {
    this.aiMessages.set([]);
  }

  clearFilter(): void {
    this.filter.set(null);
    this.filterChange.emit(null);
  }

  /** Aplica filtro externo (ex.: vx-filter-builder). */
  setFilter(next: VxFilterState | null): void {
    this.filter.set(next);
    this.filterChange.emit(next);
  }

  async onSuggestion(s: VortexAISuggestion): Promise<void> {
    if (s.command) {
      this.aiMessages.update((msgs) => [
        ...msgs,
        { role: 'user', content: s.label },
      ]);
      await this.executeCommands([s.command]);
      this.aiMessages.update((msgs) => [
        ...msgs,
        { role: 'assistant', title: 'Comando aplicado', content: s.label },
      ]);
      return;
    }
    if (s.prompt) await this.onAssistantSend(s.prompt);
  }

  async onAssistantSend(text: string): Promise<void> {
    const integration = this.aiIntegration();
    if (!this.aiEnabled() || !integration) return;

    this.aiMessages.update((msgs) => [...msgs, { role: 'user', content: text }]);
    this.aiBusy.set(true);

    try {
      let request = this.buildAIRequest(text);
      const ev: VortexAIRequestCreatingEvent = { request, cancel: false };
      this.aiRequestCreating.emit(ev);
      if (ev.cancel) {
        this.aiMessages.update((msgs) => [
          ...msgs,
          { role: 'assistant', title: 'Cancelado', content: 'Request cancelado pelo app.' },
        ]);
        return;
      }
      request = ev.request;

      const response = await integration.sendRequest(request);
      if (response.commands?.length) {
        await this.executeCommands(response.commands);
      }
      this.aiMessages.update((msgs) => [
        ...msgs,
        {
          role: 'assistant',
          title: response.title,
          content: response.text,
        },
      ]);
      this.aiRequestCompleted.emit({ text: response.text });
    } catch (error) {
      this.aiRequestFailed.emit({ error });
      this.aiMessages.update((msgs) => [
        ...msgs,
        { role: 'assistant', title: 'Erro', content: 'Falha ao consultar o assistente.' },
      ]);
    } finally {
      this.aiBusy.set(false);
    }
  }

  async onPromptRegenerate(prompt: string): Promise<void> {
    this.aiColumnPrompt.set(prompt);
    const field = this.activeAiColumnField() ?? this.columns().find((c) => c.type === 'ai')?.field;
    if (!field) return;
    await this.regenerateAiColumn(field, prompt);
  }

  onPromptApply(prompt: string): void {
    this.aiColumnPrompt.set(prompt);
    const field = this.activeAiColumnField();
    const cells = Object.entries(this.aiCellValues())
      .filter(([k]) => k.startsWith(`${field}::`))
      .map(([k, value]) => ({
        rowKey: k.slice(String(field).length + 2),
        value,
      }));

    this.promptEditorOpen.set(false);
    this.aiColumnDirty.set(false);
    this.aiCommandExecuted.emit({
      type: 'aiColumn.apply',
      payload: { prompt, field, cells },
    });
    // R5: não persiste no dataSource — app decide o que fazer com o evento
  }

  private async regenerateAiColumn(field: string, prompt: string): Promise<void> {
    const integration = this.aiIntegration();
    if (!this.aiEnabled() || !integration) return;

    const col = this.columns().find((c) => c.field === field);
    if (!col || !this.isAiColumn(col)) return;

    const cfg = this.ai();
    const dataRows = this.dataWindowRows();
    const rows = projectRowsForAI(dataRows as Record<string, unknown>[], {
      contextFields: cfg?.contextFields,
      maxRowsInContext: cfg?.maxRowsInContext ?? DEFAULT_AI.maxRowsInContext,
    });

    // Marca loading nas linhas da janela
    const loadingPatch: Record<string, boolean> = { ...this.aiCellLoading() };
    for (const row of dataRows) {
      loadingPatch[this.aiCacheKey(row, col)] = true;
    }
    this.aiCellLoading.set(loadingPatch);
    this.aiBusy.set(true);

    try {
      let request: VortexAIRequest = {
        feature: 'ai-column',
        componentType: 'data-grid',
        prompt,
        context: {
          schemaVersion: 1,
          componentType: 'data-grid',
          columns: this.columns()
            .filter((c) => c.type !== 'ai')
            .map((c) => ({ field: c.field, header: c.header })),
          sort: this.sort(),
          filter: this.filter(),
          rows,
          totalRows: this.totalRows(),
          meta: { aiColumn: field, prompt },
        },
      };

      const ev: VortexAIRequestCreatingEvent = { request, cancel: false };
      this.aiRequestCreating.emit(ev);
      if (ev.cancel) return;
      request = ev.request;

      const response = await integration.sendRequest(request);
      const cells = response.data?.cells ?? [];
      const valuesPatch: Record<string, string> = { ...this.aiCellValues() };
      for (const cell of cells) {
        valuesPatch[`${field}::${cell.rowKey}`] = cell.value;
      }
      this.aiCellValues.set(valuesPatch);
      this.aiColumnDirty.set(cells.length > 0);
      this.aiRequestCompleted.emit({ text: response.text });
      this.aiCommandExecuted.emit({
        type: 'aiColumn.regenerate',
        payload: { field, prompt, count: cells.length },
      });
    } catch (error) {
      this.aiRequestFailed.emit({ error });
    } finally {
      const clearLoading: Record<string, boolean> = { ...this.aiCellLoading() };
      for (const row of this.dataWindowRows()) {
        delete clearLoading[this.aiCacheKey(row, col)];
      }
      this.aiCellLoading.set(clearLoading);
      this.aiBusy.set(false);
    }
  }

  private buildAIRequest(userText: string): VortexAIRequest {
    const cfg = this.ai();
    const fields = cfg?.contextFields;
    const maxRows = cfg?.maxRowsInContext ?? DEFAULT_AI.maxRowsInContext;
    const rows = projectRowsForAI(
      this.dataWindowRows() as Record<string, unknown>[],
      { contextFields: fields, maxRowsInContext: maxRows }
    );

    return {
      feature: 'assistant',
      componentType: 'data-grid',
      messages: [...this.aiMessages(), { role: 'user', content: userText }],
      context: {
        schemaVersion: 1,
        componentType: 'data-grid',
        columns: this.columns().map((c) => ({ field: c.field, header: c.header })),
        sort: this.sort(),
        filter: this.filter(),
        rows,
        totalRows: this.totalRows(),
      },
      tools: [
        { name: 'filter.set', description: 'Define filtro por campo/valor' },
        { name: 'filter.clear', description: 'Limpa filtros' },
        { name: 'sort.set', description: 'Ordena por campo' },
        { name: 'group.set', description: 'Agrupa por campo (preview)' },
      ],
    };
  }

  private async executeCommands(commands: VortexAICommand[]): Promise<void> {
    for (const cmd of commands) {
      switch (cmd.type) {
        case 'filter.set': {
          const field = String(cmd.payload?.['field'] ?? '');
          const value = String(cmd.payload?.['value'] ?? '');
          const operator = (cmd.payload?.['operator'] as VxFilterState['operator']) ?? 'contains';
          if (field && value) {
            const next = { field, value, operator };
            this.filter.set(next);
            this.filterChange.emit(next);
          }
          break;
        }
        case 'filter.clear':
          this.clearFilter();
          break;
        case 'sort.set': {
          const field = String(cmd.payload?.['field'] ?? '');
          const direction = (cmd.payload?.['direction'] as 'asc' | 'desc') ?? 'asc';
          if (field) {
            const next = { field, direction };
            this.sort.set(next);
            this.sortChange.emit(next);
          }
          break;
        }
        case 'group.set': {
          const field = String(cmd.payload?.['field'] ?? '');
          if (field) {
            this.groupBy.set(field);
            this.collapsedGroups.set(new Set());
          }
          break;
        }
        default:
          break;
      }
      this.aiCommandExecuted.emit(cmd);
    }
  }

  /**
   * Largura dinâmica (paridade DX):
   * - com `width` → tamanho fixo
   * - sem `width` → flex grow (reparte o espaço restante e preenche o container)
   */
  colStyle(col: VxColumnDef<T>): Record<string, string> {
    const min = `${col.minWidth ?? 80}px`;
    if (col.width != null) {
      const w = typeof col.width === 'number' ? `${col.width}px` : String(col.width);
      return { flex: `0 0 ${w}`, width: w, minWidth: min, maxWidth: w };
    }
    return { flex: '1 1 0%', width: 'auto', minWidth: min };
  }

  /** @deprecated Prefer `colStyle` — mantido por compatibilidade interna. */
  colWidth(col: VxColumnDef<T>): string {
    if (col.width == null) return 'auto';
    return typeof col.width === 'number' ? `${col.width}px` : col.width;
  }

  trackBy = (row: T) => {
    const field = this.trackByField();
    return (row as Record<string, unknown>)[field] ?? row;
  };

  getCellValue(row: T, col: VxColumnDef<T>): unknown {
    if (col.valueGetter) return col.valueGetter(row);
    return (row as Record<string, unknown>)[col.field];
  }

  isSelected(row: T): boolean {
    return this.selected().has(this.trackBy(row));
  }

  toggleSelection(row: T): void {
    if (!this.selectable()) {
      this.rowClick.emit(row);
      return;
    }
    const key = this.trackBy(row);
    const next = new Set(this.selected());
    if (next.has(key)) next.delete(key);
    else {
      if (!this.multiSelect()) next.clear();
      next.add(key);
    }
    this.selected.set(next);
    this.selectionChange.emit(
      this.dataWindowRows().filter((r) => next.has(this.trackBy(r)))
    );
    this.rowClick.emit(row);
  }

  private dataWindowRows(): T[] {
    return this.windowRows().filter((r): r is T => !this.isGroupRow(r));
  }

  onSort(col: VxColumnDef<T>): void {
    if (this.isAiColumn(col) || col.sortable === false) return;
    const current = this.sort();
    let next: VxSortState | null = null;
    if (!current || current.field !== col.field) next = { field: col.field, direction: 'asc' };
    else if (current.direction === 'asc') next = { field: col.field, direction: 'desc' };
    else next = null;
    this.sort.set(next);
    this.sortChange.emit(next);
  }

  onGroupSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.groupBy.set(value || null);
    this.collapsedGroups.set(new Set());
  }

  clearGroup(): void {
    this.groupBy.set(null);
    this.collapsedGroups.set(new Set());
  }

  isGroupRow(row: T | VxGroupRow): row is VxGroupRow {
    return !!row && typeof row === 'object' && (row as VxGroupRow).__vxGroup === true;
  }

  asDataRow(row: T | VxGroupRow): T {
    return row as T;
  }

  groupKey(row: T | VxGroupRow): string {
    return this.isGroupRow(row) ? row.key : '';
  }

  groupLabel(row: T | VxGroupRow): string {
    return this.isGroupRow(row) ? row.label : '';
  }

  groupCount(row: T | VxGroupRow): number {
    return this.isGroupRow(row) ? row.count : 0;
  }

  isGroupExpanded(key: string): boolean {
    return !this.collapsedGroups().has(key);
  }

  toggleGroupExpand(key: string): void {
    const next = new Set(this.collapsedGroups());
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this.collapsedGroups.set(next);
  }

  trackDisplay(row: T | VxGroupRow, index: number): unknown {
    if (this.isGroupRow(row)) return `g:${row.key}`;
    return this.trackBy(row as T) ?? index;
  }

  isEditing(row: T, col: VxColumnDef<T>): boolean {
    if (!this.editable() || this.isAiColumn(col) || col.editable === false) return false;
    return this.editingKey() === String(this.trackBy(row)) && this.editingField() === col.field;
  }

  startEdit(row: T, col: VxColumnDef<T>, event: Event): void {
    if (!this.editable() || this.isAiColumn(col) || col.editable === false) return;
    event.stopPropagation();
    this.editingKey.set(String(this.trackBy(row)));
    this.editingField.set(col.field);
    this.editDraft.set(String(this.getCellValue(row, col) ?? ''));
  }

  commitEdit(): void {
    const key = this.editingKey();
    const field = this.editingField();
    if (key == null || field == null) return;
    const row = this.displayRows().find(
      (r) => !this.isGroupRow(r) && String(this.trackBy(r as T)) === key
    ) as T | undefined;
    if (!row) {
      this.cancelEdit();
      return;
    }
    const previousValue = (row as Record<string, unknown>)[field];
    const value = this.editDraft();
    (row as Record<string, unknown>)[field] = value;
    this.cellEdit.emit({ row, field, value, previousValue });
    this.cancelEdit();
    void this.refreshWindow(true);
  }

  cancelEdit(): void {
    this.editingKey.set(null);
    this.editingField.set(null);
    this.editDraft.set('');
  }

  exportCsv(): void {
    const cols = this.columns();
    const rows = this.filteredClientRows();
    exportRowsToCsv(rows, cols, 'vortex-grid.csv');
    this.exported.emit({ format: 'csv', count: rows.length });
  }
}
