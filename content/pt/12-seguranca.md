---
slug: seguranca
title: Segurança e privacidade
group: Técnico
description: Quem pode ver o quê, como os dados das clientes são protegidos e o que é testado.
---

# Segurança e privacidade

O CondicionalMap guarda endereços, telefones e histórico de compras. Por isso os controles são mais rígidos do que os de um site público.

## Modelo de ameaças (resumo)

| Ameaça | Controle |
|---|---|
| Visitante lendo dados pelo banco | RLS ligada **sem nenhuma política** + `REVOKE ALL` para `anon`/`authenticated`. O navegador não tem chave. |
| Funcionária de uma loja vendo outra | A loja vem só de `requireMember()`; toda consulta filtra `store_id`; chaves compostas no banco. |
| Alguém se cadastrar na equipe | Sem cadastro público. Contas só por `tools/create-member.mjs` (chave secreta). Signup desligado no Supabase Auth. |
| Força bruta no login | 8 tentativas a cada 15 min por aparelho; a mesma mensagem para usuário inexistente e para senha errada. |
| Ex-funcionária com sessão aberta | `--disable` remove o vínculo; a próxima chamada e a renovação da sessão falham. |
| Fechar venda errada | Regras no banco (ver [Banco de dados](#pt-banco)). |
| XSS | Texto sempre via `textContent`; CSP `script-src 'self'`; nenhum script de terceiros. |
| Link da cliente vazado | Token aleatório de 192 bits; só o hash no banco; expira em 14 dias; revogável; fica no fragmento da URL (não vai para logs nem Referer); limite de acessos por aparelho. |
| Entregador confirmar sem a cliente | Código de 6 números que **só a cliente vê**: calculado no servidor (HMAC com `CM_CODE_SECRET`), nunca gravado. Uso único, 48 h, 5 tentativas. A tarefa só conclui pela função do banco `cm_task_confirm`. |
| Confirmar sem código | Só a gerente, com motivo obrigatório; fica no histórico com o nome. |
| Indexação por buscadores | `/condicionais/*` com `X-Robots-Tag: noindex` e `no-cache`. |

## Dados pessoais

- **Mínimo obrigatório:** nome e WhatsApp.
- **Endereço:** opcional; serve para a entrega e o mapa, que é **interno da loja**.
- **Geocodificação:** o servidor envia ao Nominatim apenas rua, número, bairro e cidade, **sem nome nem telefone**.
- **Retenção:** prazo de exclusão ainda a definir com a loja (pendência registrada).

## O que é testado

`npm run test:db` (banco local) cobre, entre outros:

- anônimo não lê, não insere, não altera e não apaga nenhuma das tabelas;
- anônimo não executa `cm_resolve_token()`;
- cliente de uma loja não pode ser usado por outra;
- transições inválidas, sacola sem peças e fechamento sem pagamento são recusados;
- condicional encerrada fica travada;
- tokens expirados ou revogados não resolvem.

> **Atenção:** a sessão fica salva no aparelho para a equipe não precisar logar o tempo todo. Em aparelhos compartilhados, use sempre **Sair** no fim do turno.
