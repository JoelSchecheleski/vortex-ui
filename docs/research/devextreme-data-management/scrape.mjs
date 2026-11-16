/**
 * Scraper: DevExtreme Angular Widgets Gallery — Data Grids / Data Management
 * Fonte: https://js.devexpress.com/Angular/Demos/WidgetsGallery/
 * Tema fixo: FluentBlueLight
 *
 * Saídas:
 *  - catalog.json          (estrutura completa + metadados)
 *  - images/NNN-*.png      (screenshots sequenciais)
 *  - raw/*.json            (metadados por demo)
 *  - PRD-DATA-MANAGEMENT.md (documento AI-ready)
 *  - IMAGE-MANIFEST.json   (índice seq → arquivo)
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://js.devexpress.com/Angular/Demos/WidgetsGallery/Demo';
const THEME = 'FluentBlueLight';
const OUT = __dirname;
const IMG = path.join(OUT, 'images');
const RAW = path.join(OUT, 'raw');

fs.mkdirSync(IMG, { recursive: true });
fs.mkdirSync(RAW, { recursive: true });

/** Hierarquia espelhando o menu DX + títulos PT do usuário */
const TREE = [
  {
    id: 'data-grid',
    en: 'Data Grid',
    pt: 'Grade de dados',
    widget: 'DataGrid',
    sections: [
      {
        id: 'overview',
        en: 'Overview',
        pt: 'Visão geral',
        demos: [{ slug: 'Overview', en: 'Overview', pt: 'Visão geral' }],
      },
      {
        id: 'data-binding',
        en: 'Data Binding',
        pt: 'Vinculação de dados',
        demos: [
          { slug: 'SimpleArray', en: 'Simple Array', pt: 'Matriz simples' },
          { slug: 'AjaxRequest', en: 'JSON Data', pt: 'Dados JSON' },
          { slug: 'CustomDataSource', en: 'Custom Data Source', pt: 'Fonte de dados personalizada' },
          { slug: 'WebAPIService', en: 'Web API Service', pt: 'Serviço de API Web' },
          { slug: 'SignalRService', en: 'SignalR Service', pt: 'Serviço SignalR' },
          { slug: 'RealTimeUpdates', en: 'Real-Time Updates', pt: 'Atualizações em tempo real' },
        ],
      },
      {
        id: 'filtering',
        en: 'Filtering',
        pt: 'Filtragem',
        demos: [
          { slug: 'Filtering', en: 'Filtering', pt: 'Filtragem' },
          { slug: 'FilteringAPI', en: 'Filtering API', pt: 'API de filtragem' },
          { slug: 'FilterPanel', en: 'Filter Panel', pt: 'Painel de filtro' },
          { slug: 'ColumnHeaderFilter', en: 'Column Header Filter', pt: 'Filtro de cabeçalho de coluna' },
          { slug: 'SemanticSearch', en: 'Semantic Search', pt: 'Busca Semântica', ai: true },
        ],
      },
      {
        id: 'sorting',
        en: 'Sorting',
        pt: 'Classificação',
        demos: [{ slug: 'MultipleSorting', en: 'Sorting', pt: 'Classificação' }],
      },
      {
        id: 'editing',
        en: 'Editing',
        pt: 'Edição',
        demos: [
          { slug: 'RowEditing', en: 'Row Editing', pt: 'Edição de linhas' },
          { slug: 'CellEditing', en: 'Cell Editing', pt: 'Edição de células' },
          { slug: 'BatchEditing', en: 'Batch Editing', pt: 'Edição em lote' },
          { slug: 'FormEditing', en: 'Form Editing', pt: 'Edição de formulários' },
          { slug: 'PopupEditing', en: 'Popup Editing', pt: 'Edição Popup' },
          { slug: 'CustomEditors', en: 'Custom Editors', pt: 'Editores personalizados' },
          { slug: 'DataValidation', en: 'Data Validation', pt: 'Validação de dados' },
          { slug: 'CascadingLookups', en: 'Cascading Lookups', pt: 'Pesquisas em cascata' },
          { slug: 'CollaborativeEditing', en: 'Collaborative Editing', pt: 'Edição Colaborativa' },
          { slug: 'RemoteCRUDOperations', en: 'Remote CRUD Operations', pt: 'Operações CRUD remotas' },
          { slug: 'BatchUpdateRequest', en: 'Batch Update Request', pt: 'Solicitação de atualização em lote' },
          { slug: 'EditStateManagement', en: 'Edit State Management', pt: 'Editar gerenciamento de estado' },
          { slug: 'NewRecordPosition', en: 'New Record Position', pt: 'Nova posição recorde' },
        ],
      },
      {
        id: 'grouping',
        en: 'Grouping',
        pt: 'Agrupamento',
        demos: [
          { slug: 'RecordGrouping', en: 'Record Grouping', pt: 'Agrupamento de Registros' },
          { slug: 'RemoteGrouping', en: 'Remote Grouping', pt: 'Agrupamento remoto' },
        ],
      },
      {
        id: 'selection',
        en: 'Selection',
        pt: 'Seleção',
        demos: [
          { slug: 'RowSelection', en: 'Row Selection', pt: 'Seleção de linha' },
          { slug: 'MultipleRecordSelectionModes', en: 'Multiple Record Selection', pt: 'Seleção de múltiplos registros' },
          { slug: 'MultipleRecordSelectionAPI', en: 'Multiple Record Selection API', pt: 'API de seleção de múltiplos registros' },
          { slug: 'DeferredSelection', en: 'Deferred Selection', pt: 'Seleção Diferida' },
          { slug: 'FocusedRow', en: 'Focused Row', pt: 'Linha focada' },
        ],
      },
      {
        id: 'paging',
        en: 'Paging',
        pt: 'Chamada',
        demos: [{ slug: 'RecordPaging', en: 'Paging', pt: 'Chamada (paginação)' }],
      },
      {
        id: 'scrolling',
        en: 'Scrolling',
        pt: 'Rolagem',
        demos: [
          { slug: 'VirtualScrolling', en: 'Local Virtual Scrolling', pt: 'Rolagem virtual local' },
          { slug: 'RemoteVirtualScrolling', en: 'Remote Virtual Scrolling', pt: 'Rolagem virtual remota' },
          { slug: 'HorizontalVirtualScrolling', en: 'Horizontal Virtual Scrolling', pt: 'Rolagem virtual horizontal' },
          { slug: 'InfiniteScrolling', en: 'Infinite Scrolling', pt: 'Rolagem infinita' },
        ],
      },
      {
        id: 'columns',
        en: 'Columns',
        pt: 'Colunas',
        demos: [
          { slug: 'AutoPopulatedColumns', en: 'Auto-Populated Columns', pt: 'Colunas preenchidas automaticamente' },
          { slug: 'MultiRowHeadersBands', en: 'Multi-Level Headers (Bands)', pt: 'Cabeçalhos (bandas) de vários níveis' },
          { slug: 'ColumnReordering', en: 'Column Reordering', pt: 'Reordenação de colunas' },
          { slug: 'ColumnResizing', en: 'Column Resizing', pt: 'Redimensionamento de colunas' },
          { slug: 'FixedAndStickyColumns', en: 'Fixed and Sticky Columns', pt: 'Colunas fixas e adesivas' },
          { slug: 'CommandColumnConfiguration', en: 'Command Column Configuration', pt: 'Configuração da coluna de comando' },
          { slug: 'ColumnChooser', en: 'Column Chooser', pt: 'Seletor de colunas' },
          { slug: 'AIColumns', en: 'AI Columns', pt: 'Colunas de IA', ai: true },
        ],
      },
      {
        id: 'ai-assistant',
        en: 'AI Assistant',
        pt: 'Assistente de IA',
        demos: [{ slug: 'AIAssistant', en: 'AI Assistant', pt: 'Assistente de IA', ai: true }],
      },
      {
        id: 'master-detail',
        en: 'Master Detail',
        pt: 'Detalhe mestre',
        demos: [
          { slug: 'MasterDetailView', en: 'Master-Detail View', pt: 'Vista mestre-detalhe' },
          { slug: 'MasterDetailAPI', en: 'Master-Detail API', pt: 'API Mestre-Detalhe' },
          { slug: 'AIPoweredDetailView', en: 'AI-powered Detail View', pt: 'Visão detalhada com inteligência artificial', ai: true },
          { slug: 'AdvancedMasterDetailView', en: 'Advanced Master-Detail View', pt: 'Vista mestre-detalhe avançada' },
        ],
      },
      {
        id: 'summaries',
        en: 'Data Summaries',
        pt: 'Resumos de dados',
        demos: [
          { slug: 'GridSummaries', en: 'Total Summaries', pt: 'Resumos totais' },
          { slug: 'GroupSummaries', en: 'Group Summaries', pt: 'Resumos de grupo' },
          { slug: 'CustomSummaries', en: 'Custom Summaries', pt: 'Resumos personalizados' },
          { slug: 'RecalculateWhileEditing', en: 'Recalculate While Editing', pt: 'Recalcular durante a edição' },
        ],
      },
      {
        id: 'dnd',
        en: 'Drag & Drop',
        pt: 'Arrastar e soltar',
        demos: [
          { slug: 'LocalReordering', en: 'Local Reordering', pt: 'Reabastecimento local (reordenação local)' },
          { slug: 'RemoteReordering', en: 'Remote Reordering', pt: 'Reordenação remota' },
          { slug: 'DnDBetweenGrids', en: 'Drag & Drop Between Two Grids', pt: 'Arrastar e soltar entre duas grades' },
        ],
      },
      {
        id: 'export-pdf',
        en: 'Export to PDF',
        pt: 'Exportar para PDF',
        demos: [
          { slug: 'PDFOverview', en: 'Overview', pt: 'Visão geral' },
          { slug: 'PDFCellCustomization', en: 'Cell Customization', pt: 'Personalização de células' },
          { slug: 'PDFHeaderAndFooter', en: 'Header and Footer', pt: 'Cabeçalho e rodapé' },
          { slug: 'PDFExportMultipleGrids', en: 'Multiple Grids Export', pt: 'Exportação de múltiplas grades' },
          { slug: 'PDFExportImages', en: 'Image Export', pt: 'Exportar imagem' },
        ],
      },
      {
        id: 'export-excel',
        en: 'Export to Excel',
        pt: 'Exportar para o Excel',
        demos: [
          { slug: 'ExcelJSOverview', en: 'Overview', pt: 'Visão geral' },
          { slug: 'ExcelJSCellCustomization', en: 'Cell Customization', pt: 'Personalização de células' },
          { slug: 'ExcelJSHeaderAndFooter', en: 'Header and Footer', pt: 'Cabeçalho e rodapé' },
          { slug: 'ExcelJSExportMultipleGrids', en: 'Multiple Grids Export', pt: 'Exportação de múltiplas grades' },
          { slug: 'ExcelJSExportImages', en: 'Image Export', pt: 'Exportar imagem' },
        ],
      },
      {
        id: 'appearance',
        en: 'Appearance',
        pt: 'Aparência',
        demos: [{ slug: 'Appearance', en: 'Appearance', pt: 'Aparência' }],
      },
      {
        id: 'customization',
        en: 'Customization',
        pt: 'Personalização',
        demos: [
          { slug: 'Column', en: 'Column', pt: 'Coluna' },
          { slug: 'Row', en: 'Row', pt: 'Linha' },
          { slug: 'Cell', en: 'Cell', pt: 'Célula' },
          { slug: 'Toolbar', en: 'Toolbar', pt: 'Barra de ferramentas' },
        ],
      },
      {
        id: 'state',
        en: 'State Persistence',
        pt: 'Persistência do Estado',
        demos: [{ slug: 'StatePersistence', en: 'State Persistence', pt: 'Persistência do Estado' }],
      },
      {
        id: 'adaptability',
        en: 'Adaptability',
        pt: 'Adaptabilidade',
        demos: [
          { slug: 'GridAdaptabilityOverview', en: 'Overview', pt: 'Visão geral' },
          { slug: 'ColumnsHidingPriority', en: 'Columns Hiding Priority', pt: 'Colunas Ocultando Prioridade' },
        ],
      },
      {
        id: 'keyboard',
        en: 'Keyboard Navigation',
        pt: 'Navegação por teclado',
        demos: [
          { slug: 'KeyboardNavigation', en: 'Keyboard Navigation', pt: 'Navegação por teclado' },
          { slug: 'CustomizeKeyboardNavigation', en: 'Customize Keyboard Navigation', pt: 'Personalizar a navegação do teclado' },
        ],
      },
      {
        id: 'rtl',
        en: 'Right-To-Left Support',
        pt: 'Suporte da direita para a esquerda',
        demos: [{ slug: 'RightToLeftSupport', en: 'Right-To-Left Support', pt: 'Suporte da direita para a esquerda' }],
      },
    ],
  },
  {
    id: 'tree-list',
    en: 'Tree List',
    pt: 'Lista de árvores',
    widget: 'TreeList',
    sections: [
      {
        id: 'overview',
        en: 'Overview',
        pt: 'Visão geral',
        demos: [{ slug: 'Overview', en: 'Overview', pt: 'Visão geral' }],
      },
      {
        id: 'data-binding',
        en: 'Data Binding',
        pt: 'Vinculação de dados',
        demos: [
          { slug: 'SimpleArrayPlainStructure', en: 'Simple Array: Plain Structure', pt: 'Matriz simples: estrutura simples' },
          { slug: 'SimpleArrayHierarchicalStructure', en: 'Simple Array: Hierarchical Structure', pt: 'Matriz simples: Estrutura hierárquica' },
          { slug: 'LoadDataOnDemand', en: 'Load Data on Demand', pt: 'Carregar dados sob demanda' },
          { slug: 'WebAPIService', en: 'Web API Service', pt: 'Serviço de API Web' },
        ],
      },
      {
        id: 'filtering',
        en: 'Filtering',
        pt: 'Filtragem',
        demos: [
          { slug: 'SearchPanel', en: 'Search Panel', pt: 'Painel de pesquisa' },
          { slug: 'FilterRow', en: 'Filter Row', pt: 'Linha de filtro' },
          { slug: 'ColumnHeaderFilter', en: 'Column Header Filter', pt: 'Filtro de cabeçalho de coluna' },
          { slug: 'FilterPanel', en: 'Filter Panel', pt: 'Painel de filtro' },
          { slug: 'FilterModes', en: 'Filter Modes', pt: 'Modos de filtro' },
        ],
      },
      {
        id: 'sorting',
        en: 'Sorting',
        pt: 'Classificação',
        demos: [{ slug: 'MultipleSorting', en: 'Sorting', pt: 'Classificação' }],
      },
      {
        id: 'editing',
        en: 'Editing',
        pt: 'Edição',
        demos: [
          { slug: 'RowEditing', en: 'Row Editing', pt: 'Edição de linhas' },
          { slug: 'CellEditing', en: 'Cell Editing', pt: 'Edição de células' },
          { slug: 'BatchEditing', en: 'Batch Editing', pt: 'Edição em lote' },
          { slug: 'FormEditing', en: 'Form Editing', pt: 'Edição de formulários' },
          { slug: 'PopupEditing', en: 'Popup Editing', pt: 'Edição Popup' },
        ],
      },
      {
        id: 'selection',
        en: 'Selection',
        pt: 'Seleção',
        demos: [
          { slug: 'SingleRowSelection', en: 'Single Row Selection', pt: 'Seleção de linha única' },
          { slug: 'MultipleRowSelection', en: 'Multiple Row Selection', pt: 'Seleção de múltiplas linhas' },
          { slug: 'FocusedRow', en: 'Focused Row', pt: 'Linha focada' },
        ],
      },
      {
        id: 'paging',
        en: 'Paging',
        pt: 'Chamada',
        demos: [{ slug: 'Paging', en: 'Paging', pt: 'Chamada (paginação)' }],
      },
      {
        id: 'columns',
        en: 'Columns',
        pt: 'Colunas',
        demos: [
          { slug: 'Reordering', en: 'Column Reordering', pt: 'Reordenação de colunas' },
          { slug: 'Resizing', en: 'Column Resizing', pt: 'Redimensionamento de colunas' },
          { slug: 'FixedAndStickyColumns', en: 'Fixed and Sticky Columns', pt: 'Colunas fixas e adesivas' },
          { slug: 'ColumnChooser', en: 'Column Chooser', pt: 'Seletor de colunas' },
          { slug: 'AIColumns', en: 'AI Columns', pt: 'Colunas de IA', ai: true },
        ],
      },
      {
        id: 'dnd',
        en: 'Drag & Drop',
        pt: 'Arrastar e soltar',
        demos: [{ slug: 'LocalReordering', en: 'Drag & Drop', pt: 'Arrastar e soltar' }],
      },
      {
        id: 'state',
        en: 'State Persistence',
        pt: 'Persistência do Estado',
        demos: [{ slug: 'StatePersistence', en: 'State Persistence', pt: 'Persistência do Estado' }],
      },
      {
        id: 'adaptability',
        en: 'Adaptability',
        pt: 'Adaptabilidade',
        demos: [{ slug: 'Adaptability', en: 'Adaptability', pt: 'Adaptabilidade' }],
      },
      {
        id: 'keyboard',
        en: 'Keyboard Navigation',
        pt: 'Navegação por teclado',
        demos: [
          { slug: 'KeyboardNavigation', en: 'Keyboard Navigation', pt: 'Navegação por teclado' },
          { slug: 'CustomizeKeyboardNavigation', en: 'Customize Keyboard Navigation', pt: 'Personalizar a navegação do teclado' },
        ],
      },
    ],
  },
  {
    id: 'card-view',
    en: 'Card View',
    pt: 'Visualização do cartão',
    widget: 'CardView',
    sections: [
      {
        id: 'overview',
        en: 'Overview',
        pt: 'Visão geral',
        demos: [{ slug: 'Overview', en: 'Overview', pt: 'Visão geral' }],
      },
      {
        id: 'data-binding',
        en: 'Data Binding',
        pt: 'Vinculação de dados',
        demos: [
          { slug: 'SimpleArray', en: 'Simple Array', pt: 'Matriz simples' },
          { slug: 'WebAPIService', en: 'Web API Service', pt: 'Serviço de API Web' },
        ],
      },
      {
        id: 'filtering',
        en: 'Filtering',
        pt: 'Filtragem',
        demos: [
          { slug: 'ColumnHeaderFilter', en: 'Column Header Filter', pt: 'Filtro de cabeçalho de coluna' },
          { slug: 'FilterPanel', en: 'Filter Panel', pt: 'Painel de filtro' },
          { slug: 'SearchPanel', en: 'Search Panel', pt: 'Painel de pesquisa' },
        ],
      },
      {
        id: 'sorting',
        en: 'Sorting',
        pt: 'Classificação',
        demos: [{ slug: 'Sorting', en: 'Sorting', pt: 'Classificação' }],
      },
      {
        id: 'editing',
        en: 'Editing',
        pt: 'Edição',
        demos: [
          { slug: 'PopupEditing', en: 'Popup Editing', pt: 'Edição Popup' },
          { slug: 'DataValidation', en: 'Data Validation', pt: 'Validação de dados' },
        ],
      },
      {
        id: 'selection',
        en: 'Selection',
        pt: 'Seleção',
        demos: [{ slug: 'Selection', en: 'Selection', pt: 'Seleção' }],
      },
      {
        id: 'columns',
        en: 'Columns',
        pt: 'Colunas',
        demos: [
          { slug: 'ColumnReordering', en: 'Column Reordering', pt: 'Reordenação de colunas' },
          { slug: 'ColumnChooser', en: 'Column Chooser', pt: 'Seletor de colunas' },
        ],
      },
      {
        id: 'customization',
        en: 'Customization',
        pt: 'Personalização',
        demos: [
          { slug: 'CardTemplate', en: 'Card Template', pt: 'Modelo de cartão' },
          { slug: 'FieldTemplate', en: 'Field Template', pt: 'Modelo de campo' },
        ],
      },
    ],
  },
  {
    id: 'pivot-grid',
    en: 'Pivot Grid',
    pt: 'Grade Pivô',
    widget: 'PivotGrid',
    sections: [
      {
        id: 'overview',
        en: 'Overview',
        pt: 'Visão geral',
        demos: [{ slug: 'Overview', en: 'Overview', pt: 'Visão geral' }],
      },
      {
        id: 'data-binding',
        en: 'Data Binding',
        pt: 'Vinculação de dados',
        demos: [
          { slug: 'SimpleArray', en: 'Simple Array', pt: 'Matriz simples' },
          { slug: 'OLAPDataSource', en: 'OLAP Data Source', pt: 'Fonte de dados OLAP' },
          { slug: 'WebAPIService', en: 'Web API Service', pt: 'Serviço de API Web' },
        ],
      },
      {
        id: 'field-management',
        en: 'Field Management',
        pt: 'Gestão de Campo',
        demos: [
          { slug: 'IntegratedFieldChooser', en: 'Integrated Field Chooser', pt: 'Seletor de Campos Integrado' },
          { slug: 'StandaloneFieldChooser', en: 'Standalone Field Chooser', pt: 'Seletor de Campo Independente' },
          { slug: 'FieldPanel', en: 'Field Panel', pt: 'Painel de Campo' },
        ],
      },
      {
        id: 'summaries',
        en: 'Data Summaries',
        pt: 'Resumos de dados',
        demos: [
          { slug: 'RunningTotals', en: 'Running Totals', pt: 'Totais acumulados' },
          { slug: 'SummaryDisplayModes', en: 'Summary Display Modes', pt: 'Modos de exibição resumidos' },
        ],
      },
      {
        id: 'drill-down',
        en: 'Drill Down',
        pt: 'Detalhes',
        demos: [{ slug: 'DrillDown', en: 'Drill Down', pt: 'Detalhes (Drill Down)' }],
      },
      {
        id: 'filtering',
        en: 'Filtering',
        pt: 'Filtragem',
        demos: [{ slug: 'Filtering', en: 'Filtering', pt: 'Filtragem' }],
      },
      {
        id: 'scrolling',
        en: 'Scrolling',
        pt: 'Rolagem',
        demos: [
          { slug: 'VirtualScrolling', en: 'Virtual Scrolling', pt: 'Rolagem virtual' },
          { slug: 'RemoteVirtualScrolling', en: 'Remote Virtual Scrolling', pt: 'Rolagem virtual remota' },
        ],
      },
      {
        id: 'export-excel',
        en: 'Export to Excel',
        pt: 'Exportar para o Excel',
        demos: [
          { slug: 'ExcelJSOverview', en: 'Overview', pt: 'Visão geral' },
          { slug: 'ExcelJSCellCustomization', en: 'Cell Customization', pt: 'Personalização de células' },
          { slug: 'ExcelJsHeaderAndFooter', en: 'Header and Footer', pt: 'Cabeçalho e rodapé' },
        ],
      },
      {
        id: 'chart-integration',
        en: 'Chart Integration',
        pt: 'Integração de gráficos',
        demos: [{ slug: 'ChartIntegration', en: 'Chart Integration', pt: 'Integração de gráficos' }],
      },
      {
        id: 'customization',
        en: 'Customization',
        pt: 'Personalização',
        demos: [{ slug: 'Customization', en: 'Customization', pt: 'Personalização' }],
      },
      {
        id: 'state',
        en: 'State Persistence',
        pt: 'Persistência do Estado',
        demos: [{ slug: 'StatePersistence', en: 'State Persistence', pt: 'Persistência do Estado' }],
      },
    ],
  },
  {
    id: 'filter-builder',
    en: 'Filter Builder',
    pt: 'Construtor de filtros',
    widget: 'FilterBuilder',
    sections: [
      {
        id: 'demos',
        en: 'Demos',
        pt: 'Demos',
        demos: [
          { slug: 'WithDataGrid', en: 'With Data Grid', pt: 'Com grade de dados' },
          { slug: 'WithList', en: 'With List', pt: 'Com lista' },
          { slug: 'Customization', en: 'Customization', pt: 'Personalização' },
        ],
      },
    ],
  },
];

