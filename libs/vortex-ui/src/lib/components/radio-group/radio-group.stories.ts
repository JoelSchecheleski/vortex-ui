import type { Meta, StoryObj } from '@storybook/angular';
import { VxRadioGroupComponent } from './radio-group.component';

const meta: Meta<VxRadioGroupComponent> = {
  title: 'Forms/RadioGroup',
  component: VxRadioGroupComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { items: ['Mensal', 'Anual'], value: 'Mensal' },
    template: `<vx-radio-group label="Plano" [items]="items" [(value)]="value" />`,
  }),
};

export default meta;
type Story = StoryObj<VxRadioGroupComponent>;

export const Default: Story = {};
