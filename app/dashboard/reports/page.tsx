"use client";

import { useMemo, useState } from "react";
import { DashboardSidebar } from "../DashboardSidebar";
import "../dashboard.css";
import "./reports.css";

type ReportTab = "Visão geral" | "Funil" | "Equipe" | "Atividades" | "ROI" | "Metas";
const tabs: ReportTab[] = ["Visão geral", "Funil", "Equipe", "Atividades", "ROI", "Metas"];
const trend = [42,55,48,68,61,76,72,91,84,105,98,124];
const team = [
  {name:"Marina Silva", initials:"MS", leads:126, won:34, revenue:"R$ 126.400", conversion:"27%", tasks:"94%"},
  {name:"Beatriz Rocha", initials:"BR", leads:104, won:28, revenue:"R$ 98.700", conversion:"26,9%", tasks:"91%"},
  {name:"Carlos Nunes", initials:"CN", leads:88, won:19, revenue:"R$ 72.300", conversion:"21,6%", tasks:"87%"},
  {name:"Júlia Mendes", initials:"JM", leads:71, won:15, revenue:"R$ 54.900", conversion:"21,1%", tasks:"89%"},
];

export default function ReportsPage(){
  const [tab,setTab]=useState<ReportTab>("Visão geral");
  const [period,setPeriod]=useState("30 dias");
  const [pipeline,setPipeline]=useState("Todos os funis");
  const [owner,setOwner]=useState("Toda a equipe");
  const [compare,setCompare]=useState(true);
  const [notice,setNotice]=useState("");
  const [detail,setDetail]=useState<string|null>(null);
  const multiplier=period==="Hoje"?.18:period==="7 dias"?.54:period==="90 dias"?1.34:1;
  const stats=useMemo(()=>({revenue:Math.round(352300*multiplier),won:Math.round(96*multiplier),conversion:(24.7+(period==="90 dias"?1.8:0)).toFixed(1),ticket:Math.round(3670*(period==="Hoje"?.92:1))}),[multiplier,period]);
  function exportReport(){setNotice("Relatório preparado. O download em CSV começou.");setTimeout(()=>setNotice(""),2800)}

  return <main className="reports-app">
    <DashboardSidebar active="reports"/>
    <section className="reports-workspace">
      <header className="reports-topbar">
        <div><small>INTELIGÊNCIA COMERCIAL</small><h1>Relatórios</h1></div>
        <nav aria-label="Seções dos relatórios">{tabs.map((item)=><button key={item} className={tab===item?"active":""} onClick={()=>setTab(item)}>{item}</button>)}</nav>
        <button className="export" onClick={exportReport}>⇩ Exportar</button>
      </header>

      <div className="reports-filters">
        <label>Período<select value={period} onChange={(e)=>setPeriod(e.target.value)}><option>Hoje</option><option>7 dias</option><option>30 dias</option><option>90 dias</option></select></label>
        <label>Pipeline<select value={pipeline} onChange={(e)=>setPipeline(e.target.value)}><option>Todos os funis</option><option>Novas vendas</option><option>Renovações</option><option>Enterprise</option></select></label>
        <label>Responsável<select value={owner} onChange={(e)=>setOwner(e.target.value)}><option>Toda a equipe</option><option>Marina Silva</option><option>Beatriz Rocha</option><option>Carlos Nunes</option></select></label>
        <button className={compare?"compare active":"compare"} onClick={()=>setCompare(!compare)}><i/>{compare?"Comparando com período anterior":"Comparar períodos"}</button>
        <span>Atualizado agora</span>
      </div>

      <div className="reports-scroll">
        <section className="report-heading"><div><span>{tab}</span><h2>{tab==="Visão geral"?"Performance da operação":tab}</h2><p>{period} · {pipeline} · {owner}</p></div><button onClick={()=>setDetail("Como ler este relatório")}>? Como interpretar</button></section>

        <section className="kpi-grid">
          <button onClick={()=>setDetail("Receita gerada")}><span>Receita gerada</span><strong>R$ {stats.revenue.toLocaleString("pt-BR")}</strong><small className="up">↗ 18,4% <i>vs. período anterior</i></small><b>R$ 410 mil</b></button>
          <button onClick={()=>setDetail("Negócios ganhos")}><span>Negócios ganhos</span><strong>{stats.won}</strong><small className="up">↗ 12,9% <i>vs. período anterior</i></small><b>Meta: 120</b></button>
          <button onClick={()=>setDetail("Conversão média")}><span>Conversão média</span><strong>{stats.conversion}%</strong><small className="up">↗ 3,2 p.p. <i>no período</i></small><b>Melhor: 29,8%</b></button>
          <button onClick={()=>setDetail("Ticket médio")}><span>Ticket médio</span><strong>R$ {stats.ticket.toLocaleString("pt-BR")}</strong><small className="down">↘ 2,1% <i>vs. período anterior</i></small><b>Potencial: R$ 4.100</b></button>
        </section>

        <section className="report-grid primary-grid">
          <article className="panel sales-chart">
            <header><div><h3>Vendas ao longo do tempo</h3><p>Receita gerada e negócios ganhos</p></div><div className="legend"><span><i className="purple"/>Receita</span><span><i className="mint"/>Ganhos</span></div></header>
            <div className="chart-area"><div className="axis"><span>R$ 120k</span><span>R$ 80k</span><span>R$ 40k</span><span>R$ 0</span></div><div className="chart-bars">{trend.map((value,index)=><div key={index} className="bar-column"><i style={{height:`${value/1.35}%`}}/><b style={{height:`${Math.max(12,value/3.2)}%`}}/><span>{["1","3","5","8","10","12","15","17","20","22","25","27"][index]}</span></div>)}</div></div>
          </article>
          <article className="panel ai-panel"><header><span>✦ NOIRA IA</span><small>INSIGHT DO PERÍODO</small></header><div className="ai-orb">✦</div><h3>Você pode recuperar R$ 42 mil</h3><p>18 oportunidades estão paradas em “Proposta enviada” há mais de 5 dias. Priorize os negócios com maior intenção.</p><button onClick={()=>setDetail("Oportunidades recomendadas pela IA")}>Ver oportunidades →</button><small>Confiança da análise: 92%</small></article>
        </section>

        <section className="report-grid secondary-grid">
          <article className="panel funnel-panel"><header><div><h3>Funil de vendas</h3><p>Conversão entre etapas</p></div><button onClick={()=>setTab("Funil")}>Detalhar →</button></header><div className="funnel">{[["Novos leads",428,"100%"],["Qualificados",281,"65,7%"],["Demonstração",174,"61,9%"],["Proposta",126,"72,4%"],["Ganhos",96,"76,2%"]].map(([name,value,rate],index)=><div key={String(name)} style={{width:`${100-index*10}%`}}><span>{name}</span><strong>{value}</strong><small>{rate}</small></div>)}</div><footer><b>22,4%</b><span>conversão total</span><small>＋3,1 p.p.</small></footer></article>
          <article className="panel source-panel"><header><div><h3>Origem dos leads</h3><p>Receita por canal</p></div><button>•••</button></header><div className="source-content"><div className="donut"><strong>R$ 352k</strong><span>receita total</span></div><ul>{[["WhatsApp","34%","purple"],["Instagram","27%","pink"],["Indicação","21%","mint"],["Site","12%","blue"],["Outros","6%","gray"]].map(([name,value,color])=><li key={name}><i className={color}/><span>{name}</span><b>{value}</b></li>)}</ul></div></article>
          <article className="panel activity-panel"><header><div><h3>Atividades</h3><p>Conclusão da equipe</p></div><button onClick={()=>setTab("Atividades")}>Detalhar →</button></header>{[["Ligações",186,82],["Reuniões",94,68],["Follow-ups",158,91],["Tarefas",243,76]].map(([name,count,value])=><div className="activity-row" key={String(name)}><span>{name}<b>{count}</b></span><div><i style={{width:`${value}%`}}/></div><small>{value}%</small></div>)}<footer><span>12 tarefas atrasadas</span><button>Ver agenda →</button></footer></article>
        </section>

        <section className="panel team-panel"><header><div><h3>Desempenho da equipe</h3><p>Resultados individuais no período selecionado</p></div><button onClick={()=>setTab("Equipe")}>Relatório completo →</button></header><div className="team-table"><div className="team-head"><span>Responsável</span><span>Leads</span><span>Ganhos</span><span>Receita</span><span>Conversão</span><span>Tarefas</span></div>{team.map((member,index)=><button key={member.name} onClick={()=>setDetail(member.name)}><span className="member"><i>{member.initials}</i><span><b>{member.name}</b><small>{index===0?"Líder de performance":"Consultor comercial"}</small></span></span><span>{member.leads}</span><span>{member.won}</span><strong>{member.revenue}</strong><span>{member.conversion}</span><span className="task-score"><i style={{width:member.tasks}}/>{member.tasks}</span></button>)}</div></section>
      </div>
    </section>
    {notice&&<div className="report-toast">✓ {notice}</div>}
    <div className={`report-overlay ${detail?"open":""}`} onClick={()=>setDetail(null)}/>
    <aside className={`report-drawer ${detail?"open":""}`}>{detail&&<><header><span>DETALHES DO RELATÓRIO</span><button onClick={()=>setDetail(null)}>×</button></header><div className="drawer-icon">◉</div><h2>{detail}</h2><p>Os valores consideram o período, pipeline e responsável selecionados. As métricas são atualizadas conforme os negócios avançam no CRM.</p><section><span>Resultado atual</span><strong>{detail.includes("Receita")?`R$ ${stats.revenue.toLocaleString("pt-BR")}`:detail.includes("Conversão")?`${stats.conversion}%`:"Acima da média"}</strong><small>↗ 18,4% em comparação</small></section><h3>Recomendação</h3><p>Revise as oportunidades sem atividade recente e crie um próximo passo para manter o ritmo da operação.</p><button className="drawer-action" onClick={()=>setDetail(null)}>Entendi</button></> }</aside>
  </main>
}
