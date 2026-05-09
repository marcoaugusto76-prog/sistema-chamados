import { useState } from 'react';

export default function TicketFilters({ onSearch, onFilterStatus, statuses = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
      {/* Barra de Pesquisa */}
      <div className="relative flex-1 w-full">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Buscar chamados por título ou usuário..."
          className="w-full bg-surface-container-low border border-outline rounded-xl pl-10 pr-4 py-3 text-body-md focus:outline-none focus:border-primary transition-all"
        />
        <button 
          onClick={() => onSearch(searchTerm)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-on-primary px-3 py-1 rounded-lg text-xs font-bold hover:opacity-90"
        >
          BUSCAR
        </button>
      </div>

      {/* Filtro por Status (Combo Box) */}
      <div className="w-full md:w-64 relative">
        <select 
          onChange={(e) => onFilterStatus(e.target.value)}
          className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-3 text-body-md appearance-none focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="all">Todos os Status</option>
          {statuses.map(status => (
            <option key={status.id} value={status.id}>{status.name}</option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
      </div>
    </div>
  );
}
