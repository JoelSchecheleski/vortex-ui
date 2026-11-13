import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'vx-file-uploader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="vx-fu" [attr.aria-label]="ariaLabel()">
      <input type="file" class="vx-fu__input" [multiple]="multiple()" [accept]="accept()" (change)="onFiles($event)" />
      <span class="vx-fu__box">
        <strong>{{ label() }}</strong>
        <small>{{ hint() }}</small>
      </span>
    </label>
  `,
  styles: `
    :host { display: block; }
    .vx-fu { display: block; font-family: var(--vx-font-sans); cursor: pointer; }
    .vx-fu__input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
    .vx-fu__box {
      display: flex; flex-direction: column; align-items: center; gap: var(--vx-space-1);
      padding: var(--vx-space-6); border: 2px dashed var(--vx-color-border);
      border-radius: var(--vx-radius-md); background: var(--vx-color-bg-muted);
      text-align: center; transition: border-color var(--vx-transition-fast);
    }
    .vx-fu:hover .vx-fu__box { border-color: var(--vx-color-primary); }
    .vx-fu__box strong { font-size: var(--vx-font-size-sm); }
    .vx-fu__box small { font-size: var(--vx-font-size-xs); color: var(--vx-color-text-secondary); }
  `,
})
export class VxFileUploaderComponent {
  readonly label = input('Arraste ou clique para enviar');
  readonly hint = input('Arquivos suportados');
  readonly accept = input('');
  readonly multiple = input(false);
  readonly ariaLabel = input('Envio de arquivo');
  readonly filesSelected = output<FileList>();

  onFiles(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files?.length) this.filesSelected.emit(files);
  }
}
