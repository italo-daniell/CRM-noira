import { chatGPTSignInPath, getChatGPTUser } from "../../chatgpt-auth";
import { AdminDashboard } from "./AdminDashboard";
import "./admin.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getChatGPTUser();

  if (!user) {
    return <main className="admin-gate"><section><span>♜</span><small>ÁREA PROTEGIDA</small><h1>Painel do proprietário</h1><p>Entre com a conta ChatGPT vinculada ao proprietário da NOIRA para continuar.</p><a href={chatGPTSignInPath("/dashboard/admin")} target="_top">Entrar com ChatGPT</a><a className="back" href="/dashboard">Voltar ao CRM</a></section></main>;
  }

  const ownerId = process.env.NOIRA_OWNER_USER_ID?.trim();
  const ownerEmail = process.env.NOIRA_OWNER_EMAIL?.trim().toLowerCase();
  const isOwner = Boolean((ownerId && user.userId === ownerId) || (ownerEmail && user.email.toLowerCase() === ownerEmail));

  if (!isOwner) {
    return <main className="admin-gate denied"><section><span>⊘</span><small>ACESSO RESTRITO</small><h1>Somente o proprietário</h1><p>A conta <b>{user.email}</b> não tem permissão para acessar configurações administrativas.</p><a href="/dashboard">Voltar ao CRM</a><a className="back" href="/signout-with-chatgpt?return_to=%2Fdashboard%2Fadmin" target="_top">Entrar com outra conta</a></section></main>;
  }

  return <AdminDashboard ownerName={user.fullName || "Italo Daniel"} ownerEmail={user.email}/>;
}
