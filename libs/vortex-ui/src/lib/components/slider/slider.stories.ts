import type { Meta, StoryObj } from '@storybook/angular';
import { VxSliderComponent } from './slider.component';

const meta: Meta<VxSliderComponent> = {
  title: 'Forms/Slider',
  component: VxSliderComponent,
  tags: ['autodocs'],
  args: { min: 0, max: 100, value: 40 },
  render: (args) => ({
    props: args,
    template: `<vx-slider style="display:block;max-width:280px" [(value)]="value" [min]="min" [max]="max" />`,
  }),
};

export default meta;
type Story = StoryObj<VxSliderComponent>;

export const Default: Story = {};
