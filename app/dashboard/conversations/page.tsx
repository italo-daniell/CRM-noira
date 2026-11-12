"use client";

import { useDeviceState } from "../../../lib/use-device-state";

import { FormEvent, useMemo, useState } from "react";
import { DashboardSidebar } from "../DashboardSidebar";
import "../dashboard.css";
import "./conversations.css";

type Message = { id: number; from: "client" | "agent" | "system"; text: string; time: string };
type Conversation = {
  id: string; name: string; initials: string; channel: "whatsapp" | "instagram" | "email" | "site";
  preview: string; time: string; unread: number; owner: string; stage: string; value: string;
  company: string; phone: string; email: string; tags: string[]; online?: boolean; messages: Message[];
};

const conversations: Conversation[] = [
  { id:"marina", name:"Marina Souza", initials:"MS", channel:"whatsapp", preview:"Perfeito! Podemos marcar para amanhã?", time:"10:42", unread:3, owner:"Marina Silva", stage:"Qualificado", value:"R$ 4.800", company:"Clínica Aurora", phone:"+55 11 98765-4321", email:"marina@clinicaaurora.com.br", tags:["Alta intenção","Clínica","Inbound"], online:true, messages:[
    {id:1,from:"system",text:"Lead criado automaticamente pelo WhatsApp",time:"Hoje, 09:58"},
    {id:2,from:"client",text:"Olá! Vi o anúncio de vocês e queria entender melhor como funciona o CRM.",time:"10:03"},
    {id:3,from:"agent",text:"Oi, Marina! Que bom falar com você 😊 A NOIRA reúne WhatsApp, Instagram e seu funil em um só lugar. Quantas pessoas trabalham no atendimento hoje?",time:"10:07"},
    {id:4,from:"client",text:"Somos 8 pessoas. Hoje cada uma usa um WhatsApp e fica difícil acompanhar.",time:"10:11"},
    {id:5,from:"agent",text:"Nesse cenário, conseguimos centralizar os números, distribuir as conversas e acompanhar cada oportunidade. Posso te mostrar em uma demonstração de 20 minutos.",time:"10:18"},
    {id:6,from:"client",text:"Perfeito! Podemos marcar para amanhã?",time:"10:42"},
  ]},
  { id:"carlos", name:"Carlos Lima", initials:"CL", channel:"instagram", preview:"Vocês têm integração com Instagram?", time:"10:18", unread:1, owner:"Carlos Nunes", stage:"Novo lead", value:"R$ 2.900", company:"Estúdio Sabiá", phone:"+55 21 99812-1234", email:"carlos@studiosabia.com", tags:["Instagram","Design"], messages:[{id:1,from:"client",text:"Oi! Vocês têm integração com Instagram?",time:"10:18"}]},
  { id:"ana", name:"Ana Reis", initials:"AR", channel:"whatsapp", preview:"Obrigada, vou analisar a proposta.", time:"Ontem", unread:0, owner:"Marina Silva", stage:"Proposta", value:"R$ 12.500", company:"Imobiliária Norte", phone:"+55 31 99123-7788", email:"ana@imobnorte.com", tags:["Proposta enviada","Imobiliária"], messages:[{id:1,from:"agent",text:"Enviei a proposta com as condições que alinhamos.",time:"Ontem, 16:20"},{id:2,from:"client",text:"Obrigada, vou analisar a proposta.",time:"Ontem, 16:34"}]},
  { id:"rafael", name:"Rafael Melo", initials:"RM", channel:"email", preview:"Segue a lista de usuários para implantação.", time:"Ontem", unread:0, owner:"Beatriz Rocha", stage:"Fechado", value:"R$ 18.000", company:"Órbita Tech", phone:"+55 11 97731-5544", email:"rafael@orbitatech.io", tags:["Cliente","Tecnologia"], messages:[{id:1,from:"client",text:"Olá, segue a lista de usuários para implantação.",time:"Ontem, 14:05"}]},
  { id:"bianca", name:"Bianca Alves", initials:"BA", channel:"site", preview:"Quero saber os valores do plano Pro.", time:"Seg", unread:2, owner:"Não atribuído", stage:"Novo lead", value:"R$ 0", company:"Bela Forma", phone:"+55 41 99931-0042", email:"bianca@belaforma.com.br", tags:["Site","Preço"], messages:[{id:1,from:"client",text:"Quero saber os valores do plano Pro.",time:"Seg, 11:28"}]},
  { id:"joao", name:"João Rocha", initials:"JR", channel:"whatsapp", preview:"Combinado, até quinta-feira!", time:"Seg", unread:0, owner:"Marina Silva", stage:"Em contato", value:"R$ 7.200", company:"Vitta Saúde", phone:"+55 51 98819-4431", email:"joao@vittasaude.com", tags:["Follow-up","Saúde"], messages:[{id:1,from:"client",text:"Combinado, até quinta-feira!",time:"Seg, 09:12"}]},
];

