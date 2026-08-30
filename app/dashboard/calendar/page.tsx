"use client";

import { FormEvent, useMemo, useState } from "react";
import { DashboardSidebar } from "../DashboardSidebar";
import "../dashboard.css";
import "./calendar.css";

type View = "calendar" | "board" | "list";
type Zoom = "Dia" | "Semana" | "Mês";
type AgendaEvent = {
  id:number; title:string; contact:string; initials:string; company:string; day:number; start:number; duration:number;
  owner:string; type:"Reunião"|"Ligação"|"Tarefa"|"Demonstração"; status:"Atrasada"|"Hoje"|"Amanhã"|"Esta semana";
  color:"violet"|"pink"|"blue"|"green"|"orange"; location:string; notes:string; done?:boolean;
};

const weekdays = [
  { short:"SEG", day:24 },{ short:"TER", day:25 },{ short:"QUA", day:26 },{ short:"QUI", day:27 },{ short:"SEX", day:28 },{ short:"SÁB", day:29 },{ short:"DOM", day:30 },
];

const initialEvents: AgendaEvent[] = [
  {id:1,title:"Demonstração da NOIRA",contact:"Marina Souza",initials:"MS",company:"Clínica Aurora",day:24,start:9,duration:1.5,owner:"Marina Silva",type:"Demonstração",status:"Atrasada",color:"violet",location:"Google Meet",notes:"Apresentar caixa de entrada e automações do funil."},
  {id:2,title:"Enviar proposta comercial",contact:"Ana Reis",initials:"AR",company:"Imobiliária Norte",day:24,start:14,duration:1,owner:"Marina Silva",type:"Tarefa",status:"Atrasada",color:"orange",location:"CRM",notes:"Revisar condições e enviar proposta final."},
  {id:3,title:"Reunião de implantação",contact:"Rafael Melo",initials:"RM",company:"Órbita Tech",day:25,start:10,duration:2,owner:"Beatriz Rocha",type:"Reunião",status:"Atrasada",color:"blue",location:"Sala virtual",notes:"Alinhar usuários, canais e cronograma de implantação."},
  {id:4,title:"Follow-up da proposta",contact:"Ana Reis",initials:"AR",company:"Imobiliária Norte",day:26,start:15,duration:1,owner:"Marina Silva",type:"Ligação",status:"Atrasada",color:"pink",location:"Telefone",notes:"Confirmar recebimento e resolver objeções."},
  {id:5,title:"Call de qualificação",contact:"Carlos Lima",initials:"CL",company:"Estúdio Sabiá",day:27,start:9,duration:1,owner:"Carlos Nunes",type:"Ligação",status:"Hoje",color:"green",location:"WhatsApp",notes:"Entender volume de atendimentos e canais atuais."},
  {id:6,title:"Demo personalizada",contact:"Pedro Martins",initials:"PM",company:"Nexo Contábil",day:27,start:11,duration:1.5,owner:"Beatriz Rocha",type:"Demonstração",status:"Hoje",color:"violet",location:"Google Meet",notes:"Focar nos recursos empresariais e relatórios."},
  {id:7,title:"Revisão de contrato",contact:"João Rocha",initials:"JR",company:"Vitta Saúde",day:27,start:15,duration:1,owner:"Marina Silva",type:"Reunião",status:"Hoje",color:"blue",location:"Escritório",notes:"Revisar renovação anual e novos usuários."},
  {id:8,title:"Primeiro contato",contact:"Bianca Alves",initials:"BA",company:"Bela Forma",day:28,start:10,duration:1,owner:"Marina Silva",type:"Ligação",status:"Amanhã",color:"pink",location:"WhatsApp",notes:"Apresentar plano Pro e identificar necessidades."},
  {id:9,title:"Treinamento da equipe",contact:"Rafael Melo",initials:"RM",company:"Órbita Tech",day:28,start:14,duration:2,owner:"Beatriz Rocha",type:"Reunião",status:"Amanhã",color:"green",location:"Google Meet",notes:"Treinamento inicial da equipe comercial."},
  {id:10,title:"Reunião trimestral",contact:"João Rocha",initials:"JR",company:"Vitta Saúde",day:29,start:11,duration:1,owner:"Marina Silva",type:"Reunião",status:"Esta semana",color:"blue",location:"Google Meet",notes:"Revisar resultados do trimestre."},
];

const timeSlots = Array.from({length:12},(_,index)=>index+8);
const statusGroups: AgendaEvent["status"][] = ["Atrasada","Hoje","Amanhã","Esta semana"];

