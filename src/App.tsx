import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import NewQuote from './pages/NewQuote';
import PublicView from './pages/PublicView';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/new" element={<NewQuote />} />
        <Route path="/d/:publicId" element={<PublicView />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
