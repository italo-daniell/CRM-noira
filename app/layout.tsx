import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "NOIRA — CRM com IA para vender por conversas",
  description: "Organize conversas, automatize seu funil e venda mais com a inteligência artificial da NOIRA.",
  icons: { icon: "/noira-logo.jfif", shortcut: "/noira-logo.jfif", apple: "/noira-logo.jfif" },
  openGraph: {
    title: "NOIRA — Converse. Organize. Venda no automático.",
    description: "O CRM com IA para transformar cada mensagem em oportunidade.",
    images: [{ url: "/og.png", width: 1672, height: 941, alt: "NOIRA CRM com IA" }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`(function(){try{var t=localStorage.getItem('noira-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme='light'}})();`}} /></head><body>{children}</body></html>;
}
