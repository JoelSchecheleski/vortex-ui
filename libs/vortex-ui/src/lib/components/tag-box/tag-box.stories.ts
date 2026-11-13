import type { Meta, StoryObj } from '@storybook/angular';
import { VxTagBoxComponent } from './tag-box.component';

const meta: Meta<VxTagBoxComponent> = {
  title: 'Forms/TagBox',
  component: VxTagBoxComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { value: ['angular', 'design'] },
    template: `
      <vx-tag-box style="display:block;max-width:320px" label="Tags" [(value)]="value" />
    `,
  }),
};

export default meta;
type Story = StoryObj<VxTagBoxComponent>;

export const Default: Story = {};
