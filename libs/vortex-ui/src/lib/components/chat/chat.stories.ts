import type { Meta, StoryObj } from '@storybook/angular';
import { VxChatComponent } from './chat.component';

const meta: Meta<VxChatComponent> = {
  title: 'Messaging/Chat',
  component: VxChatComponent,
  tags: ['autodocs'],
  render: () => ({
    props: {
      messages: [
        { id: '1', author: 'Ana', text: 'Bom dia!' },
        { id: '2', author: 'Você', text: 'Tudo certo por aqui.', mine: true },
      ],
    },
    template: `<div style="height:320px;max-width:420px"><vx-chat [messages]="messages" /></div>`,
  }),
};

export default meta;
type Story = StoryObj<VxChatComponent>;

export const Default: Story = {};
