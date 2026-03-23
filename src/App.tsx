import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { AppShell } from './components/layout/AppShell';
import { Home } from './pages/Home';
import { ModeSelect } from './pages/ModeSelect';
import { Game } from './pages/Game';
import { ResultsScreen } from './components/results/ResultsScreen';

export default function App() {
  return (
    <BrowserRouter>
      <PlayerProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<ModeSelect />} />
            <Route path="/play/:mode" element={<Game />} />
            <Route path="/results" element={<ResultsScreen />} />
          </Route>
        </Routes>
      </PlayerProvider>
    </BrowserRouter>
  );
}
