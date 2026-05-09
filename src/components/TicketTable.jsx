import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TicketTable({ tickets = [], loading = false, onEdit, onDelete }) {
  const [userRole, setUserRole] = useState('client');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('profiles').select('role').eq('id', user.id).single()
          .then(({ data }) => setUserRole(data?.role || 'client'));
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Crítica': return 'keyboard_double_arrow_up';
      case 'Alta': return 'keyboard_double_arrow_up';
      case 'Média': return 'keyboard_arrow_up';
      default: return 'keyboard_arrow_down';
    }
  };

  const getStatusStyle = (statusName) => {
    switch (statusName) {
      case 'Novo': return 'bg-error-container text-on-error-container';
      case 'Em Atendimento': return 'bg-secondary-container text-secondary';
      case 'Aguardando Peças': return 'bg-surface-container-high text-on-surface-variant border-outline-variant border';
      case 'Finalizado': return 'bg-tertiary-container text-on-tertiary-container';
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant text-label-caps font-bold">
              <th className="py-4 px-6">Ticket</th>
              <th className="py-4 px-6">Assunto / Usuário</th>
              <th className="py-4 px-6">Categoria</th>
              <th className="py-4 px-6">Prioridade</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-body-md text-on-surface">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-on-surface-variant italic">
                  Nenhum chamado encontrado para esta busca.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  className="border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer"
                  onClick={() => onEdit && onEdit(ticket)}
                >
                  <td className="py-4 px-6 font-mono text-[11px] text-on-surface-variant">
                    #{ticket.id.substring(0, 8).toUpperCase()}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold">{ticket.title}</p>
                    <p className="text-[10px] text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">person</span>
                      {ticket.profiles?.name || 'Sistema'}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold border bg-surface-container-low border-outline-variant">
                      {ticket.ticket_categories?.name || 'Geral'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">{getPriorityIcon(ticket.priority)}</span>
                      <span className="text-[11px] font-bold">{ticket.priority}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(ticket.ticket_status?.name)}`}>
                      {ticket.ticket_status?.name?.toUpperCase() || 'ABERTO'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEdit && onEdit(ticket); }}
                        className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors" 
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      
                      {userRole === 'admin' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDelete && onDelete(ticket.id); }}
                          className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
