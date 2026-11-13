import type { Meta, StoryObj } from '@storybook/angular';
import { VxDialogComponent } from './dialog.component';

const meta: Meta<VxDialogComponent> = {
  title: 'Feedback/Dialog',
  component: VxDialogComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { open: true, title: 'Confirmar ação' },
    template: `
      <vx-dialog [(open)]="open" [title]="title">
        <p>Deseja continuar com esta operação?</p>
      </vx-dialog>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxDialogComponent>;

export const Default: Story = {};
export const Large: Story = {
  render: () => ({
    props: { open: true, title: 'Detalhes', size: 'lg' as const },
    template: `<vx-dialog [(open)]="open" [title]="title" [size]="size"><p>Conteúdo amplo do diálogo.</p></vx-dialog>`,
  }),
};
