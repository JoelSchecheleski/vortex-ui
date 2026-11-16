# Fluent Full Icons (`vortex-ui/icons/fluent-full`)

Catálogo **completo** de [Fluent UI System Icons](https://github.com/microsoft/fluentui-system-icons) (**MIT**, Microsoft) para VortexUI.

> O core (`vortex-ui`) já traz um pack **curado** (~17 ícones) para uso imediato.  
> Este entry é **opt-in**: importe só se precisar do catálogo amplo (~2.9k nomes, sizes 16/20/24, `regular` + `filled`).

## Por que é separado?

| | Core curado | `icons/fluent-full` |
|--|-------------|---------------------|
| Bundle | leve, no pacote principal | não entra no bundle até você importar |
| Quantidade | ~17 aliases comuns | ~2.968 nomes Fluent |
| Import | `vortex-ui` | `vortex-ui/icons/fluent-full` |

## Setup

```ts
import { ApplicationConfig } from '@angular/core';
import {
  provideFluentFullIcons,
  FLUENT_FULL_ICON_NAMES,
} from 'vortex-ui/icons/fluent-full';
// npm: '@joel_jsp/vortex-ui/icons/fluent-full'

export const appConfig: ApplicationConfig = {
  providers: [provideFluentFullIcons()],
};
```

Depois use como qualquer ícone Vortex:

```html
<vx-icon name="home" />
<vx-icon name="arrow-download" variant="filled" size="24" />
<vx-button icon="dismiss" [iconOnly]="true" aria-label="Fechar" />
```

## Consultar nomes

- **Runtime:** `FLUENT_FULL_ICON_NAMES` (array ordenado)
- **Storybook:** `Icons / Fluent Full` (busca + grade)
- **Upstream (visual):** [icons_regular.md](https://github.com/microsoft/fluentui-system-icons/blob/main/icons_regular.md)

Convenção de nome: kebab-case do stem Fluent  
(`arrow_download` → `arrow-download`, `more_horizontal` → `more-horizontal`).

Aliases amigáveis do core (`close`, `download`, `check`, `more`) continuam válidos — o full pack **mergeia** por cima do curado, não o remove.

## Regenerar (mantenedores)

```bash
npm run icons:fluent-full
# = node scripts/generate-fluent-full-icons.mjs
```

Requer `@fluentui/svg-icons` instalado (devDependency do monorepo).
