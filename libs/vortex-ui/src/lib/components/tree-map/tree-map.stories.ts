import type { Meta, StoryObj } from '@storybook/angular';
import { VxTreeMapComponent } from './tree-map.component';

const meta: Meta<VxTreeMapComponent> = {
  title: 'Visualization/TreeMap',
  component: VxTreeMapComponent,
  tags: ['autodocs'],
  args: {
    data: [
      { name: 'África', value: 42 },
      { name: 'Europa', value: 68 },
      { name: 'Ásia', value: 81 },
    ],
  },
};

export default meta;
type Story = StoryObj<VxTreeMapComponent>;

export const Default: Story = {};
