import type { Meta, StoryObj } from '@storybook/angular';
import { VxScrollViewComponent } from './scroll-view.component';

const meta: Meta<VxScrollViewComponent> = {
  title: 'Components/ScrollView',
  component: VxScrollViewComponent,
  tags: ['autodocs'],
  render: () => ({
    template: `
      <vx-scroll-view style="display:block;height:120px;max-width:280px;border:1px solid var(--vx-color-border)">
        <p style="margin:0;padding:0.5rem">Conteúdo longo…</p>
        <p style="margin:0;padding:0.5rem">Linha 2</p>
        <p style="margin:0;padding:0.5rem">Linha 3</p>
        <p style="margin:0;padding:0.5rem">Linha 4</p>
        <p style="margin:0;padding:0.5rem">Linha 5</p>
      </vx-scroll-view>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxScrollViewComponent>;

export const Default: Story = {};
