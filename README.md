# NOIRA CRM — aplicativo

Aplicativo web instalável (PWA) em Next.js, com código no GitHub e publicação na Vercel.

## Acesso direto temporário

A página inicial e as antigas telas de entrada redirecionam para `/dashboard`.
`DIRECT_ACCESS` em `lib/app-mode.ts` ativa esta experiência sem login. O código de autenticação Supabase permanece disponível para uma futura reativação; o cookie de sessão e o verificador PKCE usam a mesma configuração no navegador e no servidor.

O painel usa registros de exemplo. Leads, contatos, agenda e mensagens de teste são persistidos somente no navegador atual com chaves `noira:*:v1`. Não há sincronização entre dispositivos nem acesso anônimo aos registros de clientes no Supabase. As mensagens não são enviadas ao WhatsApp ou Instagram, e o assistente atual contém respostas demonstrativas.

A área administrativa continua exigindo autorização própria; o modo direto não concede privilégios administrativos nem altera políticas RLS.

## Instalar

Abra o aplicativo e use **Instalar NOIRA** no menu lateral ou no menu Mais do celular. Em navegadores compatíveis, confirme a instalação. No iOS, abra no Safari e use Compartilhar → Adicionar à Tela de Início. O manifesto inicia em `/dashboard` com janela independente.

O service worker guarda apenas ícones e uma tela de reconexão. Telas do CRM, dados de clientes, APIs e sessões não são armazenados no cache do service worker. Para abrir outras telas, mantenha uma conexão de internet.

## Desenvolvimento e validação

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm exec tsc --noEmit
node --test tests/auth.test.mjs tests/app-mode.test.mjs
pnpm build
```

## Vercel

O repositório inclui `vercel.json`: framework Next.js e build `pnpm build`.
Conecte `italo-daniell/CRM-noira` e use `main` como branch de produção.

Variáveis públicas para a integração Supabase existente:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SITE_URL`: origem HTTPS definitiva da aplicação.

Nunca configure a chave `service_role` em uma variável pública. O acesso direto ao painel não depende de uma sessão do Supabase e não concede leitura ou escrita anônima no banco.

Antes de habilitar sincronização com dados reais, implemente contas ou sessões anônimas isoladas, vinculação do workspace, políticas RLS e autorização de cada operação. Para reativar o login, altere `DIRECT_ACCESS` para `false`, valide SMTP, URLs permitidas e recuperação de senha, e execute os testes de autenticação.
