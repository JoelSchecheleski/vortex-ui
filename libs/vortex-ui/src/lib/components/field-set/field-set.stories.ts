import type { Meta, StoryObj } from '@storybook/angular';
import { VxFieldSetComponent } from './field-set.component';

const meta: Meta<VxFieldSetComponent> = {
  title: 'Forms/FieldSet',
  component: VxFieldSetComponent,
  tags: ['autodocs'],
  render: () => ({
    template: `
      <vx-field-set legend="Contato">
        <p style="margin:0">Campos do fieldset aqui.</p>
      </vx-field-set>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxFieldSetComponent>;

export const Default: Story = {};
