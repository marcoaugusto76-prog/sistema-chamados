import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-surface-container-lowest flex font-body-md">
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      
      <div className="flex-1 flex flex-col md:ml-sidebar-width transition-all duration-300">
        <Header />
        
        <main className="p-container-padding max-w-[1440px] mx-auto w-full flex-1">
          {/* Overlay for mobile sidebar */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" 
              onClick={closeSidebar}
            ></div>
          )}
          
          <Outlet />
        </main>
      </div>
    </div>
  );
}
