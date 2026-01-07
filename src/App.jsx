import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TournamentProvider } from './context/TournamentContext';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

function App() {
  return (
    <TournamentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </TournamentProvider>
  );
}

export default App;
