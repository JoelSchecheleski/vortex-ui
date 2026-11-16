import type { Meta, StoryObj } from '@storybook/angular';
import { VxButtonComponent } from './button.component';

const meta: Meta<VxButtonComponent> = {
  title: 'Components/Button',
  component: VxButtonComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Botão com suporte a \`icon\` / \`iconOnly\` via \`vx-icon\` (Fluent MIT).

O core traz um pack curado. Para ~2.9k ícones Fluent, registre
\`provideFluentFullIcons()\` de \`vortex-ui/icons/fluent-full\`
(ver Storybook **Icons / Fluent Full**).
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    iconOnly: { control: 'boolean' },
    block: { control: 'boolean' },
    icon: { control: 'text' },
    iconPosition: { control: 'select', options: ['start', 'end'] },
    iconSet: { control: 'select', options: ['fluent', 'material'] },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    iconOnly: false,
    block: false,
    icon: undefined,
    iconPosition: 'start',
    iconSet: 'fluent',
  },
  render: (args) => ({
    props: args,
    template: `<vx-button
      [variant]="variant"
      [size]="size"
      [disabled]="disabled"
      [loading]="loading"
      [iconOnly]="iconOnly"
      [block]="block"
      [icon]="icon"
      [iconPosition]="iconPosition"
      [iconSet]="iconSet"
    >Ação</vx-button>`,
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

export const WithIcon: Story = {
  args: {
    icon: 'save',
    variant: 'primary',
  },
};

export const IconOnly: Story = {
  args: {
    icon: 'code',
    iconOnly: true,
    variant: 'outline',
    size: 'sm',
  },
  render: (args) => ({
    props: args,
    template: `<vx-button
      [variant]="variant"
      [size]="size"
      [iconOnly]="iconOnly"
      [icon]="icon"
      aria-label="Código"
    ></vx-button>`,
  }),
};

export const IconEnd: Story = {
  args: {
    icon: 'chevron-down',
    iconPosition: 'end',
    variant: 'outline',
  },
};
