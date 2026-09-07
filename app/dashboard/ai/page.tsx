"use client";

import { FormEvent, useState } from "react";
import { DashboardSidebar } from "../DashboardSidebar";
import "../dashboard.css";
import "./ai.css";

type Section="Visão geral"|"Agentes"|"Conhecimento"|"Automações"|"Analista";
type Message={role:"user"|"ai";text:string};
const sections: {name:Section;icon:string;description:string}[]=[
  {name:"Visão geral",icon:"⌂",description:"Resumo e desempenho"},
  {name:"Agentes",icon:"✦",description:"Atendimento automático"},
  {name:"Conhecimento",icon:"▤",description:"Fontes e conteúdos"},
  {name:"Automações",icon:"⌘",description:"Ações no CRM"},
  {name:"Analista",icon:"◉",description:"Insights e relatórios"},
];
const activities=[
  ["Marina respondeu","Clínica Aurora","há 2 min","answer"],
  ["Lead qualificado","Órbita Tech","há 8 min","move"],
  ["Tarefa criada","Casa Nativa","há 14 min","task"],
  ["Conversa transferida","Grupo Atlas","há 21 min","person"],
];

export default function AIPage(){
  const [section,setSection]=useState<Section>("Visão geral");
  const [agentOn,setAgentOn]=useState(true);
  const [sourceModal,setSourceModal]=useState(false);
  const [agentModal,setAgentModal]=useState(false);
  const [testOpen,setTestOpen]=useState(true);
  const [saved,setSaved]=useState("");
  const [sources,setSources]=useState(["Produtos e serviços","Política comercial","Perguntas frequentes"]);
  const [actions,setActions]=useState({qualify:true,move:true,task:true,transfer:true,fields:false});
  const [messages,setMessages]=useState<Message[]>([
    {role:"ai",text:"Olá, Marina! Posso analisar seu CRM, configurar agentes ou ajudar sua equipe a responder leads."},
  ]);
  const [mode,setMode]=useState("Assistente");

  function notify(text:string){setSaved(text);window.setTimeout(()=>setSaved(""),2500)}
  function sendMessage(event:FormEvent<HTMLFormElement>){event.preventDefault();const data=new FormData(event.currentTarget);const text=String(data.get("message")||"").trim();if(!text)return;setMessages((items)=>[...items,{role:"user",text},{role:"ai",text:mode==="Analista"?"Nos últimos 30 dias, o WhatsApp gerou 34% da receita e teve a maior conversão: 29,8%. Posso abrir o relatório completo.":"Entendi. Analisei o contexto da NOIRA e preparei uma recomendação segura para essa tarefa. Você pode revisar antes de aplicar."}]);event.currentTarget.reset()}
  function addSource(event:FormEvent<HTMLFormElement>){event.preventDefault();const data=new FormData(event.currentTarget);const name=String(data.get("name")||"Nova fonte");setSources((items)=>[...items,name]);setSourceModal(false);notify("Fonte adicionada à base de conhecimento.")}
  const actionRows=[
    ["qualify","Qualificar leads","Fazer perguntas e identificar intenção","◎"],
    ["move","Mover no pipeline","Atualizar a etapa conforme a conversa","⇢"],
    ["task","Criar tarefas","Agendar próximos passos automaticamente","◷"],
    ["transfer","Transferir para humano","Encaminhar conversas quando necessário","↗"],
    ["fields","Preencher campos","Completar dados encontrados nas mensagens","✎"],
  ] as const;

  return <main className="noira-ai-app">
    <DashboardSidebar active="ai"/>
    <aside className="ai-module-nav">
      <header><span>✦</span><div><b>NOIRA IA</b><small>Central de inteligência</small></div></header>
      <nav aria-label="Navegação da inteligência artificial">{sections.map((item)=><button key={item.name} className={section===item.name?"active":""} onClick={()=>setSection(item.name)}><i>{item.icon}</i><span><b>{item.name}</b><small>{item.description}</small></span></button>)}</nav>
      <section className="ai-credit"><header><span>Créditos de IA</span><b>72%</b></header><div><i/></div><small>7.240 de 10.000 disponíveis</small><button onClick={()=>notify("Uso de créditos aberto.")}>Ver consumo</button></section>
    </aside>

    <section className="ai-center">
      <header className="ai-topbar"><div><small>INTELIGÊNCIA ARTIFICIAL</small><h1>{section}</h1></div><div><button className="ai-help" onClick={()=>notify("Central de ajuda aberta.")}>? Ajuda</button><button className="ai-primary" onClick={()=>setAgentModal(true)}>＋ Novo agente</button><button className="ai-mobile-test" onClick={()=>setTestOpen(!testOpen)}>✦</button></div></header>
      <div className="ai-content">
        {section==="Visão geral"&&<>
          <section className="ai-hero"><div><span className="eyebrow">AGENTE PRINCIPAL</span><h2>Atendimento que não dorme</h2><p>A NOIRA responde, qualifica e organiza seus leads em todos os canais, usando as informações do seu negócio.</p><div><button onClick={()=>setSection("Agentes")}>Configurar agente</button><button onClick={()=>setTestOpen(true)}>Testar conversa</button></div></div><div className="agent-status"><span className="agent-orb">✦</span><div><b>NOIRA Vendas</b><small><i/> Ativo em 3 canais</small></div><label><input type="checkbox" checked={agentOn} onChange={()=>{setAgentOn(!agentOn);notify(agentOn?"Agente pausado.":"Agente ativado.")}}/><span/></label></div></section>
          <section className="ai-metrics">{[["Conversas atendidas","1.284","↑ 18,2%"],["Resolvidas pela IA","72%","↑ 6,4 p.p."],["Leads qualificados","318","↑ 24,1%"],["Tempo de resposta","4s","↓ 38%"]].map(([label,value,change])=><article key={label}><span>{label}</span><strong>{value}</strong><small>{change}</small></article>)}</section>
          <section className="ai-overview-grid"><article className="ai-panel performance"><header><div><h3>Desempenho do agente</h3><p>Conversas atendidas nos últimos 7 dias</p></div><select><option>7 dias</option><option>30 dias</option></select></header><div className="performance-bars">{[48,67,55,82,74,91,78].map((height,index)=><div key={index}><i style={{height:`${height}%`}}/><span>{["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"][index]}</span></div>)}</div><footer><span><i/> Atendidas</span><span><i/> Resolvidas</span></footer></article><article className="ai-panel recent"><header><div><h3>Atividade recente</h3><p>Ações executadas pela IA</p></div><button>Ver tudo</button></header>{activities.map(([title,lead,time,type])=><div className="recent-row" key={lead}><i className={type}>{type==="answer"?"▢":type==="move"?"⇢":type==="task"?"◷":"↗"}</i><span><b>{title}</b><small>{lead}</small></span><time>{time}</time></div>)}</article></section>
          <section className="ai-panel opportunity"><header><div><span>✦ INSIGHT DA NOIRA</span><h3>12 oportunidades precisam de atenção</h3><p>Leads qualificados estão há mais de 3 dias sem uma próxima ação.</p></div><button onClick={()=>setSection("Analista")}>Analisar agora →</button></header><div>{[["Clínica Aurora","R$ 4.800","92%"],["Imobiliária Norte","R$ 12.500","87%"],["Casa Nativa","R$ 15.600","85%"]].map(([name,value,score])=><article key={name}><i>{name[0]}</i><span><b>{name}</b><small>Probabilidade de fechamento</small></span><strong>{value}</strong><em>{score}</em></article>)}</div></section>
        </>}

        {section==="Agentes"&&<><section className="section-heading"><div><h2>Agentes de IA</h2><p>Configure especialistas para equipes, canais e objetivos diferentes.</p></div><button onClick={()=>setAgentModal(true)}>＋ Criar agente</button></section><section className="agent-grid"><article className="agent-card active"><header><span>✦</span><label><input type="checkbox" checked={agentOn} onChange={()=>setAgentOn(!agentOn)}/><i/></label></header><h3>NOIRA Vendas</h3><p>Qualifica leads, responde dúvidas e agenda demonstrações.</p><div><span>WhatsApp</span><span>Instagram</span><span>Site</span></div><footer><span><i/> {agentOn?"Ativo":"Pausado"}</span><button onClick={()=>notify("Editor do agente aberto.")}>Configurar →</button></footer></article><article className="agent-card"><header><span>✦</span><label><input type="checkbox"/><i/></label></header><h3>NOIRA Suporte</h3><p>Resolve dúvidas frequentes e transfere casos especiais.</p><div><span>WhatsApp</span><span>Site</span></div><footer><span className="paused"><i/> Pausado</span><button onClick={()=>notify("Editor do agente aberto.")}>Configurar →</button></footer></article><button className="add-agent-card" onClick={()=>setAgentModal(true)}><span>＋</span><b>Novo agente</b><small>Crie um especialista com IA</small></button></section></>}

        {section==="Conhecimento"&&<><section className="section-heading"><div><h2>Base de conhecimento</h2><p>Informações usadas pela NOIRA para responder com precisão.</p></div><button onClick={()=>setSourceModal(true)}>＋ Adicionar fonte</button></section><section className="knowledge-stats"><article><span>▤</span><div><strong>{sources.length}</strong><small>Fontes ativas</small></div></article><article><span>✓</span><div><strong>98%</strong><small>Conteúdo processado</small></div></article><article><span>◷</span><div><strong>Hoje, 16:42</strong><small>Última atualização</small></div></article></section><section className="ai-panel source-list"><header><div><h3>Fontes do negócio</h3><p>A IA responde somente com base nestas informações.</p></div><button>⌕ Buscar</button></header>{sources.map((source,index)=><article key={source}><i>{index===0?"▦":index===1?"§":"?"}</i><span><b>{source}</b><small>{index===0?"32 produtos · Atualizado hoje":index===1?"8 páginas · Atualizado ontem":"24 respostas · Atualizado hoje"}</small></span><em>Pronto</em><button onClick={()=>notify(`${source} aberto para edição.`)}>•••</button></article>)}</section></>}

        {section==="Automações"&&<><section className="section-heading"><div><h2>Ações automáticas</h2><p>Escolha o que seus agentes podem fazer dentro do CRM.</p></div><button onClick={()=>notify("Alterações das automações salvas.")}>Salvar alterações</button></section><section className="automation-layout"><div className="ai-panel action-list">{actionRows.map(([key,title,description,icon])=><label key={key}><i>{icon}</i><span><b>{title}</b><small>{description}</small></span><input type="checkbox" checked={actions[key]} onChange={()=>setActions({...actions,[key]:!actions[key]})}/><em/></label>)}</div><aside className="automation-preview"><span>FLUXO ATIVO</span><h3>Quando um lead envia uma mensagem</h3><div><i>1</i><p><b>Entender a intenção</b><small>A NOIRA analisa contexto e sentimento.</small></p></div><div><i>2</i><p><b>Responder usando as fontes</b><small>A resposta segue a personalidade da marca.</small></p></div><div><i>3</i><p><b>Executar a próxima ação</b><small>Qualifica, move ou transfere o lead.</small></p></div><button onClick={()=>setTestOpen(true)}>Testar automação</button></aside></section></>}

        {section==="Analista"&&<><section className="analyst-intro"><span>✦</span><div><small>MODO ANALISTA</small><h2>Pergunte sobre seus resultados</h2><p>Transforme os dados do CRM em respostas, gráficos e próximos passos.</p></div></section><div className="analyst-prompts">{["Qual canal trouxe mais receita este mês?","Quais leads têm maior chance de fechar?","Compare o desempenho da equipe","Mostre os gargalos do pipeline"].map((prompt)=><button key={prompt} onClick={()=>{setMode("Analista");setTestOpen(true);setMessages((items)=>[...items,{role:"user",text:prompt},{role:"ai",text:prompt.includes("canal")?"O WhatsApp lidera com R$ 119.800 em receita e conversão de 29,8%. É 7,2 pontos acima do Instagram.":"Encontrei 12 oportunidades sem próxima ação. Clínica Aurora, Imobiliária Norte e Casa Nativa concentram R$ 32.900 de potencial."}])}}>✦ {prompt}<span>→</span></button>)}</div><section className="analyst-grid"><article className="ai-panel"><header><div><h3>Receita por canal</h3><p>Últimos 30 dias</p></div><b>R$ 352.300</b></header>{[["WhatsApp",84,"R$ 119,8k"],["Instagram",67,"R$ 95,1k"],["Indicação",52,"R$ 74,0k"],["Site",31,"R$ 42,3k"]].map(([label,value,total])=><div className="analyst-bar" key={label}><span>{label}</span><div><i style={{width:`${value}%`}}/></div><b>{total}</b></div>)}</article><article className="ai-panel analyst-alert"><span>GARGALO DETECTADO</span><strong>Proposta → Ganho</strong><p>A conversão caiu 4,8 pontos. 18 propostas estão sem interação há mais de 5 dias.</p><button onClick={()=>notify("Lista de oportunidades preparada.")}>Ver 18 oportunidades →</button></article></section></>}
      </div>
    </section>

    <aside className={`ai-copilot ${testOpen?"open":""}`}><header><div><span>✦</span><p><b>NOIRA Copilot</b><small>Online agora</small></p></div><button onClick={()=>setTestOpen(false)}>×</button></header><div className="copilot-modes">{["Assistente","Analista","Ajuda"].map((item)=><button key={item} className={mode===item?"active":""} onClick={()=>setMode(item)}>{item}</button>)}</div><div className="copilot-context"><span>CONTEXTO ATUAL</span><b>{section}</b><small>Pipeline de vendas · Toda a equipe</small></div><div className="copilot-messages">{messages.map((message,index)=><div key={index} className={message.role}><i>{message.role==="ai"?"✦":"MS"}</i><p>{message.text}</p></div>)}</div><div className="quick-actions"><button onClick={()=>setMessages((items)=>[...items,{role:"user",text:"Resuma meu dia"},{role:"ai",text:"Você tem 3 reuniões, 7 tarefas e 12 leads que precisam de acompanhamento hoje."}])}>Resumir meu dia</button><button onClick={()=>setMessages((items)=>[...items,{role:"user",text:"Encontrar prioridades"},{role:"ai",text:"Priorize Clínica Aurora, Casa Nativa e Imobiliária Norte. Juntas, somam R$ 32.900 em potencial."}])}>Encontrar prioridades</button></div><form onSubmit={sendMessage}><textarea name="message" rows={2} placeholder="Pergunte à NOIRA..."/><footer><button type="button">＋</button><span>A IA pode cometer erros</span><button type="submit">↑</button></footer></form></aside>

    {sourceModal&&<div className="ai-modal" role="dialog" aria-modal="true" aria-label="Adicionar fonte"><form onSubmit={addSource}><header><div><small>BASE DE CONHECIMENTO</small><h2>Adicionar fonte</h2></div><button type="button" onClick={()=>setSourceModal(false)}>×</button></header><div className="source-types"><label><input type="radio" name="type" defaultChecked/><span>▤<b>Texto</b><small>Cole informações</small></span></label><label><input type="radio" name="type"/><span>↗<b>Site</b><small>Importe uma página</small></span></label><label><input type="radio" name="type"/><span>▦<b>Catálogo</b><small>Produtos e preços</small></span></label></div><label>Nome da fonte<input name="name" required autoFocus placeholder="Ex.: Política de reembolso"/></label><label>Conteúdo<textarea rows={6} placeholder="Insira as informações que a NOIRA deve aprender..."/></label><footer><button type="button" onClick={()=>setSourceModal(false)}>Cancelar</button><button className="primary" type="submit">Adicionar e processar</button></footer></form></div>}
    {agentModal&&<div className="ai-modal" role="dialog" aria-modal="true" aria-label="Novo agente"><form onSubmit={(event)=>{event.preventDefault();setAgentModal(false);setSection("Agentes");notify("Novo agente criado como rascunho.")}}><header><div><small>AGENTES DE IA</small><h2>Criar novo agente</h2></div><button type="button" onClick={()=>setAgentModal(false)}>×</button></header><label>Nome do agente<input required autoFocus placeholder="Ex.: NOIRA Agendamentos"/></label><label>Objetivo<select><option>Qualificar e vender</option><option>Atender e oferecer suporte</option><option>Agendar compromissos</option><option>Personalizado</option></select></label><label>Personalidade<textarea rows={4} defaultValue="Seja cordial, objetivo e consultivo. Use linguagem natural e encaminhe para uma pessoa quando não tiver certeza."/></label><footer><button type="button" onClick={()=>setAgentModal(false)}>Cancelar</button><button className="primary" type="submit">Criar agente</button></footer></form></div>}
    {saved&&<div className="ai-toast">✓ {saved}</div>}
  </main>
}