export default function CalendarPage(){
  const [events,setEvents]=useState(initialEvents);
  const [view,setView]=useState<View>("calendar");
  const [zoom,setZoom]=useState<Zoom>("Semana");
  const [owner,setOwner]=useState("Todos");
  const [query,setQuery]=useState("");
  const [createOpen,setCreateOpen]=useState(false);
  const [selected,setSelected]=useState<number|null>(null);
  const [monthOffset,setMonthOffset]=useState(0);
  const [mobileMenu,setMobileMenu]=useState(false);

  const visible=useMemo(()=>events.filter((event)=>{
    const matchesOwner=owner==="Todos"||event.owner===owner;
    const text=`${event.title} ${event.contact} ${event.company} ${event.type}`.toLowerCase();
    return matchesOwner&&text.includes(query.toLowerCase());
  }),[events,owner,query]);
  const current=events.find((event)=>event.id===selected)||null;

  function addEvent(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    const title=String(data.get("title")||"Novo compromisso");
    const contact=String(data.get("contact")||"Sem contato");
    const day=Number(data.get("day")||27);
    const start=Number(String(data.get("time")||"10:00").split(":")[0]);
    const item:AgendaEvent={id:Date.now(),title,contact,initials:contact.split(" ").slice(0,2).map((p)=>p[0]).join("").toUpperCase(),company:String(data.get("company")||"Sem empresa"),day,start,duration:Number(data.get("duration")||1),owner:String(data.get("owner")||"Marina Silva"),type:String(data.get("type")||"Reunião") as AgendaEvent["type"],status:day===27?"Hoje":day===28?"Amanhã":"Esta semana",color:"violet",location:String(data.get("location")||"Google Meet"),notes:String(data.get("notes")||"Compromisso criado na agenda NOIRA.")};
    setEvents((items)=>[...items,item]);setSelected(item.id);setCreateOpen(false);event.currentTarget.reset();
  }
  function toggleDone(id:number){setEvents((items)=>items.map((item)=>item.id===id?{...item,done:!item.done}:item));}

  return <main className="calendar-app">
    <DashboardSidebar active="calendar"/>
    <section className="calendar-workspace">
      <header className="calendar-topbar">
        <div><small>Organização da equipe</small><h1>Agenda</h1></div>
        <nav className="calendar-sections" aria-label="Visualização da agenda">
          <button className={view==="board"?"active":""} onClick={()=>setView("board")}>▦ <span>Quadro</span></button>
          <button className={view==="list"?"active":""} onClick={()=>setView("list")}>☷ <span>Lista</span></button>
          <button className={view==="calendar"?"active":""} onClick={()=>setView("calendar")}>□ <span>Calendário</span></button>
        </nav>
        <div className="calendar-actions"><button className="settings">⚙ Disponibilidade</button><button className="primary" onClick={()=>setCreateOpen(true)}>＋ Novo</button></div>
      </header>

      <div className="calendar-filters">
        <div className="date-navigation"><button onClick={()=>setMonthOffset(monthOffset-1)}>‹</button><button onClick={()=>setMonthOffset(0)}>Hoje</button><button onClick={()=>setMonthOffset(monthOffset+1)}>›</button><b>{monthOffset===0?"24 – 30 de agosto de 2026":monthOffset<0?"17 – 23 de agosto de 2026":"31 de agosto – 6 de setembro"}</b></div>
        <label className="agenda-search"><span>⌕</span><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Buscar na agenda"/></label>
        <select value={owner} onChange={(event)=>setOwner(event.target.value)} aria-label="Filtrar responsável"><option>Todos</option><option>Marina Silva</option><option>Carlos Nunes</option><option>Beatriz Rocha</option></select>
        {view==="calendar"&&<div className="zoom-switch">{(["Dia","Semana","Mês"] as Zoom[]).map((item)=><button key={item} className={zoom===item?"active":""} onClick={()=>setZoom(item)}>{item}</button>)}</div>}
        <button className="mobile-filter" onClick={()=>setMobileMenu(!mobileMenu)}>≡</button>
      </div>

      <div className={`calendar-body ${mobileMenu?"menu-open":""}`}>
        <aside className="calendar-sidebar">
          <section className="mini-calendar"><header><b>Agosto 2026</b><div><button>‹</button><button>›</button></div></header><div className="mini-weekdays">{["S","T","Q","Q","S","S","D"].map((day,index)=><b key={index}>{day}</b>)}</div><div className="mini-days">{Array.from({length:35},(_,i)=>{const day=i-4;return <button key={i} className={`${day===27?"today":""} ${day<1||day>31?"muted":""}`}>{day<1?day+31:day>31?day-31:day}</button>})}</div></section>
          <section className="agenda-summary"><header><b>Minha agenda</b><span>12 tarefas</span></header><div><i className="overdue"/>Atrasadas <b>4</b></div><div><i className="today"/>Para hoje <b>3</b></div><div><i className="upcoming"/>Próximas <b>5</b></div></section>
          <section className="team-calendars"><header><b>Equipe</b><button>＋</button></header>{[["MS","Marina Silva","violet"],["CN","Carlos Nunes","green"],["BR","Beatriz Rocha","blue"]].map(([initials,name,color])=><label key={name}><input type="checkbox" defaultChecked/><i className={color}>{initials}</i><span>{name}</span><small>{visible.filter((item)=>item.owner===name).length}</small></label>)}</section>
          <button className="google-sync">G <span><b>Google Agenda</b><small>Sincronização ativa</small></span><i>✓</i></button>
        </aside>

        <section className="agenda-content">
          {view==="calendar"&&zoom==="Semana"&&<div className="week-calendar">
            <div className="week-header"><span/><div className="timezone">GMT−3</div>{weekdays.map((day)=><button key={day.day} className={day.day===27?"today":""}><small>{day.short}</small><b>{day.day}</b>{day.day===27&&<i/>}</button>)}</div>
            <div className="all-day-row"><span>Dia todo</span><div/><div/><div/><div className="all-day-event">◎ Preparar relatório semanal</div><div/><div/><div/></div>
            <div className="week-grid"><div className="time-column">{timeSlots.map((time)=><span key={time}>{String(time).padStart(2,"0")}:00</span>)}</div>{weekdays.map((day)=><div className={`day-column ${day.day===27?"today":""}`} key={day.day}>{timeSlots.map((time)=><i key={time}/>)}{visible.filter((event)=>event.day===day.day).map((event)=><button key={event.id} className={`agenda-event ${event.color} ${event.done?"done":""}`} style={{top:`${(event.start-8)*64+4}px`,height:`${Math.max(event.duration*64-7,43)}px`}} onClick={()=>setSelected(event.id)}><strong>{event.title}</strong><span>{event.contact}</span><small>{String(event.start).padStart(2,"0")}:00 – {String(Math.floor(event.start+event.duration)).padStart(2,"0")}:{event.duration%1?"30":"00"}</small></button>)}{day.day===27&&<div className="current-time" style={{top:"286px"}}><b>12:28</b></div>}</div>)}</div>
          </div>}

          {view==="calendar"&&zoom==="Dia"&&<div className="day-calendar"><header><div><small>QUI</small><b>27</b></div><span>3 compromissos · 4h ocupadas</span></header><div className="day-schedule">{timeSlots.map((time)=><div className="day-hour" key={time}><time>{String(time).padStart(2,"0")}:00</time><span/></div>)}{visible.filter((event)=>event.day===27).map((event)=><button key={event.id} className={`agenda-event ${event.color}`} style={{top:`${(event.start-8)*68+5}px`,height:`${event.duration*68-8}px`}} onClick={()=>setSelected(event.id)}><strong>{event.title}</strong><span>{event.contact} · {event.location}</span><small>{String(event.start).padStart(2,"0")}:00</small></button>)}</div></div>}

          {view==="calendar"&&zoom==="Mês"&&<div className="month-calendar"><header>{["SEG","TER","QUA","QUI","SEX","SÁB","DOM"].map((day)=><b key={day}>{day}</b>)}</header><div className="month-grid">{Array.from({length:35},(_,index)=>{const day=index-4;const realDay=day<1?day+31:day>31?day-31:day;const inMonth=day>=1&&day<=31;return <button key={index} className={`${!inMonth?"muted":""} ${realDay===27&&inMonth?"today":""}`}><strong>{realDay}</strong>{inMonth&&visible.filter((event)=>event.day===realDay).slice(0,3).map((event)=><span className={event.color} key={event.id} onClick={(click)=>{click.stopPropagation();setSelected(event.id)}}><i/>{event.title}</span>)}{inMonth&&visible.filter((event)=>event.day===realDay).length>3&&<small>+{visible.filter((event)=>event.day===realDay).length-3} mais</small>}</button>})}</div></div>}

          {view==="board"&&<div className="task-board">{statusGroups.map((status)=><section key={status}><header><div><i className={status==="Atrasada"?"overdue":status==="Hoje"?"today":"upcoming"}/><b>{status}</b><span>{visible.filter((item)=>item.status===status&&!item.done).length}</span></div><button>＋</button></header><div>{visible.filter((item)=>item.status===status&&!item.done).map((event)=><article key={event.id} onClick={()=>setSelected(event.id)}><div className="task-type"><span className={event.color}>{event.type}</span><button>•••</button></div><h3>{event.title}</h3><p>{event.contact} · {event.company}</p><footer><i>{event.initials}</i><time>{event.day} ago · {String(event.start).padStart(2,"0")}:00</time><button onClick={(click)=>{click.stopPropagation();toggleDone(event.id)}}>✓</button></footer></article>)}</div><button className="add-task" onClick={()=>setCreateOpen(true)}>＋ Adicionar tarefa</button></section>)}</div>}

          {view==="list"&&<div className="task-list"><header><label><input type="checkbox"/> Tarefa</label><span>Contato</span><span>Prazo</span><span>Responsável</span><span>Tipo</span></header>{visible.map((event)=><article key={event.id} className={event.done?"done":""} onClick={()=>setSelected(event.id)}><button onClick={(click)=>{click.stopPropagation();toggleDone(event.id)}}>{event.done?"✓":"○"}</button><div><b>{event.title}</b><small>{event.company}</small></div><span>{event.contact}</span><time className={event.status==="Atrasada"?"late":""}>{event.day} ago · {String(event.start).padStart(2,"0")}:00</time><span className="list-owner"><i>{event.owner.split(" ").map((p)=>p[0]).join("")}</i>{event.owner}</span><span className={`list-type ${event.color}`}>{event.type}</span><button>•••</button></article>)}</div>}
        </section>
      </div>
    </section>

    <div className={`event-overlay ${current?"open":""}`} onClick={()=>setSelected(null)}/>
    <aside className={`event-drawer ${current?"open":""}`}>{current&&<><header><button onClick={()=>setSelected(null)}>×</button><div><button>□</button><button>•••</button></div></header><div className="event-drawer-title"><span className={current.color}>{current.type}</span><h2>{current.title}</h2><p><i>{current.initials}</i>{current.contact} · {current.company}</p></div><div className="event-details"><section><label>DATA E HORÁRIO</label><div><span>□</span><p><b>{current.day} de agosto de 2026</b><small>{String(current.start).padStart(2,"0")}:00 – {String(Math.floor(current.start+current.duration)).padStart(2,"0")}:{current.duration%1?"30":"00"}</small></p></div></section><section><label>LOCAL</label><div><span>⌖</span><p><b>{current.location}</b><small>Adicionar link ou endereço</small></p></div></section><section><label>RESPONSÁVEL</label><div><i>{current.owner.split(" ").map((p)=>p[0]).join("")}</i><p><b>{current.owner}</b><small>Equipe comercial</small></p><button>⌄</button></div></section><section><label>OBSERVAÇÕES</label><p className="event-notes">{current.notes}</p></section><section><label>LEMBRETES</label><button className="reminder">◉ 15 minutos antes <i>×</i></button></section></div><footer><button onClick={()=>toggleDone(current.id)} className={current.done?"completed":""}>{current.done?"✓ Concluída":"○ Marcar como concluída"}</button><button>Editar</button></footer></>}
    </aside>

    {createOpen&&<div className="event-modal" role="dialog" aria-modal="true" aria-label="Novo compromisso"><form onSubmit={addEvent}><header><div><small>NOVO ITEM</small><h2>Criar compromisso</h2></div><button type="button" onClick={()=>setCreateOpen(false)}>×</button></header><div className="event-type-switch">{["Tarefa","Reunião","Ligação","Demonstração"].map((type)=><label key={type}><input type="radio" name="type" value={type} defaultChecked={type==="Reunião"}/><span>{type}</span></label>)}</div><label>Título<input name="title" required autoFocus placeholder="Ex.: Demonstração da plataforma"/></label><div className="event-form-row"><label>Data<select name="day" defaultValue="27"><option value="27">27 ago — Hoje</option><option value="28">28 ago — Amanhã</option><option value="29">29 ago — Sábado</option></select></label><label>Horário<input name="time" type="time" defaultValue="10:00"/></label><label>Duração<select name="duration" defaultValue="1"><option value="0.5">30 min</option><option value="1">1 hora</option><option value="1.5">1h30</option><option value="2">2 horas</option></select></label></div><div className="event-form-row two"><label>Contato<input name="contact" placeholder="Nome do contato"/></label><label>Empresa<input name="company" placeholder="Nome da empresa"/></label></div><div className="event-form-row two"><label>Responsável<select name="owner"><option>Marina Silva</option><option>Carlos Nunes</option><option>Beatriz Rocha</option></select></label><label>Local<input name="location" placeholder="Google Meet ou endereço"/></label></div><label>Observações<textarea name="notes" rows={3} placeholder="Contexto e objetivo do compromisso"/></label><footer><button type="button" onClick={()=>setCreateOpen(false)}>Cancelar</button><button className="primary" type="submit">Criar compromisso</button></footer></form></div>}
  </main>;
}
