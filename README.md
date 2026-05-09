# HelpDesk Pro 🚀

O **HelpDesk Pro** é um sistema moderno de gestão de chamados e atendimento ao cliente, construído com as tecnologias mais recentes para garantir velocidade, segurança e uma experiência de usuário premium.

## ✨ Funcionalidades

- 🔑 **Autenticação Segura**: Gerenciada pelo Supabase Auth.
- 🛡️ **Níveis de Acesso (RBAC)**: Diferentes permissões para Administradores, Técnicos e Clientes.
- 📊 **Dashboard Estratégico**: Métricas em tempo real e relatórios de performance.
- 🔔 **Notificações Real-Time**: Alertas instantâneos sobre mudanças no status dos chamados.
- 🔍 **Busca Avançada**: Filtros por status, título e usuário.
- 🎨 **Design Premium**: Interface baseada em Design Systems modernos, responsiva e com modo escuro suave.
- ⚙️ **Customização Total**: O administrador pode alterar a logomarca, título e central de ajuda diretamente pelo painel.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React.js + Vite
- **Estilização**: Tailwind CSS + Material Symbols
- **Backend/Banco**: Supabase (PostgreSQL + Realtime)
- **Hospedagem**: Vercel

## 🛠️ Configuração de Ambiente

Para rodar este projeto, você precisará configurar as seguintes variáveis de ambiente no seu arquivo `.env` local ou nas configurações da Vercel:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

## 📦 Como Publicar na Vercel

1. Suba o código para o seu repositório no GitHub.
2. No painel da Vercel, clique em "Add New Project".
3. Importe o repositório.
4. Na seção **Environment Variables**, adicione os dois campos citados acima.
5. Clique em **Deploy**.

O arquivo `vercel.json` incluído no projeto já garante que as rotas internas funcionem perfeitamente.

---
Desenvolvido com ❤️ pela equipe HelpDesk Pro.
