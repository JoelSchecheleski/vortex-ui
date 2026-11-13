import type { Meta, StoryObj } from '@storybook/angular';
import { VxListComponent } from './list.component';

const meta: Meta<VxListComponent> = {
  title: 'Data/List',
  component: VxListComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: [
        { id: '1', text: 'SolarMax', secondaryText: 'África' },
        { id: '2', text: 'EcoCharge', secondaryText: 'Europa' },
        { id: '3', text: 'VoltEdge', secondaryText: 'Américas' },
      ],
      selectedIds: ['1'],
    },
    template: `<vx-list [items]="items" [(selectedIds)]="selectedIds" searchable />`,
  }),
};

export default meta;
type Story = StoryObj<VxListComponent>;

export const Default: Story = {};
