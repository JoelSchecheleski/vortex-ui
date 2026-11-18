import {
  ChangeDetectionStrategy,
  Component,
  viewChild,
} from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import {
  VxDataGridComponent,
  type VxColumnDef,
} from '../data-grid/data-grid.component';
import type { VxDataFilter } from '../data-grid/data-source';
import {
  VxFilterBuilderComponent,
  type VxFilterField,
} from './filter-builder.component';

interface DemoRow {
  id: number;
  product: string;
  region: string;
  sector: string;
  amount: number;
}

const DEMO_ROWS: DemoRow[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  product: ['SolarMax', 'EcoCharge', 'VoltEdge'][i % 3]!,
  region: ['África', 'Europa', 'Américas'][i % 3]!,
  sector: ['Energy', 'Retail', 'Industrial'][i % 3]!,
  amount: 800 + i * 45,
}));

const DEMO_COLUMNS: VxColumnDef<DemoRow>[] = [
  { field: 'id', header: 'ID', width: 72 },
  { field: 'product', header: 'Produto' },
  { field: 'region', header: 'Região' },
  { field: 'sector', header: 'Setor' },
  { field: 'amount', header: 'Valor', width: 100 },
];

const DEMO_FIELDS: VxFilterField[] = [
  { field: 'product', label: 'Produto' },
  { field: 'region', label: 'Região' },
  { field: 'sector', label: 'Setor' },
  { field: 'amount', label: 'Valor' },
];

/**
 * Thin host wiring FilterBuilder Apply/Clear into DataGrid.setFilter.
 * Standalone builder + grid — not the integrated Filter Panel (story 1.4).
 */
@Component({
  selector: 'vx-filter-builder-with-grid-demo',
  standalone: true,
  imports: [VxFilterBuilderComponent, VxDataGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vx-fb-demo">
      <vx-filter-builder
        [fields]="fields"
        (applyFilter)="onApplyFilter($event)"
      />
      <div class="vx-fb-demo__grid">
        <vx-data-grid
          #grid
          [data]="rows"
          [columns]="columns"
          [virtualScroll]="false"
        />
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .vx-fb-demo {
      display: flex;
      flex-direction: column;
      gap: var(--vx-space-4, 1rem);
      padding: var(--vx-space-4, 1rem);
      box-sizing: border-box;
      min-height: 520px;
      background: var(--vx-color-bg, transparent);
      font-family: var(--vx-font-sans, inherit);
    }

    .vx-fb-demo__grid {
      flex: 1;
      min-height: 320px;
      height: 360px;
    }
  `,
})
class FilterBuilderWithDataGridDemoComponent {
  readonly fields = DEMO_FIELDS;
  readonly rows = DEMO_ROWS;
  readonly columns = DEMO_COLUMNS;

  private readonly grid =
    viewChild<VxDataGridComponent<DemoRow>>('grid');

  onApplyFilter(filter: VxDataFilter | null): void {
    this.grid()?.setFilter(filter);
  }
}

const meta: Meta<FilterBuilderWithDataGridDemoComponent> = {
  title: 'Data Management/FilterBuilder/143-WithDataGrid',
  component: FilterBuilderWithDataGridDemoComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Parity demo 143 — standalone FilterBuilder filtering a DataGrid via Apply/Clear. ' +
          'Visual AC (internal only): research PRD image 143-FilterBuilder-WithDataGrid.png. ' +
          'Public Signals: vx-filter-builder `fields` input, `value` model, `applied` + `applyFilter` outputs; ' +
          'grid consumes `applyFilter` through `setFilter`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<FilterBuilderWithDataGridDemoComponent>;

export const WithDataGrid: Story = {};
