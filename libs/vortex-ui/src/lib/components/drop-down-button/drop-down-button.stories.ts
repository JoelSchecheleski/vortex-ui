import type { Meta, StoryObj } from '@storybook/angular';
import { VxDropDownButtonComponent } from './drop-down-button.component';

const meta: Meta<VxDropDownButtonComponent> = {
  title: 'Components/DropDownButton',
  component: VxDropDownButtonComponent,
  tags: ['autodocs'],
  args: { label: 'Exportar', items: ['PDF', 'CSV', 'XLSX'] },
};

export default meta;
type Story = StoryObj<VxDropDownButtonComponent>;

export const Default: Story = {};
