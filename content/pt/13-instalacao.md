---
slug: instalacao
title: Instalação e publicação
group: Técnico
description: Rodar localmente, criar a primeira loja e publicar no Netlify com Supabase.
---

# Instalação e publicação

## Requisitos

- Node 20 ou mais recente
- Docker Desktop (para o Supabase local)
- Conta no Supabase e no Netlify (para publicar)

## Rodar localmente

```bash
npx supabase start                    # banco local no Docker
npx supabase migration up --local     # cria as tabelas
npm run dev                           # site + funções em http://localhost:8888
```

O arquivo `.env` precisa de `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`. O `supabase start` mostra os valores locais.

### Criar a loja e a gerente

```bash
node tools/create-member.mjs --store "Nome da Loja" --login gerente --name "Nome da Gerente" --role admin --out acesso.txt
```

A senha vai **só** para o arquivo `acesso.txt`. Entregue à pessoa e apague o arquivo.

## Variáveis de ambiente

| Variável | Onde | Para quê |
|---|---|---|
| `SUPABASE_URL` | Netlify | Endereço do projeto |
| `SUPABASE_ANON_KEY` | Netlify | Login no Supabase Auth (só no servidor) |
| `SUPABASE_SERVICE_ROLE_KEY` | Netlify | Acesso ao banco (**nunca** no navegador) |
| `PUBLIC_SITE_URL` | Netlify | Identificação nas consultas ao Nominatim |
| `CONTACT_EMAIL` | Netlify (opcional) | Contato exigido pela política do Nominatim |
| `RATE_LIMIT_SALT` | Netlify | Sal do limite de tentativas (o IP nunca é gravado) |
| `CM_CODE_SECRET` | Netlify | Segredo (16+ caracteres) que gera os códigos de entrega. **Obrigatório em produção.** Trocar invalida os códigos já gerados |

## Publicar

1. `npx supabase db push`: aplica as migrações em produção.
2. Configure as variáveis no Netlify (inclusive `CM_CODE_SECRET`).
3. Faça o deploy **da pasta `site/`** (ela tem o `netlify.toml`, `public/` e `netlify/`; não suba `.env`, `supabase/` nem `tools/`). O endereço é `https://condicionalmap.netlify.app` e a documentação fica em `/docs`.
4. Crie a loja e a gerente com `create-member.mjs --env .env.production`.

## Testes

```bash
npm run test:db   # regras e travas do banco (local)
```

## Problemas comuns

> **Problema:** `failed to connect to the docker API`
> O Docker Desktop está fechado. Abra o Docker e rode `npx supabase start` de novo.

> **Problema:** O Netlify CLI carrega o `.env` errado.
> Rode os comandos **dentro da pasta do projeto**, que precisa ter `.git`. Sem `.git`, o CLI sobe de pasta e pode achar outro `.env`.

> **Problema:** "O CondicionalMap está em configuração" / erro 503.
> Faltam `SUPABASE_URL` ou `SUPABASE_SERVICE_ROLE_KEY` no ambiente.
