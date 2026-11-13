import { Injectable, signal } from '@angular/core';

export type VxToastVariant = 'default' | 'success' | 'danger' | 'info';

export interface VxToastItem {
  id: string;
  message: string;
  variant: VxToastVariant;
  durationMs: number;
}

@Injectable({ providedIn: 'root' })
export class VxToastService {
  readonly toasts = signal<VxToastItem[]>([]);

  show(
    message: string,
    options?: { variant?: VxToastVariant; durationMs?: number }
  ): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const item: VxToastItem = {
      id,
      message,
      variant: options?.variant ?? 'default',
      durationMs: options?.durationMs ?? 3200,
    };
    this.toasts.update((list) => [...list, item]);
    if (item.durationMs > 0) {
      window.setTimeout(() => this.dismiss(id), item.durationMs);
    }
    return id;
  }

  success(message: string): string {
    return this.show(message, { variant: 'success' });
  }

  danger(message: string): string {
    return this.show(message, { variant: 'danger' });
  }

  info(message: string): string {
    return this.show(message, { variant: 'info' });
  }

  dismiss(id: string): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}
