import type { Meta, StoryObj } from '@storybook/angular';
import { VxTextAreaComponent } from './text-area.component';

const meta: Meta<VxTextAreaComponent> = {
  title: 'Forms/TextArea',
  component: VxTextAreaComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { value: 'Notas do projeto…' },
    template: `
      <vx-text-area style="display:block;max-width:360px" placeholder="Escreva…" [(value)]="value" [rows]="4" />
    `,
  }),
};

export default meta;
type Story = StoryObj<VxTextAreaComponent>;

export const Default: Story = {};
