import type { Meta, StoryObj } from '@storybook/angular';
import { VxColorBoxComponent } from './color-box.component';

const meta: Meta<VxColorBoxComponent> = {
  title: 'Forms/ColorBox',
  component: VxColorBoxComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { value: '#0f6cbd' },
    template: `<vx-color-box [(value)]="value" />`,
  }),
};

export default meta;
type Story = StoryObj<VxColorBoxComponent>;

export const Default: Story = {};
