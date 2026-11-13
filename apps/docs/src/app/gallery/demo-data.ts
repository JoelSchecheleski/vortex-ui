import type { VxAppointment } from 'vortex-ui';
import type { VxBarGaugeItem } from 'vortex-ui';
import type { VxCardViewField, VxCardViewItem } from 'vortex-ui';
import type { VxChartPoint } from 'vortex-ui';
import type { VxChatMessage } from 'vortex-ui';
import type { VxColumnDef } from 'vortex-ui';
import type { VxContextMenuItem } from 'vortex-ui';
import type { VxDiagramEdge, VxDiagramNode } from 'vortex-ui';
import type { VxFileItem } from 'vortex-ui';
import type { VxFilterField } from 'vortex-ui';
import type { VxFunnelPoint } from 'vortex-ui';
import type { VxGalleryItem } from 'vortex-ui';
import type { VxGanttTask } from 'vortex-ui';
import type { VxListItem } from 'vortex-ui';
import type { VxLookupItem } from 'vortex-ui';
import type { VxMapMarker } from 'vortex-ui';
import type { VxPivotFieldState } from 'vortex-ui';
import type { VxSankeyLink, VxSankeyNode } from 'vortex-ui';
import type { VxTileItem } from 'vortex-ui';
import type { VxTreeListNode } from 'vortex-ui';
import type { VxTreeMapNode } from 'vortex-ui';
import type { VxTreeNode } from 'vortex-ui';
import type { VxVectorRegion } from 'vortex-ui';
import { VxRemoteMockDataSource } from 'vortex-ui';

export interface ThemeLabRow {
  id: number;
  product: string;
  saleAmount: number;
  region: string;
  sector: string;
  saleDate: string;
  customer: string;
  category: string;
}

const PRODUCTS = ['SolarMax', 'EcoCharge', 'VoltEdge', 'AeroLite', 'NovaCell'];
const REGIONS = ['África', 'Europa', 'Américas', 'Ásia'];
const SECTORS = ['Saúde', 'Telecom', 'Seguros', 'Varejo'];
const CATEGORIES = ['Crossover & SUV', 'Sedan', 'Pickup', 'Hatch'];
const CUSTOMERS = [
  'Discovery Systems',
  'Environment Solar',
  'Northwind Traders',
  'Contoso Ltd',
  'Fabrikam Inc',
  'Adventure Works',
  'Wide World Importers',
  'Litware AG',
];

export function createRow(index: number): ThemeLabRow {
  return {
    id: index + 1,
    product: PRODUCTS[index % PRODUCTS.length]!,
    saleAmount: 1000 + ((index * 37) % 15000),
    region: REGIONS[index % REGIONS.length]!,
    sector: SECTORS[index % SECTORS.length]!,
    saleDate: `${String((index % 28) + 1).padStart(2, '0')}/05/2024`,
    customer: CUSTOMERS[index % CUSTOMERS.length]!,
    category: CATEGORIES[index % CATEGORIES.length]!,
  };
}

export const GRID_COLUMNS: VxColumnDef<ThemeLabRow>[] = [
  { field: 'id', header: 'ID', width: 72, minWidth: 56, sortable: true },
  { field: 'product', header: 'Produto', minWidth: 120, sortable: true, editable: true },
  {
    field: 'saleAmount',
    header: 'Valor',
    minWidth: 100,
    sortable: true,
    valueGetter: (row) =>
      row.saleAmount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }),
  },
  { field: 'region', header: 'Região', minWidth: 100, sortable: true },
  { field: 'sector', header: 'Setor', minWidth: 100, sortable: true },
  {
    field: 'aiInsight',
    header: 'AI Column',
    minWidth: 160,
    type: 'ai',
    sortable: false,
    ai: { prompt: 'Resuma a linha em uma frase curta', noDataText: 'No data' },
  },
  { field: 'customer', header: 'Cliente', minWidth: 140 },
];

export const remoteSource = new VxRemoteMockDataSource(1_000_000, createRow, 0);

export const demoRows = Array.from({ length: 24 }, (_, i) => createRow(i));

export const listItems: VxListItem[] = [
  { id: '1', text: 'SolarMax', secondaryText: 'Produto · África' },
  { id: '2', text: 'EcoCharge', secondaryText: 'Produto · Europa' },
  { id: '3', text: 'VoltEdge', secondaryText: 'Produto · Américas' },
  { id: '4', text: 'AeroLite', secondaryText: 'Produto · Ásia' },
];

