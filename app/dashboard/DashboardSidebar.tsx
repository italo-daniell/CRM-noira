"use client";

import Link from "next/link";

type Props = { active: "pipeline" | "conversations" | "contacts" | "calendar" };

export function DashboardSidebar({ active }: Props) {
  return (
    <aside className="dash-side">
      <Link href="/" className="brand" aria-label="Voltar ao início da NOIRA">
        <img className="brand-mark" src="/noira-logo.jfif" alt="" />
        <span>NOIRA</span>
      </Link>
      <nav aria-label="Navegação principal">
        <Link className={active === "pipeline" ? "on" : ""} href="/dashboard">▥ <span>Pipeline</span></Link>
        <Link className={active === "conversations" ? "on" : ""} href="/dashboard/conversations">▢ <span>Conversas</span><b>9</b></Link>
        <Link className={active === "contacts" ? "on" : ""} href="/dashboard/contacts">◎ <span>Contatos</span></Link>
        <Link className={active === "calendar" ? "on" : ""} href="/dashboard/calendar">◷ <span>Agenda</span></Link>
        <a href="#relatorios">◉ <span>Relatórios</span></a>
        <a href="#noira-ai">✦ <span>NOIRA IA</span></a>
      </nav>
      <div className="dash-user"><i>MS</i><span><b>Marina Silva</b><small>Administrador</small></span></div>
    </aside>
  );
}
