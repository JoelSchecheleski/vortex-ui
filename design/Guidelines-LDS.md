# LDS Figma Make Themes

Custom theme for Figma Make based on the LDS GF Theme.

*Generated on 17/09/2025 using Figma Make UI Component Studio*

---

## Global Design Tokens

These foundational tokens should be applied at the root level of your application to maintain consistency across all components.

### Color Tokens

**CSS Custom Properties:**
```css
:root {
  --primary: #005C3A;
  --primary-foreground: #FFFFFF;
  --secondary: #BAD49D;
  --secondary-foreground: #212C16;
  --background: #F2F2F2;
  --foreground: #4A4A4A;
  --card: #FFFFFF;
  --card-foreground: #4A4A4A;
  --muted: #F2F2F2;
  --muted-foreground: #6E6E6E;
  --accent: #F2F2F2;
  --accent-foreground: #030213;
  --destructive: #D92020;
  --destructive-foreground: #ffffff;
  --border: #E6E6E6;
}
```

### Typography Tokens

Font family: **Poppins** (todas as escalas). Valores no formato `tamanho/line-height` · weight · letter-spacing.

```css
:root {
  --font-family: Poppins, system-ui, sans-serif;
  --font-size: 16px;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Baseline — Display */
  --type-display-lg-size: 57px;
  --type-display-lg-line: 64px;
  --type-display-lg-tracking: -0.25px;
  --type-display-md-size: 45px;
  --type-display-md-line: 52px;
  --type-display-md-tracking: 0;
  --type-display-sm-size: 36px;
  --type-display-sm-line: 44px;
  --type-display-sm-tracking: 0;

  /* Baseline — Headline */
  --type-headline-lg-size: 32px;
  --type-headline-lg-line: 40px;
  --type-headline-lg-tracking: 0;
  --type-headline-md-size: 28px;
  --type-headline-md-line: 36px;
  --type-headline-md-tracking: 0;
  --type-headline-sm-size: 24px;
  --type-headline-sm-line: 32px;
  --type-headline-sm-tracking: 0;

  /* Baseline — Title */
  --type-title-lg-size: 22px;
  --type-title-lg-line: 28px;
  --type-title-lg-tracking: 0;
  --type-title-md-size: 16px;
  --type-title-md-line: 24px;
  --type-title-md-tracking: 0.15px;
  --type-title-sm-size: 14px;
  --type-title-sm-line: 20px;
  --type-title-sm-tracking: 0.1px;

  /* Baseline — Label */
  --type-label-lg-size: 14px;
  --type-label-lg-line: 20px;
  --type-label-lg-tracking: 0.1px;
  --type-label-md-size: 12px;
  --type-label-md-line: 16px;
  --type-label-md-tracking: 0.5px;
  --type-label-sm-size: 11px;
  --type-label-sm-line: 16px;
  --type-label-sm-tracking: 0.5px;

  /* Baseline — Body */
  --type-body-lg-size: 16px;
  --type-body-lg-line: 24px;
  --type-body-lg-tracking: 0.5px;
  --type-body-md-size: 14px;
  --type-body-md-line: 20px;
  --type-body-md-tracking: 0.25px;
  --type-body-sm-size: 12px;
  --type-body-sm-line: 16px;
  --type-body-sm-tracking: 0.4px;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size);
  font-weight: var(--font-weight-regular);
}
```

#### Baseline (Primary)

