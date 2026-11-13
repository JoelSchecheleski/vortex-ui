import type { Meta, StoryObj } from '@storybook/angular';
import { VxDraggableComponent } from './draggable.component';

const meta: Meta<VxDraggableComponent> = {
  title: 'Components/Draggable',
  component: VxDraggableComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { x: 0, y: 0 },
    template: `
      <span style="display:inline-block;padding:2rem;background:var(--vx-color-bg-muted)">
        <vx-draggable [(x)]="x" [(y)]="y">
          <span style="padding:0.5rem 1rem;background:var(--vx-color-primary);color:#fff;border-radius:6px">Arraste</span>
        </vx-draggable>
      </span>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxDraggableComponent>;

export const Default: Story = {};
