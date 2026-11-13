# Temas VortexUI

## Fontes ThemeBuilder (referência)

Arquivos gerados pelo [DevExpress ThemeBuilder](https://js.devexpress.com/ThemeBuilder/) 26.1.6:

| Arquivo | Tema Vortex |
|---------|-------------|
| `dx-themebuilder/vx.fluent.BlueLight.css` | `fluent-blue-light` (default; alias `fluent`) |
| `dx-themebuilder/vx.fluent.BlueDark.css` | `fluent-blue-dark` |
| `dx-themebuilder/vx.fluent.SaaSLight.css` | `fluent-saas-light` |
| `dx-themebuilder/vx.fluent.SaaSDark.css` | `fluent-saas-dark` |

Os CSS completos (~25k linhas `.dx-*`) **não** são importados no runtime VortexUI.  
Os tokens `--dx-*` do `:root` foram mapeados para `--vx-*` em:

`libs/vortex-ui/src/lib/styles/themes/fluent-*.css`

## Tema interno

- **LDS** — `design/Guidelines-LDS.md` → `lds.css`
