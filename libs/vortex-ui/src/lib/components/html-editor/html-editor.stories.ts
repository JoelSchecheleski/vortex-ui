import type { Meta, StoryObj } from '@storybook/angular';
import { VxHtmlEditorComponent } from './html-editor.component';

const meta: Meta<VxHtmlEditorComponent> = {
  title: 'Messaging/HtmlEditor',
  component: VxHtmlEditorComponent,
  tags: ['autodocs'],
  render: () => ({
    props: { value: '<p>Olá <strong>mundo</strong></p>' },
    template: `
      <div style="max-width:640px;height:280px">
        <vx-html-editor [(value)]="value" />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<VxHtmlEditorComponent>;

export const Default: Story = {};
