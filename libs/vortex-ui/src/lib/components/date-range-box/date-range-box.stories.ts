import type { Meta, StoryObj } from '@storybook/angular';
import { VxDateRangeBoxComponent } from './date-range-box.component';

const meta: Meta<VxDateRangeBoxComponent> = {
  title: 'Forms/DateRangeBox',
  component: VxDateRangeBoxComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { start: '2026-11-01', end: '2026-11-13' },
    template: `
      <vx-date-range-box style="display:block;max-width:360px" [(start)]="start" [(end)]="end" />
    `,
  }),
};

export default meta;
type Story = StoryObj<VxDateRangeBoxComponent>;

export const Default: Story = {};
