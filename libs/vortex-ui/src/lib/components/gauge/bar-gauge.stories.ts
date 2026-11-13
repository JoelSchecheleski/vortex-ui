import type { Meta, StoryObj } from '@storybook/angular';
import { VxBarGaugeComponent } from './bar-gauge.component';

const meta: Meta<VxBarGaugeComponent> = {
  title: 'Visualization/BarGauge',
  component: VxBarGaugeComponent,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'CPU', value: 45 },
      { label: 'RAM', value: 72 },
      { label: 'Disco', value: 33 },
    ],
  },
};

export default meta;
type Story = StoryObj<VxBarGaugeComponent>;

export const Default: Story = {};
