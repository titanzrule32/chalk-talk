import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { PlayerProfile, DifficultyTier, RoundHistoryEntry } from '../types';
import {
  getPlayers,
  savePlayer,
  deletePlayer as removePlayer,
  getActivePlayerId,
  setActivePlayerId,
  savePlayers,
} from '../utils/storage';

interface PlayerContextValue {
  players: PlayerProfile[];
  activePlayer: PlayerProfile | null;
  createPlayer: (name: string, tier: DifficultyTier) => PlayerProfile;
  selectPlayer: (id: string) => void;
  updateTier: (tier: DifficultyTier) => void;
  deletePlayer: (id: string) => void;
  updateAfterRound: (
    mode: 1 | 2,
    score: number,
    maxScore: number,
    questionsCorrect: number,
    seenIds: string[],
    streak: number,
  ) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<PlayerProfile[]>(getPlayers);
  const [activeId, setActiveId] = useState<string | null>(getActivePlayerId);

  const activePlayer = players.find((p) => p.id === activeId) ?? null;

  useEffect(() => {
    savePlayers(players);
  }, [players]);

  const createPlayer = useCallback(
    (name: string, tier: DifficultyTier): PlayerProfile => {
      const player: PlayerProfile = {
        id: crypto.randomUUID(),
        name,
        tier,
        createdAt: new Date().toISOString(),
        mode1SeenIds: [],
        mode2SeenIds: [],
        highScores: { mode1: 0, mode2: 0 },
        currentStreak: 0,
        longestStreak: 0,
        totalGames: 0,
        roundHistory: [],
      };
      setPlayers((prev) => [...prev, player]);
      setActiveId(player.id);
      setActivePlayerId(player.id);
      return player;
    },
    [],
  );

  const selectPlayer = useCallback((id: string) => {
    setActiveId(id);
    setActivePlayerId(id);
  }, []);

  const updateTier = useCallback(
    (tier: DifficultyTier) => {
      if (!activeId) return;
      setPlayers((prev) =>
        prev.map((p) => (p.id === activeId ? { ...p, tier } : p)),
      );
    },
    [activeId],
  );

  const deletePlayerFn = useCallback(
    (id: string) => {
      removePlayer(id);
      setPlayers((prev) => prev.filter((p) => p.id !== id));
      if (activeId === id) {
        setActiveId(null);
      }
    },
    [activeId],
  );

  const updateAfterRound = useCallback(
    (
      mode: 1 | 2,
      score: number,
      maxScore: number,
      questionsCorrect: number,
      seenIds: string[],
      streak: number,
    ) => {
      if (!activeId) return;
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id !== activeId) return p;

          const entry: RoundHistoryEntry = {
            mode,
            score,
            maxScore,
            date: new Date().toISOString(),
            questionsCorrect,
            questionsTotal: 10,
          };

          const newSeenKey = mode === 1 ? 'mode1SeenIds' : 'mode2SeenIds';
          const highKey = mode === 1 ? 'mode1' : 'mode2';

          const updatedHistory = [entry, ...p.roundHistory].slice(0, 20);
          const newHighScores = {
            ...p.highScores,
            [highKey]: Math.max(p.highScores[highKey], score),
          };

          const updated: PlayerProfile = {
            ...p,
            [newSeenKey]: [...p[newSeenKey], ...seenIds],
            highScores: newHighScores,
            currentStreak: streak,
            longestStreak: Math.max(p.longestStreak, streak),
            totalGames: p.totalGames + 1,
            roundHistory: updatedHistory,
          };

          savePlayer(updated);
          return updated;
        }),
      );
    },
    [activeId],
  );

  return (
    <PlayerContext.Provider
      value={{
        players,
        activePlayer,
        createPlayer,
        selectPlayer,
        updateTier,
        deletePlayer: deletePlayerFn,
        updateAfterRound,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
