import type { Meta, StoryObj } from '@storybook/angular';
import { VxButtonComponent } from './button.component';

const meta: Meta<VxButtonComponent> = {
  title: 'Components/Button',
  component: VxButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
  },
  render: (args) => ({
    props: args,
    template: `<vx-button [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading">Ação</vx-button>`,
  }),
};

export default meta;
type Story = StoryObj<VxButtonComponent>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const Loading: Story = {
  args: { loading: true },
};

export const Danger: Story = {
  args: { variant: 'danger' },
};
