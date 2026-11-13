import type { Meta, StoryObj } from '@storybook/angular';
import { VxSwitchComponent } from './switch.component';

const meta: Meta<VxSwitchComponent> = {
  title: 'Components/Switch',
  component: VxSwitchComponent,
  tags: ['autodocs'],
  args: { label: 'Notificações', disabled: false, checked: true },
  render: (args) => ({
    props: args,
    template: `<vx-switch [(checked)]="checked" [label]="label" [disabled]="disabled" />`,
  }),
};

export default meta;
type Story = StoryObj<VxSwitchComponent>;

export const Default: Story = {};
export const Off: Story = { args: { checked: false } };
