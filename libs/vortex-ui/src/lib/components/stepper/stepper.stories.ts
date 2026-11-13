import type { Meta, StoryObj } from '@storybook/angular';
import { VxStepperComponent } from './stepper.component';

const meta: Meta<VxStepperComponent> = {
  title: 'Navigation/Stepper',
  component: VxStepperComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      steps: [
        { id: '1', label: 'Conta' },
        { id: '2', label: 'Plano' },
        { id: '3', label: 'Confirmação' },
      ],
      activeIndex: 1,
    },
    template: `<vx-stepper [steps]="steps" [(activeIndex)]="activeIndex" />`,
  }),
};

export default meta;
type Story = StoryObj<VxStepperComponent>;

export const Default: Story = {};
