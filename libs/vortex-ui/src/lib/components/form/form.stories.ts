import type { Meta, StoryObj } from '@storybook/angular';
import { VxFormComponent } from './form.component';

const meta: Meta<VxFormComponent> = {
  title: 'Forms/Form',
  component: VxFormComponent,
  tags: ['autodocs'],
  render: () => ({
    template: `
      <vx-form title="Perfil" subtitle="Dados básicos">
        <p style="margin:0">Conteúdo do formulário aqui.</p>
      </vx-form>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxFormComponent>;

export const Default: Story = {};