export const filterFields: VxFilterField[] = [
  { field: 'product', label: 'Produto' },
  { field: 'region', label: 'Região' },
  { field: 'sector', label: 'Setor' },
];

export const treeListItems: VxTreeListNode[] = [
  {
    id: 'org',
    data: { name: 'VortexUI', role: 'Org', region: 'Global' },
    children: [
      {
        id: 'eng',
        data: { name: 'Engineering', role: 'Dept', region: 'BR' },
        children: [
          { id: 'e1', data: { name: 'Grid Team', role: 'Squad', region: 'SP' } },
          { id: 'e2', data: { name: 'AI Team', role: 'Squad', region: 'RJ' } },
        ],
      },
      { id: 'des', data: { name: 'Design', role: 'Dept', region: 'EU' } },
    ],
  },
];

export const treeListColumns: VxColumnDef[] = [
  { field: 'role', header: 'Papel', width: '120px' },
  { field: 'region', header: 'Região', width: '100px' },
];

export const cardFields: VxCardViewField[] = [
  { field: 'region', label: 'Região' },
  { field: 'amount', label: 'Valor' },
];

export const cardItems: VxCardViewItem[] = [
  { id: 'c1', title: 'SolarMax', subtitle: 'Produto', data: { region: 'África', amount: '$4.2k' } },
  { id: 'c2', title: 'EcoCharge', subtitle: 'Produto', data: { region: 'Europa', amount: '$6.1k' } },
  { id: 'c3', title: 'VoltEdge', subtitle: 'Produto', data: { region: 'Américas', amount: '$3.8k' } },
  { id: 'c4', title: 'Contoso Ltd', subtitle: 'Cliente', data: { region: 'Ásia', amount: '$9.0k' } },
];

export const chartData: VxChartPoint[] = [
  { argument: 'África', value: 42 },
  { argument: 'Europa', value: 68 },
  { argument: 'Américas', value: 55 },
  { argument: 'Ásia', value: 81 },
];

export const sparkData = [3, 5, 4, 8, 6, 9, 7, 10, 8, 12];

export const treeItems: VxTreeNode[] = [
  {
    id: 'root',
    text: 'VortexUI',
    children: [
      { id: 'docs', text: 'Documentação', children: [{ id: 'prd', text: 'PRD' }] },
      { id: 'pkg', text: 'Pacote npm' },
    ],
  },
];

export const fileItems: VxFileItem[] = [
  { id: '1', name: 'Documentos', isDirectory: true, parentId: null, modified: '2026-01-10' },
  { id: '2', name: 'Imagens', isDirectory: true, parentId: null, modified: '2026-02-01' },
  {
    id: '3',
    name: 'relatorio-2026.pdf',
    isDirectory: false,
    size: 2457600,
    parentId: null,
    modified: '2026-03-12',
  },
  { id: '11', name: 'financeiro', isDirectory: true, parentId: '1', modified: '2026-04-01' },
];

export const ganttTasks: VxGanttTask[] = [
  { id: 'g1', title: 'Foundation', start: '2026-11-01', end: '2026-11-05', progress: 100 },
  { id: 'g2', title: 'DataGrid', start: '2026-11-04', end: '2026-11-10', progress: 100, color: '#0f6cbd' },
  { id: 'g3', title: 'AI Foundation', start: '2026-11-08', end: '2026-11-12', progress: 90, color: '#8764b8' },
  { id: 'g4', title: 'Charts / Scheduler', start: '2026-11-12', end: '2026-11-16', progress: 40, color: '#13a10e' },
];

export function createAppointments(): VxAppointment[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const iso = (dayOffset: number, h: number, m = 0) => {
    const d = new Date(today);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };
  return [
    { id: 'a1', text: 'Stand-up', start: iso(0, 9), end: iso(0, 9, 30), color: '#0f6cbd' },
    { id: 'a2', text: 'Design review', start: iso(0, 11), end: iso(0, 12), color: '#8764b8' },
    { id: 'a3', text: 'Demo Theme Lab', start: iso(1, 14), end: iso(1, 15, 30), color: '#13a10e' },
    { id: 'a4', text: 'Planning', start: iso(2, 10), end: iso(2, 11, 30) },
  ];
}

function placeholderSvg(fill: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160"><rect width="240" height="160" fill="${fill}"/><text x="120" y="88" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="18">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const chatMessages: VxChatMessage[] = [
  { id: 'm1', author: 'Ana', text: 'Olá! Como está o Theme Lab?' },
  { id: 'm2', author: 'Você', text: 'Galeria atualizada com todos os widgets.', mine: true },
  { id: 'm3', author: 'Ana', text: 'Perfeito — vou validar os tokens Fluent.' },
];

