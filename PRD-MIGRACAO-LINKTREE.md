# PRD — Migração do Linktree para o projeto Firebase do Escombro

> Documento de trabalho. Escrito pra ser lido por uma sessão nova do Claude Code, sem
> acesso à conversa que o originou — por isso repete contexto que parece óbvio.

---

## 0. Atualização (28/08/2026) — Storage nunca foi usado

Executando a Fase 1, a listagem de buckets do projeto `linktree-escombro` via Admin SDK
veio **vazia** — o bucket de Storage nunca foi criado, apesar de `VITE_FIREBASE_STORAGE_BUCKET`
existir no `.env.local` (é só a nomenclatura padrão que o Firebase pré-calcula antes de
Storage ser ativado).

Conferido o backup do RTDB (`cms/links`, 11 registros, e `cms/siteConfig`): a única imagem
em uso está em `imageUrl` de um link, hospedada no **Cloudinary**
(`res.cloudinary.com/dcfifapdf/...`), não no Firebase Storage. O `backgroundValue` do
siteConfig também é externo (`transparenttextures.com`). Nenhum registro referencia o
bucket do linktree-escombro.

**Conclusão:** o recurso de upload em `LinkEditor.tsx` (`components/admin/LinkEditor.tsx`)
existe no código mas nunca foi usado com sucesso — sem bucket, qualquer tentativa de
upload já falha hoje, antes de qualquer migração. Isso **não é uma regressão introduzida
por este PRD**, é o estado atual.

**Impacto no plano:**
- R1 (imagens órfãs) e R4 (CORS do Storage) **não se aplicam** — não há nada de Storage
  para migrar.
- Fase 1.2 (baixar `images/`), Fase 2.3 (ativar Storage + CORS no destino) e a Fase 3
  inteira (Storage primeiro) ficam **desnecessárias**. Pular direto para a Fase 1.1 → 1.3
  → 2.1 → 2.2 → 2.4 → 4 → 5 → 6 → 7.
- A migração real é só: dados do RTDB + Auth + regras do RTDB + variáveis de ambiente.
- Fora de escopo (não mexer agora): o botão de upload continua quebrado no destino,
  exatamente como já está na origem. Se algum dia quiserem essa função funcionando,
  é ativar Storage no `site-escombro` — item novo, não parte desta migração.

---

## 1. Contexto

A conta Firebase do Igor bateu o limite de projetos. O Maestro (sistema multi-agente em
`igor-agents/`) precisa de um projeto próprio, porque hoje ele está configurado para gravar
no projeto `otica-roland` — que é de uma **cliente**, com app em produção usando o mesmo
Firestore. Isso viola a regra de isolamento escrita no `igor-agents/CLAUDE.md`: contexto
profissional e pessoal não se misturam.

A saída escolhida é consolidar os dois projetos do Escombro (linktree e site) em um só,
apagar o projeto que sobrar e usar a vaga liberada para criar o projeto do Maestro.

### Dois atalhos a testar antes de executar este plano

1. **Aumento de cota.** Na tela de criar projeto, quando a cota estoura, o Firebase mostra
   um link de solicitação de aumento. Se aprovado, cria-se o projeto do Maestro direto e
   **este PRD inteiro se torna desnecessário**.
2. **Verificar se já estão no mesmo projeto.** Comparar `VITE_FIREBASE_PROJECT_ID` em
   `linktree-escombro/.env.local` e `site-escombro/.env.local`. Se forem iguais, não há
   migração — basta apagar outro projeto inativo da conta.

Só siga adiante se os dois atalhos falharem.

---

## 2. Objetivo

Mover todos os dados do projeto Firebase do **linktree-escombro** para o projeto Firebase do
**site-escombro**, apontar a aplicação do linktree para o projeto de destino e apagar o
projeto de origem — **sem que o linktree saia do ar em nenhum momento**.

### Não-objetivos

- Não refatorar o linktree nem o site.
- Não unificar os modelos de dados dos dois (RTDB e Firestore continuam separados).
- Não migrar Analytics (histórico do site fica onde está; não há Analytics no linktree).
- Não mexer no `otica-roland` além de, no fim, tirar o Maestro de lá.

---

## 3. Estado atual

Levantado lendo o código dos dois repositórios.

### Origem — `linktree-escombro`

Usa **três** serviços do Firebase, não apenas o banco:

| Serviço | O que guarda | Onde no código |
|---|---|---|
| Realtime Database | `cms/links` (lista de links), `cms/siteConfig` (config + perfil) | `store/useCMSStore.ts` — constante `DB_PATHS`, ~linha 108 |
| Storage | `images/{timestamp}_{nomeDoArquivo}` | `components/admin/LinkEditor.tsx` ~linha 48; também usado em `components/admin/AdminPanel.tsx` |
| Auth | E-mail/senha (`signInWithEmailAndPassword`) e Google (`signInWithPopup`) | `hooks/useAuth.ts` |

