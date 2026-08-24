import { DashboardSidebar } from "./DashboardSidebar";
import "./dashboard.css";

const columns = [
  { name: "Novos leads", count: 12, value: "R$ 46.800", cards: [["Clínica Aurora","R$ 4.800","WhatsApp","Alta intenção"],["Estúdio Sabiá","R$ 2.900","Instagram","Novo"],["Casa Leve","R$ 6.200","Site","Aguardando"]] },
  { name: "Em contato", count: 9, value: "R$ 52.300", cards: [["Vitta Saúde","R$ 7.200","WhatsApp","Responder hoje"],["Rafael Imóveis","R$ 8.400","Instagram","Reunião 14h"],["Lumina Estética","R$ 3.800","Indicação","Follow-up"]] },
  { name: "Qualificados", count: 8, value: "R$ 71.500", cards: [["Imobiliária Norte","R$ 12.500","Formulário","Demo marcada"],["Órbita Tech","R$ 18.000","WhatsApp","Decisor envolvido"],["Colégio Prisma","R$ 9.600","Site","Proposta pedida"]] },
  { name: "Proposta", count: 5, value: "R$ 64.900", cards: [["Casa Nativa","R$ 15.600","Indicação","85% de chance"],["Grupo Atlas","R$ 22.000","WhatsApp","Negociação"],["Bela Forma","R$ 7.400","Instagram","Proposta enviada"]] },
];

export default function Dashboard() {
  return (
    <main className="dash">
      <DashboardSidebar active="pipeline" />
      <section className="dash-main">
        <header><div><small>Espaço de trabalho / Comercial</small><h1>Pipeline de vendas</h1></div><div className="dash-actions"><button>⌕ Buscar</button><button>Filtrar</button><button className="primary">+ Novo lead</button></div></header>
        <div className="dash-stats">
          <article><span>Valor do pipeline</span><b>R$ 284.500</b><small>↑ 12,8% este mês</small></article>
          <article><span>Negócios ativos</span><b>48</b><small>↑ 6 esta semana</small></article>
          <article><span>Conversão</span><b>28,4%</b><small>↑ 4,2% este mês</small></article>
          <article><span>Ticket médio</span><b>R$ 5.927</b><small>↑ 8,1% este mês</small></article>
        </div>
        <div className="dash-board">
          {columns.map((column) => <article className="dash-col" key={column.name}>
            <header><div><b>{column.name}</b><i>{column.count}</i></div><small>{column.value}</small></header>
            {column.cards.map((card, index) => <div className="dash-card" key={card[0]}>
              <div><i>{card[0][0]}</i><small>{card[2]}</small><button aria-label="Mais opções">•••</button></div>
              <b>{card[0]}</b><strong>{card[1]}</strong><span className={index === 0 ? "hot" : ""}>✦ {card[3]}</span>
              <footer><small>◷ Hoje</small><em>{["MS","CL","AR"][index]}</em></footer>
            </div>)}
          </article>)}
        </div>
      </section>
      <aside className="dash-ai"><header><span>✦</span><div><b>NOIRA IA</b><small>Online agora</small></div><button>×</button></header><div className="ai-welcome"><span>✦</span><h3>Bom dia, Marina!</h3><p>Analisei seu pipeline e encontrei 3 oportunidades que merecem atenção.</p></div><div className="ai-insight"><b>Prioridade agora</b><p><strong>Clínica Aurora</strong> demonstrou alta intenção e aguarda resposta há 8 minutos.</p><button>Gerar resposta →</button></div><div className="ai-insight"><b>Próxima ação</b><p>A proposta da <strong>Casa Nativa</strong> vence amanhã. Quer que eu prepare um follow-up?</p><button>Criar follow-up →</button></div><form><input placeholder="Pergunte à NOIRA..."/><button>↑</button></form></aside>
    </main>
  );
}