function flattenDemos(tree) {
  const list = [];
  let seq = 0;
  for (const widget of tree) {
    for (const section of widget.sections) {
      for (const demo of section.demos) {
        seq += 1;
        const url = `${BASE}/${widget.widget}/${demo.slug}/${THEME}/`;
        const fileBase = `${String(seq).padStart(3, '0')}-${widget.widget}-${demo.slug}`;
        list.push({
          seq,
          widgetId: widget.id,
          widgetEn: widget.en,
          widgetPt: widget.pt,
          widget: widget.widget,
          sectionId: section.id,
          sectionEn: section.en,
          sectionPt: section.pt,
          slug: demo.slug,
          titleEn: demo.en,
          titlePt: demo.pt,
          ai: !!demo.ai,
          url,
          imageFile: `images/${fileBase}.png`,
          rawFile: `raw/${fileBase}.json`,
        });
      }
    }
  }
  return list;
}

function cleanText(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function withTimeout(promise, ms, label) {
  let t;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(() => reject(new Error(`timeout ${ms}ms: ${label}`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
}

async function scrapeOne(page, item) {
  const result = {
    ...item,
    scrapedAt: new Date().toISOString(),
    pageTitle: null,
    h1: null,
    descriptionEn: null,
    docLinks: [],
    apiLinks: [],
    relatedLinks: [],
    screenshotOk: false,
    error: null,
  };

  try {
    await withTimeout(
      page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 45000 }),
      50000,
      `goto ${item.slug}`,
    );

    // Dismiss banners / cookies that overlay the demo iframe
    try {
      await page.locator('button:has-text("Close banner")').first().click({ timeout: 800 }).catch(() => {});
      const cookie = page.locator('#onetrust-accept-btn-handler, button:has-text("Accept All Cookies")').first();
      if (await cookie.isVisible({ timeout: 1200 }).catch(() => false)) {
        await cookie.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(400);
      }
    } catch {}

    await page.waitForTimeout(600);

    const meta = await withTimeout(
      page.evaluate(() => {
        const h1 = document.querySelector('h1')?.innerText || '';
        const desc =
          document.querySelector('.description-text')?.innerText ||
          document.querySelector('.description')?.innerText ||
          '';
        const links = Array.from(document.querySelectorAll('.description-text a, .description a'))
          .map((a) => ({ text: (a.innerText || '').trim(), href: a.href }))
          .filter((l) => l.href);
        return { title: document.title, h1, desc, links };
      }),
      10000,
      `evaluate ${item.slug}`,
    );

    result.pageTitle = meta.title;
    result.h1 = cleanText(meta.h1);
    result.descriptionEn = cleanText(meta.desc).slice(0, 4000);
    result.docLinks = meta.links.filter((l) => /Documentation\/Guide/i.test(l.href));
    result.apiLinks = meta.links.filter((l) => /Documentation\/ApiReference/i.test(l.href));
    result.relatedLinks = meta.links.filter(
      (l) => !/Documentation\/(Guide|ApiReference)/i.test(l.href),
    );

    const imgPath = path.join(OUT, item.imageFile);
    // Demo widget lives in #demoFrame iframe — scroll into view and wait for content
    const frame = page.locator('#demoFrame, iframe.demo-frame').first();
    await frame.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
    await frame.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(500);

    // Wait inside iframe for grid/widget (or any substantial content)
    try {
      const f = page.frameLocator('#demoFrame, iframe.demo-frame').first();
      await f
        .locator('.dx-datagrid, .dx-treelist, .dx-pivotgrid, .dx-cardview, .dx-filterbuilder, .dx-treeview')
        .first()
        .waitFor({ state: 'visible', timeout: 15000 });
      await page.waitForTimeout(800);
    } catch {
      await page.waitForTimeout(1500);
    }

    try {
      await withTimeout(
        frame.screenshot({ path: imgPath, type: 'png', timeout: 20000 }),
        25000,
        `iframe-screenshot ${item.slug}`,
      );
    } catch (shotErr) {
      await withTimeout(
        page.screenshot({
          path: imgPath,
          type: 'png',
          fullPage: false,
          timeout: 15000,
        }),
        20000,
        `screenshot-fallback ${item.slug}`,
      ).catch(() => {
        throw shotErr;
      });
    }
    result.screenshotOk = fs.existsSync(imgPath) && fs.statSync(imgPath).size > 1000;
  } catch (e) {
    result.error = String(e?.message || e);
  }

  fs.writeFileSync(path.join(OUT, item.rawFile), JSON.stringify(result, null, 2), 'utf8');
  return result;
}

function buildMarkdown(tree, flat, resultsBySeq) {
  const lines = [];
  lines.push('# VortexUI — PRD de Paridade: Data Grids / Data Management');
  lines.push('');
  lines.push('> **Audiência:** modelo de IA / engenharia VortexUI');
  lines.push('> **Objetivo:** reimplementar (MIT, Angular Signals, sem código DX) a superfície UX da família Data Management da Widgets Gallery DevExtreme Angular.');
  lines.push('> **Fonte:** [Widgets Gallery Angular](https://js.devexpress.com/Angular/Demos/WidgetsGallery/) · tema **FluentBlueLight**');
  lines.push(`> **Scraped at:** ${new Date().toISOString()}`);
  lines.push(`> **Demos capturadas:** ${flat.length}`);
  lines.push('');
  lines.push('## 0. Instruções para a IA (leia primeiro)');
  lines.push('');
  lines.push('1. Este documento é o **checklist de paridade de superfície** (não um fork). É **proibido** copiar código-fonte DevExtreme / `devextreme` / `devextreme-angular`.');
  lines.push('2. Para cada demo `seq`, leia `raw/NNN-*.json` (metadados) e a imagem `images/NNN-*.png` (prévia visual na mesma sequência).');
  lines.push('3. Implemente no VortexUI (`vx-data-grid`, `vx-tree-list`, `vx-card-view`, `vx-pivot-grid`, `vx-filter-builder`) com Signals / Standalone / OnPush / zoneless.');
  lines.push('4. Use a imagem como **critério visual de aceite** (layout, chrome, densidade), não como asset de produto.');
  lines.push('5. Priorize ordem do documento: DataGrid → TreeList → CardView → PivotGrid → FilterBuilder.');
  lines.push('6. Marque cada demo com status Vortex: `TODO` | `M0` | `M1` | `M2` | `M3` (atualizar ao implementar).');
  lines.push('7. Features `ai: true` dependem do AI Bridge Vortex (opt-in, Command Bus) — ver `VortexUI-PRD.md` § AI.');
  lines.push('8. Manifesto de imagens: `IMAGE-MANIFEST.json`. Catálogo máquina: `catalog.json`.');
  lines.push('');
  lines.push('## 1. Mapa de componentes Vortex ↔ DevExtreme');
  lines.push('');
  lines.push('| Vortex | DX Widget | PT | EN |');
  lines.push('|--------|-----------|----|----|');
  lines.push('| `vx-data-grid` | DataGrid | Grade de dados | Data Grid |');
  lines.push('| `vx-tree-list` | TreeList | Lista de árvores | Tree List |');
  lines.push('| `vx-card-view` | CardView | Visualização do cartão | Card View |');
  lines.push('| `vx-pivot-grid` (+ field chooser) | PivotGrid | Grade Pivô | Pivot Grid |');
  lines.push('| `vx-filter-builder` | FilterBuilder | Construtor de filtros | Filter Builder |');
  lines.push('');
  lines.push('## 2. Catálogo hierárquico + evidências');
  lines.push('');
  lines.push('# Grades de dados / Gestão de dados');
  lines.push('');

  for (const widget of tree) {
    lines.push(`## ${widget.pt} (\`${widget.widget}\` / ${widget.en})`);
    lines.push('');
    for (const section of widget.sections) {
      lines.push(`### ${section.pt} (${section.en})`);
      lines.push('');
      for (const demo of section.demos) {
        const item = flat.find(
          (f) => f.widget === widget.widget && f.slug === demo.slug && f.sectionId === section.id,
        );
        const r = item ? resultsBySeq.get(item.seq) : null;
        const seq = item?.seq ?? '?';
        const aiTag = demo.ai ? ' · **AI**' : '';
        lines.push(`#### ${String(seq).padStart(3, '0')}. ${demo.pt} / ${demo.en}${aiTag}`);
        lines.push('');
        lines.push(`- **Status Vortex:** TODO`);
        lines.push(`- **Slug DX:** \`${demo.slug}\``);
        lines.push(`- **URL:** ${item?.url || ''}`);
        lines.push(`- **Imagem:** \`${item?.imageFile || ''}\``);
        lines.push(`- **Raw JSON:** \`${item?.rawFile || ''}\``);
        if (r?.h1) lines.push(`- **Título página:** ${r.h1}`);
        if (r?.descriptionEn) {
          lines.push(`- **Descrição (EN, fonte DX):**`);
          lines.push('');
          lines.push(`> ${r.descriptionEn}`);
          lines.push('');
        }
        if (r?.docLinks?.length) {
          lines.push(`- **Docs Guide:**`);
          for (const l of r.docLinks.slice(0, 8)) lines.push(`  - [${l.text || l.href}](${l.href})`);
        }
        if (r?.apiLinks?.length) {
          lines.push(`- **API Reference:**`);
          for (const l of r.apiLinks.slice(0, 8)) lines.push(`  - [${l.text || l.href}](${l.href})`);
        }
        if (r?.error) lines.push(`- **Scrape error:** ${r.error}`);
        lines.push('');
        lines.push(`![${demo.en}](${item?.imageFile || ''})`);
        lines.push('');
        lines.push('**Critérios de aceite Vortex (preencher na implementação):**');
        lines.push('');
        lines.push('- [ ] Paridade de interação principal da demo');
        lines.push('- [ ] API Signals documentada (`input`/`model`/`output`)');
        lines.push('- [ ] Tema Fluent Light + LDS sem regressão visual');
        lines.push('- [ ] Storybook / Widgets Gallery Vortex com caso equivalente');
        lines.push('');
      }
    }
  }

  lines.push('## 3. Próximos passos recomendados para a IA');
  lines.push('');
  lines.push('1. Diffar este catálogo contra `apps/docs` / stories atuais e marcar gaps.');
  lines.push('2. Implementar gaps DataGrid M2→M3 (export PDF/Excel, AI Columns/Assistant, collaborative edit) antes de Pivot avançado.');
  lines.push('3. Para cada `TODO`, abrir a imagem `images/NNN-*.png` e o `raw/NNN-*.json` antes de codar.');
  lines.push('4. Não redistribuir screenshots DX em pacote npm — uso interno de pesquisa/paridade apenas.');
  lines.push('5. Atualizar `VortexUI-PRD.md` § Data Management com link para este diretório.');
  lines.push('');
  lines.push('## 4. Notas legais');
  lines.push('');
  lines.push('- Conteúdo textual/descrições e screenshots são material de referência pública DevExpress para estudo de paridade de superfície.');
  lines.push('- VortexUI deve entregar implementação própria; marcas/assets DX não devem ir para o design system de produto.');
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const flat = flattenDemos(TREE);
  const force = process.argv.includes('--force');
  console.log(`Demos to scrape: ${flat.length} (resume=${!force})`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: 1,
  });
  // Abort hung navigations / requests faster
  context.setDefaultTimeout(20000);
  context.setDefaultNavigationTimeout(45000);
  const page = await context.newPage();

  const results = [];
  for (const item of flat) {
    const imgPath = path.join(OUT, item.imageFile);
    const rawPath = path.join(OUT, item.rawFile);
    const already =
      !force &&
      fs.existsSync(imgPath) &&
      fs.statSync(imgPath).size > 1000 &&
      fs.existsSync(rawPath);

    if (already) {
      const prev = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
      results.push({ ...item, ...prev, seq: item.seq, imageFile: item.imageFile, rawFile: item.rawFile });
      console.log(`[${item.seq}/${flat.length}] ${item.widget}/${item.slug} ... SKIP`);
      continue;
    }

    process.stdout.write(`[${item.seq}/${flat.length}] ${item.widget}/${item.slug} ... `);
    let r;
    try {
      r = await withTimeout(scrapeOne(page, item), 70000, `scrapeOne ${item.slug}`);
    } catch (e) {
      r = {
        ...item,
        scrapedAt: new Date().toISOString(),
        screenshotOk: false,
        error: String(e?.message || e),
        descriptionEn: null,
        docLinks: [],
        apiLinks: [],
        relatedLinks: [],
      };
      fs.writeFileSync(path.join(OUT, item.rawFile), JSON.stringify(r, null, 2), 'utf8');
    }
    results.push(r);
    console.log(r.screenshotOk ? 'OK' : `FAIL ${r.error || ''}`);
  }

  await browser.close();

  // Reload results from disk for consistency (includes skips)
  const diskResults = flat.map((item) => {
    const rawPath = path.join(OUT, item.rawFile);
    if (fs.existsSync(rawPath)) {
      return { ...item, ...JSON.parse(fs.readFileSync(rawPath, 'utf8')), ...item };
    }
    return results.find((r) => r.seq === item.seq) || item;
  });

  const bySeq = new Map(diskResults.map((r) => [r.seq, r]));
  const catalog = {
    source: 'https://js.devexpress.com/Angular/Demos/WidgetsGallery/',
    theme: THEME,
    group: { en: 'Data Grids / Data Management', pt: 'Grades de dados / Gestão de dados' },
    scrapedAt: new Date().toISOString(),
    count: flat.length,
    tree: TREE,
    demos: diskResults,
  };
  fs.writeFileSync(path.join(OUT, 'catalog.json'), JSON.stringify(catalog, null, 2), 'utf8');

  const manifest = diskResults.map((r) => ({
    seq: r.seq,
    image: r.imageFile,
    widget: r.widget,
    slug: r.slug,
    titlePt: r.titlePt,
    titleEn: r.titleEn,
    sectionPt: r.sectionPt,
    url: r.url,
    screenshotOk: !!r.screenshotOk,
  }));
  fs.writeFileSync(path.join(OUT, 'IMAGE-MANIFEST.json'), JSON.stringify(manifest, null, 2), 'utf8');

  const md = buildMarkdown(TREE, flat, bySeq);
  fs.writeFileSync(path.join(OUT, 'PRD-DATA-MANAGEMENT.md'), md, 'utf8');

  const ok = diskResults.filter((r) => r.screenshotOk).length;
  console.log(`\nDone. Screenshots OK: ${ok}/${diskResults.length}`);
  console.log(`Wrote PRD-DATA-MANAGEMENT.md, catalog.json, IMAGE-MANIFEST.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
