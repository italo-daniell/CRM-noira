"use client";

import { ThemeToggle } from "../ThemeToggle";

type Props = { active: "pipeline" | "conversations" | "contacts" | "calendar" };

export function DashboardSidebar({ active }: Props) {
  return (
    <aside className="dash-side">
      <a href="/" className="brand" aria-label="Voltar ao início da NOIRA">
        <img className="brand-mark" src="/noira-logo.jfif" alt="" />
        <span>NOIRA</span>
      </a>
      <nav aria-label="Navegação principal">
        <a aria-current={active === "pipeline" ? "page" : undefined} className={active === "pipeline" ? "on" : ""} href="/dashboard">▥ <span>Pipeline</span></a>
        <a aria-current={active === "conversations" ? "page" : undefined} className={active === "conversations" ? "on" : ""} href="/dashboard/conversations">▢ <span>Conversas</span><b>9</b></a>
        <a aria-current={active === "contacts" ? "page" : undefined} className={active === "contacts" ? "on" : ""} href="/dashboard/contacts">◎ <span>Contatos</span></a>
        <a aria-current={active === "calendar" ? "page" : undefined} className={active === "calendar" ? "on" : ""} href="/dashboard/calendar">◷ <span>Agenda</span></a>
        <div className="dash-nav-theme"><ThemeToggle placement="dashboard"/></div>
        <a href="#relatorios">◉ <span>Relatórios</span></a>
        <a href="#noira-ai">✦ <span>NOIRA IA</span></a>
      </nav>
      <div className="dash-theme"><span>Aparência</span><ThemeToggle placement="dashboard"/></div>
      <div className="dash-user"><i>MS</i><span><b>Marina Silva</b><small>Administrador</small></span></div>
    </aside>
  );
}
