"use client";

import { ThemeToggle } from "../ThemeToggle";

type Props = {
  active: "pipeline" | "conversations" | "contacts" | "calendar" | "reports" | "ai" | "profile" | "admin";
  showAdmin?: boolean;
  userName?: string;
  userRole?: string;
};

export function DashboardSidebar({ active, showAdmin = false, userName = "Marina Silva", userRole = "Administrador" }: Props) {
  const initials = userName.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return (
    <aside className="dash-side">
      <a href="/" className="brand" aria-label="Voltar ao início da NOIRA">
        <img className="brand-mark" src="/noira-logo.jfif" alt="" />
        <span>NOIRA</span>
      </a>
      <nav aria-label="Navegação principal">
        <a aria-current={active === "pipeline" ? "page" : undefined} className={active === "pipeline" ? "on" : ""} href="/dashboard">▥ <span>Dashboard</span></a>
        <a aria-current={active === "conversations" ? "page" : undefined} className={active === "conversations" ? "on" : ""} href="/dashboard/conversations">▢ <span>Conversas</span><b>9</b></a>
        <a aria-current={active === "contacts" ? "page" : undefined} className={active === "contacts" ? "on" : ""} href="/dashboard/contacts">◎ <span>Contatos</span></a>
        <a aria-current={active === "calendar" ? "page" : undefined} className={active === "calendar" ? "on" : ""} href="/dashboard/calendar">◷ <span>Agenda</span></a>
        <div className="dash-nav-theme"><ThemeToggle placement="dashboard"/></div>
        <a aria-current={active === "reports" ? "page" : undefined} className={active === "reports" ? "on" : ""} href="/dashboard/reports">◉ <span>Relatórios</span></a>
        <a aria-current={active === "ai" ? "page" : undefined} className={active === "ai" ? "on" : ""} href="/dashboard/ai">✦ <span>NOIRA IA</span></a>
        {showAdmin && <a aria-current={active === "admin" ? "page" : undefined} className={active === "admin" ? "on" : ""} href="/dashboard/admin">♜ <span>Administração</span></a>}
      </nav>
      <div className="dash-theme"><span>Aparência</span><ThemeToggle placement="dashboard"/></div>
      <a href="/dashboard/profile" aria-current={active === "profile" ? "page" : undefined} className={`dash-user ${active === "profile" ? "active" : ""}`}><i>{initials}</i><span><b>{userName}</b><small>{userRole}</small></span></a>
    </aside>
  );
}