| Style | Size / Line | Weight | Letter spacing |
| --- | --- | --- | --- |
| Display / Large / Primary | 57 / 64 | Regular (400) | -0.25px |
| Display / Medium / Primary | 45 / 52 | Regular (400) | 0 |
| Display / Small / Primary | 36 / 44 | Regular (400) | 0 |
| Headline / Large / Primary | 32 / 40 | Regular (400) | 0 |
| Headline / Medium / Primary | 28 / 36 | Regular (400) | 0 |
| Headline / Small / Primary | 24 / 32 | Regular (400) | 0 |
| Title / Large / Primary | 22 / 28 | Regular (400) | 0 |
| Title / Medium / Primary | 16 / 24 | Medium (500) | +0.15px |
| Title / Small / Primary | 14 / 20 | Medium (500) | +0.1px |
| Label / Large / Primary | 14 / 20 | Medium (500) | +0.1px |
| Label / Medium / Primary | 12 / 16 | Medium (500) | +0.5px |
| Label / Small / Primary | 11 / 16 | Medium (500) | +0.5px |
| Body / Large / Primary | 16 / 24 | Regular (400) | +0.5px |
| Body / Medium / Primary | 14 / 20 | Regular (400) | +0.25px |
| Body / Small / Primary | 12 / 16 | Regular (400) | +0.4px |

**CSS classes (Baseline):**
```css
.type-display-lg { font-family: Poppins, system-ui, sans-serif; font-size: 57px; line-height: 64px; font-weight: 400; letter-spacing: -0.25px; }
.type-display-md { font-family: Poppins, system-ui, sans-serif; font-size: 45px; line-height: 52px; font-weight: 400; letter-spacing: 0; }
.type-display-sm { font-family: Poppins, system-ui, sans-serif; font-size: 36px; line-height: 44px; font-weight: 400; letter-spacing: 0; }
.type-headline-lg { font-family: Poppins, system-ui, sans-serif; font-size: 32px; line-height: 40px; font-weight: 400; letter-spacing: 0; }
.type-headline-md { font-family: Poppins, system-ui, sans-serif; font-size: 28px; line-height: 36px; font-weight: 400; letter-spacing: 0; }
.type-headline-sm { font-family: Poppins, system-ui, sans-serif; font-size: 24px; line-height: 32px; font-weight: 400; letter-spacing: 0; }
.type-title-lg { font-family: Poppins, system-ui, sans-serif; font-size: 22px; line-height: 28px; font-weight: 400; letter-spacing: 0; }
.type-title-md { font-family: Poppins, system-ui, sans-serif; font-size: 16px; line-height: 24px; font-weight: 500; letter-spacing: 0.15px; }
.type-title-sm { font-family: Poppins, system-ui, sans-serif; font-size: 14px; line-height: 20px; font-weight: 500; letter-spacing: 0.1px; }
.type-label-lg { font-family: Poppins, system-ui, sans-serif; font-size: 14px; line-height: 20px; font-weight: 500; letter-spacing: 0.1px; }
.type-label-md { font-family: Poppins, system-ui, sans-serif; font-size: 12px; line-height: 16px; font-weight: 500; letter-spacing: 0.5px; }
.type-label-sm { font-family: Poppins, system-ui, sans-serif; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.5px; }
.type-body-lg { font-family: Poppins, system-ui, sans-serif; font-size: 16px; line-height: 24px; font-weight: 400; letter-spacing: 0.5px; }
.type-body-md { font-family: Poppins, system-ui, sans-serif; font-size: 14px; line-height: 20px; font-weight: 400; letter-spacing: 0.25px; }
.type-body-sm { font-family: Poppins, system-ui, sans-serif; font-size: 12px; line-height: 16px; font-weight: 400; letter-spacing: 0.4px; }
```

#### Emphasis (Emphasized)

Mesmos tamanhos, line-heights e letter-spacings do Baseline; weights mais fortes.

