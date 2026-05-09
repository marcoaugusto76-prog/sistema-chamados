
export default function TicketTable() {
  const tickets = [
    {
      id: '#TK-8921',
      subject: 'Falha de conexão no switch principal',
      category: 'Informática/TI',
      categoryColor: 'bg-secondary-container/30 text-secondary border-secondary-container',
      priority: 'Alta',
      priorityIcon: 'keyboard_double_arrow_up',
      priorityColor: 'text-error',
      status: 'Novo',
      statusColor: 'bg-error-container text-on-error-container',
      assignable: true
    },
    {
      id: '#TK-8915',
      subject: 'Ar condicionado vazando no CPD',
      category: 'Predial/Civil',
      categoryColor: 'bg-tertiary-container/20 text-tertiary-container border-tertiary-container/30',
      priority: 'Crítica',
      priorityIcon: 'keyboard_double_arrow_up',
      priorityColor: 'text-error',
      status: 'Em Atendimento',
      statusColor: 'bg-secondary-container text-secondary',
      assignable: false
    },
    {
      id: '#TK-8902',
      subject: 'Câmera portão sul inoperante',
      category: 'Segurança Eletrônica',
      categoryColor: 'bg-surface-tint/20 text-surface-tint border-surface-tint/30',
      priority: 'Média',
      priorityIcon: 'keyboard_arrow_up',
      priorityColor: 'text-on-surface-variant',
      status: 'Aguardando Peças',
      statusColor: 'bg-surface-container-high text-on-surface-variant border-outline-variant',
      assignable: false
    }
  ];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT overflow-hidden">
      <div className="px-card-gap py-4 border-b border-surface-variant flex justify-between items-center bg-surface-bright">
        <h2 className="text-headline-md font-headline-md text-on-surface">Fila de Atendimento</h2>
        <button className="text-primary text-body-sm font-body-sm flex items-center gap-1 hover:underline">
          Ver todos <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-variant bg-surface-container-lowest text-on-surface-variant text-label-caps font-label-caps">
              <th className="py-3 px-card-gap font-semibold">ID/Ticket</th>
              <th className="py-3 px-card-gap font-semibold">Assunto</th>
              <th className="py-3 px-card-gap font-semibold">Categoria</th>
              <th className="py-3 px-card-gap font-semibold">Prioridade</th>
              <th className="py-3 px-card-gap font-semibold">Status</th>
              <th className="py-3 px-card-gap font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-body-md font-body-md text-on-surface">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b border-surface-variant hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-card-gap font-mono text-body-sm text-on-surface-variant">{ticket.id}</td>
                <td className="py-4 px-card-gap font-medium">{ticket.subject}</td>
                <td className="py-4 px-card-gap">
                  <span className={`inline-block px-2 py-1 rounded-full text-badge font-badge border ${ticket.categoryColor}`}>
                    {ticket.category}
                  </span>
                </td>
                <td className="py-4 px-card-gap">
                  <div className={`flex items-center gap-1 ${ticket.priorityColor}`}>
                    <span className="material-symbols-outlined text-[18px]">{ticket.priorityIcon}</span>
                    <span className="text-body-sm font-medium">{ticket.priority}</span>
                  </div>
                </td>
                <td className="py-4 px-card-gap">
                  <span className={`inline-block px-3 py-1 rounded-full text-badge font-badge ${ticket.statusColor} ${ticket.statusColor.includes('border') ? '' : ''}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="py-4 px-card-gap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-primary hover:bg-primary-container/10 p-1 rounded transition-colors" title="Visualizar">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    {ticket.assignable ? (
                      <button className="text-primary hover:bg-primary-container/10 p-1 rounded transition-colors" title="Atribuir">
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                      </button>
                    ) : (
                      <button className="text-outline-variant cursor-not-allowed p-1 rounded transition-colors" title="Atribuído">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
