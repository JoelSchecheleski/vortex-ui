import type { Meta, StoryObj } from '@storybook/angular';
import { VxCircularGaugeComponent } from './circular-gauge.component';

const meta: Meta<VxCircularGaugeComponent> = {
  title: 'Visualization/CircularGauge',
  component: VxCircularGaugeComponent,
  tags: ['autodocs'],
  args: { value: 72, min: 0, max: 100 },
};

export default meta;
type Story = StoryObj<VxCircularGaugeComponent>;

export const Default: Story = {};