| Style | Size / Line | Weight | Letter spacing |
| --- | --- | --- | --- |
| Display / Large / Emphasized | 57 / 64 | Medium (500) | -0.25px |
| Display / Medium / Emphasized | 45 / 52 | Medium (500) | 0 |
| Display / Small / Emphasized | 36 / 44 | Medium (500) | 0 |
| Headline / Large / Emphasized | 32 / 40 | Medium (500) | 0 |
| Headline / Medium / Emphasized | 28 / 36 | Medium (500) | 0 |
| Headline / Small / Emphasized | 24 / 32 | Medium (500) | 0 |
| Title / Large / Emphasized | 22 / 28 | Medium (500) | 0 |
| Title / Medium / Emphasized | 16 / 24 | Bold (700) | +0.15px |
| Title / Small / Emphasized | 14 / 20 | Bold (700) | +0.1px |
| Label / Large / Emphasized | 14 / 20 | Bold (700) | +0.1px |
| Label / Medium / Emphasized | 12 / 16 | Bold (700) | +0.5px |
| Label / Small / Emphasized | 11 / 16 | Bold (700) | +0.5px |
| Body / Large / Emphasized | 16 / 24 | Medium (500) | +0.5px |
| Body / Medium / Emphasized | 14 / 20 | Medium (500) | +0.25px |
| Body / Small / Emphasized | 12 / 16 | Medium (500) | +0.4px |

**CSS classes (Emphasis):**
```css
.type-display-lg-em { font-family: Poppins, system-ui, sans-serif; font-size: 57px; line-height: 64px; font-weight: 500; letter-spacing: -0.25px; }
.type-display-md-em { font-family: Poppins, system-ui, sans-serif; font-size: 45px; line-height: 52px; font-weight: 500; letter-spacing: 0; }
.type-display-sm-em { font-family: Poppins, system-ui, sans-serif; font-size: 36px; line-height: 44px; font-weight: 500; letter-spacing: 0; }
.type-headline-lg-em { font-family: Poppins, system-ui, sans-serif; font-size: 32px; line-height: 40px; font-weight: 500; letter-spacing: 0; }
.type-headline-md-em { font-family: Poppins, system-ui, sans-serif; font-size: 28px; line-height: 36px; font-weight: 500; letter-spacing: 0; }
.type-headline-sm-em { font-family: Poppins, system-ui, sans-serif; font-size: 24px; line-height: 32px; font-weight: 500; letter-spacing: 0; }
.type-title-lg-em { font-family: Poppins, system-ui, sans-serif; font-size: 22px; line-height: 28px; font-weight: 500; letter-spacing: 0; }
.type-title-md-em { font-family: Poppins, system-ui, sans-serif; font-size: 16px; line-height: 24px; font-weight: 700; letter-spacing: 0.15px; }
.type-title-sm-em { font-family: Poppins, system-ui, sans-serif; font-size: 14px; line-height: 20px; font-weight: 700; letter-spacing: 0.1px; }
.type-label-lg-em { font-family: Poppins, system-ui, sans-serif; font-size: 14px; line-height: 20px; font-weight: 700; letter-spacing: 0.1px; }
.type-label-md-em { font-family: Poppins, system-ui, sans-serif; font-size: 12px; line-height: 16px; font-weight: 700; letter-spacing: 0.5px; }
.type-label-sm-em { font-family: Poppins, system-ui, sans-serif; font-size: 11px; line-height: 16px; font-weight: 700; letter-spacing: 0.5px; }
.type-body-lg-em { font-family: Poppins, system-ui, sans-serif; font-size: 16px; line-height: 24px; font-weight: 500; letter-spacing: 0.5px; }
.type-body-md-em { font-family: Poppins, system-ui, sans-serif; font-size: 14px; line-height: 20px; font-weight: 500; letter-spacing: 0.25px; }
.type-body-sm-em { font-family: Poppins, system-ui, sans-serif; font-size: 12px; line-height: 16px; font-weight: 500; letter-spacing: 0.4px; }
```

### Border & Shape Tokens

```css
:root {
  --radius: 0.5rem;
}
```

### Spacing Tokens

```css
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
}
```

### Shadow Tokens

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

---

## General Guidelines

This design system was created to ensure visual consistency across projects. Apply these styles by using inline styles or by creating CSS classes that match these specifications.

## Text Guidelines

Regras tipográficas e de escrita para labels, títulos, botões, placeholders, mensagens e qualquer texto de interface.

### Capitalização (sentence case)

