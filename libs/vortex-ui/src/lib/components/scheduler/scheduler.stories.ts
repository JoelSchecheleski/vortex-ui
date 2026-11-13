import type { Meta, StoryObj } from '@storybook/angular';
import { VxSchedulerComponent } from './scheduler.component';

const today = new Date();
today.setHours(0, 0, 0, 0);
const iso = (h: number, m = 0) => {
  const d = new Date(today);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const meta: Meta<VxSchedulerComponent> = {
  title: 'Scheduling/Scheduler',
  component: VxSchedulerComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      view: 'week' as const,
      appointments: [
        { id: '1', text: 'Stand-up', start: iso(9), end: iso(9, 30) },
        { id: '2', text: 'Review', start: iso(14), end: iso(15) },
      ],
    },
    template: `
      <div style="height:480px">
        <vx-scheduler [appointments]="appointments" [(view)]="view" />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxSchedulerComponent>;

export const Week: Story = {};

export const Month: Story = {
  render: () => ({
    props: {
      view: 'month' as const,
      appointments: [
        { id: '1', text: 'Release', start: iso(10), end: iso(11) },
        { id: '2', text: 'Demo', start: iso(15), end: iso(16) },
      ],
    },
    template: `
      <div style="height:520px">
        <vx-scheduler [appointments]="appointments" [(view)]="view" />
      </div>
    `,
  }),
};
