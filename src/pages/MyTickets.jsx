import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import TicketFilters from '../components/TicketFilters';
import TicketTable from '../components/TicketTable';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchMyTickets();
    fetchStatuses();
  }, []);

  async function fetchStatuses() {
    const { data } = await supabase.from('ticket_status').select('*').order('name');
    setStatuses(data || []);
  }

  async function fetchMyTickets() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single();
      setUserName(profile?.name || 'Usuário');

      const { data, error } = await supabase
        .from('tickets')
        .select('*, ticket_categories(name), ticket_status(name), profiles:created_by(name)')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (!error) {
        setTickets(data || []);
        setFilteredTickets(data || []);
      }
    }
    setLoading(false);
  }

  const handleSearch = (term) => {
    setFilteredTickets(tickets.filter(t => t.title.toLowerCase().includes(term.toLowerCase())));
  };

  const handleFilterStatus = (statusId) => {
    if (statusId === 'all') setFilteredTickets(tickets);
    else setFilteredTickets(tickets.filter(t => t.status_id === statusId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-headline-lg font-bold text-primary">Meus Chamados</h1>
        <p className="text-on-surface-variant">Olá, <span className="font-bold text-secondary">{userName}</span>. Veja abaixo seus chamados.</p>
      </div>

      <TicketFilters onSearch={handleSearch} onFilterStatus={handleFilterStatus} statuses={statuses} />
      <TicketTable tickets={filteredTickets} loading={loading} />
    </div>
  );
}