* Use **sentence case** em toda a interface: somente a **primeira letra da frase** deve ser maiúscula; as demais letras devem ser minúsculas.
* Exceção: **nomes próprios**, marcas, siglas e códigos oficiais mantêm a capitalização correta (ex.: Localiza, LDS, CPF, GPS, Brasil).
* Não use Title Case em botões, menus, abas, títulos de seção, badges ou headers de tabela (ex.: evite "Salvar Alterações"; use "Salvar alterações").
* Placeholders e mensagens de ajuda também seguem sentence case (ex.: "Digite o número da placa").
* Siglas permanecem em maiúsculas (ex.: OS, NF, API).

**Exemplos:**
* ✅ "Criar ordem de serviço"
* ❌ "Criar Ordem De Serviço"
* ✅ "Dados do cliente Localiza"
* ❌ "DADOS DO CLIENTE"
* ✅ "Erro ao salvar. Tente novamente."
* ❌ "Erro Ao Salvar. Tente Novamente."

### Tom e clareza

* Prefira frases curtas e diretas.
* Evite jargão técnico desnecessário na interface do usuário final.
* Mensagens de erro devem explicar o problema e, quando possível, a ação esperada.

## Behavior Guidelines

Regras de comportamento de componentes e padrões de interação.

### Modal

* Ao abrir, o modal deve ocupar de forma **fixa 80% da altura e 80% da largura** do espaço de conteúdo da tela (área útil da aplicação, excluindo chrome externo do browser).
* O modal deve permanecer centralizado nesse espaço de conteúdo.
* Se o conteúdo interno ultrapassar a altura disponível do modal, a área de conteúdo deve exibir **scroll vertical** (o header/footer do modal, quando existirem, devem permanecer fixos).
* O overlay/backdrop cobre todo o espaço de conteúdo; o foco fica preso no modal enquanto ele estiver aberto.
* Fechar: ação explícita (botão fechar / cancelar) ou conforme regra do fluxo; não alterar o tamanho do modal dinamicamente pelo conteúdo.

**CSS Implementation:**
```css
.modal-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.4);
}

.modal {
  width: 80%;
  height: 80%;
  max-width: 80%;
  max-height: 80%;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  border-radius: 8px;
  font-family: Poppins, system-ui, sans-serif;
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.modal-header,
.modal-footer {
  flex-shrink: 0;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #E6E6E6;
}

.modal-footer {
  border-bottom: none;
  border-top: 1px solid #E6E6E6;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
}
```

**React Inline Style:**
```jsx
<div style={{
  width: '80%',
  height: '80%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: '8px',
  fontFamily: 'Poppins',
  backgroundColor: '#FFFFFF',
}}>
  <div style={{ flexShrink: 0 }}>{/* header */}</div>
  <div style={{ flex: 1, overflowY: 'auto' }}>{/* content */}</div>
  <div style={{ flexShrink: 0 }}>{/* footer */}</div>
</div>
```

## Button

Interactive elements that trigger actions or navigate users through the application.

### Default Variant

* **Size**: md
* **Font Family**: Poppins
* **Border Radius**: 8px
* **Padding**: 1.5rem

**CSS Implementation:**
```css
.button {
  size: md;
  font-family: Poppins;
  border-radius: 8px;
  padding: 1.5rem;
}
```

**React Inline Style:**
```jsx
<Component style={{
  size: 'md',
  fontFamily: 'Poppins',
  borderRadius: '8px',
  padding: '1.5rem',
}} />
```

### Secondary Variant

* **Padding**: 1.5rem
* **Border Radius**: 8px
* **Size**: md
* **Font Family**: Poppins

**CSS Implementation:**
```css
.button-secondary {
  padding: 1.5rem;
  border-radius: 8px;
  size: md;
  font-family: Poppins;
}
```

**React Inline Style:**
```jsx
<Component style={{
  padding: '1.5rem',
  borderRadius: '8px',
  size: 'md',
  fontFamily: 'Poppins',
}} />
```

### Outline Variant

* **Padding**: 1.5rem
* **Border Radius**: 8px
* **Size**: md
* **Font Family**: Poppins
* **Color**: #003418
* **Background Color**: #FFFFFF
* **Border Color**: #005C3A

