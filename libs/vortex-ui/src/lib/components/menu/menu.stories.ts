import type { Meta, StoryObj } from '@storybook/angular';
import { VxMenuComponent } from './menu.component';

const meta: Meta<VxMenuComponent> = {
  title: 'Navigation/Menu',
  component: VxMenuComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: [
        { id: '1', label: 'Início' },
        { id: '2', label: 'Relatórios' },
        {
          id: '3',
          label: 'Mais',
          children: [{ id: '3a', label: 'Exportar' }],
        },
      ],
    },
    template: `<vx-menu [items]="items" />`,
  }),
};

export default meta;
type Story = StoryObj<VxMenuComponent>;

export const Default: Story = {};
