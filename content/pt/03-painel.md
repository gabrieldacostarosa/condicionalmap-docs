---
slug: painel
title: Painel
group: Uso diário
description: A tela inicial — o que está em aberto, onde estão as sacolas, quanto vendeu e o que precisa de atenção.
---

# Painel

## Para que serve

Responder em poucos segundos as perguntas do dia: *quantas sacolas estão fora? alguma passou do prazo? quanto falta receber? as condicionais estão virando venda?*

## Como funciona

O painel tem cinco blocos, de cima para baixo.

### 1. Resumo

| Card | O que conta |
|---|---|
| **Em aberto** | Condicionais aguardando entrega, com a cliente ou devolvidas e ainda não finalizadas. Embaixo: valor das peças que estão com clientes. |
| **Com a cliente** | Sacolas entregues e ainda não devolvidas. |
| **Prazo vencido** | Sacolas com a cliente cujo prazo de devolução já passou. |
| **A receber** | Valor vendido (conferido) menos o que já foi pago. |

Os três primeiros cards são clicáveis e abrem a lista já filtrada.

### 2. Mapa das sacolas

Mostra no mapa onde está cada sacola fora da loja, com uma cor por situação. Veja [Mapa das sacolas](#pt-mapa).

### 3. Movimento

Gráfico de barras com o **valor enviado** (barra clara) e o **valor vendido** (barra terracota) por período. As abas mudam o agrupamento:

| Aba | Período |
|---|---|
| Dias | Últimos 14 dias |
| Semanas | Últimas 8 semanas (segunda a domingo) |
| Meses | Últimos 6 meses |

"Enviado" conta pela data em que a sacola **saiu**; "vendido" pela data em que foi **finalizada**.

### 4. Últimos 30 dias

| Indicador | Cálculo |
|---|---|
| **Faturado** | Soma do valor final das condicionais finalizadas. |
| **Finalizadas** | Quantidade de condicionais finalizadas. |
| **Ticket médio** | Faturado ÷ finalizadas. |
| **Peças que viraram venda** | Peças vendidas ÷ peças enviadas, só nas finalizadas. |

### 5. Precisa de atenção

Até 8 itens, nesta ordem: prazo vencido, devolvidas esperando conferência e vendas com saldo a receber. Cada item abre a condicional.

## Caso de uso

> Segunda de manhã, a gerente abre o painel no celular. O card **Prazo vencido** mostra 1. Em "Precisa de atenção" aparece a Elisa, com prazo até sexta. Ela toca no nome, abre a condicional e usa o botão **Mensagem no WhatsApp** para lembrar a cliente.

## Problemas comuns

> **Problema:** O gráfico está vazio.
> O gráfico só conta sacolas que **saíram** (passaram para "Com a cliente") e vendas **finalizadas**. Condicionais ainda aguardando entrega não entram.

> **Problema:** "A receber" está zerado, mas a cliente ainda não pagou.
> O valor a receber só existe depois da **conferência**, quando a loja informa o que foi vendido. Antes disso, o sistema não sabe o valor final.

> **Problema:** A conversão aparece como "—".
> Ainda não há condicionais finalizadas nos últimos 30 dias.
