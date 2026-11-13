import type { Meta, StoryObj } from '@storybook/angular';
import { VxPivotGridComponent } from './pivot-grid.component';

const data = [
  { region: 'África', product: 'A', amount: 120 },
  { region: 'Europa', product: 'A', amount: 200 },
  { region: 'África', product: 'B', amount: 90 },
];

const meta: Meta<VxPivotGridComponent> = {
  title: 'Data/PivotGrid',
  component: VxPivotGridComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      data,
      fields: {
        available: ['region', 'product', 'amount'],
        rows: ['region'],
        columns: ['product'],
        values: ['amount'],
      },
    },
    template: `<vx-pivot-grid [data]="data" [fields]="fields" />`,
  }),
};

export default meta;
type Story = StoryObj<VxPivotGridComponent>;

export const Default: Story = {};
