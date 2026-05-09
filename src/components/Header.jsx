import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Header() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [sysSettings, setSysSettings] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);

  useEffect(() => {
    fetchData();
    
    // Realtime para configurações
    const channel = supabase.channel('header-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'system_settings' }, payload => {
        setSysSettings(payload.new);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, payload => {
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user && payload.new.id === user.id) setProfile(payload.new);
        });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(prof);
    }
    const { data: sys } = await supabase.from('system_settings').select('*').eq('id', 1).single();
    setSysSettings(sys);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-end px-6 gap-4 sticky top-0 z-30 shadow-sm">
      
      {/* Botão de Ajuda (?) */}
      <div className="relative">
        <button 
          onClick={() => { setShowHelpMenu(!showHelpMenu); setShowProfileMenu(false); }}
          className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
          title="Ajuda"
        >
          <span className="material-symbols-outlined text-[24px]">help</span>
        </button>

        {showHelpMenu && sysSettings && (
          <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl p-6 animate-in slide-in-from-top-2 duration-200">
            <h3 className="text-label-bold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">support</span>
              Central de Ajuda
            </h3>
            <div className="space-y-4">
              {sysSettings.help_text && (
                <p className="text-body-md font-bold text-on-surface">{sysSettings.help_text}</p>
              )}
              {sysSettings.help_email && (
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  <a href={`mailto:${sysSettings.help_email}`} className="text-body-sm hover:underline">{sysSettings.help_email}</a>
                </div>
              )}
              {sysSettings.help_phone && (
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span className="text-body-sm">{sysSettings.help_phone}</span>
                </div>
              )}
              {sysSettings.help_website && (
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">language</span>
                  <a href={sysSettings.help_website} target="_blank" rel="noreferrer" className="text-body-sm hover:underline">Visitar Website</a>
                </div>
              )}
              {!sysSettings.help_text && !sysSettings.help_email && (
                <p className="text-body-sm italic text-on-surface-variant">Nenhuma informação de ajuda cadastrada.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Menu do Perfil */}
      <div className="relative">
        <button 
          onClick={() => { setShowProfileMenu(!showProfileMenu); setShowHelpMenu(false); }}
          className="flex items-center gap-3 hover:bg-surface-container-high px-3 py-1.5 rounded-full transition-all border border-transparent hover:border-outline-variant"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 overflow-hidden border border-primary/20">
            {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-primary">{profile?.name?.charAt(0)}</div>}
          </div>
          <span className="text-body-sm font-bold text-on-surface hidden md:block">{profile?.name}</span>
          <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
        </button>

        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
            <div className="p-4 bg-surface-container-low flex flex-col items-center border-b border-outline-variant">
              <div className="w-16 h-16 rounded-full bg-primary/20 overflow-hidden mb-2 border-2 border-primary shadow-sm">
                {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-primary text-2xl">{profile?.name?.charAt(0)}</div>}
              </div>
              <p className="text-body-sm font-bold text-on-surface">{profile?.name}</p>
              <p className="text-[10px] uppercase font-bold text-primary">{profile?.role}</p>
            </div>
            <div className="p-2">
              <Link to="/configuracoes" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low rounded-xl text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined text-[20px]">person</span>
                <span className="text-body-md">Meu Perfil</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-error-container hover:text-on-error-container rounded-xl text-error transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span className="text-body-md font-bold">Sair do Sistema</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