**CSS Implementation:**
```css
.button-outline {
  padding: 1.5rem;
  border-radius: 8px;
  size: md;
  font-family: Poppins;
  color: #003418;
  background-color: #FFFFFF;
  border-color: #005C3A;
}
```

**React Inline Style:**
```jsx
<Component style={{
  padding: '1.5rem',
  borderRadius: '8px',
  size: 'md',
  fontFamily: 'Poppins',
  color: '#003418',
  backgroundColor: '#FFFFFF',
  borderColor: '#005C3A',
}} />
```

### Ghost Variant

* **Padding**: 1.5rem
* **Border Radius**: 8px
* **Size**: md
* **Font Family**: Poppins
* **Color**: #003418

**CSS Implementation:**
```css
.button-ghost {
  padding: 1.5rem;
  border-radius: 8px;
  size: md;
  font-family: Poppins;
  color: #003418;
}
```

**React Inline Style:**
```jsx
<Component style={{
  padding: '1.5rem',
  borderRadius: '8px',
  size: 'md',
  fontFamily: 'Poppins',
  color: '#003418',
}} />
```

### Destructive Variant

* **Padding**: 1.5rem
* **Border Radius**: 8px
* **Size**: md
* **Font Family**: Poppins
* **Color**: #FFFFFF
* **Background Color**: #D92020

**CSS Implementation:**
```css
.button-destructive {
  padding: 1.5rem;
  border-radius: 8px;
  size: md;
  font-family: Poppins;
  color: #FFFFFF;
  background-color: #D92020;
}
```

**React Inline Style:**
```jsx
<Component style={{
  padding: '1.5rem',
  borderRadius: '8px',
  size: 'md',
  fontFamily: 'Poppins',
  color: '#FFFFFF',
  backgroundColor: '#D92020',
}} />
```

### Destructive Ghost Variant

* **Padding**: 1.5rem
* **Border Radius**: 8px
* **Size**: md
* **Font Family**: Poppins
* **Color**: #720D0D

**CSS Implementation:**
```css
.button-destructive-ghost {
  padding: 1.5rem;
  border-radius: 8px;
  size: md;
  font-family: Poppins;
  color: #720D0D;
}
```

**React Inline Style:**
```jsx
<Component style={{
  padding: '1.5rem',
  borderRadius: '8px',
  size: 'md',
  fontFamily: 'Poppins',
  color: '#720D0D',
}} />
```

### Usage — qual variante usar

* **Primary (default)**: ações principais e de conclusão — **Confirmar**, **Salvar**, **Enviar**, **Cadastrar**, **Validar**, **Agendar**, e equivalentes. Em wizards/modais, o botão final da jornada é sempre primary.
* **Outline**: ações secundárias de navegação ou complemento — **Próximo**, **Anterior**, **Limpar**, **Fechar** (quando não for o único CTA), filtros e ações de toolbar não críticas.
* **Ghost**: ações terciárias de baixa ênfase, quando não houver borda/preenchimento necessários.
* **Destructive**: confirma ações irreversíveis destrutivas — **Confirmar cancelamento**, **Excluir**, **Remover**.
* **Destructive ghost**: **Cancelar** (sair/abortar o fluxo sem destruir dados). Não use destructive sólido para Cancelar.

Em footers de modal (`Cancelar` à esquerda · ação principal à direita), o padrão é: **Cancelar** = destructive ghost · **Confirmar** / ação final = primary.

---

## Input

Form elements for collecting user input.

### Default Variant

* **Background Color**: #FFFFFF
* **Size**: md
* **Font Family**: Poppins
* **Border Color**: #919191
* **Border Radius**: 8px
* **Border Width**: 1px
* **Padding**: 1.5rem

**CSS Implementation:**
```css
.input {
  background-color: #FFFFFF;
  size: md;
  font-family: Poppins;
  border-color: #919191;
  border-radius: 8px;
  border-width: 1px;
  padding: 1.5rem;
}
```

