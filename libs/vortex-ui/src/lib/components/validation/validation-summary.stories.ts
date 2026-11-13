import type { Meta, StoryObj } from '@storybook/angular';
import { VxValidationSummaryComponent } from './validation-summary.component';

const meta: Meta<VxValidationSummaryComponent> = {
  title: 'Forms/ValidationSummary',
  component: VxValidationSummaryComponent,
  tags: ['autodocs'],
  args: {
    errors: ['E-mail inválido', 'Senha muito curta'],
  },
};

export default meta;
type Story = StoryObj<VxValidationSummaryComponent>;

export const Default: Story = {};
