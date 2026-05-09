import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import MetricCard from '../components/MetricCard';
import TicketFilters from '../components/TicketFilters';
import TicketTable from '../components/TicketTable';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [techs, setTechs] = useState([]); // Lista de técnicos/admins
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [metrics, setMetrics] = useState({ abertos: 0, atendimento: 0, aguardando: 0, concluidos: 0 });

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setUserProfile(prof);
    }
    
    await Promise.all([
      fetchTickets(),
      fetchStatuses(),
      fetchTechs()
    ]);
    setLoading(false);
  }

  async function fetchStatuses() {
    const { data } = await supabase.from('ticket_status').select('*').order('name');
    setStatuses(data || []);
  }

  async function fetchTechs() {
    // Filtrar apenas usuários que são admin ou tech para atribuição
    const { data } = await supabase
      .from('profiles')
      .select('id, name, role')
      .in('role', ['admin', 'tech'])
      .order('name');
    setTechs(data || []);
  }

  async function fetchTickets() {
    const { data, error } = await supabase
      .from('tickets')
      .select('*, ticket_categories(name), ticket_status(name), profiles:created_by(name)')
      .order('created_at', { ascending: false });

    if (!error) {
      setTickets(data || []);
      setFilteredTickets(data || []);
      calculateMetrics(data || []);
    }
  }

  function calculateMetrics(ticketList) {
    setMetrics({
      abertos: ticketList.filter(t => t.ticket_status?.name === 'Novo').length,
      atendimento: ticketList.filter(t => t.ticket_status?.name === 'Em Atendimento').length,
      aguardando: ticketList.filter(t => t.ticket_status?.name === 'Aguardando Peças').length,
      concluidos: ticketList.filter(t => t.ticket_status?.name === 'Finalizado').length
    });
  }

  const handleSearch = (term) => {
    const filtered = tickets.filter(t => 
      t.title.toLowerCase().includes(term.toLowerCase()) || 
      t.profiles?.name?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredTickets(filtered);
  };

  const handleFilterStatus = (statusId) => {
    if (statusId === 'all') setFilteredTickets(tickets);
    else setFilteredTickets(tickets.filter(t => t.status_id === statusId));
  };

  const handleEdit = (ticket) => {
    setSelectedTicket({ ...ticket });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir este chamado permanentemente?')) return;
    const { error } = await supabase.from('tickets').delete().eq('id', id);
    if (!error) fetchTickets();
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('tickets').update({
      status_id: selectedTicket.status_id,
      priority: selectedTicket.priority,
      assigned_to: selectedTicket.assigned_to,
      resolution: selectedTicket.resolution,
      updated_at: new Date()
    }).eq('id', selectedTicket.id);

    if (!error) {
      setIsEditModalOpen(false);
      fetchTickets();
    }
    setSaving(false);
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-6">
        <MetricCard title="Abertos" icon="inbox" iconColor="text-primary" value={metrics.abertos.toString()} />
        <MetricCard title="Em Atendimento" icon="support_agent" iconColor="text-secondary" value={metrics.atendimento.toString()} />
        <MetricCard title="Pendentes" icon="inventory" iconColor="text-tertiary" value={metrics.aguardando.toString()} />
        <MetricCard title="Concluídos" icon="check_circle" iconColor="text-tertiary-container" value={metrics.concluidos.toString()} />
      </div>

      <TicketFilters onSearch={handleSearch} onFilterStatus={handleFilterStatus} statuses={statuses} />
      
      <TicketTable 
        tickets={filteredTickets} 
        loading={loading} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {/* Modal de Edição */}
      {isEditModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-outline-variant max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-headline-md font-bold text-primary">Gerenciar Chamado</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="hover:bg-surface-container-high p-1 rounded-full"><span className="material-symbols-outlined">close</span></button>
            </div>
            
            <form onSubmit={handleUpdateTicket} className="space-y-6">
              <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/50">
                <p className="text-[10px] uppercase font-bold text-primary tracking-widest mb-1">Informações Básicas</p>
                <h3 className="text-xl font-bold text-on-surface mb-2">{selectedTicket.title}</h3>
                <p className="text-body-md text-on-surface-variant bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30">{selectedTicket.description}</p>
                <p className="text-[10px] text-on-surface-variant mt-3 italic">Aberto por: {selectedTicket.profiles?.name} em {new Date(selectedTicket.created_at).toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prioridade - Bloqueada para Suporte (Tech) */}
                <div>
                  <label className="block text-label-bold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">priority_high</span>
                    Prioridade
                  </label>
                  <select 
                    disabled={!isAdmin}
                    value={selectedTicket.priority} 
                    onChange={e => setSelectedTicket({...selectedTicket, priority: e.target.value})} 
                    className={`w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2.5 ${!isAdmin ? 'opacity-60 cursor-not-allowed bg-surface-container-high' : ''}`}
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                  {!isAdmin && <p className="text-[10px] text-error mt-1 italic">* Somente administradores podem alterar a prioridade.</p>}
                </div>

                {/* Status - Liberado para todos (Suporte/Admin) */}
                <div>
                  <label className="block text-label-bold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">update</span>
                    Status Atual
                  </label>
                  <select 
                    value={selectedTicket.status_id || ''} 
                    onChange={e => setSelectedTicket({...selectedTicket, status_id: e.target.value})} 
                    className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2.5"
                  >
                    {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                {/* Atribuído a - Filtrado por técnicos/admins */}
                <div className="md:col-span-2">
                  <label className="block text-label-bold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">person_check</span>
                    Atribuir a um Técnico
                  </label>
                  <select 
                    value={selectedTicket.assigned_to || ''} 
                    onChange={e => setSelectedTicket({...selectedTicket, assigned_to: e.target.value})} 
                    className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2.5"
                  >
                    <option value="">Não atribuído</option>
                    {techs.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.role === 'admin' ? 'Admin' : 'Suporte'})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-label-bold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                  Resolução / Observações Técnicas
                </label>
                <textarea 
                  rows="4" 
                  value={selectedTicket.resolution || ''} 
                  onChange={e => setSelectedTicket({...selectedTicket, resolution: e.target.value})} 
                  className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2.5" 
                  placeholder="Descreva as ações realizadas..." 
                />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-outline-variant">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="font-bold px-6">Cancelar</button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="bg-primary text-on-primary px-10 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Atualizar Chamado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
