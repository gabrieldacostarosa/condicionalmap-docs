---
slug: versoes
title: Versões e roteiro
group: Ajuda
description: O que já existe, o que vem depois e como as decisões são validadas com a loja.
---

# Versões e roteiro

## 0.1, primeira versão para validação

- Login da equipe (gerente e funcionária) com renovação automática de sessão
- Clientes com cadastro mínimo, busca e histórico
- Condicionais por quantidade ou peça por peça
- Ciclo com regras no banco: aguardando entrega → com a cliente → devolvida → finalizada
- "Cliente não recebeu" e nova tentativa de entrega
- Escolha e conferência separadas
- Pagamentos parciais e fechamento com justificativa
- Painel: resumo, movimento (dias, semanas, meses), conversão, ticket médio, pendências
- **Mapa das sacolas** com quatro cores, foco na Grande Florianópolis
- Mensagens prontas no WhatsApp
- Histórico de cada condicional

## 2.0, v2

- **Página da cliente** (`/c/`): escolher as peças pelo link, sem conta
- **Entregas e coletas** com tela própria (**Entregas**)
- **Código de confirmação** estilo Uber: a cliente passa, quem entrega digita e a etapa muda sozinha
- Confirmação manual só pela gerente, com motivo
- Filtro **Todos** no mapa das sacolas
- Endereço próprio: `condicionalmap.netlify.app`, documentação em `/docs`

## Próximos passos (validar com a gerente)

| Item | Situação |
|---|---|
| Entregadores com login próprio e aceite do serviço | Planejado (hoje quem entrega usa o login da loja) |
| Catálogo de peças com foto | Planejado |
| Relatórios e exportação CSV | Planejado |
| Campo de avaria na conferência | Se a loja pedir |
| Desfazer etapa com justificativa | Se a loja pedir |
| Política de retenção dos dados de clientes | A definir |

## Como as mudanças são decididas

O sistema começa enxuto de propósito. A gerente usa no dia a dia e aponta o que não condiz com a rotina. Cada mudança entra com testes e atualiza esta documentação.
