import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VxButtonComponent } from '../button/button.component';
import {
  VxFileCreateEvent,
  VxFileDeleteEvent,
  VxFileItem,
  VxFileManagerPermissions,
  VxFileManagerView,
  VxFileRenameEvent,
} from './file-manager.types';
import {
  VortexAICommand,
  VortexAIConfig,
  VortexAIIntegration,
  VortexAISuggestion,
  projectRowsForAI,
  VxAIAssistantDialogComponent,
  VxAIChatMessage,
} from 'vortex-ui/ai';

export type {
  VxFileItem,
  VxFileManagerView,
  VxFileManagerPermissions,
  VxFileCreateEvent,
  VxFileRenameEvent,
  VxFileDeleteEvent,
} from './file-manager.types';

@Component({
  selector: 'vx-file-manager',
  standalone: true,
  imports: [VxButtonComponent, FormsModule, VxAIAssistantDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="vx-fm"
      [class.vx-fm--drop]="dragOver()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
    >
      <div class="vx-fm__toolbar">
        <div class="vx-fm__breadcrumbs">
          @for (crumb of breadcrumbs(); track crumb.id ?? 'root'; let last = $last) {
            <button
              type="button"
              class="vx-fm__crumb"
              [disabled]="last"
              (click)="navigateTo(crumb.id)"
            >
              {{ crumb.name }}
            </button>
            @if (!last) {
              <span class="vx-fm__sep">/</span>
            }
          }
        </div>

        <div class="vx-fm__actions">
          <div class="vx-fm__view-toggle" role="group" aria-label="Visualização">
            <button
              type="button"
              class="vx-fm__view-btn"
              [class.vx-fm__view-btn--active]="view() === 'list'"
              (click)="view.set('list')"
            >
              Lista
            </button>
            <button
              type="button"
              class="vx-fm__view-btn"
              [class.vx-fm__view-btn--active]="view() === 'details'"
              (click)="view.set('details')"
            >
              Detalhes
            </button>
            <button
              type="button"
              class="vx-fm__view-btn"
              [class.vx-fm__view-btn--active]="view() === 'thumbnails'"
              (click)="view.set('thumbnails')"
            >
              Grade
            </button>
          </div>

          @if (aiEnabled()) {
            <button
              type="button"
              class="vx-fm__ai-btn"
              aria-label="AI Assistant"
              title="AI Assistant"
              (click)="assistantOpen.set(true)"
            >
              ✦
            </button>
          }

          @if (canCreateFolder()) {
            <vx-button size="sm" variant="outline" (click)="createFolder()">Nova pasta</vx-button>
          }
          @if (canUpload()) {
            <vx-button size="sm" variant="primary" (click)="triggerUpload()">
              Upload
            </vx-button>
            <input
              #fileInputEl
              type="file"
              multiple
              hidden
              (change)="onFileInput($event)"
            />
          }
        </div>
      </div>

      @if (nameFilter()) {
        <div class="vx-fm__filter-bar">
          Busca AI: “{{ nameFilter() }}”
          <button type="button" class="vx-fm__link" (click)="nameFilter.set(null)">limpar</button>
        </div>
      }

      <div class="vx-fm__content" (contextmenu)="onContentContextMenu($event)">
        @if (loading()) {
          <div class="vx-fm__loading">Carregando arquivos...</div>
        } @else {
          <div
            class="vx-fm__list"
            [class.vx-fm__list--details]="view() === 'details'"
            [class.vx-fm__list--thumbs]="view() === 'thumbnails'"
          >
            @if (view() === 'details') {
              <div class="vx-fm__details-head" role="row">
                <span>Nome</span>
                <span>Tamanho</span>
                <span>Modificado</span>
              </div>
            }
            @for (item of visibleItems(); track item.id) {
              <div
                class="vx-fm__item"
                [class.vx-fm__item--dir]="item.isDirectory"
                [class.vx-fm__item--selected]="selected().has(item.id)"
                [class.vx-fm__item--thumb]="view() === 'thumbnails'"
                (click)="onItemClick($event, item)"
                (dblclick)="onItemDblClick(item)"
                (contextmenu)="onItemContextMenu($event, item)"
              >
                @if (view() === 'thumbnails' && item.thumbnailUrl) {
                  <img class="vx-fm__thumb" [src]="item.thumbnailUrl" [alt]="item.name" />
                } @else {
                  <span class="vx-fm__icon" aria-hidden="true">{{
                    item.isDirectory ? '📁' : '📄'
                  }}</span>
                }

                @if (renamingId() === item.id) {
                  <input
                    class="vx-fm__rename"
                    [ngModel]="renameDraft()"
                    (ngModelChange)="renameDraft.set($event)"
                    (click)="$event.stopPropagation()"
                    (keydown.enter)="commitRename()"
                    (keydown.escape)="cancelRename()"
                    (blur)="commitRename()"
                  />
                } @else {
                  <span class="vx-fm__name">{{ item.name }}</span>
                }

                @if (view() === 'details' || view() === 'list') {
                  @if (!item.isDirectory && item.size != null) {
                    <span class="vx-fm__size">{{ formatSize(item.size) }}</span>
                  } @else if (view() === 'details') {
                    <span class="vx-fm__size">—</span>
                  }
                }
                @if (view() === 'details') {
                  <span class="vx-fm__modified">{{ formatDate(item.modified) }}</span>
                }
              </div>
            } @empty {
              <div class="vx-fm__empty">
                Pasta vazia
                @if (canUpload()) {
                  <span class="vx-fm__empty-hint">Solte arquivos aqui ou use Upload</span>
                }
              </div>
            }
          </div>
        }
      </div>

      <div class="vx-fm__footer">
        <span>{{ visibleItems().length }} itens</span>
        @if (selectedCount() > 0) {
          <span>{{ selectedCount() }} selecionado(s)</span>
        }
      </div>

      @if (contextMenu(); as menu) {
        <div
          class="vx-fm__ctx"
          [style.left.px]="menu.x"
          [style.top.px]="menu.y"
          role="menu"
        >
          @if (menu.item?.isDirectory) {
            <button type="button" role="menuitem" (click)="openFromMenu()">Abrir</button>
          }
          @if (canRename() && menu.item) {
            <button type="button" role="menuitem" (click)="startRename(menu.item!)">
              Renomear
            </button>
          }
          @if (canDownload() && menu.item && !menu.item.isDirectory) {
            <button type="button" role="menuitem" (click)="downloadSelected()">Download</button>
          }
          @if (canDelete() && selectedCount() > 0) {
            <button type="button" role="menuitem" class="vx-fm__ctx--danger" (click)="deleteSelected()">
              Excluir
            </button>
          }
          <button type="button" role="menuitem" (click)="closeContextMenu()">Cancelar</button>
        </div>
      }

      @if (confirmDelete(); as payload) {
        <div class="vx-fm__modal-overlay" (click)="confirmDelete.set(null)">
          <div class="vx-fm__modal" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
            <h3>Excluir {{ payload.length }} item(ns)?</h3>
            <p>Esta ação emite o evento para o backend — confirme para continuar.</p>
            <div class="vx-fm__modal-actions">
              <vx-button size="sm" variant="ghost" (click)="confirmDelete.set(null)">Cancelar</vx-button>
              <vx-button size="sm" variant="danger" (click)="confirmDeleteNow()">Excluir</vx-button>
            </div>
          </div>
        </div>
      }
    </div>

    @if (aiEnabled()) {
      <vx-ai-assistant-dialog
        [open]="assistantOpen()"
        (openChange)="assistantOpen.set($event)"
        title="AI Assistant"
        [messages]="aiMessages()"
        [suggestions]="aiSuggestions()"
        [busy]="aiBusy()"
        (sendMessage)="onAssistantSend($event)"
        (suggestionSelect)="onSuggestion($event)"
        (clear)="aiMessages.set([])"
      />
    }
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
      min-height: 360px;
      position: relative;
    }

    .vx-fm {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 360px;
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-lg);
      background: var(--vx-color-surface);
      overflow: hidden;
      font-family: var(--vx-font-sans);
      position: relative;
    }

    .vx-fm--drop {
      outline: 2px dashed var(--vx-color-primary);
      outline-offset: -4px;
    }

    .vx-fm__toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--vx-space-3) var(--vx-space-4);
      border-bottom: 1px solid var(--vx-color-border);
      background: var(--vx-color-bg-subtle);
      gap: var(--vx-space-3);
      flex-wrap: wrap;
      flex-shrink: 0;
    }

    .vx-fm__breadcrumbs {
      display: flex;
      align-items: center;
      gap: var(--vx-space-1);
      flex: 1;
      min-width: 0;
      overflow: auto;
    }

    .vx-fm__crumb {
      background: none;
      border: none;
      color: var(--vx-color-primary);
      cursor: pointer;
      font-size: var(--vx-font-size-sm);
      font-family: inherit;
      padding: var(--vx-space-1) var(--vx-space-2);
      border-radius: var(--vx-radius-sm);
      white-space: nowrap;
    }
    .vx-fm__crumb:hover:not(:disabled) {
      background: var(--vx-color-bg-hover);
    }
    .vx-fm__crumb:disabled {
      color: var(--vx-color-text);
      cursor: default;
      font-weight: var(--vx-font-weight-medium);
    }

    .vx-fm__sep {
      color: var(--vx-color-text-muted);
    }

    .vx-fm__actions {
      display: flex;
      align-items: center;
      gap: var(--vx-space-2);
      flex-wrap: wrap;
    }

    .vx-fm__view-toggle {
      display: inline-flex;
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      overflow: hidden;
    }

    .vx-fm__view-btn {
      border: none;
      background: var(--vx-color-surface);
      color: var(--vx-color-text-secondary);
      font-size: var(--vx-font-size-xs);
      font-family: inherit;
      padding: 0.35rem 0.6rem;
      cursor: pointer;
    }
    .vx-fm__view-btn--active {
      background: var(--vx-color-primary-subtle);
      color: var(--vx-color-primary-ink, var(--vx-color-primary));
      font-weight: var(--vx-font-weight-medium);
    }

    .vx-fm__ai-btn {
      width: 2rem;
      height: 2rem;
      border-radius: 999px;
      border: 1px solid var(--vx-color-border);
      background: var(--vx-color-surface);
      color: var(--vx-color-primary);
      cursor: pointer;
    }

    .vx-fm__filter-bar {
      padding: var(--vx-space-2) var(--vx-space-4);
      font-size: var(--vx-font-size-xs);
      background: var(--vx-color-primary-subtle);
      color: var(--vx-color-primary-ink, var(--vx-color-text));
      display: flex;
      gap: var(--vx-space-2);
      align-items: center;
    }

    .vx-fm__link {
      border: none;
      background: none;
      color: inherit;
      text-decoration: underline;
      cursor: pointer;
      font: inherit;
      padding: 0;
    }

    .vx-fm__content {
      flex: 1;
      overflow: auto;
      padding: var(--vx-space-2);
      min-height: 0;
    }

    .vx-fm__list {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .vx-fm__list--thumbs {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: var(--vx-space-2);
    }

    .vx-fm__details-head {
      display: grid;
      grid-template-columns: 1fr 100px 140px;
      gap: var(--vx-space-3);
      padding: var(--vx-space-2) var(--vx-space-3);
      font-size: var(--vx-font-size-xs);
      color: var(--vx-color-text-muted);
      font-weight: var(--vx-font-weight-medium);
      border-bottom: 1px solid var(--vx-color-border);
    }

    .vx-fm__list--details .vx-fm__item {
      display: grid;
      grid-template-columns: 1.5rem 1fr 100px 140px;
      align-items: center;
    }

    .vx-fm__item {
      display: flex;
      align-items: center;
      gap: var(--vx-space-3);
      padding: var(--vx-space-2) var(--vx-space-3);
      border-radius: var(--vx-radius-md);
      cursor: pointer;
      user-select: none;
    }
    .vx-fm__item:hover {
      background: var(--vx-color-bg-hover);
    }
    .vx-fm__item--selected {
      background: var(--vx-color-primary-subtle);
    }
    .vx-fm__item--thumb {
      flex-direction: column;
      text-align: center;
      padding: var(--vx-space-3);
      border: 1px solid var(--vx-color-border);
      min-height: 110px;
    }

    .vx-fm__icon {
      font-size: 1.25rem;
      width: 1.5rem;
      text-align: center;
    }

    .vx-fm__thumb {
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: var(--vx-radius-sm);
    }

    .vx-fm__name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--vx-color-text);
      font-size: var(--vx-font-size-sm);
      min-width: 0;
    }

    .vx-fm__item--thumb .vx-fm__name {
      flex: none;
      width: 100%;
      font-size: var(--vx-font-size-xs);
    }

    .vx-fm__rename {
      flex: 1;
      font: inherit;
      border: 1px solid var(--vx-color-border-focus);
      border-radius: var(--vx-radius-sm);
      padding: 0.2rem 0.4rem;
      min-width: 0;
    }

    .vx-fm__size,
    .vx-fm__modified {
      color: var(--vx-color-text-muted);
      font-size: var(--vx-font-size-xs);
      white-space: nowrap;
    }

    .vx-fm__loading,
    .vx-fm__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--vx-space-2);
      height: 200px;
      color: var(--vx-color-text-muted);
      font-size: var(--vx-font-size-sm);
    }

    .vx-fm__empty-hint {
      font-size: var(--vx-font-size-xs);
    }

    .vx-fm__footer {
      display: flex;
      justify-content: space-between;
      padding: var(--vx-space-2) var(--vx-space-4);
      border-top: 1px solid var(--vx-color-border);
      background: var(--vx-color-bg-subtle);
      font-size: var(--vx-font-size-xs);
      color: var(--vx-color-text-secondary);
      flex-shrink: 0;
    }

    .vx-fm__ctx {
      position: fixed;
      z-index: var(--vx-z-dropdown);
      min-width: 160px;
      background: var(--vx-color-surface);
      border: 1px solid var(--vx-color-border);
      border-radius: var(--vx-radius-md);
      box-shadow: var(--vx-shadow-lg);
      padding: var(--vx-space-1);
      display: flex;
      flex-direction: column;
    }

    .vx-fm__ctx button {
      border: none;
      background: transparent;
      text-align: left;
      padding: 0.45rem 0.75rem;
      font: inherit;
      font-size: var(--vx-font-size-sm);
      color: var(--vx-color-text);
      border-radius: var(--vx-radius-sm);
      cursor: pointer;
    }
    .vx-fm__ctx button:hover {
      background: var(--vx-color-bg-hover);
    }
    .vx-fm__ctx--danger {
      color: var(--vx-color-danger) !important;
    }

    .vx-fm__modal-overlay {
      position: absolute;
      inset: 0;
      background: rgb(0 0 0 / 0.35);
      display: grid;
      place-items: center;
      z-index: var(--vx-z-modal);
      padding: var(--vx-space-4);
    }

    .vx-fm__modal {
      background: var(--vx-color-surface);
      border-radius: var(--vx-radius-lg);
      padding: var(--vx-space-5);
      max-width: 360px;
      width: 100%;
      box-shadow: var(--vx-shadow-xl);
    }
    .vx-fm__modal h3 {
      margin: 0 0 var(--vx-space-2);
      font-size: var(--vx-font-size-md);
    }
    .vx-fm__modal p {
      margin: 0 0 var(--vx-space-4);
      color: var(--vx-color-text-secondary);
      font-size: var(--vx-font-size-sm);
    }
    .vx-fm__modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--vx-space-2);
    }
  `,
})
export class VxFileManagerComponent {
  readonly items = input<VxFileItem[]>([]);
  readonly loading = input(false);
  readonly permissions = input<VxFileManagerPermissions>({});
  readonly ai = input<VortexAIConfig | null>(null);
  readonly aiIntegration = input<VortexAIIntegration | null>(null);

  readonly selectionChange = output<VxFileItem[]>();
  readonly navigate = output<string | null>();
  readonly open = output<VxFileItem>();
  readonly refresh = output<void>();
  readonly create = output<VxFileCreateEvent>();
  readonly rename = output<VxFileRenameEvent>();
  readonly delete = output<VxFileDeleteEvent>();
  readonly download = output<VxFileItem[]>();
  readonly upload = output<{ files: File[]; parentId: string | null }>();
  readonly aiCommandExecuted = output<VortexAICommand>();

  private readonly fileInputEl = viewChild<ElementRef<HTMLInputElement>>('fileInputEl');

  /** Cópia de trabalho — sincroniza com input e aplica CRUD local + eventos. */
  readonly workingItems = signal<VxFileItem[]>([]);
  readonly selected = signal<Set<string>>(new Set());
  readonly currentFolderId = signal<string | null>(null);
  readonly view = signal<VxFileManagerView>('list');
  readonly dragOver = signal(false);
  readonly renamingId = signal<string | null>(null);
  readonly renameDraft = signal('');
  readonly contextMenu = signal<{ x: number; y: number; item: VxFileItem | null } | null>(null);
  readonly confirmDelete = signal<VxFileItem[] | null>(null);
  readonly nameFilter = signal<string | null>(null);
  readonly foldersOnly = signal(false);

  readonly assistantOpen = signal(false);
  readonly aiMessages = signal<VxAIChatMessage[]>([]);
  readonly aiBusy = signal(false);

  readonly aiEnabled = computed(() => !!this.ai()?.enabled);
  readonly selectedCount = computed(() => this.selected().size);

  readonly canUpload = computed(
    () => !this.permissions().readOnly && this.permissions().allowUpload !== false
  );
  readonly canDownload = computed(
    () => !this.permissions().readOnly && this.permissions().allowDownload !== false
  );
  readonly canRename = computed(
    () => !this.permissions().readOnly && this.permissions().allowRename !== false
  );
  readonly canDelete = computed(
    () => !this.permissions().readOnly && this.permissions().allowDelete !== false
  );
  readonly canCreateFolder = computed(
    () => !this.permissions().readOnly && this.permissions().allowCreateFolder !== false
  );

  readonly currentItems = computed(() => {
    const folderId = this.currentFolderId();
    return this.workingItems().filter((i) => (i.parentId ?? null) === folderId);
  });

  readonly visibleItems = computed(() => {
    let rows = this.currentItems();
    if (this.foldersOnly()) rows = rows.filter((i) => i.isDirectory);
    const q = this.nameFilter()?.toLowerCase().trim();
    if (q) rows = rows.filter((i) => i.name.toLowerCase().includes(q));
    return rows.slice().sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
      return a.name.localeCompare(b.name, 'pt-BR');
    });
  });

  readonly breadcrumbs = computed(() => {
    const crumbs: Array<{ id: string | null; name: string }> = [{ id: null, name: 'Raiz' }];
    let id = this.currentFolderId();
    const chain: VxFileItem[] = [];
    const byId = new Map(this.workingItems().map((i) => [i.id, i]));
    while (id) {
      const folder = byId.get(id);
      if (!folder) break;
      chain.unshift(folder);
      id = (folder.parentId as string | null) ?? null;
    }
    for (const f of chain) crumbs.push({ id: f.id, name: f.name });
    return crumbs;
  });

  readonly aiSuggestions = computed<VortexAISuggestion[]>(() => [
    { id: 'help', label: 'Ajuda', prompt: 'ajuda' },
    {
      id: 'folders',
      label: 'Mostrar só pastas',
      command: { type: 'filter.foldersOnly', payload: { value: true } },
    },
    {
      id: 'search-pdf',
      label: 'Buscar PDF',
      command: { type: 'filter.name', payload: { value: '.pdf' } },
    },
    {
      id: 'clear',
      label: 'Limpar filtros',
      command: { type: 'filter.clear' },
    },
  ]);

  constructor() {
    effect(() => {
      this.workingItems.set(this.items().map((i) => ({ ...i })));
    });
  }

  onItemClick(event: MouseEvent, item: VxFileItem): void {
    this.closeContextMenu();
    const next = new Set(this.selected());
    if (event.ctrlKey || event.metaKey) {
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
    } else {
      next.clear();
      next.add(item.id);
    }
    this.selected.set(next);
    this.selectionChange.emit(this.workingItems().filter((i) => next.has(i.id)));
  }

  onItemDblClick(item: VxFileItem): void {
    if (item.isDirectory) {
      this.currentFolderId.set(item.id);
      this.selected.set(new Set());
      this.navigate.emit(item.id);
    } else {
      this.open.emit(item);
    }
  }

  navigateTo(id: string | null): void {
    this.currentFolderId.set(id);
    this.selected.set(new Set());
    this.navigate.emit(id);
  }

  createFolder(): void {
    const name = `Nova pasta ${this.currentItems().filter((i) => i.isDirectory).length + 1}`;
    const parentId = this.currentFolderId();
    const id = `dir-${Date.now()}`;
    const item: VxFileItem = {
      id,
      name,
      isDirectory: true,
      parentId,
      modified: new Date().toISOString(),
    };
    this.workingItems.update((rows) => [...rows, item]);
    this.create.emit({ name, isDirectory: true, parentId });
    this.startRename(item);
  }

  triggerUpload(): void {
    this.fileInputEl()?.nativeElement.click();
  }

  onFileInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const files = Array.from(inputEl.files ?? []);
    if (files.length) this.addFiles(files);
    inputEl.value = '';
  }

  onDragOver(event: DragEvent): void {
    if (!this.canUpload()) return;
    event.preventDefault();
    this.dragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    if (!this.canUpload()) return;
    const files = Array.from(event.dataTransfer?.files ?? []);
    if (files.length) this.addFiles(files);
  }

  private addFiles(files: File[]): void {
    const parentId = this.currentFolderId();
    const now = new Date().toISOString();
    const created = files.map((file, idx) => {
      const item: VxFileItem = {
        id: `file-${Date.now()}-${idx}`,
        name: file.name,
        isDirectory: false,
        size: file.size,
        parentId,
        modified: now,
        mimeType: file.type,
      };
      this.create.emit({ name: file.name, isDirectory: false, parentId, file });
      return item;
    });
    this.workingItems.update((rows) => [...rows, ...created]);
    this.upload.emit({ files, parentId });
  }

  startRename(item: VxFileItem): void {
    if (!this.canRename()) return;
    this.renamingId.set(item.id);
    this.renameDraft.set(item.name);
    this.closeContextMenu();
  }

  cancelRename(): void {
    this.renamingId.set(null);
  }

  commitRename(): void {
    const id = this.renamingId();
    if (!id) return;
    const newName = this.renameDraft().trim();
    const item = this.workingItems().find((i) => i.id === id);
    this.renamingId.set(null);
    if (!item || !newName || newName === item.name) return;
    this.workingItems.update((rows) =>
      rows.map((r) => (r.id === id ? { ...r, name: newName } : r))
    );
    this.rename.emit({ item, newName });
  }

  deleteSelected(): void {
    this.closeContextMenu();
    const items = this.workingItems().filter((i) => this.selected().has(i.id));
    if (!items.length || !this.canDelete()) return;
    this.confirmDelete.set(items);
  }

  confirmDeleteNow(): void {
    const items = this.confirmDelete();
    this.confirmDelete.set(null);
    if (!items?.length) return;
    const ids = new Set(items.map((i) => i.id));
    this.workingItems.update((rows) => rows.filter((r) => !ids.has(r.id)));
    this.selected.set(new Set());
    this.delete.emit({ items });
  }

  downloadSelected(): void {
    this.closeContextMenu();
    const items = this.workingItems().filter(
      (i) => this.selected().has(i.id) && !i.isDirectory
    );
    if (items.length) this.download.emit(items);
  }

  onItemContextMenu(event: MouseEvent, item: VxFileItem): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.selected().has(item.id)) {
      this.selected.set(new Set([item.id]));
      this.selectionChange.emit([item]);
    }
    this.contextMenu.set({ x: event.clientX, y: event.clientY, item });
  }

  onContentContextMenu(event: MouseEvent): void {
    // evita menu nativo na área vazia
    if ((event.target as HTMLElement).closest('.vx-fm__item')) return;
    event.preventDefault();
    this.contextMenu.set({ x: event.clientX, y: event.clientY, item: null });
  }

  closeContextMenu(): void {
    this.contextMenu.set(null);
  }

  openFromMenu(): void {
    const item = this.contextMenu()?.item;
    this.closeContextMenu();
    if (item) this.onItemDblClick(item);
  }

  // —— AI ——
  async onSuggestion(s: VortexAISuggestion): Promise<void> {
    if (s.command) {
      this.aiMessages.update((m) => [...m, { role: 'user', content: s.label }]);
      this.executeCommands([s.command]);
      this.aiMessages.update((m) => [
        ...m,
        { role: 'assistant', title: 'Comando aplicado', content: s.label },
      ]);
      return;
    }
    if (s.prompt) await this.onAssistantSend(s.prompt);
  }

  async onAssistantSend(text: string): Promise<void> {
    const integration = this.aiIntegration();
    if (!this.aiEnabled() || !integration) return;
    this.aiMessages.update((m) => [...m, { role: 'user', content: text }]);
    this.aiBusy.set(true);
    try {
      const lower = text.toLowerCase();
      // Intents locais de FM (além do mock genérico)
      if (lower.includes('pasta') && (lower.includes('só') || lower.includes('apenas') || lower.includes('only'))) {
        this.executeCommands([{ type: 'filter.foldersOnly', payload: { value: true } }]);
        this.aiMessages.update((m) => [
          ...m,
          { role: 'assistant', title: 'Filtro', content: 'Mostrando apenas pastas.' },
        ]);
        return;
      }
      if (lower.startsWith('buscar ') || lower.startsWith('search ')) {
        const q = text.replace(/^(buscar|search)\s+/i, '').trim();
        this.executeCommands([{ type: 'filter.name', payload: { value: q } }]);
        this.aiMessages.update((m) => [
          ...m,
          { role: 'assistant', title: 'Busca', content: `Filtro por nome: ${q}` },
        ]);
        return;
      }

      const rows = projectRowsForAI(
        this.visibleItems().map((i) => ({
          id: i.id,
          name: i.name,
          isDirectory: i.isDirectory,
          size: i.size ?? null,
        })),
        {
          contextFields: this.ai()?.contextFields ?? ['id', 'name', 'isDirectory', 'size'],
          maxRowsInContext: this.ai()?.maxRowsInContext ?? 50,
        }
      );

      const response = await integration.sendRequest({
        feature: 'assistant',
        componentType: 'file-manager',
        messages: [...this.aiMessages()],
        context: {
          schemaVersion: 1,
          componentType: 'file-manager',
          rows,
          totalRows: this.visibleItems().length,
          meta: { folderId: this.currentFolderId() },
        },
      });

      // Map generic filter.set from mock → name filter when field is name
      const cmds = (response.commands ?? []).map((c) => {
        if (c.type === 'filter.set' && c.payload?.['field'] === 'name') {
          return { type: 'filter.name', payload: { value: c.payload['value'] } };
        }
        return c;
      });
      if (cmds.length) this.executeCommands(cmds);
      this.aiMessages.update((m) => [
        ...m,
        { role: 'assistant', title: response.title, content: response.text },
      ]);
    } finally {
      this.aiBusy.set(false);
    }
  }

  private executeCommands(commands: VortexAICommand[]): void {
    for (const cmd of commands) {
      switch (cmd.type) {
        case 'filter.foldersOnly':
          this.foldersOnly.set(!!cmd.payload?.['value']);
          break;
        case 'filter.name':
          this.nameFilter.set(String(cmd.payload?.['value'] ?? ''));
          break;
        case 'filter.clear':
          this.nameFilter.set(null);
          this.foldersOnly.set(false);
          break;
        default:
          break;
      }
      this.aiCommandExecuted.emit(cmd);
    }
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  formatDate(value?: Date | string): string {
    if (!value) return '—';
    const d = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('pt-BR');
  }
}
