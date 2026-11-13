import type { Meta, StoryObj } from '@storybook/angular';
import { VxPopoverComponent } from './popover.component';

const meta: Meta<VxPopoverComponent> = {
  title: 'Feedback/Popover',
  component: VxPopoverComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { open: true, title: 'Ajuda' },
    template: `
      <vx-popover [(open)]="open" [title]="title">
        <span vxPopoverTrigger>Detalhes</span>
        Texto explicativo do popover.
      </vx-popover>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxPopoverComponent>;

export const Default: Story = {};
