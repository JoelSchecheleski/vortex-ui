import type { Meta, StoryObj } from '@storybook/angular';
import { VxGanttComponent } from './gantt.component';

const meta: Meta<VxGanttComponent> = {
  title: 'Scheduling/Gantt',
  component: VxGanttComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => ({
    props: {
      tasks: [
        { id: '1', title: 'Design', start: '2026-11-01', end: '2026-11-08', progress: 80 },
        { id: '2', title: 'Build', start: '2026-11-06', end: '2026-11-20', progress: 35 },
      ],
    },
    template: `
      <div style="height:280px;padding:1rem;box-sizing:border-box">
        <vx-gantt [tasks]="tasks" />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxGanttComponent>;

export const Default: Story = {};
