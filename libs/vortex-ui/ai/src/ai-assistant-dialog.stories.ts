import type { Meta, StoryObj } from '@storybook/angular';
import { VxAIAssistantDialogComponent } from './ai-assistant-dialog.component';

const meta: Meta<VxAIAssistantDialogComponent> = {
  title: 'AI/Assistant Dialog',
  component: VxAIAssistantDialogComponent,
  tags: ['autodocs'],
  args: {
    open: true,
    title: 'AI Assistant',
    suggestions: [
      { id: '1', label: 'Filter Sector by Health' },
      { id: '2', label: 'Sort by Region' },
      { id: '3', label: 'Group by Product' },
    ],
    messages: [],
  },
  render: (args) => ({
    props: args,
    template: `
      <vx-ai-assistant-dialog
        [open]="open"
        [title]="title"
        [suggestions]="suggestions"
        [messages]="messages"
      />
    `,
  }),
};

export default meta;
type Story = StoryObj<VxAIAssistantDialogComponent>;

export const Empty: Story = {};

export const WithMessages: Story = {
  args: {
    messages: [
      { role: 'user', content: 'Filtrar setor Saúde' },
      {
        role: 'assistant',
        title: 'Filtro aplicado',
        content: 'Apliquei filter.set em sector = Saúde.',
      },
    ],
  },
};
