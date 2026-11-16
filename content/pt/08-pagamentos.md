---
slug: pagamentos
title: Pagamentos e fechamento
group: Uso diário
description: Registrar o que foi pago, lidar com pagamento parcial e encerrar a condicional com segurança.
---

# Pagamentos e fechamento

## Para que serve

Saber quanto cada cliente deve, quanto já pagou e impedir que uma condicional seja encerrada como paga quando não está.

## Como funciona

Na etapa **Devolvida**, o bloco **Pagamentos** mostra quanto falta receber. Em **Registrar pagamento**:

| Campo | Observação |
|---|---|
| **Valor recebido** | Já vem preenchido com o saldo. Pode ser menor (pagamento parcial). |
| **Forma** | Dinheiro, Pix, Cartão ou Outro. |
| **Observação** | Opcional ("2x no cartão"). |

Pode haver vários pagamentos para a mesma condicional.

### Finalizar

- **Pagamentos ≥ valor final:** a condicional é finalizada direto.
- **Pagamentos < valor final:** o sistema pede uma **justificativa** ("paga na sexta pelo Pix"), que fica no histórico. O saldo continua em **A receber** no painel.

> **Atenção:** registrar um pagamento **não** significa que o dinheiro entrou. O CondicionalMap é um controle interno: ele não se conecta a banco, maquininha ou Pix.

## Caso de uso

> A venda da Ana deu R$ 260,00. Ela paga R$ 150,00 no Pix na hora e promete o resto na sexta. A atendente registra o Pix, toca em **Finalizar** e escreve "R$ 110 na sexta". A condicional fecha, e os R$ 110,00 aparecem em **A receber** e em "Precisa de atenção" até serem quitados.

## Problemas comuns

> **Problema:** "O pagamento ainda não cobre o valor final."
> Registre o restante ou escreva a justificativa no aviso que aparece ao finalizar.

> **Problema:** Registrei um pagamento errado.
> Enquanto a condicional não está finalizada, avise a gerente: a correção ainda é feita pelo administrador. Depois de finalizada, ela fica travada por segurança.

> **Problema:** A cliente pagou um saldo antigo de uma condicional finalizada.
> Condicionais finalizadas não aceitam pagamentos novos. Por enquanto, registre a quitação nas observações da cliente. O controle de saldo após o fechamento está no roteiro.
