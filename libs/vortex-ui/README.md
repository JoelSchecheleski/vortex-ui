# @joel_jsp/vortex-ui

**VortexUI** — suite de componentes Angular 22+ (Standalone, Signals, zoneless-ready), com DataGrid de alta performance, AI opt-in e temas Fluent / LDS.

Repositório: [JoelSchecheleski/vortex-ui](https://github.com/JoelSchecheleski/vortex-ui)

## Install (npm privado)

```bash
npm login
npm install @joel_jsp/vortex-ui
```

Se o pacote for **restricted**, quem for instalar precisa ter acesso à organização/usuário npm.

## Uso

```ts
import { VxButtonComponent, VxDataGridComponent, VortexThemeService } from '@joel_jsp/vortex-ui';
import { VortexMockAIIntegration, VortexAIConfig } from '@joel_jsp/vortex-ui/ai';
```

```css
@import '@joel_jsp/vortex-ui/styles/vortex-ui.css';
```

```ts
inject(VortexThemeService).setTheme('fluent-blue-light');
// fluent-blue-dark | fluent-saas-light | fluent-saas-dark | lds
```

## Temas

| ID | Descrição |
|----|-----------|
| `fluent-blue-light` | Default (alias `fluent`) |
| `fluent-blue-dark` | Fluent Blue Dark |
| `fluent-saas-light` | Fluent SaaS Light |
| `fluent-saas-dark` | Fluent SaaS Dark |
| `lds` | LDS (Poppins) |

## Dev (monorepo)

```bash
npm start                 # Widgets Gallery :4200
npm run build             # build da lib
npm run storybook         # Storybook
```

## License

MIT
