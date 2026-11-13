import type { Meta, StoryObj } from '@storybook/angular';
import { VxSplitterComponent } from './splitter.component';

const meta: Meta<VxSplitterComponent> = {
  title: 'Navigation/Splitter',
  component: VxSplitterComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { ratio: 35 },
    template: `
      <div style="height:240px">
        <vx-splitter [(ratio)]="ratio">
          <div vx-splitter-pane-1 style="padding:0.75rem;background:var(--vx-color-bg-muted)">Painel A</div>
          <div vx-splitter-pane-2 style="padding:0.75rem">Painel B</div>
        </vx-splitter>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxSplitterComponent>;

export const Default: Story = {};
