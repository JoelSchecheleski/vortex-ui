import type { Meta, StoryObj } from '@storybook/angular';
import { VxContextMenuComponent } from './context-menu.component';

const meta: Meta<VxContextMenuComponent> = {
  title: 'Navigation/ContextMenu',
  component: VxContextMenuComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      items: [
        { id: '1', label: 'Copiar' },
        { id: '2', label: 'Colar' },
        { id: '3', label: 'Excluir', disabled: true },
      ],
    },
    template: `
      <vx-context-menu [items]="items">
        <div style="padding:2rem;background:var(--vx-color-bg-muted)">Clique com o botão direito</div>
      </vx-context-menu>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxContextMenuComponent>;

export const Default: Story = {};
