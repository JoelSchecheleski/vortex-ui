import type { Meta, StoryObj } from '@storybook/angular';
import { VxTextBoxComponent } from './text-box.component';

const meta: Meta<VxTextBoxComponent> = {
  title: 'Editors/TextBox',
  component: VxTextBoxComponent,
  tags: ['autodocs'],
  args: {
    label: 'Nome',
    placeholder: 'Digite…',
    disabled: false,
  },
  render: (args) => ({
    props: { ...args, value: '' },
    template: `
      <vx-text-box
        style="display:block;max-width:320px"
        [(value)]="value"
        [label]="label"
        [placeholder]="placeholder"
        [disabled]="disabled"
      />
    `,
  }),
};

export default meta;
type Story = StoryObj<VxTextBoxComponent>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};
