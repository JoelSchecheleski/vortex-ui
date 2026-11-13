import type { Meta, StoryObj } from '@storybook/angular';
import { VxButtonGroupComponent } from './button-group.component';

const meta: Meta<VxButtonGroupComponent> = {
  title: 'Components/ButtonGroup',
  component: VxButtonGroupComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { items: ['Dia', 'Semana', 'Mês'], value: 'Semana' },
    template: `<vx-button-group [items]="items" [(value)]="value" />`,
  }),
};

export default meta;
type Story = StoryObj<VxButtonGroupComponent>;

export const Default: Story = {};
