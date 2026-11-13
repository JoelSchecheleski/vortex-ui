import type { Meta, StoryObj } from '@storybook/angular';
import { VxDateBoxComponent } from './date-box.component';

const meta: Meta<VxDateBoxComponent> = {
  title: 'Forms/DateBox',
  component: VxDateBoxComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { value: '2026-11-13' },
    template: `
      <vx-date-box style="display:block;max-width:280px" label="Data" [(value)]="value" />
    `,
  }),
};

export default meta;
type Story = StoryObj<VxDateBoxComponent>;

export const Default: Story = {};
