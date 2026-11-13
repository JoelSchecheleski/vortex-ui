import type { Meta, StoryObj } from '@storybook/angular';
import { VxTooltipComponent } from './tooltip.component';

const meta: Meta<VxTooltipComponent> = {
  title: 'Feedback/Tooltip',
  component: VxTooltipComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { text: 'Mais informações' },
    template: `<vx-tooltip [text]="text"><span>Hover aqui</span></vx-tooltip>`,
  }),
};

export default meta;
type Story = StoryObj<VxTooltipComponent>;

export const Default: Story = {};
