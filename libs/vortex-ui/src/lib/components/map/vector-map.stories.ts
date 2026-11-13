import type { Meta, StoryObj } from '@storybook/angular';
import { VxVectorMapComponent } from './vector-map.component';

const meta: Meta<VxVectorMapComponent> = {
  title: 'Maps/VectorMap',
  component: VxVectorMapComponent,
  tags: ['autodocs'],
  args: {
    selected: 'br',
    regions: [
      { id: 'br', name: 'Brasil', d: 'M120,200 L200,180 L240,220 L180,260 Z' },
      { id: 'pt', name: 'Portugal', d: 'M60,120 L100,100 L120,140 L80,160 Z' },
    ],
  },
};

export default meta;
type Story = StoryObj<VxVectorMapComponent>;

export const Default: Story = {};
