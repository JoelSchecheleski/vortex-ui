import type { GalleryActive, GalleryCategory } from './models';

export const GALLERY_CATALOG: GalleryCategory[] = [
  {
    id: 'ai',
    title: 'AI-powered Extensions',
    components: [
      {
        id: 'ai-data-grid',
        title: 'Data Grid',
        badge: 'Upd',
        demos: [
          {
            id: 'grid-ai',
            title: 'AI Assistant',
            badge: 'AI',
            description: 'Assistant opt-in + AI Columns (deny by default).',
            code: {
              html: `<vx-data-grid
  [columns]="columns"
  [data]="rows"
  [ai]="aiConfig"
  [aiIntegration]="aiIntegration"
/>`,
              ts: `import { VortexMockAIIntegration, VortexAIConfig } from 'vortex-ui/ai';

readonly aiConfig: VortexAIConfig = {
  enabled: true,
  assistant: { enabled: true, title: 'AI Assistant' },
  contextFields: ['id', 'product', 'region', 'sector'],
  maxRowsInContext: 50,
};

readonly aiIntegration = new VortexMockAIIntegration();`,
            },
          },
        ],
      },
      {
        id: 'ai-html-editor',
        title: 'HTML Editor',
        badge: 'AI',
        demos: [
          {
            id: 'html-editor',
            title: 'AI-powered Text Editing',
            badge: 'AI',
            description: 'Editor rich-text com reescrita AI (vortex-ui/ai).',
            code: {
              html: `<vx-html-editor
  [(value)]="html"
  [ai]="aiConfig"
  [aiIntegration]="ai"
/>`,
              ts: `import { VxHtmlEditorComponent } from 'vortex-ui';
import { VortexMockAIIntegration } from 'vortex-ui/ai';`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'messaging',
    title: 'Messaging',
    components: [
      {
        id: 'chat',
        title: 'Chat',
        badge: 'New',
        demos: [
          {
            id: 'chat',
            title: 'Overview',
            badge: 'New',
            description: 'Lista de mensagens com compositor e evento messageSent.',
            code: {
              html: `<vx-chat [messages]="messages" [(draft)]="draft" (messageSent)="onSend($event)" />`,
              ts: `import { VxChatComponent, VxChatMessage } from 'vortex-ui';`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'grids',
    title: 'Data Grids / Data Management',
    components: [
      {
        id: 'data-grid',
        title: 'Data Grid',
        badge: 'Upd',
        demos: [
          {
            id: 'grid-overview',
            title: 'Overview',
            description: 'DataGrid com virtualização, sort, filtro e seleção.',
            code: {
              html: `<vx-data-grid
  [columns]="columns"
  [data]="rows"
  [rowHeight]="36"
  [virtualScroll]="true"
/>`,
              ts: `import { VxDataGridComponent, VxColumnDef } from 'vortex-ui';

readonly columns: VxColumnDef[] = [
  { field: 'id', header: 'ID', sortable: true },
  { field: 'product', header: 'Produto', sortable: true },
  { field: 'region', header: 'Região', sortable: true },
];

readonly rows = [ /* ... */ ];`,
            },
          },
          {
            id: 'grid-remote',
            title: 'Server-side / 1M rows',
            badge: 'Upd',
            description: 'DataSource remoto com janela virtualizada (1.000.000 linhas).',
            code: {
              html: `<vx-data-grid
  [columns]="columns"
  [dataSource]="remoteSource"
  [rowHeight]="36"
  [overscan]="10"
/>`,
              ts: `import { VxRemoteMockDataSource } from 'vortex-ui';

readonly remoteSource = new VxRemoteMockDataSource(
  1_000_000,
  createRow,
  0
);`,
            },
          },
          {
            id: 'grid-editing',
            title: 'Editing + Grouping + Export',
            badge: 'New',
            description: 'Duplo clique para editar, agrupamento e export CSV.',
            code: {
              html: `<vx-data-grid
  [columns]="columns"
  [data]="rows"
  [editable]="true"
  [exportEnabled]="true"
  (cellEdit)="onCellEdit($event)"
/>`,
              ts: `// Coluna editável
{ field: 'product', header: 'Produto', editable: true }

// Agrupar via toolbar ou AI: group.set
// Export: botão ↓ CSV na toolbar`,
            },
          },
        ],
      },
      {
        id: 'tree-list',
        title: 'Tree List',
        badge: 'New',
        demos: [
          {
            id: 'tree-list',
            title: 'Overview',
            description: 'Tabela hierárquica com expand/collapse.',
            code: {
              html: `<vx-tree-list
  [items]="items"
  [columns]="columns"
  [(expandedIds)]="expanded"
/>`,
              ts: `import { VxTreeListComponent, VxTreeListNode } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'card-view',
        title: 'Card View',
        badge: 'New',
        demos: [
          {
            id: 'card-view',
            title: 'Overview',
            description: 'Cards com busca e multi-seleção.',
            code: {
              html: `<vx-card-view
  [items]="items"
  [fields]="fields"
  [(selectedIds)]="selected"
/>`,
              ts: `import { VxCardViewComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'file-manager',
        title: 'File Manager',
        demos: [
          {
            id: 'file-manager',
            title: 'Overview',
            description: 'CRUD de arquivos, views e AI opt-in.',
            code: {
              html: `<vx-file-manager
  [items]="files"
  [ai]="aiConfig"
  [aiIntegration]="aiIntegration"
/>`,
              ts: `import { VxFileManagerComponent, VxFileItem } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'filter-builder',
        title: 'Filter Builder',
        demos: [
          {
            id: 'filter-builder',
            title: 'Overview',
            description: 'Construtor de condições integrado ao DataGrid.',
            code: {
              html: `<vx-filter-builder
  [fields]="fields"
  (applyFilter)="grid.setFilter($event)"
/>`,
              ts: `import { VxFilterBuilderComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'pivot-grid',
        title: 'Pivot Grid',
        badge: 'New',
        demos: [
          {
            id: 'pivot-grid',
            title: 'Overview',
            badge: 'New',
            description: 'Tabela pivot com agregação por linhas/colunas/valores.',
            code: {
              html: `<vx-pivot-grid [data]="rows" [fields]="fields" />`,
              ts: `import { VxPivotGridComponent, VxPivotFieldState } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'pivot-field-chooser',
        title: 'Pivot Field Chooser',
        badge: 'New',
        demos: [
          {
            id: 'pivot-field-chooser',
            title: 'Overview',
            badge: 'New',
            description: 'Arraste campos entre zonas disponíveis, linhas, colunas e valores.',
            code: {
              html: `<vx-pivot-field-chooser [fieldState]="fields" (fieldChange)="fields = $event" />`,
              ts: `import { VxPivotFieldChooserComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'editors',
    title: 'Forms & Editors',
    components: [
      {
        id: 'button',
        title: 'Button',
        demos: [
          {
            id: 'button',
            title: 'Overview',
            description: 'Variants primary, secondary, outline, ghost, danger.',
            code: {
              html: `<vx-button>Confirmar</vx-button>
<vx-button variant="outline">Cancelar</vx-button>
<vx-button variant="danger">Excluir</vx-button>`,
              ts: `import { VxButtonComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'form',
        title: 'Form',
        demos: [
          {
            id: 'form',
            title: 'Validation',
            description: 'Editors, validators e validation summary.',
            code: {
              html: `<vx-form (submitted)="onSubmit()">
  <vx-text-box label="Nome" [(value)]="name" />
  <vx-select-box label="Setor" [items]="sectors" [(value)]="sector" />
  <vx-button type="submit">Salvar</vx-button>
</vx-form>`,
              ts: `import { required, email, validateAll } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'list',
        title: 'List',
        demos: [
          {
            id: 'list',
            title: 'Overview',
            description: 'Lista com busca e multi-select.',
            code: {
              html: `<vx-list
  [items]="items"
  [searchable]="true"
  [multiSelect]="true"
  [(selectedIds)]="selected"
/>`,
              ts: `import { VxListComponent, VxListItem } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'number-box',
        title: 'Number Box',
        badge: 'New',
        demos: [
          {
            id: 'number-box',
            title: 'Overview',
            badge: 'New',
            description: 'Entrada numérica com min, max e step.',
            code: {
              html: `<vx-number-box label="Quantidade" [(value)]="qty" [min]="0" [max]="100" />`,
              ts: `import { VxNumberBoxComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'radio-group',
        title: 'Radio Group',
        badge: 'New',
        demos: [
          {
            id: 'radio-group',
            title: 'Overview',
            badge: 'New',
            description: 'Seleção única entre opções.',
            code: {
              html: `<vx-radio-group label="Setor" [items]="items" [(value)]="sector" />`,
              ts: `import { VxRadioGroupComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'slider',
        title: 'Slider',
        badge: 'New',
        demos: [
          {
            id: 'slider',
            title: 'Overview',
            badge: 'New',
            description: 'Controle deslizante com valor visível.',
            code: {
              html: `<vx-slider label="Volume" [(value)]="volume" [showValue]="true" />`,
              ts: `import { VxSliderComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'range-slider',
        title: 'Range Slider',
        badge: 'New',
        demos: [
          {
            id: 'range-slider',
            title: 'Overview',
            badge: 'New',
            description: 'Intervalo com dois controles.',
            code: {
              html: `<vx-range-slider label="Faixa" [(start)]="lo" [(end)]="hi" />`,
              ts: `import { VxRangeSliderComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'text-area',
        title: 'Text Area',
        badge: 'New',
        demos: [
          {
            id: 'text-area',
            title: 'Overview',
            badge: 'New',
            description: 'Área de texto multilinha.',
            code: {
              html: `<vx-text-area label="Observações" [(value)]="notes" [rows]="4" />`,
              ts: `import { VxTextAreaComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'color-box',
        title: 'Color Box',
        badge: 'New',
        demos: [
          {
            id: 'color-box',
            title: 'Overview',
            badge: 'New',
            description: 'Seletor de cor nativo.',
            code: {
              html: `<vx-color-box label="Cor primária" [(value)]="color" />`,
              ts: `import { VxColorBoxComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'tag-box',
        title: 'Tag Box',
        badge: 'New',
        demos: [
          {
            id: 'tag-box',
            title: 'Overview',
            badge: 'New',
            description: 'Tags com Enter para adicionar e remoção individual.',
            code: {
              html: `<vx-tag-box label="Tags" [(value)]="tags" />`,
              ts: `import { VxTagBoxComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'autocomplete',
        title: 'Autocomplete',
        badge: 'New',
        demos: [
          {
            id: 'autocomplete',
            title: 'Overview',
            badge: 'New',
            description: 'Sugestões conforme você digita.',
            code: {
              html: `<vx-autocomplete label="Produto" [items]="products" [(value)]="product" />`,
              ts: `import { VxAutocompleteComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'lookup',
        title: 'Lookup',
        badge: 'New',
        demos: [
          {
            id: 'lookup',
            title: 'Overview',
            badge: 'New',
            description: 'Dropdown com busca e seleção de item.',
            code: {
              html: `<vx-lookup label="Produto" [items]="items" [(value)]="id" />`,
              ts: `import { VxLookupComponent, VxLookupItem } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'date-range-box',
        title: 'Date Range Box',
        badge: 'New',
        demos: [
          {
            id: 'date-range-box',
            title: 'Overview',
            badge: 'New',
            description: 'Intervalo de datas início/fim.',
            code: {
              html: `<vx-date-range-box label="Período" [(start)]="start" [(end)]="end" />`,
              ts: `import { VxDateRangeBoxComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'button-group',
        title: 'Button Group',
        badge: 'New',
        demos: [
          {
            id: 'button-group',
            title: 'Overview',
            badge: 'New',
            description: 'Botões exclusivos para alternar visão.',
            code: {
              html: `<vx-button-group [items]="views" [(value)]="view" />`,
              ts: `import { VxButtonGroupComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'drop-down-button',
        title: 'Drop Down Button',
        badge: 'New',
        demos: [
          {
            id: 'drop-down-button',
            title: 'Overview',
            badge: 'New',
            description: 'Menu de ações em dropdown.',
            code: {
              html: `<vx-drop-down-button [items]="actions" (itemClick)="onAction($event)" />`,
              ts: `import { VxDropDownButtonComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'calendar',
        title: 'Calendar',
        badge: 'New',
        demos: [
          {
            id: 'calendar',
            title: 'Overview',
            badge: 'New',
            description: 'Calendário mensal com data selecionada.',
            code: {
              html: `<vx-calendar [(selected)]="day" [(viewDate)]="month" />`,
              ts: `import { VxCalendarComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'field-set',
        title: 'Field Set',
        badge: 'New',
        demos: [
          {
            id: 'field-set',
            title: 'Overview',
            badge: 'New',
            description: 'Agrupa editores com legenda.',
            code: {
              html: `<vx-field-set legend="Contato">
  <vx-text-box label="Nome" [(value)]="name" />
</vx-field-set>`,
              ts: `import { VxFieldSetComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'file-uploader',
        title: 'File Uploader',
        badge: 'New',
        demos: [
          {
            id: 'file-uploader',
            title: 'Overview',
            badge: 'New',
            description: 'Área de drop e seleção de arquivos.',
            code: {
              html: `<vx-file-uploader [multiple]="true" (filesSelected)="onFiles($event)" />`,
              ts: `import { VxFileUploaderComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation & Layout',
    components: [
      {
        id: 'tabs',
        title: 'Tabs',
        demos: [
          {
            id: 'tabs',
            title: 'Overview',
            description: 'Abas com painéis contentChildren.',
            code: {
              html: `<vx-tabs [(selected)]="tab">
  <vx-tab-panel tabId="a" label="Geral">…</vx-tab-panel>
  <vx-tab-panel tabId="b" label="Layout">…</vx-tab-panel>
</vx-tabs>`,
              ts: `import { VxTabsComponent, VxTabPanelComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'drawer',
        title: 'Drawer',
        demos: [
          {
            id: 'drawer',
            title: 'Overview',
            description: 'Drawer overlay com árvore de navegação.',
            code: {
              html: `<vx-drawer [(open)]="open" title="Menu">
  <vx-tree-view [items]="tree" />
  <div vx-drawer-content>Conteúdo</div>
</vx-drawer>`,
              ts: `import { VxDrawerComponent, VxTreeViewComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'splitter',
        title: 'Splitter',
        demos: [
          {
            id: 'splitter',
            title: 'Overview',
            description: 'Painéis redimensionáveis com teclado.',
            code: {
              html: `<vx-splitter [(ratio)]="ratio">
  <div vx-splitter-pane-1>A</div>
  <div vx-splitter-pane-2>B</div>
</vx-splitter>`,
              ts: `import { VxSplitterComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'gallery',
        title: 'Gallery',
        badge: 'New',
        demos: [
          {
            id: 'gallery',
            title: 'Overview',
            badge: 'New',
            description: 'Imagem principal e miniaturas.',
            code: {
              html: `<vx-gallery [items]="images" [(selectedId)]="activeId" />`,
              ts: `import { VxGalleryComponent, VxGalleryItem } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'tile-view',
        title: 'Tile View',
        badge: 'New',
        demos: [
          {
            id: 'tile-view',
            title: 'Overview',
            badge: 'New',
            description: 'Mosaico clicável de cartões.',
            code: {
              html: `<vx-tile-view [items]="tiles" (tileClick)="onTile($event)" />`,
              ts: `import { VxTileViewComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'scroll-view',
        title: 'Scroll View',
        badge: 'New',
        demos: [
          {
            id: 'scroll-view',
            title: 'Overview',
            badge: 'New',
            description: 'Conteúdo com rolagem vertical limitada.',
            code: {
              html: `<vx-scroll-view [maxHeight]="240">…conteúdo longo…</vx-scroll-view>`,
              ts: `import { VxScrollViewComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'pagination',
        title: 'Pagination',
        badge: 'New',
        demos: [
          {
            id: 'pagination',
            title: 'Overview',
            badge: 'New',
            description: 'Navegação por páginas.',
            code: {
              html: `<vx-pagination [totalItems]="120" [pageSize]="10" [(page)]="page" />`,
              ts: `import { VxPaginationComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'overlays',
    title: 'Overlays & Feedback',
    components: [
      {
        id: 'load-panel',
        title: 'Load Panel',
        badge: 'New',
        demos: [
          {
            id: 'load-panel',
            title: 'Overview',
            badge: 'New',
            description: 'Overlay de carregamento.',
            code: {
              html: `<vx-load-panel [visible]="loading" message="Aguarde…" />`,
              ts: `import { VxLoadPanelComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'tooltip',
        title: 'Tooltip',
        badge: 'New',
        demos: [
          {
            id: 'tooltip',
            title: 'Overview',
            badge: 'New',
            description: 'Dica ao passar o mouse.',
            code: {
              html: `<vx-tooltip text="Mais informações"><vx-button size="sm">?</vx-button></vx-tooltip>`,
              ts: `import { VxTooltipComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'popover',
        title: 'Popover',
        badge: 'New',
        demos: [
          {
            id: 'popover',
            title: 'Overview',
            badge: 'New',
            description: 'Painel flutuante com conteúdo.',
            code: {
              html: `<vx-popover title="Ajuda" [(open)]="open">Texto de apoio.</vx-popover>`,
              ts: `import { VxPopoverComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'context-menu',
        title: 'Context Menu',
        badge: 'New',
        demos: [
          {
            id: 'context-menu',
            title: 'Overview',
            badge: 'New',
            description: 'Menu no clique direito.',
            code: {
              html: `<vx-context-menu [items]="items" [(open)]="open">Área</vx-context-menu>`,
              ts: `import { VxContextMenuComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'viz',
    title: 'Data Visualization',
    components: [
      {
        id: 'chart',
        title: 'Chart',
        badge: 'Upd',
        demos: [
          {
            id: 'chart',
            title: 'Overview',
            badge: 'Upd',
            description: 'Bar, line, area, pie, funnel e polar em SVG.',
            code: {
              html: `<vx-chart [type]="type" title="Vendas" [data]="points" [width]="560" [height]="280" />`,
              ts: `import { VxChartComponent, VxChartType, VxChartPoint } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'sparkline',
        title: 'Sparkline',
        demos: [
          {
            id: 'sparkline',
            title: 'Overview',
            description: 'Mini série temporal inline.',
            code: {
              html: `<vx-sparkline [data]="[3,5,8,6,10]" />`,
              ts: `import { VxSparklineComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'circular-gauge',
        title: 'Circular Gauge',
        badge: 'New',
        demos: [
          {
            id: 'circular-gauge',
            title: 'Overview',
            badge: 'New',
            description: 'Medidor circular em SVG.',
            code: {
              html: `<vx-circular-gauge [value]="72" [max]="100" />`,
              ts: `import { VxCircularGaugeComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'linear-gauge',
        title: 'Linear Gauge',
        badge: 'New',
        demos: [
          {
            id: 'linear-gauge',
            title: 'Overview',
            badge: 'New',
            description: 'Barra horizontal de valor.',
            code: {
              html: `<vx-linear-gauge [value]="65" [min]="0" [max]="100" />`,
              ts: `import { VxLinearGaugeComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'bar-gauge',
        title: 'Bar Gauge',
        badge: 'New',
        demos: [
          {
            id: 'bar-gauge',
            title: 'Overview',
            badge: 'New',
            description: 'Várias barras comparativas.',
            code: {
              html: `<vx-bar-gauge [items]="items" [max]="100" />`,
              ts: `import { VxBarGaugeComponent, VxBarGaugeItem } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'bullet',
        title: 'Bullet',
        badge: 'New',
        demos: [
          {
            id: 'bullet',
            title: 'Overview',
            badge: 'New',
            description: 'Valor vs meta com faixas.',
            code: {
              html: `<vx-bullet [value]="72" [target]="80" [good]="85" />`,
              ts: `import { VxBulletComponent } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'funnel',
        title: 'Funnel',
        badge: 'New',
        demos: [
          {
            id: 'funnel-viz',
            title: 'Overview',
            badge: 'New',
            description: 'Funil de conversão interativo.',
            code: {
              html: `<vx-funnel [data]="stages" [width]="360" [height]="240" />`,
              ts: `import { VxFunnelComponent, VxFunnelPoint } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'tree-map',
        title: 'Tree Map',
        badge: 'New',
        demos: [
          {
            id: 'tree-map',
            title: 'Overview',
            badge: 'New',
            description: 'Retângulos proporcionais ao valor.',
            code: {
              html: `<vx-tree-map [data]="nodes" [width]="420" [height]="260" />`,
              ts: `import { VxTreeMapComponent, VxTreeMapNode } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'sankey',
        title: 'Sankey',
        badge: 'New',
        demos: [
          {
            id: 'sankey',
            title: 'Overview',
            badge: 'New',
            description: 'Fluxo entre nós.',
            code: {
              html: `<vx-sankey [nodes]="nodes" [links]="links" />`,
              ts: `import { VxSankeyComponent, VxSankeyNode, VxSankeyLink } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'diagram',
        title: 'Diagram',
        badge: 'New',
        demos: [
          {
            id: 'diagram',
            title: 'Overview',
            badge: 'New',
            description: 'Nós e arestas em SVG.',
            code: {
              html: `<vx-diagram [nodes]="nodes" [edges]="edges" />`,
              ts: `import { VxDiagramComponent, VxDiagramNode, VxDiagramEdge } from 'vortex-ui';`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'maps',
    title: 'Maps',
    components: [
      {
        id: 'map',
        title: 'Map',
        badge: 'New',
        demos: [
          {
            id: 'map',
            title: 'Overview',
            badge: 'New',
            description: 'Marcadores lat/lng em canvas simplificado.',
            code: {
              html: `<vx-map [markers]="markers" (markerClick)="onMarker($event)" />`,
              ts: `import { VxMapComponent, VxMapMarker } from 'vortex-ui';`,
            },
          },
        ],
      },
      {
        id: 'vector-map',
        title: 'Vector Map',
        badge: 'New',
        demos: [
          {
            id: 'vector-map',
            title: 'Overview',
            badge: 'New',
            description: 'Regiões SVG selecionáveis.',
            code: {
              html: `<vx-vector-map [regions]="regions" [selected]="selected" />`,
              ts: `import { VxVectorMapComponent, VxVectorRegion } from 'vortex-ui';`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'scheduling',
    title: 'Scheduling / Planning',
    components: [
      {
        id: 'scheduler',
        title: 'Scheduler',
        badge: 'Upd',
        demos: [
          {
            id: 'scheduler',
            title: 'Overview',
            badge: 'Upd',
            description: 'Visões Dia, Semana e Mês com appointments.',
            code: {
              html: `<vx-scheduler
  [appointments]="appointments"
  [(view)]="view"
/>`,
              ts: `import { VxSchedulerComponent, VxAppointment, VxSchedulerView } from 'vortex-ui';

readonly view = signal<VxSchedulerView>('month');`,
            },
          },
        ],
      },
      {
        id: 'gantt',
        title: 'Gantt',
        badge: 'New',
        demos: [
          {
            id: 'gantt',
            title: 'Overview',
            description: 'Barras de tarefa com progresso.',
            code: {
              html: `<vx-gantt [tasks]="tasks" />`,
              ts: `import { VxGanttComponent, VxGanttTask } from 'vortex-ui';`,
            },
          },
        ],
      },
    ],
  },
];

export const DEFAULT_DEMO_ID = 'grid-overview';

export function findDemo(id: string): GalleryActive | null {
  for (const category of GALLERY_CATALOG) {
    for (const component of category.components) {
      const demo = component.demos.find((d) => d.id === id);
      if (demo) return { category, component, demo };
    }
  }
  return null;
}
