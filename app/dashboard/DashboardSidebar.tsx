"use client";

import { useState } from "react";
import {
  CalendarDays,
  ChartNoAxesCombined,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { createClient } from "../../lib/supabase/client";

type Props = {
  active: "pipeline" | "conversations" | "contacts" | "calendar" | "reports" | "ai" | "profile" | "admin";
  showAdmin?: boolean;
  userName?: string;
  userRole?: string;
};

type NavigationItem = {
  id: Props["active"];
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

const navigationItems: NavigationItem[] = [
  { id: "pipeline", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "conversations", label: "Conversas", href: "/dashboard/conversations", icon: MessageSquare, badge: "9" },
  { id: "contacts", label: "Contatos", href: "/dashboard/contacts", icon: Users },
  { id: "calendar", label: "Agenda", href: "/dashboard/calendar", icon: CalendarDays },
  { id: "reports", label: "Relatórios", href: "/dashboard/reports", icon: ChartNoAxesCombined },
  { id: "ai", label: "NOIRA IA", href: "/dashboard/ai", icon: Sparkles },
];

export function DashboardSidebar({ active, showAdmin = false, userName = "Marina Silva", userRole = "Administrador" }: Props) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const initials = userName.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const moreIsActive = ["reports", "ai", "profile", "admin"].includes(active);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.assign("/entrar");
  }
  return (
    <>
      <aside className="dash-side desktop-sidebar">
        <a href="/" className="brand" aria-label="Voltar ao início da NOIRA">
          <img className="brand-mark" src="/noira-logo.jfif" alt="" />
          <span>NOIRA</span>
        </a>
        <nav aria-label="Navegação principal">
          {navigationItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const selected = active === item.id;
            return <a key={item.id} aria-label={item.label} aria-current={selected ? "page" : undefined} className={selected ? "on" : ""} data-tooltip={item.label} href={item.href}><Icon className="dash-nav-icon" aria-hidden="true" strokeWidth={2}/><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}</a>;
          })}
          <div className="dash-nav-theme"><ThemeToggle placement="dashboard"/></div>
          {navigationItems.slice(4).map((item) => {
            const Icon = item.icon;
            const selected = active === item.id;
            return <a key={item.id} aria-label={item.label} aria-current={selected ? "page" : undefined} className={selected ? "on" : ""} data-tooltip={item.label} href={item.href}><Icon className="dash-nav-icon" aria-hidden="true" strokeWidth={2}/><span>{item.label}</span></a>;
          })}
          {showAdmin && <a aria-label="Administração" aria-current={active === "admin" ? "page" : undefined} className={active === "admin" ? "on" : ""} data-tooltip="Administração" href="/dashboard/admin"><ShieldCheck className="dash-nav-icon" aria-hidden="true" strokeWidth={2}/><span>Administração</span></a>}
        </nav>
        <div className="dash-theme"><span>Aparência</span><ThemeToggle placement="dashboard"/></div>
        <div className="dash-account"><a href="/dashboard/profile" aria-current={active === "profile" ? "page" : undefined} className={`dash-user ${active === "profile" ? "active" : ""}`}><i>{initials}</i><span><b>{userName}</b><small>{userRole}</small></span></a><button className="dash-signout" type="button" onClick={signOut} disabled={signingOut} aria-label="Sair da conta" data-tooltip="Sair da conta"><LogOut aria-hidden="true" strokeWidth={2}/><span>{signingOut ? "Saindo…" : "Sair"}</span></button></div>
      </aside>

      <nav className="mobile-bottom-nav" aria-label="Navegação móvel">
        <div className="mobile-bottom-nav__bar">
          {navigationItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const selected = active === item.id;
            return (
              <a key={item.id} className={`mobile-nav-item ${selected ? "active" : ""}`} aria-current={selected ? "page" : undefined} href={item.href}>
                <span className="mobile-nav-icon"><Icon aria-hidden="true" strokeWidth={2}/>{item.badge && <b aria-label={`${item.badge} mensagens não lidas`}>{item.badge}</b>}</span>
                <span>{item.label}</span>
              </a>
            );
          })}
          <button className={`mobile-nav-item mobile-nav-more ${moreOpen || moreIsActive ? "active" : ""}`} type="button" aria-expanded={moreOpen} aria-controls="mobile-more-menu" onClick={() => setMoreOpen((open) => !open)}>
            <span className="mobile-nav-icon">{moreOpen ? <X aria-hidden="true" strokeWidth={2}/> : <Menu aria-hidden="true" strokeWidth={2}/>}</span>
            <span>Mais</span>
          </button>
        </div>
      </nav>

      {moreOpen && <button className="mobile-more-backdrop" type="button" aria-label="Fechar menu Mais" onClick={() => setMoreOpen(false)}/>}
      <aside id="mobile-more-menu" className={`mobile-more-drawer ${moreOpen ? "open" : ""}`} aria-hidden={!moreOpen} aria-label="Mais opções">
        <header>
          <a href="/" className="mobile-more-brand" aria-label="Voltar ao início da NOIRA"><img src="/noira-logo.jfif" alt=""/><span>NOIRA</span></a>
          <button type="button" aria-label="Fechar menu Mais" onClick={() => setMoreOpen(false)}><X aria-hidden="true"/></button>
        </header>
        <a className={`mobile-more-user ${active === "profile" ? "active" : ""}`} href="/dashboard/profile">
          <i>{initials}</i><span><b>{userName}</b><small>{userRole}</small></span><UserRound aria-hidden="true"/>
        </a>
        <nav aria-label="Mais módulos">
          {navigationItems.slice(4).map((item) => {
            const Icon = item.icon;
            const selected = active === item.id;
            return <a key={item.id} className={selected ? "active" : ""} aria-current={selected ? "page" : undefined} href={item.href}><Icon aria-hidden="true" strokeWidth={2}/><span>{item.label}</span></a>;
          })}
          <a className={active === "profile" ? "active" : ""} aria-current={active === "profile" ? "page" : undefined} href="/dashboard/profile"><UserRound aria-hidden="true" strokeWidth={2}/><span>Perfil</span></a>
          {showAdmin && <a className={active === "admin" ? "active" : ""} aria-current={active === "admin" ? "page" : undefined} href="/dashboard/admin"><ShieldCheck aria-hidden="true" strokeWidth={2}/><span>Administração</span></a>}
          <button type="button" className="mobile-signout" onClick={signOut} disabled={signingOut}><LogOut aria-hidden="true" strokeWidth={2}/><span>{signingOut ? "Saindo…" : "Sair da conta"}</span></button>
        </nav>
        <footer><span><b>Aparência</b><small>Escolha o tema do aplicativo</small></span><ThemeToggle placement="dashboard"/></footer>
      </aside>
    </>
  );
}
