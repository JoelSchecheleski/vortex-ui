import type { Meta, StoryObj } from '@storybook/angular';
import { VxLoadIndicatorComponent } from './load-indicator.component';

const meta: Meta<VxLoadIndicatorComponent> = {
  title: 'Feedback/LoadIndicator',
  component: VxLoadIndicatorComponent,
  tags: ['autodocs'],
  args: { size: 'lg' as const },
};

export default meta;
type Story = StoryObj<VxLoadIndicatorComponent>;

export const Default: Story = {};
