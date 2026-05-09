import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewTicket() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    priority: 'Baixa',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui seria feita a integração com API. 
    // Para protótipo, voltamos ao Dashboard ou damos feedback.
    alert('Chamado aberto com sucesso!');
    navigate('/');
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT overflow-hidden max-w-3xl mx-auto shadow-sm">
      <div className="px-container-padding py-6 border-b border-surface-variant bg-surface-bright flex items-center justify-between">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-primary">Abertura de Chamado</h2>
          <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">Preencha os dados abaixo para registrar uma nova solicitação.</p>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors flex items-center justify-center"
          title="Voltar"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-container-padding space-y-6">
        
        {/* Assunto */}
        <div>
          <label htmlFor="subject" className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Assunto do Chamado *</label>
          <input 
            type="text" 
            id="subject" 
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-DEFAULT px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-body-md font-body-md text-on-surface placeholder-outline transition-colors" 
            placeholder="Ex: Impressora do RH não está ligando" 
          />
        </div>

        {/* Linha com Categoria e Prioridade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Categoria *</label>
            <div className="relative">
              <select 
                id="category" 
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-DEFAULT px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-body-md font-body-md text-on-surface transition-colors"
              >
                <option value="" disabled>Selecione a categoria</option>
                <option value="Informática/TI">Informática/TI</option>
                <option value="Elétrica">Elétrica</option>
                <option value="Predial/Civil">Predial/Civil</option>
                <option value="Segurança Eletrônica">Segurança Eletrônica</option>
                <option value="Telecomunicações">Telecomunicações</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Prioridade</label>
            <div className="relative">
              <select 
                id="priority" 
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-DEFAULT px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-body-md font-body-md text-on-surface transition-colors"
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="description" className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Descrição Detalhada *</label>
          <textarea 
            id="description" 
            name="description"
            required
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-DEFAULT px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-body-md font-body-md text-on-surface placeholder-outline transition-colors resize-y" 
            placeholder="Descreva o problema com o máximo de detalhes possível para facilitar o atendimento..." 
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-surface-variant">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="px-6 py-2 text-primary font-body-md font-medium rounded-DEFAULT hover:bg-surface-container-low transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 bg-primary-container text-on-primary font-body-md font-medium rounded-DEFAULT hover:bg-opacity-90 transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
            Abrir Chamado
          </button>
        </div>

      </form>
    </div>
  );
}
