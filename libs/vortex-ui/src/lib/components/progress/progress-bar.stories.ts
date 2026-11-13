import type { Meta, StoryObj } from '@storybook/angular';
import { VxProgressBarComponent } from './progress-bar.component';

const meta: Meta<VxProgressBarComponent> = {
  title: 'Feedback/ProgressBar',
  component: VxProgressBarComponent,
  tags: ['autodocs'],
  args: { value: 62, label: 'Upload' },
};

export default meta;
type Story = StoryObj<VxProgressBarComponent>;

export const Default: Story = {};
export const Complete: Story = { args: { value: 100 } };
