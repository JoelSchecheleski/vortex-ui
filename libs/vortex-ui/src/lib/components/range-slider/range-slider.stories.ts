import type { Meta, StoryObj } from '@storybook/angular';
import { VxRangeSliderComponent } from './range-slider.component';

const meta: Meta<VxRangeSliderComponent> = {
  title: 'Forms/RangeSlider',
  component: VxRangeSliderComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { start: 20, end: 75 },
    template: `
      <vx-range-slider style="display:block;max-width:280px" [(start)]="start" [(end)]="end" />
    `,
  }),
};

export default meta;
type Story = StoryObj<VxRangeSliderComponent>;

export const Default: Story = {};
