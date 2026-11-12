"use client";

import { useDeviceState } from "../../../lib/use-device-state";

import { FormEvent, useMemo, useState } from "react";
import { DashboardSidebar } from "../DashboardSidebar";
import "../dashboard.css";
import "./contacts.css";

type Contact = {
  id: number;
  name: string;
  initials: string;
  role: string;
  company: string;
  companyInitials: string;
  email: string;
  phone: string;
  owner: string;
  source: string;
  status: "Cliente" | "Em negociação" | "Novo" | "Inativo";
  updated: string;
  tags: string[];
  value: string;
  lastContact: string;
  nextTask: string;
};

const baseContacts: Contact[] = [
  { id:1, name:"Marina Souza", initials:"MS", role:"Diretora comercial", company:"Clínica Aurora", companyInitials:"CA", email:"marina@clinicaaurora.com.br", phone:"+55 11 98765-4321", owner:"Marina Silva", source:"WhatsApp", status:"Em negociação", updated:"Hoje, 10:42", tags:["Alta intenção","Clínica","Inbound"], value:"R$ 4.800", lastContact:"Hoje, 10:42", nextTask:"Demonstração · Amanhã, 10:00" },
  { id:2, name:"Carlos Lima", initials:"CL", role:"Fundador", company:"Estúdio Sabiá", companyInitials:"ES", email:"carlos@studiosabia.com", phone:"+55 21 99812-1234", owner:"Carlos Nunes", source:"Instagram", status:"Novo", updated:"Hoje, 10:18", tags:["Instagram","Design"], value:"R$ 2.900", lastContact:"Hoje, 10:18", nextTask:"Primeiro contato · Hoje, 14:30" },
  { id:3, name:"Ana Reis", initials:"AR", role:"Gerente de vendas", company:"Imobiliária Norte", companyInitials:"IN", email:"ana@imobnorte.com", phone:"+55 31 99123-7788", owner:"Marina Silva", source:"Indicação", status:"Em negociação", updated:"Ontem, 16:34", tags:["Proposta enviada","Imobiliária"], value:"R$ 12.500", lastContact:"Ontem, 16:34", nextTask:"Follow-up · Quinta, 09:00" },
  { id:4, name:"Rafael Melo", initials:"RM", role:"COO", company:"Órbita Tech", companyInitials:"OT", email:"rafael@orbitatech.io", phone:"+55 11 97731-5544", owner:"Beatriz Rocha", source:"Evento", status:"Cliente", updated:"Ontem, 14:05", tags:["Cliente","Tecnologia"], value:"R$ 18.000", lastContact:"Ontem, 14:05", nextTask:"Implantação · Sexta, 11:00" },
  { id:5, name:"Bianca Alves", initials:"BA", role:"Proprietária", company:"Bela Forma", companyInitials:"BF", email:"bianca@belaforma.com.br", phone:"+55 41 99931-0042", owner:"Não atribuído", source:"Site", status:"Novo", updated:"Seg, 11:28", tags:["Site","Preço"], value:"R$ 0", lastContact:"Seg, 11:28", nextTask:"Qualificar contato · Hoje, 16:00" },
  { id:6, name:"João Rocha", initials:"JR", role:"Gestor de atendimento", company:"Vitta Saúde", companyInitials:"VS", email:"joao@vittasaude.com", phone:"+55 51 98819-4431", owner:"Marina Silva", source:"WhatsApp", status:"Cliente", updated:"Seg, 09:12", tags:["Saúde","Renovação"], value:"R$ 7.200", lastContact:"Seg, 09:12", nextTask:"Reunião trimestral · 02 set" },
  { id:7, name:"Luiza Castro", initials:"LC", role:"Marketing", company:"Mobi Foods", companyInitials:"MF", email:"luiza@mobi.food", phone:"+55 85 99108-7721", owner:"Carlos Nunes", source:"TikTok", status:"Inativo", updated:"18 ago", tags:["Nutrição","TikTok"], value:"R$ 1.700", lastContact:"18 ago, 15:50", nextTask:"Sem tarefa agendada" },
  { id:8, name:"Pedro Martins", initials:"PM", role:"CEO", company:"Nexo Contábil", companyInitials:"NC", email:"pedro@nexocontabil.com", phone:"+55 19 99721-3420", owner:"Beatriz Rocha", source:"Google Ads", status:"Em negociação", updated:"16 ago", tags:["Contabilidade","Enterprise"], value:"R$ 22.400", lastContact:"16 ago, 17:22", nextTask:"Revisar contrato · Amanhã, 15:00" },
];

const statusClass: Record<Contact["status"], string> = { Cliente:"client", "Em negociação":"negotiation", Novo:"new", Inativo:"inactive" };

