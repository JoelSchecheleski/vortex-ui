import type { Meta, StoryObj } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { VxToastOutletComponent } from './toast-outlet.component';
import { VxToastService } from './toast.service';
import { VxButtonComponent } from '../button/button.component';

@Component({
  selector: 'vx-story-toast',
  standalone: true,
  imports: [VxToastOutletComponent, VxButtonComponent],
  template: `
    <vx-toast-outlet />
    <vx-button (click)="show()">Mostrar toast</vx-button>
  `,
})
class StoryToastDemo {
  readonly toast = inject(VxToastService);
  show(): void {
    this.toast.success('Salvo com sucesso!');
  }
}

const meta: Meta<StoryToastDemo> = {
  title: 'Feedback/Toast',
  component: StoryToastDemo,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<StoryToastDemo>;

export const Default: Story = {};
