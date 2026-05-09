import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados para novo usuário / edição
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
    title: '',
    phone: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('name');
    
    if (error) console.error(error);
    else setUsers(data || []);
    setLoading(false);
  }

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      role: user.role || 'client',
      title: user.title || '',
      phone: user.phone || '',
      email: '', // Email e senha não são editáveis diretamente por aqui por segurança do Supabase
      password: ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        name: formData.name,
        role: formData.role,
        title: formData.title,
        phone: formData.phone,
        updated_at: new Date()
      })
      .eq('id', selectedUser.id);

    if (error) alert('Erro ao atualizar perfil: ' + error.message);
    else {
      alert('Usuário atualizado com sucesso!');
      setIsEditModalOpen(false);
      fetchUsers();
    }
    setSaving(false);
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Tem certeza que deseja remover este usuário?')) return;
    
    // Nota: Deletar do auth.users exige Admin API. 
    // Vamos deletar do profiles e o usuário perderá o acesso se houver RLS.
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    
    if (error) alert('Erro ao remover: ' + error.message);
    else {
      alert('Usuário removido da listagem.');
      fetchUsers();
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return 'bg-error-container text-on-error-container border-error/20';
      case 'tech': return 'bg-secondary-container text-secondary border-secondary/20';
      default: return 'bg-surface-container-high text-on-surface-variant border-outline-variant';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'tech': return 'Técnico';
      default: return 'Cliente';
    }
  };

  if (loading) return <div className="p-8 text-center text-primary font-bold">Carregando usuários...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-headline-lg font-bold text-primary">Gestão de Usuários</h1>
          <p className="text-on-surface-variant">Administre os acessos e permissões do sistema</p>
        </div>
        <button 
          onClick={() => alert('Para criar novos usuários, use o botão de cadastro na tela de Login ou o Painel do Supabase. A criação via Admin API exige uma Edge Function.')}
          className="bg-primary text-on-primary px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <span className="material-symbols-outlined">person_add</span>
          Novo Usuário
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant text-label-caps font-bold">
              <th className="py-4 px-6">Usuário</th>
              <th className="py-4 px-6">Cargo/Título</th>
              <th className="py-4 px-6">Nível de Acesso</th>
              <th className="py-4 px-6">Contato</th>
              <th className="py-4 px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden">
                      {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-primary">{user.name?.charAt(0)}</div>}
                    </div>
                    <span className="font-bold">{user.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-body-sm text-on-surface-variant">{user.title || '---'}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getRoleBadge(user.role)}`}>
                    {getRoleLabel(user.role).toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-6 text-body-sm">{user.phone || '---'}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenEdit(user)} className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} className="p-2 hover:bg-error/10 rounded-lg text-error transition-colors">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edição */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-outline-variant animate-in zoom-in-95 duration-200">
            <h2 className="text-headline-md font-bold text-primary mb-6">Editar Usuário</h2>
            <form onSubmit={handleUpdateUser} className="space-y-6">
              <div>
                <label className="block text-label-bold mb-2">Nome Completo</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-bold mb-2">Cargo</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" />
                </div>
                <div>
                  <label className="block text-label-bold mb-2">Nível de Acesso</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2">
                    <option value="client">Cliente</option>
                    <option value="tech">Técnico</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-label-bold mb-2">Telefone</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2" />
              </div>
              
              <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 font-bold text-on-surface-variant">Cancelar</button>
                <button type="submit" disabled={saving} className="bg-primary text-on-primary px-8 py-2 rounded-xl font-bold disabled:opacity-50">
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