**React Inline Style:**
```jsx
<Component style={{
  backgroundColor: '#FFFFFF',
  size: 'md',
  fontFamily: 'Poppins',
  borderColor: '#919191',
  borderRadius: '8px',
  borderWidth: '1px',
  padding: '1.5rem',
}} />
```

---

## Textarea

Multi-line text input areas.

### Default Variant

* **Border Color**: #919191
* **Border Radius**: 8px
* **Border Width**: 1px
* **Size**: md
* **Font Family**: Poppins
* **Padding**: 0.75rem
* **Background Color**: #FFFFFF

**CSS Implementation:**
```css
.textarea {
  border-color: #919191;
  border-radius: 8px;
  border-width: 1px;
  size: md;
  font-family: Poppins;
  padding: 0.75rem;
  background-color: #FFFFFF;
}
```

**React Inline Style:**
```jsx
<Component style={{
  borderColor: '#919191',
  borderRadius: '8px',
  borderWidth: '1px',
  size: 'md',
  fontFamily: 'Poppins',
  padding: '0.75rem',
  backgroundColor: '#FFFFFF',
}} />
```

---

## Checkbox

Boolean input controls.

### Default Variant

* **Border Color**: #919191
* **Border Width**: 2px

**CSS Implementation:**
```css
.checkbox {
  border-color: #919191;
  border-width: 2px;
}
```

**React Inline Style:**
```jsx
<Component style={{
  borderColor: '#919191',
  borderWidth: '2px',
}} />
```

---

## Select

Dropdown selection components.

### Default Variant

* **Background Color**: #FFFFFF
* **Border Color**: #919191
* **Border Radius**: 8px
* **Size**: md
* **Font Family**: Poppins
* **Padding**: 1.5rem

**CSS Implementation:**
```css
.select {
  background-color: #FFFFFF;
  border-color: #919191;
  border-radius: 8px;
  size: md;
  font-family: Poppins;
  padding: 1.5rem;
}
```

**React Inline Style:**
```jsx
<Component style={{
  backgroundColor: '#FFFFFF',
  borderColor: '#919191',
  borderRadius: '8px',
  size: 'md',
  fontFamily: 'Poppins',
  padding: '1.5rem',
}} />
```

---

## Badge

Small status indicators and labels.

### Default Variant

* **Border Radius**: 16px
* **Size**: sm
* **Font Family**: Poppins
* **Color**: #003827
* **Background Color**: #D1F5DC

**CSS Implementation:**
```css
.badge {
  border-radius: 16px;
  size: sm;
  font-family: Poppins;
  color: #003827;
  background-color: #D1F5DC;
}
```

**React Inline Style:**
```jsx
<Component style={{
  borderRadius: '16px',
  size: 'sm',
  fontFamily: 'Poppins',
  color: '#003827',
  backgroundColor: '#D1F5DC',
}} />
```

### Secondary Variant

* **Border Radius**: 16px
* **Size**: sm
* **Font Family**: Poppins
* **Color**: #212C16
* **Background Color**: #DEE9D3

**CSS Implementation:**
```css
.badge-secondary {
  border-radius: 16px;
  size: sm;
  font-family: Poppins;
  color: #212C16;
  background-color: #DEE9D3;
}
```

**React Inline Style:**
```jsx
<Component style={{
  borderRadius: '16px',
  size: 'sm',
  fontFamily: 'Poppins',
  color: '#212C16',
  backgroundColor: '#DEE9D3',
}} />
```

### Outline Variant

* **Border Radius**: 16px
* **Size**: sm
* **Font Family**: Poppins

**CSS Implementation:**
```css
.badge-outline {
  border-radius: 16px;
  size: sm;
  font-family: Poppins;
}
```

**React Inline Style:**
```jsx
<Component style={{
  borderRadius: '16px',
  size: 'sm',
  fontFamily: 'Poppins',
}} />
```

### Destructive Variant

* **Border Radius**: 16px
* **Size**: sm
* **Font Family**: Poppins
* **Color**: #720D0D
* **Background Color**: #FFE4E4

