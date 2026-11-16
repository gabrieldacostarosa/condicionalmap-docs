---
slug: clientes
title: Clientes
group: Uso diário
description: Cadastro mínimo, busca rápida e o histórico de compras de cada cliente.
---

# Clientes

## Para que serve

Ter em um lugar o contato, o endereço e o histórico de cada cliente, reaproveitando os dados a cada nova condicional.

## Como funciona

### Cadastro

| Campo | Obrigatório? |
|---|---|
| Nome | ✅ |
| WhatsApp (com DDD) | ✅ |
| Rua, número, bairro, cidade, referência | Opcional, mas necessário para aparecer no [mapa](#pt-mapa) |

O endereço fica em "Endereço (opcional)" para não atrasar o cadastro no balcão.

### Busca

Na tela **Clientes** ou ao criar uma condicional: digite parte do nome ou 4 ou mais dígitos do telefone.

### Ficha da cliente

- **Já comprou:** soma das condicionais finalizadas.
- **Condicionais** e **Em aberto:** quantidades.
- **Histórico de condicionais:** cada uma com etapa e valor.
- Botões **WhatsApp**, **Editar** e **Nova condicional**.

## Caso de uso

> Uma cliente antiga liga pedindo vestidos. A atendente busca pelo final do telefone, abre a ficha e vê que ela costuma ficar com uma ou duas peças e paga no Pix. Ela monta a sacola já sabendo o perfil da cliente.

## Problemas comuns

> **Problema:** Cadastrei a mesma cliente duas vezes.
> O sistema permite, porque famílias às vezes dividem o mesmo número. Use sempre a busca antes de cadastrar. A junção de cadastros duplicados está no roteiro.

> **Problema:** Mudei o endereço e o ponto no mapa não mudou.
> O ponto é recalculado ao salvar. Confira se apareceu o aviso "endereço não foi encontrado no mapa". Se apareceu, revise a grafia.
