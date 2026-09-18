# DESIGN AUDIT — Linktree Escombro

Auditoria extraída diretamente do código-fonte em `2026-07-29`. Nenhum valor foi arredondado ou aproximado; onde a informação não existe no repositório, está marcado como **não definido**.

---

## 1. STACK

| Item | Valor |
|---|---|
| Framework | React `^19.2.3` (`react`, `react-dom`) |
| Router | `react-router-dom` `^7.6.0` |
| Linguagem | TypeScript `~5.8.2`, `strict: true` |
| Bundler | Vite `^6.2.0` (plugin `@vitejs/plugin-react` `^5.0.0`) |
| CSS | Tailwind CSS `^3.4.0` + PostCSS `^8.4.0` + Autoprefixer `^10.4.0` |
| Backend/CMS | Firebase `^12.9.0` (Realtime Database, Auth, Storage) |
| Gerenciador de pacotes | npm (presença de `package-lock.json`; não há `yarn.lock`/`pnpm-lock.yaml`) |

**Scripts** (`package.json`): `dev` → `vite`, `build` → `vite build`, `preview` → `vite preview`.

**Estrutura de pastas relevante:**
```
App.tsx                    → orquestrador raiz + rotas (Controller)
index.tsx                  → entry point, importa ./style.css
style.css                  → raiz: import de fontes Google + diretivas @tailwind + keyframes
constants.ts                → Model estático (FOOTER_AD)
types.ts                    → Model: interfaces (LinkItem, UserProfile, SiteConfig, AdConfig, IconKey)
icons.ts                    → registro central de ícones SVG inline (ICON_MAP)
firebase.ts                 → init do Firebase (lê env vars VITE_FIREBASE_*)
components/                 → View
  Header.tsx, Profile.tsx, LinkItem.tsx, AnchorAd.tsx, IconRenderer.tsx, ProtectedRoute.tsx
  admin/AdminLogin.tsx, admin/AdminPanel.tsx, admin/LinkEditor.tsx
hooks/                      → Controller
  useAuth.ts, useScrollDirection.ts
store/useCMSStore.ts        → Controller: Context + stream do Firebase RTDB
assets/                     → arquivos de imagem/ícone fonte (logos, favicon, SVGs soltos)
public/assets/              → cópia idêntica de assets/ (é o diretório servido/copiado pelo Vite no build)
dist/                       → saída de build (gerada, não editar)
```
Não há diretório `styles/` ou `.scss`; todo o CSS vive em um único arquivo `style.css` na raiz, mais classes utilitárias Tailwind inline no JSX e alguns `style={{ ... }}` inline em objetos JS.

**Build e deploy:**
- Build: `vite build` gera `dist/` (confirmado: `dist/assets/index-*.js`, `index-*.css`, hash de conteúdo no nome do arquivo).
- `vercel.json` presente na raiz com rewrite SPA (`"source": "/(.*)"` → `"/index.html"`), indicando deploy na **Vercel**.
- Remote git: `git@github.com:igorsfugiwara/linktree-escombro.git` (branch `main`).
- Variáveis de ambiente de build: `.env.local` com chaves `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_DATABASE_URL`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` (valores não reportados aqui por serem segredos).

---

## 2. TOKENS DE COR

### 2.1 Definidos formalmente (fonte única de verdade)

Definidos em dois lugares que **duplicam exatamente os mesmos valores**: [tailwind.config.js](tailwind.config.js) e [style.css:13-17](style.css#L13-L17).

| Nome | Valor exato | Definido em |
|---|---|---|
| `brand-black` / `--brand-black` | `#000000` | `tailwind.config.js` (`theme.extend.colors.brand-black`) e `style.css` (`:root { --brand-black }`) |
| `brand-white` / `--brand-white` | `#ffffff` | idem (`brand-white` / `--brand-white`) |
| `brand-green` / `--brand-green` | `#22c55e` | idem (`brand-green` / `--brand-green`) |