const channelIcon = { whatsapp:"◉", instagram:"◎", email:"✉", site:"◇" };

export default function ConversationsPage() {
  const [selectedId, setSelectedId] = useState("marina");
  const [filter, setFilter] = useState("Todos");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [mobileChat, setMobileChat] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [closed, setClosed] = useState(false);
  const [extraMessages, setExtraMessages] = useDeviceState<Record<string, Message[]>>("noira:messages:v1", {});

  const selected = conversations.find((item) => item.id === selectedId) ?? conversations[0];
  const visible = useMemo(() => conversations.filter((item) => {
    const matchesSearch = `${item.name} ${item.company} ${item.preview}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "Todos" || (filter === "Não respondidos" && item.unread > 0) || (filter === "Meus" && item.owner === "Marina Silva");
    return matchesSearch && matchesFilter;
  }), [filter, query]);

  const allMessages = [...selected.messages, ...(extraMessages[selected.id] ?? [])];

  function chooseConversation(id: string) { setSelectedId(id); setMobileChat(true); setClosed(false); }
  function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const message: Message = { id: Date.now(), from:"agent", text, time:new Date().toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit" }) };
    setExtraMessages((current) => ({ ...current, [selected.id]: [...(current[selected.id] ?? []), message] }));
    setDraft("");
  }

  return (
    <main className="conversations-app">
      <DashboardSidebar active="conversations" />
      <section className={`conversation-layout ${mobileChat ? "mobile-chat" : ""} ${infoOpen ? "info-open" : ""}`}>
        <aside className="inbox-list">
          <header className="inbox-heading"><div><small>Caixa de entrada</small><h1>Conversas <b>9</b></h1></div><button aria-label="Iniciar conversa">＋</button></header>
          <label className="conversation-search"><span>⌕</span><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Buscar conversas" /></label>
          <div className="conversation-filters" role="tablist">{["Todos","Não respondidos","Meus"].map((item)=><button role="tab" aria-selected={filter===item} className={filter===item?"active":""} onClick={()=>setFilter(item)} key={item}>{item}</button>)}</div>
          <div className="channel-filter"><button className="active">Todos <b>24</b></button><button className="whatsapp">◉</button><button className="instagram">◎</button><button className="email">✉</button><button>＋</button></div>
          <div className="conversation-items">
            {visible.map((item)=><button className={`conversation-item ${selectedId===item.id?"selected":""}`} onClick={()=>chooseConversation(item.id)} key={item.id}>
              <span className="contact-avatar">{item.initials}{item.online&&<i/>}</span>
              <span className="conversation-summary"><strong>{item.name}</strong><small><i className={item.channel}>{channelIcon[item.channel]}</i>{item.preview}</small><em>{item.company}</em></span>
              <span className="conversation-meta"><time>{item.time}</time>{item.unread>0&&<b>{item.unread}</b>}</span>
            </button>)}
          </div>
          <footer className="inbox-footer"><span>24 conversas</span><button>Ordenar por recentes⌄</button></footer>
        </aside>

        <section className="chat-panel">
          <header className="chat-header">
            <button className="mobile-back" onClick={()=>setMobileChat(false)} aria-label="Voltar às conversas">‹</button>
            <span className="contact-avatar large">{selected.initials}{selected.online&&<i/>}</span>
            <div><h2>{selected.name}</h2><p><span className={selected.channel}>{channelIcon[selected.channel]}</span> {selected.company} · {selected.online?"online agora":"visto recentemente"}</p></div>
            <div className="chat-actions"><button title="Pesquisar">⌕</button><button title="Ligar">⌕</button><button className={closed?"done":""} onClick={()=>setClosed(!closed)}>{closed?"✓ Respondida":"Marcar respondida"}</button><button className="mobile-info" onClick={()=>setInfoOpen(!infoOpen)} aria-label="Dados do contato">ⓘ</button><button>•••</button></div>
          </header>
          <div className="chat-context"><span>Negócio: <b>{selected.company}</b></span><i>›</i><span className="stage-dot">{selected.stage}</span><i>›</i><strong>{selected.value}</strong></div>
          <div className="message-stream">
            <div className="day-separator"><span>Hoje</span></div>
            {allMessages.map((message)=><div className={`message-row ${message.from}`} key={message.id}>
              {message.from === "system" ? <div className="system-message">✦ {message.text}<time>{message.time}</time></div> : <><span className="message-avatar">{message.from === "client" ? selected.initials : "MS"}</span><div className="message-bubble"><p>{message.text}</p><time>{message.time}{message.from==="agent"&&"  ✓✓"}</time></div></>}
            </div>)}
            <div className="ai-suggestion"><span>✦</span><div><b>Sugestão da NOIRA IA</b><p>Tenho disponibilidade amanhã às 10h ou às 15h. Qual horário funciona melhor para você?</p><button onClick={()=>setDraft("Tenho disponibilidade amanhã às 10h ou às 15h. Qual horário funciona melhor para você?")}>Usar resposta</button></div><button aria-label="Fechar sugestão">×</button></div>
          </div>
          <form className="message-composer" onSubmit={sendMessage}>
            <div className="composer-tools"><button type="button" title="Anexar arquivo">＋</button><button type="button" title="Respostas rápidas">▤ Modelos</button><button type="button" title="Automação">✦ NOIRA IA</button><span>Responder por <b className={selected.channel}>{channelIcon[selected.channel]} {selected.channel}</b>⌄</span></div>
            <textarea value={draft} onChange={(event)=>setDraft(event.target.value)} placeholder="Digite uma mensagem…" rows={2} />
            <div className="composer-footer"><div><button type="button">☺</button><button type="button">GIF</button><button type="button">🎙</button></div><small>Enter para enviar</small><button className="send-button" type="submit" aria-label="Enviar mensagem">➤</button></div>
          </form>
        </section>

        <aside className="lead-panel">
          <header><b>Dados do contato</b><button onClick={()=>setInfoOpen(false)} aria-label="Fechar dados">×</button></header>
          <div className="lead-identity"><span className="contact-avatar xl">{selected.initials}</span><h3>{selected.name}</h3><p>{selected.company}</p><button>Editar contato</button></div>
          <section className="lead-section"><label>ETAPA DO FUNIL</label><button className="stage-select"><span/><b>{selected.stage}</b><i>⌄</i></button><div className="lead-value"><span>Valor do negócio</span><b>{selected.value}</b></div></section>
          <section className="lead-section"><label>RESPONSÁVEL</label><button className="owner"><i>{selected.owner === "Marina Silva" ? "MS" : "?"}</i><span><b>{selected.owner}</b><small>Equipe Comercial</small></span><em>⌄</em></button></section>
          <section className="lead-section"><label>CONTATO</label><a href={`tel:${selected.phone}`}>☎ <span>{selected.phone}</span></a><a href={`mailto:${selected.email}`}>✉ <span>{selected.email}</span></a></section>
          <section className="lead-section"><label>ETIQUETAS</label><div className="tag-list">{selected.tags.map((tag)=><span key={tag}>{tag}</span>)}<button>＋</button></div></section>
          <section className="lead-section"><label>PRÓXIMA TAREFA</label><div className="next-task"><span>◷</span><div><b>Demonstrar a plataforma</b><small>Amanhã · 10:00</small></div><button>✓</button></div></section>
          <section className="lead-section"><label>ATALHOS</label><div className="shortcut-grid"><button>＋<span>Tarefa</span></button><button>▤<span>Nota</span></button><button>↗<span>Mover</span></button></div></section>
        </aside>
      </section>
    </main>
  );
}
