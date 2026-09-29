"use client";

import {
  CalendarDays,
  ChartNoAxesCombined,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";

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
  const initials = userName.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return (
    <aside className="dash-side">
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
      <a href="/dashboard/profile" aria-current={active === "profile" ? "page" : undefined} className={`dash-user ${active === "profile" ? "active" : ""}`}><i>{initials}</i><span><b>{userName}</b><small>{userRole}</small></span></a>
    </aside>
  );
}
