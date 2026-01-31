# Linktree Escombro 🏗️

> **Minimalismo no vazio digital.**  
> Uma solução de link-in-bio de alta performance, acessível e monetizável.

![Licença](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-teal)

## 📋 Descrição

**Linktree Escombro** é uma reimaginação moderna da clássica página de agregação de links. Construído com a filosofia "Mobile First", prioriza a velocidade, acessibilidade (WCAG 2.1) e estética limpa. O projeto segue estritamente o padrão arquitetural **Model-View-Controller (MVC)** dentro do contexto React para garantir manutenibilidade e escalabilidade do código.

Este repositório serve como um modelo robusto para criadores que desejam centralizar sua presença digital mantendo uma identidade visual única e escura.

## ✨ Funcionalidades Principais

*   **Arquitetura MVC:** Separação estrita de Dados (Model), Interface (View) e Lógica (Controller).
*   **Design Mobile First:** Layout e interações otimizados primeiramente para smartphones.
*   **Cabeçalho Hide-on-Scroll:** Esconde suavemente a navegação ao ler o conteúdo e a revela ao navegar de volta para cima.
*   **Estética de Alto Contraste:** Paleta moderna "Escombro" (Preto, Branco, Verde Vibrante).
*   **Pronto para Monetização:** Componente "Anchor Ad" (anúncio fixo) integrado com dispensa amigável (botão fechar).
*   **Acessibilidade:** Totalmente compatível com os padrões WCAG 2.1 AA para navegação por teclado e leitores de tela.

## 🏗️ Arquitetura (MVC)

A estrutura do projeto imita o MVC para organizar componentes React:

*   **Model (`types.ts`, `constants.ts`):** Define interfaces de dados (`UserProfile`, `SocialLink`) e atua como a fonte única de verdade para os dados.
*   **View (`components/`):** Componentes funcionais puros (ex: `LinkItem`, `Profile`) que simplesmente renderizam dados recebidos via props. Não contêm lógica de negócio complexa.
*   **Controller (`App.tsx`, `hooks/`):** 
    *   `App.tsx`: Atua como o orquestrador principal, injetando dados do Model nos componentes View.
    *   `useScrollDirection.ts`: Lida com a lógica de detecção de rolagem para controlar o estado do Cabeçalho.
    *   `AnchorAd.tsx`: Contém lógica de controle local para visibilidade do anúncio.

## 🛠️ Stack Tecnológico

*   **Core:** React 18
*   **Linguagem:** TypeScript (ES6+)
*   **Estilização:** Tailwind CSS (Utility-first)
*   **Build Tool:** Vite / Create React App (Compatível)
*   **Linting:** ESLint

## 🚀 Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/igorsfugiwara/linktree-escombro.git
    cd linktree-escombro
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Rode o servidor de desenvolvimento:**
    ```bash
    npm start
    ```
    Abra [http://localhost:3000](http://localhost:3000) para ver no navegador.

## 📖 Guia de Uso

### Personalizando Links
Abra `constants.ts` e modifique o array `LINKS`. Você pode adicionar a propriedade `highlight: true` a qualquer link para destacá-lo.

```typescript
export const LINKS: SocialLink[] = [
  {
    id: '1',
    title: 'Meu Novo Curso',
    url: 'https://...',
    highlight: true, // Adiciona estilo distinto
  },
  // ...
];
```

### Alterando Informações do Perfil
Edite a constante `USER_PROFILE` em `constants.ts`:

```typescript
export const USER_PROFILE: UserProfile = {
  name: "Seu Nome",
  handle: "@seuhandle",
  // ...
};
```

### Configurando Anúncios
Modifique o objeto `FOOTER_AD` em `constants.ts`. Se desejar desativá-lo, você pode renderizá-lo condicionalmente em `App.tsx` ou deixar o conteúdo vazio.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, siga estes passos:

1.  Faça um Fork do projeto.
2.  Crie sua branch de feature (`git checkout -b feature/RecursoIncrivel`).
3.  Commit suas mudanças (`git commit -m 'Adiciona algum RecursoIncrivel'`).
4.  Push para a branch (`git push origin feature/RecursoIncrivel`).
5.  Abra um Pull Request.

---

**Escombro** — *Construindo sobre as ruínas da velha web.*
