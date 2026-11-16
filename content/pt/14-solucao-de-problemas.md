---
slug: solucao-de-problemas
title: Solução de problemas
group: Ajuda
description: Todas as mensagens que o sistema mostra, o que significam e o que fazer.
---

# Solução de problemas

## Mensagens da tela

| Mensagem | O que significa | O que fazer |
|---|---|---|
| Usuário ou senha incorretos. | Login não confere (ou conta desativada). | Confira o usuário em minúsculas; peça senha nova. |
| Muitas tentativas seguidas. | Limite de 8 tentativas em 15 min. | Espere alguns minutos. |
| Sua sessão expirou. Entre de novo. | A renovação automática falhou (conta desativada ou muito tempo sem uso). | Entre de novo. |
| Esta conta não tem acesso a esta loja. | Pessoa sem vínculo ativo com a loja. | Administrador confere `store_members`. |
| Essa mudança de etapa não é permitida. | Ação fora de ordem ou alguém já mudou a etapa. | Atualize a página. |
| Adicione pelo menos uma peça antes de enviar. | Sacola vazia. | Adicione peças ou salve a quantidade. |
| Confira as peças devolvidas antes de finalizar. | Falta conferência. | **Salvar conferência**. |
| O pagamento ainda não cobre o valor final. | Pago < valor final, sem justificativa. | Registre o restante ou justifique. |
| Esta condicional já foi encerrada. | Finalizada ou cancelada: travada. | — |
| As peças só podem ser alteradas enquanto a sacola está sendo separada. | A sacola já saiu. | Registre nas observações. |
| A escolha só pode ser registrada com a sacola na cliente ou devolvida. | Ainda aguardando entrega. | Primeiro **Cliente recebeu**. |
| A conferência só pode ser feita depois da devolução. | Ainda com a cliente. | Primeiro **Peças devolvidas**. |
| “Não recebido” só vale antes da entrega. | A cliente já recebeu. | — |
| WhatsApp inválido. Use DDD + número. | Menos de 10 ou mais de 11 dígitos. | Corrija o número. |
| Cliente salva, mas o endereço não foi encontrado no mapa. | Geocodificação sem resultado ou serviço fora. | Revise a grafia; preencha bairro e cidade. |
| Não foi possível carregar o mapa agora. | Tiles do OpenStreetMap não carregaram. | Verifique a internet; o resto funciona. |
| Algo deu errado do nosso lado. | Erro inesperado no servidor (detalhe só no log). | Tente de novo; se repetir, ver logs das funções no Netlify. |

## Situações frequentes

> **Problema:** A tela ficou em "Carregando…".
> O JavaScript não carregou (extensão bloqueando ou internet caiu). Atualize a página. Se persistir, teste em aba anônima.

> **Problema:** O número no painel não bate com o caderno.
> O painel conta só o que foi **registrado**. Confira se as condicionais antigas foram finalizadas no sistema. Ainda abertas, elas contam em "Em aberto".

> **Problema:** Duas pessoas mexeram na mesma condicional.
> A última ação válida vence, e o banco recusa transições fora de ordem. Confira o **Histórico** para ver quem fez o quê.

## Para quem mantém o sistema

| Sintoma | Onde olhar |
|---|---|
| Erro 500 genérico | Netlify → Functions → `cm` → logs (`[condicionalmap]`). |
| Regra de banco recusando algo correto | Código do erro em `detail.message` no log, e tabela de regras em [Banco de dados](#pt-banco). |
| Geocodificação sempre falhando | Política do Nominatim (1 req/s, User-Agent). Configure `PUBLIC_SITE_URL` e `CONTACT_EMAIL`. |
| Login funciona e todas as ações dão 403 | Pessoa sem `store_members` ativo, ou loja com `is_active = false`. |
