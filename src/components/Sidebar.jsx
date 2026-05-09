import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ isOpen, closeSidebar }) {
  const location = useLocation();

  return (
    <nav className={`bg-surface-container-lowest border-r border-outline-variant fixed left-0 top-0 h-full w-sidebar-width flex flex-col py-6 transition-transform duration-300 z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex`}>
      <div className="px-container-padding mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-headline-md text-headline-md">H</div>
          <div>
            <h1 className="text-headline-md font-headline-md font-bold text-primary">HelpDesk Pro</h1>
            <p className="text-label-caps font-label-caps text-on-surface-variant">Gestão de Atendimento</p>
          </div>
        </div>
      </div>
      <div className="px-4 mb-6">
        <Link 
          to="/novo-chamado" 
          onClick={closeSidebar}
          className="w-full bg-primary-container text-on-primary py-2 px-4 rounded-DEFAULT flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          <span className="font-label-caps text-label-caps">+ Novo Chamado</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Link 
          to="/" 
          onClick={closeSidebar}
          className={`flex items-center gap-3 px-4 py-3 mb-1 transition-all ${
            location.pathname === '/' 
              ? 'bg-secondary-container/10 text-primary border-l-4 border-primary font-semibold opacity-80'
              : 'text-on-surface-variant hover:bg-surface-container-low border-l-4 border-transparent'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          <span className="font-body-md text-body-md">Painel Geral</span>
        </Link>
        <Link 
          to="/meus-chamados"
          onClick={closeSidebar}
          className={`flex items-center gap-3 px-4 py-3 mb-1 transition-all ${
            location.pathname === '/meus-chamados'
              ? 'bg-secondary-container/10 text-primary border-l-4 border-primary font-semibold opacity-80'
              : 'text-on-surface-variant hover:bg-surface-container-low border-l-4 border-transparent'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
          <span className="font-body-md text-body-md">Meus Chamados</span>
        </Link>
        <Link 
          to="/relatorios"
          onClick={closeSidebar}
          className={`flex items-center gap-3 px-4 py-3 mb-1 transition-all ${
             location.pathname === '/relatorios'
              ? 'bg-secondary-container/10 text-primary border-l-4 border-primary font-semibold opacity-80'
              : 'text-on-surface-variant hover:bg-surface-container-low border-l-4 border-transparent'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">analytics</span>
          <span className="font-body-md text-body-md">Relatórios</span>
        </Link>
        <Link 
          to="/inventario"
          onClick={closeSidebar}
          className={`flex items-center gap-3 px-4 py-3 mb-1 transition-all ${
             location.pathname === '/inventario'
              ? 'bg-secondary-container/10 text-primary border-l-4 border-primary font-semibold opacity-80'
              : 'text-on-surface-variant hover:bg-surface-container-low border-l-4 border-transparent'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          <span className="font-body-md text-body-md">Inventário</span>
        </Link>
        <Link 
          to="/configuracoes"
          onClick={closeSidebar}
          className={`flex items-center gap-3 px-4 py-3 mb-1 transition-all ${
             location.pathname === '/configuracoes'
              ? 'bg-secondary-container/10 text-primary border-l-4 border-primary font-semibold opacity-80'
              : 'text-on-surface-variant hover:bg-surface-container-low border-l-4 border-transparent'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span className="font-body-md text-body-md">Configurações</span>
        </Link>
      </div>
    </nav>
  );
}