export default function ContactsPage() {
  const [contacts, setContacts] = useDeviceState("noira:contacts:v1", baseContacts);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"Contatos" | "Empresas">("Contatos");
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState<number[]>([]);
  const [opened, setOpened] = useState<number | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visible = useMemo(() => contacts.filter((contact) => {
    const text = `${contact.name} ${contact.company} ${contact.email} ${contact.phone} ${contact.tags.join(" ")}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesFilter = filter === "Todos" || contact.status === filter || (filter === "Meus contatos" && contact.owner === "Marina Silva");
    return matchesQuery && matchesFilter;
  }), [contacts, query, filter]);

  const current = contacts.find((contact) => contact.id === opened) ?? null;
  const companies = useMemo(() => Array.from(new Map(visible.map((contact) => [contact.company, contact])).values()), [visible]);

  function toggle(id: number) { setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]); }
  function toggleAll() { setSelected(selected.length === visible.length ? [] : visible.map((contact) => contact.id)); }
  function createContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "Novo contato");
    const company = String(data.get("company") || "Sem empresa");
    const initials = name.split(" ").slice(0,2).map((part) => part[0]).join("").toUpperCase();
    const contact: Contact = { id:Date.now(), name, initials, role:"Contato", company, companyInitials:company.slice(0,2).toUpperCase(), email:String(data.get("email") || ""), phone:String(data.get("phone") || ""), owner:"Marina Silva", source:"Cadastro manual", status:"Novo", updated:"Agora", tags:["Novo contato"], value:"R$ 0", lastContact:"Ainda sem interação", nextTask:"Criar primeira tarefa" };
    setContacts((items) => [contact, ...items]);
    setOpened(contact.id);
    setNewOpen(false);
    event.currentTarget.reset();
  }

  return (
    <main className="contacts-app">
      <DashboardSidebar active="contacts" />
      <section className="contacts-workspace">
        <header className="contacts-topbar">
          <div><small>Base de relacionamento</small><h1>Contatos</h1></div>
          <div className="contacts-actions"><button>⇩ Importar</button><button>•••</button><button className="primary" onClick={()=>setNewOpen(true)}>＋ Novo contato</button></div>
        </header>

        <div className="contacts-tabs" role="tablist">
          <button role="tab" aria-selected={tab === "Contatos"} className={tab === "Contatos" ? "active" : ""} onClick={()=>setTab("Contatos")}>Contatos <b>{contacts.length}</b></button>
          <button role="tab" aria-selected={tab === "Empresas"} className={tab === "Empresas" ? "active" : ""} onClick={()=>setTab("Empresas")}>Empresas <b>{new Set(contacts.map((item)=>item.company)).size}</b></button>
        </div>

        <div className="contacts-toolbar">
          <label className="contacts-search"><span>⌕</span><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder={`Buscar em ${tab.toLowerCase()}…`} /></label>
          <div className="quick-filters">{["Todos","Meus contatos","Cliente","Em negociação","Novo"].map((item)=><button key={item} onClick={()=>setFilter(item)} className={filter===item?"active":""}>{item}</button>)}</div>
          <button className={`filter-button ${filtersOpen?"active":""}`} onClick={()=>setFiltersOpen(!filtersOpen)}>≡ Filtros <b>2</b></button>
          <button className="view-button" aria-label="Visualização em lista">☷</button>
        </div>

        {filtersOpen && <div className="advanced-filters">
          <label>Responsável<select defaultValue="Todos"><option>Todos</option><option>Marina Silva</option><option>Carlos Nunes</option><option>Beatriz Rocha</option></select></label>
          <label>Origem<select defaultValue="Todas"><option>Todas</option><option>WhatsApp</option><option>Instagram</option><option>Site</option></select></label>
          <label>Atualização<select defaultValue="Qualquer data"><option>Qualquer data</option><option>Hoje</option><option>Últimos 7 dias</option><option>Últimos 30 dias</option></select></label>
          <button onClick={()=>{setFilter("Todos");setFiltersOpen(false)}}>Limpar filtros</button>
        </div>}

        {selected.length > 0 && <div className="bulk-bar"><b>{selected.length} selecionado{selected.length>1?"s":""}</b><button>♙ Alterar responsável</button><button># Editar etiquetas</button><button>✉ Enviar mensagem</button><button>↗ Exportar</button><button className="danger">⌫ Excluir</button><button onClick={()=>setSelected([])}>×</button></div>}

        <div className="contacts-content">
          {tab === "Contatos" ? <div className="contacts-table-wrap">
            <table className="contacts-table">
              <thead><tr><th><input type="checkbox" checked={visible.length>0&&selected.length===visible.length} onChange={toggleAll} aria-label="Selecionar todos" /></th><th>Nome ↕</th><th>Empresa</th><th>Contato</th><th>Responsável</th><th>Status</th><th>Atualizado</th><th></th></tr></thead>
              <tbody>{visible.map((contact)=><tr key={contact.id} className={opened===contact.id?"opened":""} onClick={()=>setOpened(contact.id)}>
                <td onClick={(event)=>event.stopPropagation()}><input type="checkbox" checked={selected.includes(contact.id)} onChange={()=>toggle(contact.id)} aria-label={`Selecionar ${contact.name}`} /></td>
                <td><div className="contact-cell"><span>{contact.initials}</span><div><b>{contact.name}</b><small>{contact.role}</small></div></div></td>
                <td><div className="company-cell"><i>{contact.companyInitials}</i><span>{contact.company}</span></div></td>
                <td><div className="contact-info"><span>{contact.phone}</span><small>{contact.email}</small></div></td>
                <td><div className="owner-cell"><i>{contact.owner === "Marina Silva" ? "MS" : contact.owner === "Não atribuído" ? "?" : contact.owner.split(" ").map((p)=>p[0]).join("")}</i><span>{contact.owner}</span></div></td>
                <td><span className={`status ${statusClass[contact.status]}`}>{contact.status}</span></td><td><time>{contact.updated}</time></td><td><button>•••</button></td>
              </tr>)}</tbody>
            </table>
            {visible.length === 0 && <div className="empty-contacts"><span>⌕</span><h3>Nenhum contato encontrado</h3><p>Tente ajustar a busca ou os filtros.</p></div>}
          </div> : <div className="companies-grid">{companies.map((contact)=><article key={contact.company} onClick={()=>setOpened(contact.id)}><header><i>{contact.companyInitials}</i><button>•••</button></header><h3>{contact.company}</h3><p>{contact.role} · {contact.name}</p><div><span>◎ 1 contato</span><span>◆ {contact.value}</span></div><footer><span className={`status ${statusClass[contact.status]}`}>{contact.status}</span><small>{contact.updated}</small></footer></article>)}</div>}
        </div>
        <footer className="contacts-footer"><span>Mostrando {visible.length} de {contacts.length} contatos</span><div><button disabled>‹</button><button className="active">1</button><button>2</button><button>›</button></div><label>25 por página⌄</label></footer>
      </section>

      <div className={`contact-drawer-overlay ${current?"open":""}`} onClick={()=>setOpened(null)} />
      <aside className={`contact-drawer ${current?"open":""}`}>
        {current && <>
          <header><button onClick={()=>setOpened(null)}>×</button><div><button>☆</button><button>•••</button></div></header>
          <div className="drawer-identity"><span>{current.initials}<i>●</i></span><h2>{current.name}</h2><p>{current.role} · {current.company}</p><div className="drawer-tags">{current.tags.map((tag)=><b key={tag}>{tag}</b>)}<button>＋</button></div></div>
          <div className="contact-shortcuts"><a href={`tel:${current.phone}`}>☎<span>Ligar</span></a><a href={`mailto:${current.email}`}>✉<span>E-mail</span></a><a href="/dashboard/conversations">▢<span>Mensagem</span></a><button>✓<span>Tarefa</span></button></div>
          <nav className="drawer-tabs"><button className="active">Visão geral</button><button>Histórico</button><button>Arquivos</button></nav>
          <div className="drawer-body">
            <section><label>INFORMAÇÕES DE CONTATO</label><div className="drawer-field"><span>Telefone</span><b>{current.phone}</b><button>✎</button></div><div className="drawer-field"><span>E-mail</span><b>{current.email}</b><button>✎</button></div><div className="drawer-field"><span>Origem</span><b>{current.source}</b><button>✎</button></div><div className="drawer-field"><span>Responsável</span><b>{current.owner}</b><button>⌄</button></div></section>
            <section><div className="section-title"><label>NEGÓCIOS VINCULADOS</label><button>＋ Novo negócio</button></div><article className="linked-deal"><span className="deal-icon">◆</span><div><b>{current.company} — Implantação NOIRA</b><small><i/> {current.status} · {current.value}</small></div><button>›</button></article></section>
            <section><div className="section-title"><label>PRÓXIMA TAREFA</label><button>＋ Adicionar</button></div><article className="drawer-task"><button>○</button><div><b>{current.nextTask.split(" · ")[0]}</b><small>{current.nextTask.split(" · ")[1] || current.nextTask}</small></div><span>◷</span></article></section>
            <section><label>ATIVIDADE RECENTE</label><div className="activity-line"><i>✉</i><div><b>Último contato registrado</b><p>{current.lastContact}</p></div></div><div className="activity-line"><i>✦</i><div><b>NOIRA IA atualizou a qualificação</b><p>Contato classificado como {current.status.toLowerCase()}.</p></div></div></section>
          </div>
        </>}
      </aside>

      {newOpen && <div className="contact-modal" role="dialog" aria-modal="true" aria-label="Novo contato"><form onSubmit={createContact}><header><div><small>NOVO REGISTRO</small><h2>Adicionar contato</h2></div><button type="button" onClick={()=>setNewOpen(false)}>×</button></header><div className="modal-avatar">＋<small>Adicionar foto</small></div><label>Nome completo<input name="name" required autoFocus placeholder="Ex.: Fernanda Oliveira" /></label><label>Empresa<input name="company" placeholder="Nome da empresa" /></label><div className="form-row"><label>Telefone<input name="phone" placeholder="+55 (00) 00000-0000" /></label><label>E-mail<input name="email" type="email" placeholder="nome@empresa.com" /></label></div><label>Responsável<select defaultValue="Marina Silva"><option>Marina Silva</option><option>Carlos Nunes</option><option>Beatriz Rocha</option></select></label><footer><button type="button" onClick={()=>setNewOpen(false)}>Cancelar</button><button className="primary" type="submit">Criar contato</button></footer></form></div>}
    </main>
  );
}
