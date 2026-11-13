import type { Meta, StoryObj } from '@storybook/angular';
import { VxFileManagerComponent } from './file-manager.component';

const meta: Meta<VxFileManagerComponent> = {
  title: 'File/FileManager',
  component: VxFileManagerComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => ({
    props: {
      items: [
        { id: 'd1', name: 'Documentos', isDirectory: true, parentId: null },
        { id: 'f1', name: 'relatorio.pdf', isDirectory: false, parentId: 'd1', size: 2048 },
        { id: 'f2', name: 'planilha.xlsx', isDirectory: false, parentId: 'd1', size: 4096 },
      ],
    },
    template: `
      <div style="height:420px;padding:1rem;box-sizing:border-box">
        <vx-file-manager [items]="items" />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxFileManagerComponent>;

export const Default: Story = {};
