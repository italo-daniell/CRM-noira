# NOIRA CRM

Primeira experiência pública e protótipo navegável do NOIRA, um CRM com IA para empresas que vendem por WhatsApp, Instagram e formulários.

## O que já existe

- Landing page completa, responsiva e com identidade NOIRA.
- Hero, apresentação do produto, recursos, IA, resultados, planos, CTA e rodapé.
- Protótipo visual do CRM em `/dashboard`.
- Pipeline, indicadores comerciais e painel do assistente NOIRA IA.
- Menu mobile e seletor interativo de período dos planos.
- Metadados de busca e imagem de compartilhamento.

## Próxima fase: produto operacional

O painel atual é uma demonstração visual. Para transformar o NOIRA em um SaaS comercial, a implementação deve seguir esta ordem:

1. Contas, empresas, usuários, equipes e permissões.
2. Contatos, empresas, negócios, etapas e campos personalizados.
3. Pipeline com arrastar e soltar, filtros, busca e histórico.
4. Caixa de entrada omnichannel com distribuição de conversas.
5. Integração oficial com WhatsApp Cloud API e Instagram Messaging.
6. Tarefas, agenda, lembretes e páginas de agendamento.
7. Automações por gatilho, condição, espera e ação.
8. Assistente de IA com contexto, aprovação humana e limites de uso.
9. Relatórios de funil, origem, produtividade, receita e SLA.
10. Assinaturas, cobrança, limites por plano e painel administrativo.
11. Auditoria, consentimento, exportação e exclusão de dados para LGPD.

## Estrutura de dados recomendada

Entidades principais: `workspaces`, `users`, `memberships`, `contacts`, `companies`, `pipelines`, `stages`, `deals`, `channels`, `conversations`, `messages`, `tasks`, `appointments`, `automation_flows`, `automation_runs`, `ai_usage`, `subscriptions` e `audit_logs`.

Todo registro comercial deve pertencer a um `workspace`. Permissões, consultas e automações precisam respeitar esse isolamento desde o início.

## Critérios para o MVP vendável

- Um gestor consegue criar a conta e convidar a equipe.
- Um vendedor consegue cadastrar, importar e movimentar leads.
- Mensagens de WhatsApp chegam e são respondidas dentro da NOIRA.
- Toda interação fica registrada na linha do tempo do contato.
- Regras simples criam tarefas e movem negócios automaticamente.
- A IA sugere respostas, mas ações externas sensíveis exigem confirmação.
- O gestor enxerga conversão por etapa, vendedor e origem.
- Cobrança, limites de plano, LGPD, logs e backups estão ativos.

## Desenvolvimento local

Requer Node.js 22 ou superior.

```bash
npm install
npm run dev
```

A página pública fica em `/` e o protótipo do CRM em `/dashboard`.
