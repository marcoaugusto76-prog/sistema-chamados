import MetricCard from '../components/MetricCard';
import FilterButtons from '../components/FilterButtons';
import TicketTable from '../components/TicketTable';

export default function Dashboard() {
  return (
    <>
      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-6">
        <MetricCard 
          title="Chamados Abertos" 
          icon="inbox" 
          iconColor="text-primary" 
          value="124" 
          statIcon="trending_up" 
          statText="+12 hoje" 
          statColor="text-error" 
        />
        <MetricCard 
          title="Em Atendimento" 
          icon="support_agent" 
          iconColor="text-secondary" 
          value="45" 
          statText="Tempo médio: 45m" 
          statColor="text-on-surface-variant" 
        />
        <MetricCard 
          title="Aguardando Peças" 
          icon="inventory" 
          iconColor="text-tertiary-container" 
          value="18" 
          statIcon="warning" 
          statText="3 urgentes" 
          statColor="text-tertiary-container" 
        />
        <MetricCard 
          title="Concluídos Hoje" 
          icon="check_circle" 
          iconColor="text-on-tertiary-container" 
          value="82" 
          statIcon="trending_up" 
          statText="+5% vs ontem" 
          statColor="text-on-tertiary-container" 
        />
      </div>

      <FilterButtons />
      <TicketTable />
    </>
  );
}
