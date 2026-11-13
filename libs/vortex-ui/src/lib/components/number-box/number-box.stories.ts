import type { Meta, StoryObj } from '@storybook/angular';
import { VxNumberBoxComponent } from './number-box.component';

const meta: Meta<VxNumberBoxComponent> = {
  title: 'Forms/NumberBox',
  component: VxNumberBoxComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { value: 42 },
    template: `
      <vx-number-box style="display:block;max-width:200px" label="Quantidade" [(value)]="value" [min]="0" [max]="100" />
    `,
  }),
};

export default meta;
type Story = StoryObj<VxNumberBoxComponent>;

export const Default: Story = {};
