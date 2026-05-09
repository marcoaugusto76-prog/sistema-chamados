import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Reports() {
  const [data, setData] = useState({
    avgResolutionTime: 0,
    byCategory: [],
    byPriority: [],
    byStatus: [],
    totalTickets: 0,
    closedTickets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  async function fetchReportData() {
    setLoading(true);
    
    // 1. Total de Tickets
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*, ticket_categories(name), ticket_status(name)');

    if (error) {
      console.error(error);
      return;
    }

    // 2. Processar Métricas
    const total = tickets.length;
    const closed = tickets.filter(t => t.closed_at).length;

    // Tempo médio de resolução (em horas)
    let totalHours = 0;
    tickets.forEach(t => {
      if (t.closed_at && t.created_at) {
        const diff = new Date(t.closed_at) - new Date(t.created_at);
        totalHours += diff / (1000 * 60 * 60);
      }
    });
    const avgTime = closed > 0 ? (totalHours / closed).toFixed(1) : 0;

    // Agrupar por categoria
    const catMap = {};
    tickets.forEach(t => {
      const name = t.ticket_categories?.name || 'Geral';
      catMap[name] = (catMap[name] || 0) + 1;
    });
    const byCategory = Object.entries(catMap).map(([name, count]) => ({ name, count }));

    // Agrupar por prioridade
    const prioMap = {};
    tickets.forEach(t => {
      prioMap[t.priority] = (prioMap[t.priority] || 0) + 1;
    });
    const byPriority = Object.entries(prioMap).map(([name, count]) => ({ name, count }));

    setData({
      avgResolutionTime: avgTime,
      totalTickets: total,
      closedTickets: closed,
      byCategory,
      byPriority
    });
    setLoading(false);
  }

  if (loading) return <div className="p-8 text-center font-bold text-primary">Gerando relatórios estratégicos...</div>;

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-headline-lg font-bold text-primary">Relatórios de Performance</h1>
        <p className="text-on-surface-variant">Análise detalhada da eficiência do HelpDesk</p>
      </header>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl shadow-sm">
          <p className="text-label-caps text-primary font-bold">Tempo Médio de Resolução</p>
          <h2 className="text-4xl font-bold text-primary mt-2">{data.avgResolutionTime} <span className="text-lg">horas</span></h2>
          <p className="text-[10px] text-on-surface-variant mt-2 italic">* Calculado para chamados finalizados</p>
        </div>
        <div className="bg-secondary/10 border border-secondary/20 p-6 rounded-2xl shadow-sm">
          <p className="text-label-caps text-secondary font-bold">Taxa de Conclusão</p>
          <h2 className="text-4xl font-bold text-secondary mt-2">
            {data.totalTickets > 0 ? ((data.closedTickets / data.totalTickets) * 100).toFixed(0) : 0}%
          </h2>
          <p className="text-[10px] text-on-surface-variant mt-2 italic">{data.closedTickets} de {data.totalTickets} chamados fechados</p>
        </div>
        <div className="bg-tertiary-container/10 border border-tertiary-container/20 p-6 rounded-2xl shadow-sm">
          <p className="text-label-caps text-tertiary-container font-bold">Volume Total</p>
          <h2 className="text-4xl font-bold text-tertiary-container mt-2">{data.totalTickets}</h2>
          <p className="text-[10px] text-on-surface-variant mt-2 italic">Chamados abertos no sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribuição por Categoria */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
          <h3 className="text-headline-sm font-bold text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">category</span>
            Chamados por Categoria
          </h3>
          <div className="space-y-4">
            {data.byCategory.map(cat => (
              <div key={cat.name}>
                <div className="flex justify-between text-body-sm font-bold mb-1">
                  <span>{cat.name}</span>
                  <span>{cat.count}</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${(cat.count / data.totalTickets) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribuição por Prioridade */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
          <h3 className="text-headline-sm font-bold text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">priority_high</span>
            Impacto por Prioridade
          </h3>
          <div className="space-y-4">
            {data.byPriority.map(prio => (
              <div key={prio.name}>
                <div className="flex justify-between text-body-sm font-bold mb-1">
                  <span>{prio.name}</span>
                  <span>{prio.count}</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      prio.name === 'Crítica' || prio.name === 'Alta' ? 'bg-error' : 'bg-secondary'
                    }`} 
                    style={{ width: `${(prio.count / data.totalTickets) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
