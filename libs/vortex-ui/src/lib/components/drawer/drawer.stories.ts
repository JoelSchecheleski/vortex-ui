import type { Meta, StoryObj } from '@storybook/angular';
import { VxDrawerComponent } from './drawer.component';

const meta: Meta<VxDrawerComponent> = {
  title: 'Navigation/Drawer',
  component: VxDrawerComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { open: true, title: 'Navegação' },
    template: `
      <div style="height:320px;border:1px solid var(--vx-color-border)">
        <vx-drawer [(open)]="open" [title]="title">
          <p style="margin:0">Links e filtros laterais.</p>
          <div vx-drawer-content style="padding:1rem">Conteúdo principal</div>
        </vx-drawer>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxDrawerComponent>;

export const Default: Story = {};
