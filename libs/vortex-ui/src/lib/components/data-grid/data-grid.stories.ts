import type { Meta, StoryObj } from '@storybook/angular';
import { VxDataGridComponent } from './data-grid.component';
import type { VxColumnDef } from './data-grid.types';

interface Row {
  id: number;
  product: string;
  region: string;
  amount: number;
}

const rows: Row[] = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  product: ['SolarMax', 'EcoCharge', 'VoltEdge'][i % 3]!,
  region: ['África', 'Europa', 'Américas'][i % 3]!,
  amount: 1000 + i * 37,
}));

const columns: VxColumnDef[] = [
  { field: 'id', header: 'ID', width: 72 },
  { field: 'product', header: 'Produto' },
  { field: 'region', header: 'Região' },
  { field: 'amount', header: 'Valor', width: 100 },
];

const meta: Meta<VxDataGridComponent> = {
  title: 'Data/DataGrid',
  component: VxDataGridComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => ({
    props: { rows, columns },
    template: `
      <div style="padding:1rem;height:420px;box-sizing:border-box">
        <vx-data-grid [data]="rows" [columns]="columns" />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxDataGridComponent>;

export const Basic: Story = {};