Inicialização em `firebase.ts`, exportando `db` (RTDB), `storage` e `auth`.

Variáveis de ambiente consumidas (todas via `import.meta.env`):

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_DATABASE_URL      # específica do RTDB — some do snippet padrão de config
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

Há um `cors.json` na raiz com `"origin": ["*"]` — configuração de CORS do Storage.

### Destino — `site-escombro`

| Serviço | O que guarda | Onde no código |
|---|---|---|
| Firestore | documento `siteData` | `firebase.ts`, uso via `doc(db, 'siteData', …)` |
| Auth | admin do site | `firebase.ts` |
| Analytics | ativo | `firebase.ts` |

**Não usa Realtime Database nem Storage.**

### Por que não há colisão

- O linktree grava em **Realtime Database**; o site em **Firestore**. São produtos distintos
  dentro do mesmo projeto e não compartilham namespace.
- O bucket de Storage do destino está vazio, então `images/` chega sem conflito de nomes.
- Auth é o único ponto compartilhado — ver risco R2.

---

## 4. Riscos

### R1 — Imagens órfãs (crítico)

Os registros em `cms/links` guardam a **URL completa** da imagem, incluindo o nome do bucket
de origem e o token de download. Migrar apenas o banco deixa o linktree funcionando, porque
o bucket antigo continua existindo. Ao apagar o projeto de origem, **todas as imagens somem
de uma vez**, dias depois, sem alteração de código que explique.

**Mitigação:** migrar o Storage **antes** do banco e reescrever as URLs no JSON antes de
importar. Verificação obrigatória na fase 4.

### R2 — Admin sem acesso

Os dois projetos usam Auth. O usuário administrador do linktree não existe no projeto de
destino. Login por Google se resolve no primeiro acesso; e-mail/senha precisa ser criado à
mão no console.

### R3 — Regras não replicadas

Regras do Realtime Database e do Storage são por projeto. Se não forem republicadas no
destino, o sintoma típico é "os links aparecem mas não salvam" (leitura pública, escrita
negada).

### R4 — CORS do Storage

Sem o `cors.json` aplicado no bucket de destino, as imagens falham ao carregar no navegador
mesmo estando lá.

### R5 — `VITE_FIREBASE_DATABASE_URL` esquecida

Quando o RTDB é criado depois do app web, essa variável **não aparece** no snippet de
configuração do console. É a que mais escapa na troca de ambiente.

---

## 5. Plano de execução

Sete fases. Cada uma tem um portão — não avance sem satisfazê-lo.
**Nada é irreversível até a fase 7.**

### Fase 1 — Backup

1. Console — Realtime Database — menu ⋮ — **Exportar JSON**. Salvar como
   `linktree-rtdb-backup.json`.
2. Baixar a pasta `images/` inteira do Storage:
   ```bash
   gsutil -m cp -r gs://BUCKET-ANTIGO/images ./images
   ```
3. Copiar para arquivo local as **regras do Realtime Database** e as **regras do Storage**.

**Portão:** o JSON exportado contém `cms/links` com dados reais, e a contagem de arquivos
baixados bate com a do console.

### Fase 2 — Preparar o destino

No projeto do **site-escombro**:

1. Criar o Realtime Database (região mais próxima, iniciar em **modo bloqueado**).
2. Publicar as regras do RTDB salvas na fase 1.
3. Ativar o Storage e aplicar o CORS:
   ```bash
   gsutil cors set cors.json gs://BUCKET-NOVO
   ```
   Aproveitar para trocar `"origin": ["*"]` pelo domínio real do linktree.
4. Em Authentication, habilitar E-mail/senha e Google. Criar o usuário admin
   (o login por Google se resolve sozinho no primeiro acesso).

**Portão:** o site do Escombro continua funcionando normalmente. Nada aqui deveria afetá-lo.

### Fase 3 — Storage primeiro

A ordem é obrigatória: as URLs novas precisam existir antes do import do banco.

1. Subir `images/` para o bucket de destino mantendo os mesmos nomes:
   ```bash
   gsutil -m cp -r ./images gs://BUCKET-NOVO/
   ```
2. Registrar o de-para de URL antiga — URL nova para cada arquivo.

**Portão:** uma URL nova abre em aba anônima e mostra a imagem.

### Fase 4 — Reescrever URLs e importar

1. Substituir no JSON toda ocorrência da URL antiga pela nova. Salvar como
   `linktree-rtdb-migrado.json`, preservando o original.
2. Verificar que não sobrou referência ao projeto antigo:
   ```bash
   grep -c "PROJETO-ANTIGO" linktree-rtdb-migrado.json   # deve ser 0
   ```
3. Console do destino — Realtime Database — **Importar JSON**.

