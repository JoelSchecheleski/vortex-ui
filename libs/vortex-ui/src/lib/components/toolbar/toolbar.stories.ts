import type { Meta, StoryObj } from '@storybook/angular';
import { VxToolbarComponent } from './toolbar.component';
import { VxButtonComponent } from '../button/button.component';

const meta: Meta<VxToolbarComponent> = {
  title: 'Components/Toolbar',
  component: VxToolbarComponent,
  tags: ['autodocs'],
  render: () => ({
    template: `
      <vx-toolbar>
        <span vx-toolbar-start><vx-button size="sm">Novo</vx-button></span>
        <span vx-toolbar-end><vx-button size="sm" variant="outline">Exportar</vx-button></span>
      </vx-toolbar>
    `,
    moduleMetadata: { imports: [VxToolbarComponent, VxButtonComponent] },
  }),
};

export default meta;
type Story = StoryObj<VxToolbarComponent>;

export const Default: Story = {};