**CSS Implementation:**
```css
.badge-destructive {
  border-radius: 16px;
  size: sm;
  font-family: Poppins;
  color: #720D0D;
  background-color: #FFE4E4;
}
```

**React Inline Style:**
```jsx
<Component style={{
  borderRadius: '16px',
  size: 'sm',
  fontFamily: 'Poppins',
  color: '#720D0D',
  backgroundColor: '#FFE4E4',
}} />
```

---

## Alert

Messages that communicate important information to users.

### Default Variant

* **Background Color**: #D8EFFD
* **Size**: md
* **Font Family**: Poppins
* **Color**: #0B4260
* **Border Color**: #C0E6FC

**CSS Implementation:**
```css
.alert {
  background-color: #D8EFFD;
  size: md;
  font-family: Poppins;
  color: #0B4260;
  border-color: #C0E6FC;
}
```

**React Inline Style:**
```jsx
<Component style={{
  backgroundColor: '#D8EFFD',
  size: 'md',
  fontFamily: 'Poppins',
  color: '#0B4260',
  borderColor: '#C0E6FC',
}} />
```

### Destructive Variant

* **Size**: md
* **Font Family**: Poppins
* **Color**: #720D0D
* **Background Color**: #FFE4E4
* **Border Color**: #FFD1D1

**CSS Implementation:**
```css
.alert-destructive {
  size: md;
  font-family: Poppins;
  color: #720D0D;
  background-color: #FFE4E4;
  border-color: #FFD1D1;
}
```

**React Inline Style:**
```jsx
<Component style={{
  size: 'md',
  fontFamily: 'Poppins',
  color: '#720D0D',
  backgroundColor: '#FFE4E4',
  borderColor: '#FFD1D1',
}} />
```

### Description Variant

* **Size**: md
* **Font Family**: Poppins
* **Color**: #262626

**CSS Implementation:**
```css
.alert-description {
  size: md;
  font-family: Poppins;
  color: #262626;
}
```

**React Inline Style:**
```jsx
<Component style={{
  size: 'md',
  fontFamily: 'Poppins',
  color: '#262626',
}} />
```

---

## Label

Form field labels.

### Default Variant

* **Size**: md
* **Font Family**: Poppins

**CSS Implementation:**
```css
.label {
  size: md;
  font-family: Poppins;
}
```

**React Inline Style:**
```jsx
<Component style={{
  size: 'md',
  fontFamily: 'Poppins',
}} />
```

---

## Radio

Single-choice selection controls.

### Default Variant

* **Border Color**: #E6E6E6
* **Border Width**: 2px

**CSS Implementation:**
```css
.radio {
  border-color: #E6E6E6;
  border-width: 2px;
}
```

**React Inline Style:**
```jsx
<Component style={{
  borderColor: '#E6E6E6',
  borderWidth: '2px',
}} />
```

---

## Toggle

Interactive switches and toggles.

### Group Variant

* **Border Radius**: 8px
* **Border Width**: 1px
* **Border Color**: #E6E6E6

**CSS Implementation:**
```css
.toggle-group {
  border-radius: 8px;
  border-width: 1px;
  border-color: #E6E6E6;
}
```

**React Inline Style:**
```jsx
<Component style={{
  borderRadius: '8px',
  borderWidth: '1px',
  borderColor: '#E6E6E6',
}} />
```

### Item Variant

* **Size**: sm
* **Font Family**: Poppins
* **Padding**: 1.5rem

**CSS Implementation:**
```css
.toggle-item {
  size: sm;
  font-family: Poppins;
  padding: 1.5rem;
}
```

**React Inline Style:**
```jsx
<Component style={{
  size: 'sm',
  fontFamily: 'Poppins',
  padding: '1.5rem',
}} />
```

---

## Tabs

Navigation tabs for multi-step flows and section switching. Default style matches the create service order wizard (`wizard-stepper`).

### Default Variant

