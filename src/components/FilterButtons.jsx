
export default function FilterButtons() {
  const filters = [
    { label: 'Todos', active: true },
    { label: 'Informática/TI', active: false },
    { label: 'Elétrica', active: false },
    { label: 'Predial/Civil', active: false },
    { label: 'Segurança Eletrônica', active: false },
    { label: 'Telecomunicações', active: false }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter, index) => (
        <button 
          key={index} 
          className={`px-4 py-2 rounded-full text-body-sm font-body-sm border transition-colors ${
            filter.active 
              ? 'bg-primary-container text-on-primary border-primary-container hover:bg-opacity-90' 
              : 'bg-transparent text-primary border-outline-variant hover:bg-surface-container-low'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
