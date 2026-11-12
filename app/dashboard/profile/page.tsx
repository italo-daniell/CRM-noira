"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { DashboardSidebar } from "../DashboardSidebar";
import "../dashboard.css";
import "./profile.css";


type Section="profile"|"workspace"|"chat"|"email"|"billing"|"users"|"ai"|"integrations";
const menu:{group:string;items:{id:Section;label:string}[]}[]=[
  {group:"Perfil",items:[{id:"profile",label:"Configurações de perfil"}]},
  {group:"Área de trabalho",items:[{id:"workspace",label:"Configurações de trabalho"},{id:"chat",label:"Configurações de chat"},{id:"email",label:"Configurações de e-mail"},{id:"billing",label:"Faturamento"},{id:"users",label:"Gestão de usuários"}]},
  {group:"NOIRA IA",items:[{id:"ai",label:"Configurações de IA"}]},
  {group:"Integrações e canais",items:[{id:"integrations",label:"Central de integrações"}]},
];
const noticeRows=["Caixa de entrada","Menções e chat da equipe","Conversas internas","Chamadas","E-mails recebidos","Erros e outras informações","Faturamento","Leads de entrada","Limites de atividade","Tarefas: 5 minutos antes","Tarefas: vencimento","Tarefas: concluídas","Nova tarefa atribuída"];

export default function ProfilePage(){
  const [section,setSection]=useState<Section>("profile");
  const [notifications,setNotifications]=useState(true);
  const [toast,setToast]=useState("");
  const [dirty,setDirty]=useState(false);
  const [avatar,setAvatar]=useState("");
  const [emailEdit,setEmailEdit]=useState(false);
  const [checks,setChecks]=useState<Record<string,boolean>>(()=>Object.fromEntries(noticeRows.flatMap(row=>["mail","mobile","browser"].map(channel=>[`${row}-${channel}`,true]))));

  function notify(message:string){setToast(message);window.setTimeout(()=>setToast(""),2600)}
  function save(event?:FormEvent){event?.preventDefault();setDirty(false);notify("Configurações salvas com sucesso.")}
  function changeAvatar(event:ChangeEvent<HTMLInputElement>){const file=event.target.files?.[0];if(file){setAvatar(URL.createObjectURL(file));setDirty(true)}}
  const title=menu.flatMap(group=>group.items).find(item=>item.id===section)?.label||"Configurações";

  return <div className="profile-app">
    <DashboardSidebar active="profile"/>
    <aside className="settings-nav">
      <header><span>⚙</span><b>CONFIGURAÇÕES</b></header>
      <nav aria-label="Seções das configurações">{menu.map(group=><section key={group.group}><small>{group.group}</small>{group.items.map(item=><button key={item.id} className={section===item.id?"active":""} onClick={()=>setSection(item.id)}>{item.label}<span>›</span></button>)}{group.group==="Área de trabalho"&&<a href="/dashboard/admin">♜ Painel do proprietário <span>↗</span></a>}{group.group==="NOIRA IA"&&<a href="/dashboard/ai">Fontes de conhecimento <span>↗</span></a>}</section>)}</nav>
    </aside>
    <main className="profile-main">
      <header><div><small>CONTA E PREFERÊNCIAS</small><h1>{title}</h1></div><button className="save-top" onClick={()=>save()} disabled={!dirty}>Salvar</button></header>
      {section==="profile"?<form onSubmit={save}>
        <section className="profile-card">
          <div className="profile-photo"><label>{avatar?<img src={avatar} alt="Foto do perfil"/>:<span>MS</span>}<i>◉</i><input type="file" accept="image/*" onChange={changeAvatar}/></label><small>Alterar foto</small></div>
          <div className="profile-fields">
            <div className="field-row identity"><label>Espaço</label><p>Dispositivo atual</p></div>
            <div className="field-row identity"><label>Acesso</label><p><b>Direto, sem login</b><span>Dados locais neste dispositivo</span></p></div>
            <div className="field-row"><label htmlFor="language">Idioma</label><select id="language" defaultValue="pt-BR" onChange={()=>setDirty(true)}><option value="pt-BR">Português (Brasil)</option><option value="en">English</option><option value="es">Español</option></select></div>
            <div className="field-row"><label htmlFor="name">Nome</label><input id="name" defaultValue="Marina Silva" onChange={()=>setDirty(true)}/></div>
            <div className="field-row"><label htmlFor="phone">Telefone</label><input id="phone" defaultValue="+55 11 99999-0000" onChange={()=>setDirty(true)}/></div>
            <div className="field-row"><label htmlFor="email">E-mail</label><div className="inline-field"><input id="email" type="email" defaultValue="marina@noira.com.br" readOnly={!emailEdit} onChange={()=>setDirty(true)}/><button type="button" onClick={()=>setEmailEdit(!emailEdit)}>{emailEdit?"Bloquear":"Alterar e-mail"}</button></div></div>

            <div className="field-row"><label htmlFor="note">Nota</label><textarea id="note" rows={3} onChange={()=>setDirty(true)} placeholder="Adicione uma observação pessoal"/></div>
            <div className="field-row"><label htmlFor="left-menu">Menu esquerdo</label><select id="left-menu" onChange={()=>setDirty(true)}><option>Novo menu (Recomendado)</option><option>Menu compacto</option></select></div>
          </div>
        </section>
        <section className="security-card"><div><h3>Versão com acesso direto</h3><p>Não há conta autenticada nesta versão. Leads, contatos e agenda são salvos somente neste navegador, sem sincronização entre dispositivos. A autenticação será necessária para usar dados compartilhados.</p></div></section>
        <div className="notification-title"><h2 className="profile-section-title">Configurações de notificação</h2><label>Receber notificações <span className="switch"><input type="checkbox" checked={notifications} onChange={()=>{setNotifications(!notifications);setDirty(true)}}/><span/></span></label></div>
        <section className={`notification-table ${notifications?"":"muted"}`}><header><span>CONFIGURAÇÕES AVANÇADAS</span><span>✉ E-MAIL</span><span>▣ CELULAR</span><span>◉ NAVEGADOR</span></header>{noticeRows.map((row,index)=><div key={row}><b>{row}</b>{["mail","mobile","browser"].map(channel=><label key={channel}><input type="checkbox" checked={Boolean(checks[`${row}-${channel}`])} onChange={()=>{setChecks({...checks,[`${row}-${channel}`]:!checks[`${row}-${channel}`]});setDirty(true)}}/><span>{channel==="mail"?(index===0||index===7?"Uma vez ao dia 18:00":"Imediatamente"):""}</span></label>)}</div>)}</section>
        <div className="mobile-save"><button type="submit">Salvar alterações</button></div>
      </form>:<SettingsPanel section={section} title={title} onChange={()=>setDirty(true)} notify={notify}/>}
    </main>
    {toast&&<div className="profile-toast">✓ {toast}</div>}
  </div>
}

