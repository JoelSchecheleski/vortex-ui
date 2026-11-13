import type { Meta, StoryObj } from '@storybook/angular';
import { VxCalendarComponent } from './calendar.component';

const meta: Meta<VxCalendarComponent> = {
  title: 'Forms/Calendar',
  component: VxCalendarComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { selected: '2026-11-13' },
    template: `<vx-calendar [(selected)]="selected" />`,
  }),
};

export default meta;
type Story = StoryObj<VxCalendarComponent>;

export const Default: Story = {};