`style.css` também redeclara manualmente classes utilitárias equivalentes às do Tailwind (linhas 27-34): `.bg-brand-black`, `.text-brand-white`, `.text-brand-green`, `.bg-brand-green`, `.text-brand-black`, `.border-brand-green`, `.selection\:bg-brand-green ::selection`, `.selection\:text-brand-black ::selection` — todas apontando para as mesmas 3 CSS vars acima. Não há necessidade funcional de duplicar isso já que o Tailwind já gera essas classes a partir de `tailwind.config.js`; é redundância, não um token adicional.

### 2.2 Cores literais usadas fora do sistema de tokens (hardcoded no código)

Nenhuma destas tem nome de variável — são valores soltos em `style={{ ... }}` ou classes Tailwind da paleta padrão (não customizada) do Tailwind:

| Valor | Onde é usado |
|---|---|
| `#000000` | `App.tsx` (`backgroundColor` inline do wrapper da página pública) |
| `#000` | `AnchorAd.tsx` (botão fechar), `Header.tsx` (cor do texto do toast) |
| `#22c55e` | `AnchorAd.tsx` (borda superior do anúncio, background do CTA), `Header.tsx` (ícone de share, background do toast) — idêntico a `brand-green`, mas escrito literal em vez de via token |
| `#333` | `AnchorAd.tsx` (borda do botão fechar) |
| `#fff` | `AnchorAd.tsx` (cor do texto), `Header.tsx` (cor do handle no header) |
| `#e5e5e5` | `Profile.tsx` (cor do texto do subtítulo) |
| `rgba(0,0,0,0.9)` | `Header.tsx` (background do header fixo) |
| `rgba(255,255,255,0.1)` | `Header.tsx` (borda inferior do header) |
| `rgba(0,0,0,0.5)` | `AnchorAd.tsx` (box-shadow), `Profile.tsx` (drop-shadow do logo) |
| `rgba(23,23,23,0.95)` | `AnchorAd.tsx` (background do card do anúncio) |

Classes Tailwind da **paleta padrão não customizada** (neutral/red/black/white nativos do Tailwind, não redefinidos em `tailwind.config.js`):
`bg-black`, `bg-black/40`, `bg-white`, `bg-white/10`, `bg-neutral-700`, `bg-neutral-800`, `bg-neutral-900`, `bg-neutral-900/50`, `bg-neutral-900/95`, `bg-neutral-950`, `border-white`, `border-white/5`, `border-white/10`, `border-white/20`, `border-white/30`, `border-red-500/30`, `text-black`, `text-white`, `text-neutral-300`, `text-neutral-400`, `text-neutral-500`, `text-neutral-600`, `text-neutral-700`, `text-red-400`, `text-red-500`.
Esses são valores padrão do Tailwind (ex.: `neutral-900` = `#171717`, `neutral-950` = `#0a0a0a`, `red-500` = `#ef4444`) — não redeclarados no `tailwind.config.js`, portanto não há uma constante de projeto para eles; estou reportando os nomes de classe tal como aparecem no código, não os valores hex, pois o projeto nunca os fixa explicitamente.

### 2.3 Papel semântico de cada cor

| Papel | Cor / classe | Observação |
|---|---|---|
| Background da página | `brand-black` `#000000` | `body` em `style.css` e wrapper em `App.tsx` |
| Superfície (cards, painéis) | `bg-neutral-900`, `bg-neutral-900/95`, `bg-neutral-950`, `bg-black/40`, `rgba(23,23,23,0.95)` | painéis admin, card de login, links não destacados, anúncio fixo — nunca há um token nomeado para "superfície", é composto ad-hoc por componente |
| Texto primário | `brand-white` `#ffffff` / `#fff` | texto principal sobre fundo escuro |
| Texto secundário / mutado | `text-neutral-400` a `text-neutral-700`, `#e5e5e5` | labels, legendas, rodapé, placeholders |
| Cor de destaque (accent) | `brand-green` `#22c55e` | CTAs, estado ativo/focus, badges "Destaque", spinner, seleção de texto (`::selection`) |
| Bordas | `border-white/5` a `border-white/30`, `border-brand-green`, `#333` | opacidade variável de branco sobre preto; nenhuma cor de borda "neutra" nomeada além disso |
| Erro/perigo | `text-red-400`, `text-red-500`, `border-red-500/30` | mensagens de validação, botão "Sair", ação "Apagar" — cor padrão do Tailwind, não um token de marca |