export const pivotRows = demoRows.map((r) => ({
  region: r.region,
  sector: r.sector,
  product: r.product,
  saleAmount: r.saleAmount,
}));

export const pivotFields: VxPivotFieldState = {
  available: ['product'],
  rows: ['region'],
  columns: ['sector'],
  values: ['saleAmount'],
};

export const funnelVizData: VxFunnelPoint[] = [
  { argument: 'Visitas', value: 1200 },
  { argument: 'Leads', value: 640 },
  { argument: 'Trials', value: 280 },
  { argument: 'Clientes', value: 96 },
];

export const treeMapData: VxTreeMapNode[] = [
  { name: 'África', value: 42 },
  { name: 'Europa', value: 68, color: '#0f6cbd' },
  { name: 'Américas', value: 55, color: '#13a10e' },
  { name: 'Ásia', value: 81, color: '#8764b8' },
];

export const sankeyNodes: VxSankeyNode[] = [
  { id: 'src', label: 'Origem' },
  { id: 'mid', label: 'Processo' },
  { id: 'out', label: 'Destino' },
];

export const sankeyLinks: VxSankeyLink[] = [
  { source: 'src', target: 'mid', value: 60 },
  { source: 'mid', target: 'out', value: 45 },
];

export const diagramNodes: VxDiagramNode[] = [
  { id: 'a', label: 'Grid', x: 40, y: 80 },
  { id: 'b', label: 'API', x: 200, y: 40 },
  { id: 'c', label: 'Chart', x: 200, y: 140 },
  { id: 'd', label: 'UI', x: 360, y: 90 },
];

export const diagramEdges: VxDiagramEdge[] = [
  { from: 'a', to: 'b' },
  { from: 'a', to: 'c' },
  { from: 'b', to: 'd' },
  { from: 'c', to: 'd' },
];

export const mapMarkers: VxMapMarker[] = [
  { lat: -23.55, lng: -46.63, label: 'São Paulo' },
  { lat: 38.72, lng: -9.14, label: 'Lisboa' },
  { lat: 40.71, lng: -74.0, label: 'NYC' },
];

export const vectorRegions: VxVectorRegion[] = [
  { id: 'br', name: 'Brasil', d: 'M80 180 L120 140 L160 170 L140 210 Z' },
  { id: 'eu', name: 'Europa', d: 'M200 60 L260 50 L280 100 L230 120 Z' },
  { id: 'na', name: 'Américas', d: 'M40 80 L90 70 L100 130 L50 150 Z' },
];

export const barGaugeItems: VxBarGaugeItem[] = [
  { label: 'África', value: 42 },
  { label: 'Europa', value: 68, color: '#0f6cbd' },
  { label: 'Ásia', value: 81, color: '#8764b8' },
];

export const galleryItems: VxGalleryItem[] = [
  { id: 'g1', src: placeholderSvg('#0f6cbd', 'A'), alt: 'Placeholder A' },
  { id: 'g2', src: placeholderSvg('#13a10e', 'B'), alt: 'Placeholder B' },
  { id: 'g3', src: placeholderSvg('#8764b8', 'C'), alt: 'Placeholder C' },
];

export const tileItems: VxTileItem[] = [
  { id: 't1', title: 'SolarMax', subtitle: 'Produto' },
  { id: 't2', title: 'EcoCharge', subtitle: 'Produto' },
  { id: 't3', title: 'VoltEdge', subtitle: 'Produto' },
  { id: 't4', title: 'Contoso', subtitle: 'Cliente' },
];

export const lookupItems: VxLookupItem[] = [
  { id: '1', label: 'SolarMax' },
  { id: '2', label: 'EcoCharge' },
  { id: '3', label: 'VoltEdge' },
];

export const autocompleteItems = PRODUCTS;

export const contextMenuItems: VxContextMenuItem[] = [
  { id: 'edit', label: 'Editar' },
  { id: 'copy', label: 'Copiar' },
  { id: 'del', label: 'Excluir', disabled: true },
];

export const buttonGroupItems = ['Lista', 'Grade', 'Mapa'];

export const dropDownItems = ['Exportar CSV', 'Exportar PDF', 'Imprimir'];

export const radioItems = ['Saúde', 'Telecom', 'Seguros'];