* **Layout**: CSS grid with equal columns (`repeat(N, 1fr)`), gap `0.75rem`
* **Font Family**: Poppins
* **Font Size / Line**: 14 / 20 (Label / Medium)
* **Font Weight**: Medium (500)
* **Text Align**: left
* **Padding**: `0 0 0.65rem`
* **Border Bottom**: 3px solid
* **Background**: transparent
* **Border (sides)**: none
* **Sentence case** on labels

**States:**

| State | Text color | Bottom border |
| --- | --- | --- |
| Default (inactive) | `#6E6E6E` (`--muted-foreground`) | `#E6E6E6` (`--border`) |
| Active (selected) | `#003418` | `#005C3A` (`--primary`) |
| Done (completed step) | `#005C3A` (`--primary`) | `#BAD49D` (`--secondary`) |

**Behavior:**

* Use `role="tablist"` on the container and `role="tab"` + `aria-selected` on each tab.
* Active = current step/section; Done = previously completed steps (optional; omit if tabs are not sequential).
* Labels in sentence case (ex.: "1. Tipo", "2. Veículo e solução").

**CSS Implementation:**
```css
.tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* adjust N to tab count */
  gap: 0.75rem;
  margin: 0 0 1.75rem;
  font-family: Poppins, system-ui, sans-serif;
}

.tab {
  border: none;
  background: transparent;
  padding: 0 0 0.65rem;
  text-align: left;
  font-family: inherit;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #6E6E6E;
  border-bottom: 3px solid #E6E6E6;
  cursor: pointer;
}

.tab.done {
  color: #005C3A;
  border-bottom-color: #BAD49D;
}

.tab.active,
.tab[aria-selected="true"] {
  color: #003418;
  border-bottom-color: #005C3A;
}
```

**React Inline Style:**
```jsx
<div
  role="tablist"
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.75rem',
    margin: '0 0 1.75rem',
    fontFamily: 'Poppins',
  }}
>
  <button
    type="button"
    role="tab"
    aria-selected={true}
    style={{
      border: 'none',
      background: 'transparent',
      padding: '0 0 0.65rem',
      textAlign: 'left',
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 500,
      color: '#003418',
      borderBottom: '3px solid #005C3A',
      cursor: 'pointer',
    }}
  >
    1. Tipo
  </button>
</div>
```

---

## Accordion

Collapsible content sections.

### Default Variant

* **Border Color**: #E6E6E6
* **Border Radius**: 8px
* **Padding**: 1rem
* **Border Width**: 1px

**CSS Implementation:**
```css
.accordion {
  border-color: #E6E6E6;
  border-radius: 8px;
  padding: 1rem;
  border-width: 1px;
}
```

**React Inline Style:**
```jsx
<Component style={{
  borderColor: '#E6E6E6',
  borderRadius: '8px',
  padding: '1rem',
  borderWidth: '1px',
}} />
```

---

## Usage Instructions

### In Figma Make Projects

1. Save this file as `Guidelines.md` in your project root
2. The AI will automatically reference these guidelines when creating components
3. You can override specific properties by mentioning them in your prompts

### In Other Projects

1. Use the CSS implementations above to create stylesheet classes
2. Apply the React inline styles directly to components
3. Adapt the color values and sizing to match your framework's conventions

### Design Tokens

Consider creating design tokens based on these customizations for better maintainability:

**Colors:**
* #003418
* #FFFFFF
* #005C3A
* #919191
* #003827
* #D1F5DC
* #212C16
* #DEE9D3
* #720D0D
* #FFE4E4
* #0B4260
* #D8EFFD
* #C0E6FC
* #FFD1D1
* #262626
* #E6E6E6

**Font Sizes (type scale):**
* Display: 57 / 45 / 36
* Headline: 32 / 28 / 24
* Title: 22 / 16 / 14
* Label: 14 / 12 / 11
* Body: 16 / 14 / 12
* Component sizes: md · sm

**Font Weights:**
* Regular 400 · Medium 500 · Bold 700

**Border Radii:**
* 8px
* 16px

