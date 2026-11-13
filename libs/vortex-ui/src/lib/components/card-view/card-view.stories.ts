import type { Meta, StoryObj } from '@storybook/angular';
import { VxCardViewComponent } from './card-view.component';

const meta: Meta<VxCardViewComponent> = {
  title: 'Data/CardView',
  component: VxCardViewComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      selectedIds: [] as string[],
      fields: [
        { field: 'region', label: 'Região' },
        { field: 'amount', label: 'Valor' },
      ],
      items: [
        { id: '1', title: 'SolarMax', subtitle: 'Produto', data: { region: 'África', amount: '$4k' } },
        { id: '2', title: 'EcoCharge', subtitle: 'Produto', data: { region: 'Europa', amount: '$6k' } },
      ],
    },
    template: `<vx-card-view [items]="items" [fields]="fields" [(selectedIds)]="selectedIds" />`,
  }),
};

export default meta;
type Story = StoryObj<VxCardViewComponent>;

export const Default: Story = {};
