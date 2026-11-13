# VortexUI

**Angular 22+ component suite** — Standalone, Signals-first, zoneless-ready.  
DataGrid de alta performance, File Manager, Charts, Scheduler, AI opt-in e temas Fluent / LDS.

[![npm](https://img.shields.io/npm/v/@joel_jsp/vortex-ui.svg)](https://www.npmjs.com/package/@joel_jsp/vortex-ui)
[![license](https://img.shields.io/npm/l/@joel_jsp/vortex-ui.svg)](./LICENSE)
[![Angular](https://img.shields.io/badge/Angular-22%2B-dd0031)](https://angular.dev/)

📦 **npm:** [`@joel_jsp/vortex-ui`](https://www.npmjs.com/package/@joel_jsp/vortex-ui)  
📂 **GitHub:** [JoelSchecheleski/vortex-ui](https://github.com/JoelSchecheleski/vortex-ui)

---

## Por que VortexUI?

| Diferencial | Detalhe |
|-------------|---------|
| **Angular nativo** | 100% Standalone + `input()` / `model()` / `output()` / `signal` / `computed` |
| **Zoneless** | `OnPush` e compatível com apps sem Zone.js |
| **DataGrid** | Virtualização, remote DataSource (1M+ rows), sort/filter/group/edit/export |
| **AI opt-in** | Assistant + AI Columns via entry separado `@joel_jsp/vortex-ui/ai` |
| **Temas** | Design tokens `--vx-*` · Fluent Blue/SaaS (Light/Dark) · LDS |
| **Tree-shakeable** | Importe só o que usa; CSS e AI não entram no bundle se não forem referenciados |

Inspirado na superfície de produto DevExtreme — **implementação própria**, MIT.

---

## Install

```bash
npm install @joel_jsp/vortex-ui
```

**Peers:** `@angular/core`, `@angular/common`, `@angular/forms` ^22.

---

## Setup rápido (3 passos)

### 1. Estilos (uma vez no app)

No `styles` do `angular.json` / `project.json`, ou no CSS global:

```css
@import '@joel_jsp/vortex-ui/styles/vortex-ui.css';
```

### 2. Tema

```ts
import { inject, ApplicationConfig, provideAppInitializer } from '@angular/core';
import { VortexThemeService } from '@joel_jsp/vortex-ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      inject(VortexThemeService).setTheme('fluent-blue-light');
    }),
  ],
};
```

Ou em qualquer componente:

```ts
inject(VortexThemeService).setTheme('fluent-saas-dark');
```

### 3. Use um componente

```ts
import { Component } from '@angular/core';
import { VxButtonComponent, VxDataGridComponent, VxColumnDef } from '@joel_jsp/vortex-ui';

@Component({
  standalone: true,
  imports: [VxButtonComponent, VxDataGridComponent],
  template: `
    <vx-button variant="primary">Salvar</vx-button>

    <vx-data-grid
      [columns]="columns"
      [data]="rows"
      [rowHeight]="36"
      [virtualScroll]="true"
    />
  `,
})
export class DemoPage {
  readonly columns: VxColumnDef[] = [
    { field: 'id', header: 'ID', width: 72 },
    { field: 'product', header: 'Produto' }, // fluida (preenche o grid)
    { field: 'region', header: 'Região', minWidth: 100 },
  ];
  readonly rows = [
    { id: 1, product: 'SolarMax', region: 'África' },
    { id: 2, product: 'EcoCharge', region: 'Europa' },
  ];
}
```

---

## Temas

Aplique via `data-vx-theme` (feito automaticamente pelo `VortexThemeService`):

| ID | Descrição |
|----|-----------|
| `fluent-blue-light` | **Default** (alias `fluent`) |
| `fluent-blue-dark` | Fluent Blue Dark |
| `fluent-saas-light` | Fluent SaaS Light |
| `fluent-saas-dark` | Fluent SaaS Dark |
| `lds` | LDS (Poppins + guideline interno) |

```ts
import { VortexThemeService, VORTEX_THEMES, VORTEX_THEME_LABELS } from '@joel_jsp/vortex-ui';

const themes = inject(VortexThemeService);
themes.setTheme('lds');
themes.toggleTheme(); // cicla pelos oficiais
```

Componentes usam **somente** tokens `--vx-*` (sem hex hardcoded no core).

---

## AI (opt-in)

A IA **não** entra no bundle principal. Use o secondary entry:

```ts
import {
  VortexAIConfig,
  VortexMockAIIntegration,
} from '@joel_jsp/vortex-ui/ai';
```

```ts
readonly aiConfig: VortexAIConfig = {
  enabled: true,
  assistant: { enabled: true, title: 'AI Assistant' },
  contextFields: ['id', 'product', 'region'],
  maxRowsInContext: 50,
};

readonly ai = new VortexMockAIIntegration();
```

```html
<vx-data-grid
  [columns]="columns"
  [data]="rows"
  [ai]="aiConfig"
  [aiIntegration]="ai"
/>
```

- Deny by default (`ai.enabled = false`)
- Contexto tipado (não lê o DOM)
- Command bus / allowlist de ações
- Pluggable: troque o mock por OpenAI, Azure, modelo local, etc.

---

## Catálogo (v0.1)

### Data & grids
`vx-data-grid` · `vx-tree-list` · `vx-card-view` · `vx-pivot-grid` · `vx-pivot-field-chooser` · `vx-filter-builder` · `vx-list`

### Forms & editors
`vx-form` · `vx-text-box` · `vx-text-area` · `vx-number-box` · `vx-select-box` · `vx-date-box` · `vx-date-range-box` · `vx-checkbox` · `vx-switch` · `vx-radio-group` · `vx-slider` · `vx-range-slider` · `vx-color-box` · `vx-tag-box` · `vx-autocomplete` · `vx-lookup` · `vx-calendar` · `vx-field-set` · validation summary

### Buttons & actions
`vx-button` · `vx-button-group` · `vx-drop-down-button` · `vx-fab`

### Navigation & layout
`vx-tabs` · `vx-accordion` · `vx-drawer` · `vx-menu` · `vx-tree-view` · `vx-splitter` · `vx-stepper` · `vx-toolbar` · `vx-box` · `vx-multi-view` · `vx-pagination` · `vx-gallery` · `vx-tile-view` · `vx-scroll-view`

### Feedback & overlays
`vx-dialog` · `vx-toast` · `vx-load-panel` · `vx-tooltip` · `vx-popover` · `vx-context-menu` · `vx-action-sheet` · progress / load-indicator

### Visualization
`vx-chart` (bar/line/area/pie/funnel/polar) · `vx-sparkline` · `vx-bullet` · `vx-funnel` · `vx-tree-map` · `vx-sankey` · gauges · `vx-diagram`

### Scheduling & files
`vx-scheduler` (day/week/month) · `vx-gantt` · `vx-file-manager` · `vx-file-uploader`

### Messaging & maps
`vx-chat` · `vx-html-editor` · `vx-map` · `vx-vector-map`

### Wrappers
`vx-draggable` · `vx-sortable` · `vx-resizable`

> Maturidade atual: **M0–M1** na maior parte da Super Suite; DataGrid / temas / AI Foundation mais avançados. Roadmap no [PRD](https://github.com/JoelSchecheleski/vortex-ui/blob/main/VortexUI-PRD.md).

---

## DataGrid — tips

```html
<vx-data-grid
  [columns]="columns"
  [data]="rows"
  [dataSource]="remoteSource"
  [virtualScroll]="true"
  [editable]="true"
  [exportEnabled]="true"
  (cellEdit)="onEdit($event)"
/>
```

- **Sem `width`** → coluna fluida (reparte o espaço do container, estilo DX)
- **Com `width`** → fixa; use `minWidth` nas fluidas
- Remote: implemente `VxDataSource` / use `VxRemoteMockDataSource` nos demos
- Export CSV nativo na toolbar

---

## Entries do pacote

| Import | Conteúdo |
|--------|----------|
| `@joel_jsp/vortex-ui` | Componentes + theme + validators |
| `@joel_jsp/vortex-ui/ai` | AI Bridge, dialogs, mock integration |
| `@joel_jsp/vortex-ui/styles/vortex-ui.css` | Tokens + temas oficiais |

---

## Requisitos

- Node 20+ recomendado  
- Angular **22+**  
- TypeScript 5.x  

---

## Desenvolvimento (monorepo)

```bash
git clone https://github.com/JoelSchecheleski/vortex-ui.git
cd vortex-ui
npm install
npm start              # Widgets Gallery → http://localhost:4200
npm run storybook      # Storybook
npm run build          # build da lib
npm run prepare:npm    # artefato em dist/libs/vortex-ui
```

---

## License

MIT © [Joel Schecheleski](https://github.com/JoelSchecheleski)
