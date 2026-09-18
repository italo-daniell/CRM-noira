"use client";

import { FormEvent, useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import "./dashboard.css";

type Lead = { id:number; name:string; value:string; channel:string; tag:string; owner:string; stage:string };
const stages = ["Novos leads", "Em contato", "Qualificados", "Proposta"];
const stageMeta: Record<string,{count:number;value:string}> = {
  "Novos leads":{count:12,value:"R$ 46.800"}, "Em contato":{count:9,value:"R$ 52.300"},
  "Qualificados":{count:8,value:"R$ 71.500"}, "Proposta":{count:5,value:"R$ 64.900"},
};
const initialLeads: Lead[] = [
  {id:1,name:"Clínica Aurora",value:"R$ 4.800",channel:"WhatsApp",tag:"Alta intenção",owner:"MS",stage:"Novos leads"},
  {id:2,name:"Estúdio Sabiá",value:"R$ 2.900",channel:"Instagram",tag:"Novo",owner:"CL",stage:"Novos leads"},
  {id:3,name:"Casa Leve",value:"R$ 6.200",channel:"Site",tag:"Aguardando",owner:"AR",stage:"Novos leads"},
  {id:4,name:"Vitta Saúde",value:"R$ 7.200",channel:"WhatsApp",tag:"Responder hoje",owner:"MS",stage:"Em contato"},
  {id:5,name:"Rafael Imóveis",value:"R$ 8.400",channel:"Instagram",tag:"Reunião 14h",owner:"CL",stage:"Em contato"},
  {id:6,name:"Lumina Estética",value:"R$ 3.800",channel:"Indicação",tag:"Follow-up",owner:"AR",stage:"Em contato"},
  {id:7,name:"Imobiliária Norte",value:"R$ 12.500",channel:"Formulário",tag:"Demo marcada",owner:"MS",stage:"Qualificados"},
  {id:8,name:"Órbita Tech",value:"R$ 18.000",channel:"WhatsApp",tag:"Decisor envolvido",owner:"CL",stage:"Qualificados"},
  {id:9,name:"Colégio Prisma",value:"R$ 9.600",channel:"Site",tag:"Proposta pedida",owner:"AR",stage:"Qualificados"},
  {id:10,name:"Casa Nativa",value:"R$ 15.600",channel:"Indicação",tag:"85% de chance",owner:"MS",stage:"Proposta"},
  {id:11,name:"Grupo Atlas",value:"R$ 22.000",channel:"WhatsApp",tag:"Negociação",owner:"CL",stage:"Proposta"},
  {id:12,name:"Bela Forma",value:"R$ 7.400",channel:"Instagram",tag:"Proposta enviada",owner:"AR",stage:"Proposta"},
];

export default function Dashboard() {
  const [leads,setLeads]=useState(initialLeads);
  const [menu,setMenu]=useState<number|null>(null);
  const [selected,setSelected]=useState<number|null>(null);
  const [editing,setEditing]=useState<number|null>(null);
  const [deleting,setDeleting]=useState<number|null>(null);
  const [toast,setToast]=useState("");
  const [searchOpen,setSearchOpen]=useState(false);
  const [filterOpen,setFilterOpen]=useState(false);
  const [createOpen,setCreateOpen]=useState(false);
  const [creatingLead,setCreatingLead]=useState(false);
  const [createError,setCreateError]=useState("");
  const [query,setQuery]=useState("");
  const [stageFilter,setStageFilter]=useState("Todas as etapas");
  const [channelFilter,setChannelFilter]=useState("Todos os canais");
  const [ownerFilter,setOwnerFilter]=useState("Todos");
  const current=leads.find((lead)=>lead.id===selected)||null;
  const editLead=leads.find((lead)=>lead.id===editing)||null;
  const deleteLead=leads.find((lead)=>lead.id===deleting)||null;
  const filtersActive=Boolean(query||stageFilter!=="Todas as etapas"||channelFilter!=="Todos os canais"||ownerFilter!=="Todos");
  const visibleLeads=leads.filter((lead)=>{
    const text=`${lead.name} ${lead.value} ${lead.channel} ${lead.tag}`.toLowerCase();
    return text.includes(query.toLowerCase())&&(stageFilter==="Todas as etapas"||lead.stage===stageFilter)&&(channelFilter==="Todos os canais"||lead.channel===channelFilter)&&(ownerFilter==="Todos"||lead.owner===ownerFilter);
  });

  function notify(message:string){setToast(message);window.setTimeout(()=>setToast(""),2600)}
  function moveLead(id:number,stage:string){setLeads((items)=>items.map((lead)=>lead.id===id?{...lead,stage}:lead));setMenu(null);notify(`Lead movido para ${stage}.`)}
  function saveLead(event:FormEvent<HTMLFormElement>){event.preventDefault();const data=new FormData(event.currentTarget);setLeads((items)=>items.map((lead)=>lead.id===editing?{...lead,name:String(data.get("name")),value:String(data.get("value")),channel:String(data.get("channel")),tag:String(data.get("tag")),stage:String(data.get("stage"))}:lead));setEditing(null);notify("Alterações salvas com sucesso.")}
  function removeLead(){if(deleting===null)return;setLeads((items)=>items.filter((lead)=>lead.id!==deleting));if(selected===deleting)setSelected(null);setDeleting(null);notify("Lead excluído do pipeline.")}
  async function addLead(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(creatingLead)return;
    const data=new FormData(event.currentTarget);
    const name=String(data.get("name")||"").trim();
    const rawValue=String(data.get("value")||"").replace(/\D/g,"");
    const amount=Number(rawValue);
    if(!name||!Number.isSafeInteger(amount)||amount<=0){
      setCreateError("Informe um nome e um valor estimado maior que zero.");
      return;
    }
    setCreateError("");
    setCreatingLead(true);
    try{
      // Give the local demo a visible processing state before updating the pipeline.
      await new Promise((resolve)=>window.setTimeout(resolve,500));
      const lead:Lead={id:Date.now(),name,value:`R$ ${amount.toLocaleString("pt-BR")}`,channel:String(data.get("channel")),tag:String(data.get("tag")||"Novo").trim()||"Novo",owner:String(data.get("owner")),stage:String(data.get("stage"))};
      setLeads((items)=>[...items,lead]);
      setCreateOpen(false);
      setStageFilter("Todas as etapas");setChannelFilter("Todos os canais");setOwnerFilter("Todos");setQuery("");
      notify(`${lead.name} foi adicionado ao pipeline.`);
    }catch{
      setCreateError("Não foi possível adicionar o lead. Tente novamente.");
    }finally{
      setCreatingLead(false);
    }
  }
  function clearFilters(){setQuery("");setStageFilter("Todas as etapas");setChannelFilter("Todos os canais");setOwnerFilter("Todos")}

  return (
    <main className="dash">
      <DashboardSidebar active="pipeline" />
      <section className="dash-main">
        <header><div><small>Espaço de trabalho / Comercial</small><h1>Dashboard</h1></div><div className="dash-actions"><button className={searchOpen?"active":""} aria-expanded={searchOpen} onClick={()=>{setSearchOpen(!searchOpen);setFilterOpen(false)}}>⌕ Buscar</button><button className={filterOpen||filtersActive?"active":""} aria-expanded={filterOpen} onClick={()=>{setFilterOpen(!filterOpen);setSearchOpen(false)}}>Filtrar {filtersActive&&<i>•</i>}</button><button className="primary" onClick={()=>{setCreateError("");setCreateOpen(true)}}>+ Novo lead</button></div></header>
        {(searchOpen||filterOpen)&&<section className="pipeline-tools">
          {searchOpen&&<label className="pipeline-search"><span>⌕</span><input autoFocus value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Buscar por nome, valor, canal ou etiqueta"/>{query&&<button onClick={()=>setQuery("")} aria-label="Limpar busca">×</button>}</label>}
          {filterOpen&&<div className="pipeline-filters"><label>Etapa<select value={stageFilter} onChange={(event)=>setStageFilter(event.target.value)}><option>Todas as etapas</option>{stages.map((stage)=><option key={stage}>{stage}</option>)}</select></label><label>Canal<select value={channelFilter} onChange={(event)=>setChannelFilter(event.target.value)}><option>Todos os canais</option><option>WhatsApp</option><option>Instagram</option><option>Site</option><option>Indicação</option><option>Formulário</option></select></label><label>Responsável<select value={ownerFilter} onChange={(event)=>setOwnerFilter(event.target.value)}><option>Todos</option><option value="MS">Marina Silva</option><option value="CL">Carlos Lima</option><option value="AR">Ana Reis</option></select></label><button onClick={clearFilters} disabled={!filtersActive}>Limpar filtros</button></div>}
          <button className="pipeline-tools-close" aria-label="Fechar" onClick={()=>{setSearchOpen(false);setFilterOpen(false)}}>×</button>
        </section>}
        {filtersActive&&<div className="filter-summary"><span>{visibleLeads.length} {visibleLeads.length===1?"lead encontrado":"leads encontrados"}</span><button onClick={clearFilters}>Limpar tudo ×</button></div>}
        <div className="dash-stats">
          <article><span>Valor do pipeline</span><b>R$ 284.500</b><small>↑ 12,8% este mês</small></article>
          <article><span>Negócios ativos</span><b>48</b><small>↑ 6 esta semana</small></article>
          <article><span>Conversão</span><b>28,4%</b><small>↑ 4,2% este mês</small></article>
          <article><span>Ticket médio</span><b>R$ 5.927</b><small>↑ 8,1% este mês</small></article>
        </div>
        <div className="dash-board">
          {stages.map((stage) => <article className="dash-col" key={stage}>
            <header><div><b>{stage}</b><i>{filtersActive?visibleLeads.filter((lead)=>lead.stage===stage).length:stageMeta[stage].count+leads.filter((lead)=>lead.stage===stage).length-initialLeads.filter((lead)=>lead.stage===stage).length}</i></div><small>{stageMeta[stage].value}</small></header>
            {visibleLeads.filter((lead)=>lead.stage===stage).map((lead,index) => <div className="dash-card" key={lead.id} onClick={()=>setSelected(lead.id)}>
              <div><i>{lead.name[0]}</i><small>{lead.channel}</small><button className={menu===lead.id?"lead-more active":"lead-more"} aria-label={`Ações de ${lead.name}`} aria-expanded={menu===lead.id} onClick={(event)=>{event.stopPropagation();setMenu(menu===lead.id?null:lead.id)}}>•••</button>
                {menu===lead.id&&<div className="lead-menu" role="menu" onClick={(event)=>event.stopPropagation()}>
                  <button onClick={()=>{setSelected(lead.id);setMenu(null)}}><i>▤</i><span><b>Abrir lead</b><small>Ver todos os detalhes</small></span></button>
                  <a href={`/dashboard/conversations?lead=${encodeURIComponent(lead.name)}`}><i>▢</i><span><b>Enviar mensagem</b><small>Abrir em Conversas</small></span></a>
                  <a href={`/dashboard/calendar?lead=${encodeURIComponent(lead.name)}`}><i>◷</i><span><b>Criar tarefa</b><small>Agendar próximo passo</small></span></a>
                  <button onClick={()=>{setEditing(lead.id);setMenu(null)}}><i>✎</i><span><b>Editar lead</b><small>Alterar dados do negócio</small></span></button>
                  <label><i>⇢</i><span><b>Mover para</b><small>Escolher outra etapa</small></span><select aria-label={`Mover ${lead.name} para outra etapa`} value={lead.stage} onChange={(event)=>moveLead(lead.id,event.target.value)}>{stages.map((item)=><option key={item}>{item}</option>)}</select></label>
                  <button className="danger" onClick={()=>{setDeleting(lead.id);setMenu(null)}}><i>⌫</i><span><b>Excluir lead</b><small>Remover do pipeline</small></span></button>
                </div>}
              </div>
              <b>{lead.name}</b><strong>{lead.value}</strong><span className={index===0?"hot":""}>✦ {lead.tag}</span>
              <footer><small>◷ Hoje</small><em>{lead.owner}</em></footer>
            </div>)}
            {visibleLeads.filter((lead)=>lead.stage===stage).length===0&&<div className="pipeline-empty"><span>⌕</span><b>Nenhum lead</b><small>Não há resultados nesta etapa.</small></div>}
          </article>)}
        </div>
      </section>
      <aside className="dash-ai"><header><span>✦</span><div><b>NOIRA IA</b><small>Online agora</small></div><button>×</button></header><div className="ai-welcome"><span>✦</span><h3>Bom dia, Marina!</h3><p>Analisei seu pipeline e encontrei 3 oportunidades que merecem atenção.</p></div><div className="ai-insight"><b>Prioridade agora</b><p><strong>Clínica Aurora</strong> demonstrou alta intenção e aguarda resposta há 8 minutos.</p><button>Gerar resposta →</button></div><div className="ai-insight"><b>Próxima ação</b><p>A proposta da <strong>Casa Nativa</strong> vence amanhã. Quer que eu prepare um follow-up?</p><button>Criar follow-up →</button></div><form><input placeholder="Pergunte à NOIRA..."/><button>↑</button></form></aside>

      {menu!==null&&<button className="lead-menu-dismiss" aria-label="Fechar menu" onClick={()=>setMenu(null)}/>}
      <div className={`lead-overlay ${current?"open":""}`} onClick={()=>setSelected(null)}/>
      <aside className={`lead-drawer ${current?"open":""}`}>{current&&<><header><span>DETALHES DO LEAD</span><button onClick={()=>setSelected(null)}>×</button></header><div className="lead-profile"><i>{current.name[0]}</i><div><h2>{current.name}</h2><p>{current.channel} · Responsável {current.owner}</p></div></div><section className="lead-value"><span>Valor do negócio</span><strong>{current.value}</strong><small>✦ {current.tag}</small></section><dl><div><dt>Etapa atual</dt><dd>{current.stage}</dd></div><div><dt>Última atividade</dt><dd>Hoje, há 8 minutos</dd></div><div><dt>Próxima ação</dt><dd>Fazer follow-up comercial</dd></div></dl><div className="lead-drawer-actions"><a href={`/dashboard/conversations?lead=${encodeURIComponent(current.name)}`}>▢ Enviar mensagem</a><a href={`/dashboard/calendar?lead=${encodeURIComponent(current.name)}`}>◷ Criar tarefa</a><button onClick={()=>{setEditing(current.id);setSelected(null)}}>✎ Editar lead</button></div></>}</aside>

      {editLead&&<div className="lead-modal" role="dialog" aria-modal="true" aria-label="Editar lead"><form onSubmit={saveLead}><header><div><small>PIPELINE DE VENDAS</small><h2>Editar lead</h2></div><button type="button" onClick={()=>setEditing(null)}>×</button></header><label>Nome do lead<input name="name" defaultValue={editLead.name} required autoFocus/></label><div className="lead-form-row"><label>Valor<input name="value" defaultValue={editLead.value} required/></label><label>Canal<select name="channel" defaultValue={editLead.channel}><option>WhatsApp</option><option>Instagram</option><option>Site</option><option>Indicação</option><option>Formulário</option></select></label></div><label>Etiqueta<input name="tag" defaultValue={editLead.tag}/></label><label>Etapa<select name="stage" defaultValue={editLead.stage}>{stages.map((stage)=><option key={stage}>{stage}</option>)}</select></label><footer><button type="button" onClick={()=>setEditing(null)}>Cancelar</button><button className="primary" type="submit">Salvar alterações</button></footer></form></div>}
      {createOpen&&<div className="lead-modal lead-create-modal" role="dialog" aria-modal="true" aria-label="Novo lead"><form onSubmit={addLead} aria-busy={creatingLead}><header><div><small>PIPELINE DE VENDAS</small><h2>Novo lead</h2><p>Adicione uma nova oportunidade à equipe comercial.</p></div><button type="button" aria-label="Fechar formulário de novo lead" disabled={creatingLead} onClick={()=>setCreateOpen(false)}>×</button></header><label>Nome do lead<input name="name" placeholder="Ex.: Clínica Horizonte" required autoFocus/></label><div className="lead-form-row"><label>Valor estimado<input name="value" inputMode="numeric" placeholder="Ex.: 8500" required aria-invalid={Boolean(createError)}/></label><label>Canal<select name="channel" defaultValue="WhatsApp"><option>WhatsApp</option><option>Instagram</option><option>Site</option><option>Indicação</option><option>Formulário</option></select></label></div><div className="lead-form-row"><label>Responsável<select name="owner" defaultValue="MS"><option value="MS">Marina Silva</option><option value="CL">Carlos Lima</option><option value="AR">Ana Reis</option></select></label><label>Etapa<select name="stage" defaultValue="Novos leads">{stages.map((stage)=><option key={stage}>{stage}</option>)}</select></label></div><label>Etiqueta<input name="tag" placeholder="Ex.: Alta intenção"/></label>{createError&&<p className="lead-form-error" role="alert">{createError}</p>}<footer><button className="lead-modal-cancel" type="button" disabled={creatingLead} onClick={()=>{setCreateError("");setCreateOpen(false)}}>Cancelar</button><button className="primary lead-modal-submit" type="submit" disabled={creatingLead}>{creatingLead?"Adicionando...":"Adicionar lead"}</button></footer></form></div>}
      {deleteLead&&<div className="lead-modal confirm" role="alertdialog" aria-modal="true" aria-label="Excluir lead"><div><span>⌫</span><h2>Excluir {deleteLead.name}?</h2><p>Este lead será removido do pipeline. Esta ação não poderá ser desfeita nesta demonstração.</p><footer><button onClick={()=>setDeleting(null)}>Cancelar</button><button className="delete" onClick={removeLead}>Excluir lead</button></footer></div></div>}
      {toast&&<div className="lead-toast">✓ {toast}</div>}
    </main>
  );
}
