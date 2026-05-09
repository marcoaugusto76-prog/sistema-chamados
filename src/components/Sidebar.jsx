import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Sidebar({ isOpen, closeSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sysSettings, setSysSettings] = useState({
    app_title: 'HelpDesk Pro',
    app_subtitle: 'Gestão de Atendimento',
    logo_url: null
  });

  useEffect(() => {
    fetchProfile();
    fetchSystemSettings();
    fetchUnreadCount();
    
    // Listen for Profile Changes
    let profileChannel;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        profileChannel = supabase
          .channel(`profile-${user.id}`)
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, payload => {
            setProfile(payload.new);
          })
          .subscribe();
      }
    });

    // Listen for System Settings Changes
    const sysChannel = supabase
      .channel('sys-settings-sidebar')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'system_settings', filter: 'id=eq.1' }, payload => {
        setSysSettings(payload.new);
      })
      .subscribe();

    // Listen for New Notifications
    const notifyChannel = supabase
      .channel('new-notifications-sidebar')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, () => {
        fetchUnreadCount();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications' }, () => {
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      if (profileChannel) supabase.removeChannel(profileChannel);
      supabase.removeChannel(sysChannel);
      supabase.removeChannel(notifyChannel);
    };
  }, []);

  async function fetchUnreadCount() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      setUnreadCount(count || 0);
    }
  }

  async function fetchSystemSettings() {
    const { data } = await supabase.from('system_settings').select('*').eq('id', 1).single();
    if (data) setSysSettings(data);
  }

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isAdmin = profile?.role === 'admin';
  const isTech = profile?.role === 'tech';

  const menuItems = [
    { to: '/', icon: 'dashboard', label: 'Painel Geral', visible: isAdmin || isTech },
    { to: '/meus-chamados', icon: 'confirmation_number', label: 'Meus Chamados', visible: true },
    { to: '/relatorios', icon: 'monitoring', label: 'Relatórios', visible: isAdmin },
    { to: '/usuarios', icon: 'group', label: 'Usuários', visible: isAdmin },
    { to: '/notificacoes', icon: 'notifications', label: 'Notificações', visible: true, badge: unreadCount },
    { to: '/configuracoes', icon: 'settings', label: 'Configurações', visible: true }
  ];

  return (
    <nav className={`bg-surface-container-lowest border-r border-outline-variant fixed left-0 top-0 h-full w-sidebar-width flex flex-col py-6 transition-transform duration-300 z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex shadow-xl`}>
      <div className="px-container-padding mb-8">
        <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
           {sysSettings.logo_url ? (
             <img src={sysSettings.logo_url} alt="Logo" className="max-h-20 w-auto mb-4 object-contain" />
           ) : (
             <div className="w-16 h-16 rounded-2xl bg-primary shadow-lg flex items-center justify-center text-on-primary font-bold text-4xl mb-4">
               {sysSettings.app_title?.charAt(0) || 'H'}
             </div>
           )}
           <div className="text-center overflow-hidden w-full">
             <h1 className="text-headline-sm font-bold text-primary truncate px-2">{sysSettings.app_title}</h1>
             <p className="text-[10px] uppercase tracking-[2px] text-on-surface-variant font-bold mt-1">{sysSettings.app_subtitle}</p>
           </div>
        </div>
      </div>
      
      <div className="px-4 mb-6">
        <Link 
          to="/novo-chamado" 
          onClick={closeSidebar}
          className="w-full bg-primary text-on-primary py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span className="font-bold tracking-wider text-sm">NOVO CHAMADO</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {menuItems.filter(item => item.visible).map((item) => (
          <Link 
            key={item.to}
            to={item.to} 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${location.pathname === item.to ? 'bg-primary/10 text-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            <span className="text-body-md">{item.label}</span>
            {item.badge > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-error text-on-error text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="px-4 mt-auto mb-6">
        <div className="bg-surface-container-high/50 p-4 rounded-2xl border border-outline-variant/30 shadow-sm relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 overflow-hidden border-2 border-primary shadow-sm flex-shrink-0">
               {profile?.avatar_url ? (
                 <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-primary text-on-primary text-lg font-bold">
                   {profile?.name?.charAt(0) || 'U'}
                 </div>
               )}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5 truncate">
                {profile?.title || profile?.role?.toUpperCase() || 'USUÁRIO'}
              </p>
              <p className="text-body-sm font-bold text-on-surface truncate">
                {profile?.name || 'Usuário'}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="absolute top-2 right-2 text-on-surface-variant hover:text-error transition-colors p-1">
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
