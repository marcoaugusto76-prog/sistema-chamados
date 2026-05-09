import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-background text-on-background font-body-md text-body-md h-screen flex overflow-hidden">
      <Sidebar isOpen={isMobileMenuOpen} closeSidebar={() => setIsMobileMenuOpen(false)} />
      
      {/* Overlay para fechar o menu no mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-[260px] h-full overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        {/* Scrollable Canvas que injetará as páginas baseadas na rota */}
        <main className="flex-1 overflow-y-auto p-container-padding bg-background">
          <div className="max-w-7xl mx-auto space-y-container-padding">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
