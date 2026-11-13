import type { Meta, StoryObj } from '@storybook/angular';
import { VxSparklineComponent } from './sparkline.component';

const meta: Meta<VxSparklineComponent> = {
  title: 'Visualization/Sparkline',
  component: VxSparklineComponent,
  tags: ['autodocs'],
  args: { data: [3, 7, 5, 9, 12, 8, 14] },
};

export default meta;
type Story = StoryObj<VxSparklineComponent>;

export const Default: Story = {};
export const LineOnly: Story = { args: { showArea: false } };
