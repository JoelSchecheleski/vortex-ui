import type { Meta, StoryObj } from '@storybook/angular';
import { VxSelectBoxComponent } from './select-box.component';

const meta: Meta<VxSelectBoxComponent> = {
  title: 'Forms/SelectBox',
  component: VxSelectBoxComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: ['Opção A', 'Opção B', 'Opção C'],
      value: 'Opção A',
    },
    template: `
      <vx-select-box style="display:block;max-width:280px" [items]="items" [(value)]="value" label="Região" />
    `,
  }),
};

export default meta;
type Story = StoryObj<VxSelectBoxComponent>;

export const Default: Story = {};
