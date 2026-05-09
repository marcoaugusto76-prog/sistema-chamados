import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewTicket from './pages/NewTicket';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="novo-chamado" element={<NewTicket />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