**Portão:** `cms/links` e `cms/siteConfig` visíveis no console do destino, e o grep retornou 0.

### Fase 5 — Apontar o app e testar local

Produção segue intocada nesta fase.

1. Trocar as sete variáveis em `linktree-escombro/.env.local` pelas do projeto de destino.
   Atenção especial a `VITE_FIREBASE_DATABASE_URL` (ver R5).
2. Rodar local e verificar, nesta ordem:
   - os links aparecem;
   - as imagens carregam;
   - o login do painel funciona;
   - editar um link salva e o valor persiste após recarregar.

**Portão:** os quatro testes passam. O quarto é o mais importante — prova que Auth e regras
do RTDB estão corretos no destino.

### Fase 6 — Publicar e aguardar

1. Atualizar as variáveis de ambiente no host do linktree e fazer deploy.
2. Verificar em produção, aba anônima, no celular.
3. **Aguardar alguns dias sem apagar nada.** O projeto antigo parado não custa nada e é a
   rede de segurança inteira.

**Portão:** linktree no ar pelo projeto novo há alguns dias, sem anomalias, e o painel admin
foi acessado ao menos uma vez após o deploy.

### Fase 7 — Apagar o antigo e criar o Maestro

> **Ponto sem volta.** A exclusão tem 30 dias de arrependimento, mas o projeto fica
> inacessível imediatamente.

1. Apagar o projeto antigo do linktree.
2. Criar o projeto do Maestro na vaga liberada (`maestro-igor` ou similar).
3. Ativar o Firestore e publicar `igor-agents/firestore.rules` (essas regras negam tudo que
   não é `posts`/`negocios` — correto num projeto dedicado, destrutivo num compartilhado).
4. Baixar a service account e apontar no `.env` do igor-agents:
   ```
   FIREBASE_SERVICE_ACCOUNT=/caminho/da/chave.json
   ```
   Com essa variável presente, `memory/firebase.js` passa a usar o Admin SDK automaticamente
   (ver `memory/backendFirebase.js`).
5. Trocar as demais `FIREBASE_*` do igor-agents e as `VITE_FIREBASE_*` do maestro-frontend.

**Portão / critério de aceite final:** rodar um pipeline pelo painel do Maestro e ver o card
aparecer no kanban, sair de *Gerando* e chegar em *Pendente* com a arte carregada.

---

## 6. Automação sugerida

O miolo das fases 3 e 4 é repetitivo e sujeito a erro humano. Vale um script.

### Especificação

**Entrada**
- `linktree-rtdb-backup.json` (export da fase 1)
- diretório local `./images` (download da fase 1)
- credenciais do projeto de destino (service account com acesso ao Storage)

**Comportamento**
1. Fazer upload de cada arquivo de `./images` para o bucket de destino, preservando o nome.
2. Obter a URL de download pública de cada arquivo enviado.
3. Percorrer o JSON recursivamente procurando strings que contenham o bucket de origem.
4. Substituir cada uma pela URL correspondente do destino.
5. Emitir `linktree-rtdb-migrado.json`.
6. Emitir um relatório: quantos arquivos subiram, quantas URLs foram reescritas, e
   **quais URLs do bucket antigo sobraram sem correspondência** (deve ser zero).

**Critério de sucesso**
- `grep -c "PROJETO-ANTIGO" linktree-rtdb-migrado.json` retorna 0.
- O relatório não lista nenhuma URL órfã.
- O JSON de saída é válido e mantém a estrutura `cms/links` + `cms/siteConfig`.

**Restrições**
- Não modificar o JSON de entrada.
- Falhar ruidosamente se algum upload não confirmar — silêncio aqui vira imagem órfã depois.

### Convenções do repositório

Se o script for para `igor-agents/`, valem as regras do `CLAUDE.md` de lá: teste antes do
código de produção, ES6+ com `import`/`export`, comentários em português e código em inglês,
JSDoc no que é exportado.

---

## 7. Reversão

| Momento | Como reverter |
|---|---|
| Fases 1 a 5 | Nada foi alterado em produção. Não há o que reverter. |
| Fase 6 | Trocar as variáveis de ambiente de volta para o projeto antigo e publicar. Imediato. |
| Após fase 7 | Restaurar `linktree-rtdb-backup.json` e a pasta `images/` num projeto novo. |

---

## 8. Sintomas e causas

| Sintoma | Causa provável |
|---|---|
| Imagens somem dias depois | Sobrou URL do bucket antigo no banco (R1) |
| Não consigo entrar no painel | Usuário admin não existe no destino, ou provedor não habilitado (R2) |
| Links aparecem mas não salvam | Regras do RTDB no destino negam escrita (R3) |
| Imagem não carrega no navegador | CORS ou regras do Storage no destino (R4) |
| App não conecta ao banco | `VITE_FIREBASE_DATABASE_URL` não trocada (R5) |
