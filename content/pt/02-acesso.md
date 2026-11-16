---
slug: acesso
title: Primeiro acesso
group: Começo
description: Como a equipe entra no sistema, o que cada perfil pode fazer e o que acontece quando a sessão expira.
---

# Primeiro acesso

## Para que serve

O login garante que só quem trabalha na loja veja clientes, endereços e valores. Não existe cadastro público: as contas são criadas por quem administra o sistema.

## Como funciona

1. A gerente recebe um **usuário** (por exemplo `ana.loja`) e uma **senha**.
2. Ela abre o endereço do sistema, em `/condicionais/`, e entra.
3. A sessão continua aberta no aparelho e é renovada sozinha, sem pedir a senha a cada hora.
4. O botão **Sair** fica no rodapé do menu (no computador) ou na barra inferior (no celular).

### Perfis

| Perfil | Pode fazer |
|---|---|
| **Gerente** (`admin`) | Tudo, inclusive cancelar condicionais que já saíram da loja. |
| **Equipe** (`staff`) | Clientes, condicionais, escolhas, conferência e pagamentos. |

Cada pessoa só vê os dados da **própria loja**. A loja vem do login, nunca de algo que o navegador possa trocar.

## Caso de uso

> A Ana começa a trabalhar na loja. O administrador roda `tools/create-member.mjs` com o nome e o usuário dela, e entrega o arquivo com a senha. A Ana entra pelo celular e já vê o painel da loja. Quando ela sair da loja, o administrador desativa o acesso com `--disable`, e a sessão dela para de funcionar na hora.

## Problemas comuns

> **Problema:** "Usuário ou senha incorretos."
> Confira se o usuário está em minúsculas e sem espaços. Ao colar a senha, não inclua espaços no começo ou no fim. A mensagem é a mesma para usuário inexistente, de propósito, para não ajudar quem tenta adivinhar.

> **Problema:** "Muitas tentativas seguidas."
> Depois de 8 tentativas erradas em 15 minutos, o login fica bloqueado para aquele aparelho por alguns minutos. Espere e tente de novo, ou peça uma senha nova.

> **Problema:** "Esta conta não tem acesso a esta loja."
> O acesso foi desativado ou a loja está inativa. Peça ao administrador para conferir a pessoa em `store_members`.

> **Problema:** Esqueci a senha.
> Não existe "esqueci a senha" por e-mail. O administrador gera uma nova com `node tools/create-member.mjs --reset <usuário> --out <arquivo>`.
