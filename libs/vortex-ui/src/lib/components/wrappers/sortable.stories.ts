import type { Meta, StoryObj } from '@storybook/angular';
import { VxSortableComponent } from './sortable.component';

const meta: Meta<VxSortableComponent> = {
  title: 'Components/Sortable',
  component: VxSortableComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: [
        { id: '1', text: 'Primeiro' },
        { id: '2', text: 'Segundo' },
        { id: '3', text: 'Terceiro' },
      ],
    },
    template: `<vx-sortable [(items)]="items" />`,
  }),
};

export default meta;
type Story = StoryObj<VxSortableComponent>;

export const Default: Story = {};
