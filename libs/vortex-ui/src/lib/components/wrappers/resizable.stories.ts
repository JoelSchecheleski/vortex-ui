import type { Meta, StoryObj } from '@storybook/angular';
import { VxResizableComponent } from './resizable.component';

const meta: Meta<VxResizableComponent> = {
  title: 'Components/Resizable',
  component: VxResizableComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { width: 240, height: 140 },
    template: `
      <vx-resizable [(width)]="width" [(height)]="height" style="display:block">
        <div style="height:100%;display:grid;place-items:center;background:var(--vx-color-bg-muted)">Redimensionável</div>
      </vx-resizable>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxResizableComponent>;

export const Default: Story = {};
