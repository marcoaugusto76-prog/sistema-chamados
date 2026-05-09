import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    
    // Realtime para novas notificações
    const channel = supabase
      .channel('new-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchNotifications() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setNotifications(data || []);
    }
    setLoading(false);
  }

  const markAsRead = async (id) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    
    if (!error) {
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    }
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  if (loading) return <div className="p-8 text-center font-bold text-primary">Carregando alertas...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-headline-lg font-bold text-primary">Notificações</h1>
          <p className="text-on-surface-variant">Fique por dentro das atualizações dos seus chamados</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-primary hover:bg-primary/10 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
        >
          Marcar todas como lidas
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center">
            <span className="material-symbols-outlined text-outline-variant text-6xl mb-4">notifications_off</span>
            <p className="text-on-surface-variant">Você não tem nenhuma notificação no momento.</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex gap-4 ${
                notification.is_read 
                  ? 'bg-surface-container-lowest border-outline-variant opacity-70' 
                  : 'bg-surface-container-low border-primary shadow-sm'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                notification.is_read ? 'bg-surface-container-high text-on-surface-variant' : 'bg-primary/20 text-primary'
              }`}>
                <span className="material-symbols-outlined">
                  {notification.title.includes('Novo') ? 'add_alert' : 'update'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold ${notification.is_read ? 'text-on-surface' : 'text-primary'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-[10px] text-on-surface-variant">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-body-md text-on-surface-variant mt-1">{notification.message}</p>
                {!notification.is_read && (
                  <span className="inline-block mt-2 text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded-full font-bold">NOVA</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
