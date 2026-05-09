import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('perfil');
  const [profile, setProfile] = useState({ name: '', phone: '', title: '', avatar_url: '', role: '' });
  const [sysSettings, setSysSettings] = useState({ 
    app_title: '', app_subtitle: '', logo_url: '',
    help_text: '', help_email: '', help_phone: '', help_website: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [confirmAuth, setConfirmAuth] = useState({ email: '', password: '' });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profData) {
        setProfile(profData);
        setConfirmAuth(prev => ({ ...prev, email: user.email }));
      }

      if (profData?.role === 'admin') {
        const { data: sysData } = await supabase.from('system_settings').select('*').eq('id', 1).single();
        if (sysData) setSysSettings(sysData);
      }
    }
    setLoading(false);
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('profiles').update({
      name: profile.name, phone: profile.phone, title: profile.title, avatar_url: profile.avatar_url, updated_at: new Date()
    }).eq('id', user.id);
    alert('Perfil atualizado!');
    setSaving(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return alert('Senhas não coincidem!');
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.new });
    if (error) alert(error.message);
    else { alert('Senha alterada!'); setPasswords({ new: '', confirm: '' }); }
    setSaving(false);
  };

  const handleSaveSys = async (e) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('system_settings').update({
      app_title: sysSettings.app_title, 
      app_subtitle: sysSettings.app_subtitle, 
      logo_url: sysSettings.logo_url,
      help_text: sysSettings.help_text,
      help_email: sysSettings.help_email,
      help_phone: sysSettings.help_phone,
      help_website: sysSettings.help_website,
      updated_at: new Date()
    }).eq('id', 1);
    alert('Configurações atualizadas!');
    setSaving(false);
  };

  const handleBulkDelete = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: confirmAuth.email,
      password: confirmAuth.password,
    });
    if (authError) alert('Senha incorreta!');
    else {
      await supabase.from('tickets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      alert('Todos os chamados foram excluídos!');
      setIsBulkDeleteModalOpen(false);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center text-primary font-bold">Carregando...</div>;

  const isAdmin = profile.role === 'admin';

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <header><h1 className="text-headline-lg font-bold text-primary">Configurações</h1></header>

      <div className="flex border-b border-outline-variant gap-8 overflow-x-auto">
        <button onClick={() => setActiveTab('perfil')} className={`pb-4 px-2 whitespace-nowrap font-bold transition-all border-b-2 ${activeTab === 'perfil' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'}`}>Perfil</button>
        <button onClick={() => setActiveTab('seguranca')} className={`pb-4 px-2 whitespace-nowrap font-bold transition-all border-b-2 ${activeTab === 'seguranca' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'}`}>Segurança</button>
        {isAdmin && (
          <>
            <button onClick={() => setActiveTab('sistema')} className={`pb-4 px-2 whitespace-nowrap font-bold transition-all border-b-2 ${activeTab === 'sistema' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'}`}>Sistema & Ajuda</button>
            <button onClick={() => setActiveTab('chamados')} className={`pb-4 px-2 whitespace-nowrap font-bold transition-all border-b-2 ${activeTab === 'chamados' ? 'border-error text-error' : 'border-transparent text-on-surface-variant'}`}>Gestão de Chamados</button>
          </>
        )}
      </div>

      <div className="mt-8">
        {activeTab === 'perfil' && (
          <form onSubmit={handleSaveProfile} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-sm">
                  {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-primary text-on-primary text-4xl">{profile.name?.charAt(0)}</div>}
                </div>
              </div>
              <div className="md:col-span-2"><label className="block text-label-bold mb-1">URL da Foto</label><input type="url" value={profile.avatar_url || ''} onChange={e => setProfile({...profile, avatar_url: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" /></div>
              <div><label className="block text-label-bold mb-1">Nome</label><input type="text" required value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" /></div>
              <div><label className="block text-label-bold mb-1">Cargo</label><input type="text" value={profile.title || ''} onChange={e => setProfile({...profile, title: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" /></div>
              <div><label className="block text-label-bold mb-1">Telefone</label><input type="text" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" /></div>
            </div>
            <div className="flex justify-end"><button type="submit" disabled={saving} className="bg-primary text-on-primary px-8 py-2 rounded-xl font-bold">Salvar Perfil</button></div>
          </form>
        )}

        {activeTab === 'seguranca' && (
          <form onSubmit={handleUpdatePassword} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 space-y-6 max-w-md mx-auto">
            <div><label className="block text-label-bold mb-1">Nova Senha</label><input type="password" required value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" /></div>
            <div><label className="block text-label-bold mb-1">Confirmar Senha</label><input type="password" required value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" /></div>
            <div className="flex justify-center"><button type="submit" disabled={saving} className="bg-primary text-on-primary px-10 py-2 rounded-xl font-bold">Atualizar Senha</button></div>
          </form>
        )}

        {activeTab === 'sistema' && isAdmin && (
          <form onSubmit={handleSaveSys} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 border-b border-outline-variant pb-2"><h3 className="font-bold text-primary">Marca e Visual</h3></div>
              <div><label className="block text-label-bold mb-1">Título</label><input type="text" required value={sysSettings.app_title} onChange={e => setSysSettings({...sysSettings, app_title: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" /></div>
              <div><label className="block text-label-bold mb-1">Slogan</label><input type="text" required value={sysSettings.app_subtitle} onChange={e => setSysSettings({...sysSettings, app_subtitle: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" /></div>
              <div className="md:col-span-2"><label className="block text-label-bold mb-1">URL Logo</label><input type="url" value={sysSettings.logo_url || ''} onChange={e => setSysSettings({...sysSettings, logo_url: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" /></div>
              
              <div className="md:col-span-2 border-b border-outline-variant pb-2 pt-4"><h3 className="font-bold text-primary">Central de Ajuda (Conteúdo do ?)</h3></div>
              <div>
                <label className="block text-label-bold mb-1">Texto Curto (máx 20 caracteres)</label>
                <input type="text" maxLength={20} value={sysSettings.help_text || ''} onChange={e => setSysSettings({...sysSettings, help_text: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" placeholder="Ex: Suporte Local" />
              </div>
              <div>
                <label className="block text-label-bold mb-1">E-mail de Ajuda</label>
                <input type="email" value={sysSettings.help_email || ''} onChange={e => setSysSettings({...sysSettings, help_email: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" placeholder="suporte@email.com" />
              </div>
              <div>
                <label className="block text-label-bold mb-1">Telefone de Ajuda</label>
                <input type="text" value={sysSettings.help_phone || ''} onChange={e => setSysSettings({...sysSettings, help_phone: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" placeholder="(00) 0000-0000" />
              </div>
              <div>
                <label className="block text-label-bold mb-1">Site de Ajuda</label>
                <input type="url" value={sysSettings.help_website || ''} onChange={e => setSysSettings({...sysSettings, help_website: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" placeholder="https://ajuda.com" />
              </div>
            </div>
            <div className="flex justify-end"><button type="submit" disabled={saving} className="bg-secondary text-on-secondary px-8 py-2 rounded-xl font-bold">Salvar Configurações</button></div>
          </form>
        )}

        {activeTab === 'chamados' && isAdmin && (
          <div className="bg-error-container/10 border border-error/20 rounded-2xl p-8 text-center space-y-6">
            <span className="material-symbols-outlined text-error text-6xl">dangerous</span>
            <h2 className="text-headline-md font-bold text-error">Zona de Perigo</h2>
            <button onClick={() => setIsBulkDeleteModalOpen(true)} className="bg-error text-on-error px-10 py-3 rounded-xl font-bold">EXCLUIR TODOS OS CHAMADOS</button>
          </div>
        )}
      </div>

      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-8 border-2 border-error">
            <h2 className="text-headline-sm font-bold text-error mb-4">Confirmar Exclusão</h2>
            <form onSubmit={handleBulkDelete} className="space-y-4">
              <input type="password" required value={confirmAuth.password} onChange={e => setConfirmAuth({...confirmAuth, password: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" placeholder="Digite sua senha de admin..." />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsBulkDeleteModalOpen(false)} className="flex-1">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-2 bg-error text-on-error px-8 py-2 rounded-xl font-bold">CONFIRMAR</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