Não existe um token de "texto terciário" ou "superfície elevada" formalmente nomeado — cada componente escolhe seu próprio tom de cinza/opacidade de branco.

---

## 3. TIPOGRAFIA

### 3.1 Famílias de fonte

Importadas via Google Fonts em [style.css:1](style.css#L1):
```
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;700&family=Oxygen:wght@300;400;700&display=swap');
```

| Família | Pesos importados | Origem | Uso real |
|---|---|---|---|
| **Cairo** | 300, 400, 700 | Google Fonts (import remoto, não arquivo local) | **Única fonte efetivamente aplicada.** Definida em `body { font-family: 'Cairo', sans-serif; }` (`style.css:20`) — herdada por todo o site (título e corpo, não há diferenciação). |
| **Oxygen** | 300, 400, 700 | Google Fonts (import remoto) | **Importada mas não utilizada em nenhum lugar do código** — nenhum seletor, classe ou estilo inline referencia `Oxygen` ou `font-family`. Peso morto de carregamento. |

Não há arquivos de fonte locais (nenhum `.woff`/`.woff2`/`.ttf` no repositório) e não há stack de fontes do sistema declarada — o único fallback presente é o genérico `sans-serif` do CSS.

`tailwind.config.js` não estende `theme.fontFamily`; portanto as classes utilitárias padrão do Tailwind (`font-sans`, `font-mono` etc.) usam a stack padrão do Tailwind, não `Cairo`/`Oxygen` — não há evidência de que essas classes utilitárias sejam usadas em nenhum componente (nenhuma ocorrência encontrada).

**Título vs. corpo:** não há distinção de família — tudo usa `Cairo` herdada do `body`. A distinção visual entre "título" e "corpo" é feita por **peso, tamanho e tracking**, não por fonte diferente.

### 3.2 Escala de tamanhos, peso, altura de linha e letter-spacing

Não existe uma escala nomeada/tokenizada (`tailwind.config.js` não estende `fontSize`). Os valores abaixo são os que efetivamente ocorrem no código, via classes Tailwind padrão ou `style` inline:

**Via classes Tailwind (padrão do framework, não customizadas):**
| Classe | Tamanho real (padrão Tailwind) | Onde |
|---|---|---|
| `text-xs` | `0.75rem` (12px) | labels, badges, legendas — a mais usada no admin |
| `text-sm` | `0.875rem` (14px) | inputs, botões, corpo de formulário |
| (nenhum `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl` encontrado em uso) | — | não definido / não usado |

**Via `style` inline (valores literais em px, fora da escala Tailwind):**
| Contexto | font-size | font-weight | letter-spacing | line-height | text-transform |
|---|---|---|---|---|---|
| Handle no header (`Header.tsx:41`) | `18px` | `700` | `-0.02em` | não definido | não definido |
| Toast "Link copiado!" (`Header.tsx:60-61`) | `14px` | `700` | `0.05em` | não definido | `uppercase` |
| Subtítulo do perfil (`Profile.tsx:16`) | `13px` | `700` | `0.1em` | `1.6` | `uppercase` |
| Conteúdo do anúncio fixo (`AnchorAd.tsx:32`) | `14px` | `500` | não definido | não definido | não definido |
| CTA do anúncio fixo (`AnchorAd.tsx:36-38`) | `12px` | `700` | não definido | não definido | não definido |

**Pesos via classes Tailwind:** `font-bold` (14 ocorrências), `font-black` (14 ocorrências) — não há `font-medium`, `font-semibold`, `font-light` em uso nos componentes.

**Tracking via classes Tailwind:** `tracking-wider` (29 ocorrências), `tracking-widest` (11 ocorrências) — não há `tracking-tight`/`tracking-normal` explícitos.

Não há um token central de "line-height" — a única ocorrência explícita é `1.6` inline no subtítulo do perfil; o restante herda o line-height padrão do navegador/Tailwind (`normal`/`1.5` conforme reset).

---

## 4. ESPAÇAMENTO E LAYOUT

`tailwind.config.js` **não estende** `spacing`, `borderRadius` nem `screens` — portanto a escala de espaçamento e os breakpoints são exatamente os valores padrão de fábrica do Tailwind 3.4 (incrementos de `0.25rem`), não há customização de projeto para reportar além do uso observado:

### 4.1 Espaçamento observado (classes Tailwind usadas, escala padrão)
`p-0`, `p-2`, `p-3`, `p-4`, `p-6`, `p-8`, `px-3`, `px-4`, `px-6`, `py-2`, `py-2.5`, `py-3`, `gap-1`, `gap-2`, `gap-3`, `gap-6`, `mb-3`, `mb-4`, `mt-6`, `mt-12`, `space-y-2`, `space-y-4`, `space-y-5`, `space-y-6`, `pt-24`, `pb-32`, `pt-32`(não encontrado), `h-14`.

### 4.2 Border-radius
Não há token nomeado; dois sistemas coexistem no mesmo projeto:
- **Cartões de link da página pública** (`LinkItem.tsx`): **nenhum** `border-radius` aplicado (classe `overflow-hidden` sem `rounded-*`) → cantos totalmente retos (`0`).
- **Interface de administração** (login, painel, editor de link): `border-radius: '2px'` fixo via `style` inline, repetido em ~20 elementos (inputs, botões, cards, badges) — um valor de projeto de fato, mas escrito como constante literal repetida, não como token.
- **Pílulas** (`border-radius: '9999px'`): toast do header, CTA do anúncio fixo.
- **Círculos** (`border-radius: '50%'`): botão de fechar do anúncio, botão de compartilhar do header.
- **`rounded-full`** (classe Tailwind = `9999px`): spinners de loading, avatar circular em `LinkItem` (modo avatar), badge do banner de anúncio.

### 4.3 Largura máxima de container
| Contexto | Classe/valor | Em px |
|---|---|---|
| Página pública (`App.tsx`) | `max-w-md` | `28rem` = `448px` |
| Header fixo e anúncio fixo (`Header.tsx`, `AnchorAd.tsx`) | `maxWidth: '448px'` inline | `448px` (consistente com `max-w-md`) |
| Card de login admin (`AdminLogin.tsx`) | `max-w-sm` | `24rem` = `384px` |
| Painel admin (`AdminPanel.tsx`) | `max-w-2xl` | `42rem` = `672px` |

### 4.4 Breakpoints responsivos
**Não definido / não utilizado.** `tailwind.config.js` não customiza `screens` (usa os padrões `sm:640px md:768px lg:1024px xl:1280px 2xl:1536px` disponíveis pelo framework), mas **nenhum componente usa prefixos responsivos** (`sm:`, `md:`, `lg:`, `xl:`) — busca no código não retornou nenhuma ocorrência. O layout é fixo mobile-first de coluna única, sem variação por breakpoint; a "responsividade" vem apenas de `w-full`/`max-w-*` fluidos, não de media queries.

---

## 5. COMPONENTES E EFEITOS

### 5.1 Componentes reutilizáveis e assinatura de props

| Componente | Arquivo | Props |
|---|---|---|
| `Header` | [components/Header.tsx](components/Header.tsx) | `{ user: UserProfile }` |
| `Profile` | [components/Profile.tsx](components/Profile.tsx) | `{ user: UserProfile }` |
| `LinkItem` | [components/LinkItem.tsx](components/LinkItem.tsx) | `{ link: LinkItemType }` (3 modos de renderização internos: `banner`, `avatar`, `none`, conforme `link.imageType`) |
| `AnchorAd` | [components/AnchorAd.tsx](components/AnchorAd.tsx) | `{ ad: AdConfig }` |
| `IconRenderer` | [components/IconRenderer.tsx](components/IconRenderer.tsx) | `{ iconKey: IconKey; size?: number (default 20); className?: string (default '') }` |
| `ProtectedRoute` | [components/ProtectedRoute.tsx](components/ProtectedRoute.tsx) | `{ children: React.ReactNode }` |
| `AdminLogin` | [components/admin/AdminLogin.tsx](components/admin/AdminLogin.tsx) | nenhuma (usa `useAuth()` internamente) |
| `AdminPanel` | [components/admin/AdminPanel.tsx](components/admin/AdminPanel.tsx) | nenhuma (usa `useCMSStore()` e `useAuth()`) |
| `LinkEditor` | [components/admin/LinkEditor.tsx](components/admin/LinkEditor.tsx) | `{ initial?: Partial<LinkItem>; onSave: (data: Omit<LinkItem,'id'\|'order'>) => void; onCancel: () => void }` |

### 5.2 Estilo de botão

Não existe um componente `<Button>` compartilhado — cada botão é estilizado localmente. Padrões observados:

- **Botão primário (CTA)**: fundo `brand-green`, texto `brand-black`, `font-black`/`font-bold`, `uppercase`, `tracking-widest`/`tracking-wider`, `hover:bg-white`. Ex.: botão "Entrar" (`AdminLogin.tsx`), "Novo Link"/"Salvar" (`AdminPanel.tsx`, `LinkEditor.tsx`).
- **Botão secundário/outline**: fundo transparente, `border border-white/20`, `hover:bg-white/10`. Ex.: "Entrar com Google".
- **Botão de cancelar**: `bg-neutral-800`, `border border-white/10`, `hover:bg-neutral-700`. Ex.: "Cancelar" no `LinkEditor`.
- **Botão-ícone circular** (sem fundo): usado no header (compartilhar) e no anúncio (fechar), `background: none`/`background-color:#000`, `border-radius: 50%`.
- **Toggle/tab ativo**: borda inferior `border-brand-green`, texto `text-brand-green`; inativo `border-transparent text-neutral-500 hover:text-white`.
- Todos os botões usam `transition-colors` (ou `transition-all`) — nenhuma duração customizada nomeada além do padrão Tailwind (`150ms`), exceto onde há `duration-300`/`duration-500` explícitos.

### 5.3 Card de link (`LinkItem`)

Classe base compartilhada por todos os modos:
```
group relative flex w-full mb-3 transition-all duration-300 transform
hover:-translate-y-1 hover:shadow-lg
focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-green
border font-bold uppercase tracking-wider overflow-hidden
```
Duas variantes de cor (`link.highlight` controla qual):
- **Padrão** (`standard`): `bg-black/40 border-white text-white hover:bg-white hover:text-black`
- **Destaque** (`highlight`): `bg-white text-black border-white hover:bg-brand-green hover:border-brand-green`

Estado de foco: anel verde de 2px (`focus-within:ring-2 focus-within:ring-brand-green`) — acessível via teclado.
Hover: elevação (`-translate-y-1`), sombra (`shadow-lg`), inversão de cor, e nos modos `banner`/`highlight` uma seta (→) que aparece com `opacity-0 group-hover:opacity-100 transition-opacity`.

### 5.4 Link/texto (rodapé, nav)

Links de texto simples (ex.: "Ver Site" no `AdminPanel`) usam `text-neutral-500 hover:text-white uppercase tracking-wider font-bold transition-colors`, sem sublinhado em nenhum estado.

### 5.5 Sombras, gradientes, texturas, filtros, animações

- **Gradientes**: **nenhum encontrado** em todo o código-fonte (nenhuma ocorrência de `gradient`).
- **Sombras**:
  - `hover:shadow-lg` (Tailwind padrão) — cards de link.
  - `shadow-xl` (Tailwind padrão) — toast do painel admin.
  - `boxShadow: '0 -4px 24px rgba(0,0,0,0.5)'` inline — anúncio fixo (`AnchorAd.tsx:19`).
  - `filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'` inline — logo no `Profile.tsx:14`.
- **Blur/glass**: `backdropFilter: 'blur(8px)'` no header e no anúncio fixo; classe `backdrop-blur-md` no header do painel admin — efeito "vidro fosco" sobre fundo semitransparente (`rgba(0,0,0,0.9)`, `rgba(23,23,23,0.95)`, `bg-neutral-900/95`).
- **Textura de fundo**: `https://www.transparenttextures.com/patterns/rocky-wall.png` — usada em dois lugares:
  1. Como valor **padrão** do background do site público (`DEFAULT_SITE_CONFIG.backgroundValue` em `store/useCMSStore.ts:94`, `backgroundType: 'url'`, overlay escuro padrão de `60%`), configurável pelo admin.
  2. Hardcoded como textura de fundo do próprio formulário de login admin (`AdminLogin.tsx:43`, `opacity-20`).
  Ambas são **URLs externas remotas**, não arquivos locais no repositório.
- **Animações (`@keyframes` em `style.css`):**
  | Nome | Definição | Duração/easing | Classe | Uso |
  |---|---|---|---|---|
  | `shake` | `translateX(0) → -6px (25%) → 6px (75%) → 0` | `0.4s ease-in-out` | `.animate-shake` | erro de login (senha incorreta) |
  | `slideUp` | `translateY(100%),opacity:0 → translateY(0),opacity:1` | `0.3s ease-out` | `.animate-slide-up` | entrada do anúncio fixo |
  | `fadeIn` | `opacity:0,translateY(8px) → opacity:1,translateY(0)` | `0.4s ease-out` | `.animate-fade-in` | entrada da seção de perfil |
  | `spin` | Tailwind padrão (`animate-spin`) | Tailwind padrão | `.animate-spin` | todos os spinners de loading |
- **Transições pontuais**: header esconde/mostra via `transform: translateY(-100%\|0)` com `transition: transform 0.3s ease-in-out` (scroll hide-on-scroll, `Header.tsx`); toast de "link copiado" com `transition: all 0.3s ease`; imagem do banner do link com `transition-transform duration-500 group-hover:scale-105`.

---

## 6. ASSETS DE MARCA

Todos os arquivos abaixo existem duplicados, byte a byte idênticos, em `assets/` e `public/assets/` (o segundo é o diretório efetivamente servido pelo Vite/Vercel).

| Arquivo | Formato | Dimensões (px) | Uso confirmado no código |
|---|---|---|---|
| `logo_branco_2.png` | PNG (RGBA) | `691 × 361` | **Logo principal** — usado em `Profile.tsx` (página pública), `AdminLogin.tsx`, `AdminPanel.tsx`, e como `avatarUrl` padrão em `useCMSStore.ts` |
| `logo.png` | PNG (RGBA) | `691 × 361` | Idêntico byte a byte a `logo_branco_2.png` (mesmo MD5) — **não referenciado em nenhum lugar do código-fonte**; arquivo órfão/duplicata |
| `logo_amarelo_2.png` | PNG (RGBA) | `594 × 420` | **Não referenciado** em nenhum componente ou config — órfão |
| `logo_png.png` | PNG (RGBA) | `500 × 500` | **Não referenciado** — órfão |
| `fav.png` | PNG (RGBA) | `579 × 546` | Favicon — referenciado em `index.html:7` (`<link rel="icon" href="./assets/fav.png" type="image/x-icon">`); no build (`dist/index.html`) vira `fav-B1yrjNOj.png` (hash de conteúdo do Vite) |
| `repetente.png` | PNG (RGBA) | `729 × 342` | **Não referenciado** — órfão |
| `500025109_1241273908003373_6958710255068696444_n.png` | PNG (RGB) | `2048 × 1156` | **Não referenciado** — órfão (nome de arquivo sugere export direto do Instagram/Facebook) |

**Ícones SVG soltos** (`bandcamp.svg`, `facebook-_1_.svg`, `instagram.svg`, `shopping-cart.svg`, `social.svg`, `spotify.svg`, `tickets.svg`, `van.svg`, `youtube.svg`): **nenhum é referenciado em nenhum componente** — todos os ícones exibidos na UI vêm, na verdade, de paths SVG **inline** definidos em [icons.ts](icons.ts) e renderizados por [IconRenderer.tsx](components/IconRenderer.tsx). Esses arquivos `.svg` são órfãos residuais de uma versão anterior do projeto.

**Imagens Open Graph / social sharing**: **não definido** — não há nenhuma tag `<meta property="og:...">` nem `<meta name="twitter:...">` em `index.html`, e `metadata.json` contém apenas `name` e `description` (sem campo de imagem):
```json
{
  "name": "Linktree Escombro",
  "description": "Uma aplicação moderna e minimalista de link-in-bio construída com React, com estética clean preto/branco/verde, cabeçalho hide-on-scroll e anúncios fixos monetizáveis."
}
```

**Textura de fundo**: não é um asset local — é a URL externa `https://www.transparenttextures.com/patterns/rocky-wall.png` (ver seção 5.5). Não há nenhum arquivo de padrão/textura versionado no repositório.

---

## 7. VOZ E CONTEÚDO

Todo o conteúdo é em **português brasileiro**, tom direto/coloquial. Texto literal extraído do código (não parafraseado):

### 7.1 Página pública
- Rodapé: `© {ano atual} {profile.name}. Todos os direitos reservados.` (`App.tsx:76`)
- Toast de compartilhar: `Link copiado!` (`Header.tsx:63`)
- Subtítulo do perfil (dado padrão em `useCMSStore.ts`): `SÃO PAULO, BRASIL. HARDCORE POR UM MUNDO MAIS DIGNO`
- Nome/handle padrão: `Escombro` / `@escombro.hc`
- Anúncio fixo padrão (`constants.ts`): conteúdo `Confira a nova coleção de merchandising oficial.`, CTA `Ver Loja`
- Títulos de link padrão (`useCMSStore.ts`, `DEFAULT_LINKS`): `ESCOMBRO, FIM DA AURORA, MILITIA, ZANGA na A PORTA MALDITA`, `⚠️ ⛓️ VIDA VAZIA ⛓️ ⚠️`, `LOJA HEART MERCH`, `Escombro no Spotify`, `Escombro no Bandcamp`, `YouTube`, `Instagram`, `Facebook`
- `aria-label` dos links: `Visitar {título do link}`

### 7.2 Login admin (`AdminLogin.tsx`)
`Painel Admin` · `Email` · `Senha` · placeholder `admin@escombro.com` · placeholder `••••••••` · `Entrar` · `Entrando...` · `Entrar com Google` · rodapé `Escombro HC © {ano atual}`

### 7.3 Painel admin (`AdminPanel.tsx`)
`Admin` · `Ver Site` · `Sair` · abas: `Links`, `Background` · `{n} links cadastrados` · `Novo Link` · `Editando` · badge `Destaque` · badges de tipo de imagem exibem o valor bruto do dado (`avatar`/`banner`, em minúsculas, não traduzido) · tooltips de ação: `Desativar`/`Ativar`, `Editar`, `Apagar` · confirmação nativa do navegador: `Apagar "{título}"?` · toasts: `Link adicionado!`, `Link atualizado!`, `Link removido.`, `Erro no upload da imagem.`, `Background atualizado!`, `Background removido.` · `Background do Site` · `Preview` · `Tipo de Imagem` · botões `URL`/`Upload`/`Remover` · `URL da Imagem` · placeholder `https://exemplo.com/bg.jpg` · `Salvar` · `Upload de Imagem` · `Clique para selecionar imagem` · `JPG, PNG, WebP recomendados` · `Enviando...` · `Overlay Escuro: {n}%` · `Transparente` · `Escuro`

### 7.4 Editor de link (`LinkEditor.tsx`)
`Título *` · placeholder `Nome do link` · `URL *` · placeholder `https://...` · erros: `Título obrigatório`, `URL obrigatória`, `URL deve começar com http:// ou https://` · `Ícone` · rótulos de ícone (`icons.ts`, campo `label`): `Ingresso`, `Instagram`, `Spotify`, `Facebook`, `YouTube`, `Bandcamp`, `Loja / Carrinho`, `Link Genérico`, `TikTok`, `X / Twitter`, `WhatsApp`, `E-mail` · `Imagem no Link` · opções `Sem imagem` / `Avatar (esquerda)` / `Banner (topo)` · `Imagem` · `Por URL` / `Upload` · placeholder `https://exemplo.com/imagem.jpg` · checkboxes `Destaque` / `Ativo` · `Salvar` / `Cancelar`

### 7.5 Metadados / título de página
`index.html`: `<title>Escombro</title>`, `lang="pt-br"`.
`metadata.json`: nome `Linktree Escombro`, descrição citada na seção 6.

### 7.6 Convenção de capitalização

Duas convenções distintas coexistem, e é importante notar que **a string literal no código nem sempre corresponde ao que é renderizado na tela**, porque a transformação visual é aplicada via CSS (`uppercase`), não escrita como maiúscula no dado/JSX:

- **Forçado para CAIXA ALTA visualmente via CSS** (`text-transform: uppercase` / classe Tailwind `uppercase`), independente da capitalização literal do texto-fonte: todos os títulos de link (`LinkItem`), todos os labels de formulário, todos os botões do admin, badges, tabs, toasts do painel admin, subtítulo do perfil, toast "Link copiado!". A string armazenada nesses casos costuma estar em Title Case ou sentence case no código (ex.: `"Link adicionado!"`), mas aparece como `"LINK ADICIONADO!"` na tela.
- **Sem transformação, exibido como escrito** (sentence case / Title Case literal): rodapé de copyright, conteúdo do anúncio fixo (`"Confira a nova coleção..."`), CTA do anúncio (`"Ver Loja"`, Title Case literal), mensagens de erro do formulário de link (`"Título obrigatório"`, sentence case), texto do `<title>` da página (`"Escombro"`).
- Os **dados de conteúdo em si** (títulos de link em `DEFAULT_LINKS`) misturam convenções na origem: alguns já vêm em CAIXA ALTA no dado (`"LOJA HEART MERCH"`, `"ESCOMBRO, FIM DA AURORA..."`), outros em Title Case (`"Escombro no Spotify"`, `"YouTube"`, `"Instagram"`, `"Facebook"`) — mas isso é irrelevante para a renderização final na página pública, pois a classe `uppercase` do `LinkItem` normaliza tudo para caixa alta na tela de qualquer forma.

---

## Observações finais (inconsistências encontradas, não corrigidas)

- `Oxygen` é importado do Google Fonts mas nunca utilizado — carregamento desperdiçado.
- `logo.png` é uma duplicata byte-idêntica de `logo_branco_2.png`; `logo_amarelo_2.png`, `logo_png.png`, `repetente.png` e a foto `500025109_....png` não são referenciados em lugar nenhum do código.
- Todos os arquivos `.svg` em `assets/`/`public/assets/` (ícones de rede social soltos) são órfãos — os ícones reais vêm de paths inline em `icons.ts`.
- As 3 cores de marca são declaradas duas vezes com os mesmos valores (`tailwind.config.js` e `style.css`), e `style.css` ainda reimplementa manualmente classes utilitárias que o Tailwind já geraria sozinho a partir do config.
- Não há favicon dedicado nem imagem Open Graph para compartilhamento em redes sociais — links compartilhados não terão preview de imagem/título customizado além do `<title>`.
- Border-radius de `2px` no admin é repetido como valor literal em ~20 lugares via `style` inline, em vez de uma classe/token único — qualquer mudança futura exige editar cada ocorrência.
