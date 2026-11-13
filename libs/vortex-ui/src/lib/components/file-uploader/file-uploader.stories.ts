import type { Meta, StoryObj } from '@storybook/angular';
import { VxFileUploaderComponent } from './file-uploader.component';

const meta: Meta<VxFileUploaderComponent> = {
  title: 'File/FileUploader',
  component: VxFileUploaderComponent,
  tags: ['autodocs'],
  args: { label: 'Enviar anexos', multiple: true },
};

export default meta;
type Story = StoryObj<VxFileUploaderComponent>;

export const Default: Story = {};
