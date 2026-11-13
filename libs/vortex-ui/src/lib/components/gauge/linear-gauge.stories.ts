import type { Meta, StoryObj } from '@storybook/angular';
import { VxLinearGaugeComponent } from './linear-gauge.component';

const meta: Meta<VxLinearGaugeComponent> = {
  title: 'Visualization/LinearGauge',
  component: VxLinearGaugeComponent,
  tags: ['autodocs'],
  args: { value: 58, min: 0, max: 100 },
};

export default meta;
type Story = StoryObj<VxLinearGaugeComponent>;

export const Default: Story = {};
