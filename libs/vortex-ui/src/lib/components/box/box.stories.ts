import type { Meta, StoryObj } from '@storybook/angular';
import { VxBoxComponent } from './box.component';

const meta: Meta<VxBoxComponent> = {
  title: 'Components/Box',
  component: VxBoxComponent,
  tags: ['autodocs'],
  render: () => ({
    template: `
      <vx-box gap="var(--vx-space-2)">
        <span style="padding:0.5rem;background:var(--vx-color-bg-muted)">A</span>
        <span style="padding:0.5rem;background:var(--vx-color-bg-muted)">B</span>
        <span style="padding:0.5rem;background:var(--vx-color-bg-muted)">C</span>
      </vx-box>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxBoxComponent>;

export const Default: Story = {};