function SettingsPanel({section,title,onChange,notify}:{section:Section;title:string;onChange:()=>void;notify:(message:string)=>void}){
  const descriptions:Record<Exclude<Section,"profile">,string>={workspace:"Defina o nome, o fuso horário e as preferências do espaço comercial.",chat:"Escolha como as conversas serão distribuídas e exibidas para a equipe.",email:"Conecte caixas de entrada e ajuste a assinatura padrão.",billing:"Acompanhe seu plano, usuários e histórico de cobranças.",users:"Gerencie funções, acessos e equipes da sua conta.",ai:"Defina como a NOIRA IA atua, responde e transfere atendimentos.",integrations:"Conecte os canais usados pela sua operação comercial."};
  return <section className="secondary-settings"><header><span>{section==="ai"?"✦":"⚙"}</span><div><h2>{title}</h2><p>{descriptions[section as Exclude<Section,"profile">]}</p></div></header><div className="secondary-card"><label>Nome da configuração<input defaultValue={section==="workspace"?"Comercial":"Padrão NOIRA"} onChange={onChange}/></label><label>Preferência principal<select onChange={onChange}><option>Ativa</option><option>Somente administradores</option><option>Desativada</option></select></label><label className="secondary-toggle"><span><b>Aplicar para toda a equipe</b><small>Mantenha esta configuração consistente em todos os usuários.</small></span><span className="switch"><input type="checkbox" defaultChecked onChange={onChange}/><span/></span></label><button onClick={()=>notify(`${title} atualizado.`)}>Aplicar configuração</button></div></section>
}
