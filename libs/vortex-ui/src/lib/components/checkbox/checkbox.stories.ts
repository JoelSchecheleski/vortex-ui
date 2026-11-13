import type { Meta, StoryObj } from '@storybook/angular';
import { VxCheckboxComponent } from './checkbox.component';

const meta: Meta<VxCheckboxComponent> = {
  title: 'Components/Checkbox',
  component: VxCheckboxComponent,
  tags: ['autodocs'],
  args: { label: 'Aceito os termos', disabled: false, checked: false },
  render: (args) => ({
    props: args,
    template: `<vx-checkbox [(checked)]="checked" [label]="label" [disabled]="disabled" />`,
  }),
};

export default meta;
type Story = StoryObj<VxCheckboxComponent>;

export const Default: Story = {};
export const Checked: Story = { args: { checked: true } };
