import type { PlayerProfile } from '../types';

const PLAYERS_KEY = 'chalk-talk-players';
const ACTIVE_KEY = 'chalk-talk-active-player';

export function getPlayers(): PlayerProfile[] {
  try {
    const raw = localStorage.getItem(PLAYERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePlayers(players: PlayerProfile[]): void {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
}

export function savePlayer(player: PlayerProfile): void {
  const players = getPlayers();
  const index = players.findIndex((p) => p.id === player.id);
  if (index >= 0) {
    players[index] = player;
  } else {
    players.push(player);
  }
  savePlayers(players);
}

export function deletePlayer(id: string): void {
  const players = getPlayers().filter((p) => p.id !== id);
  savePlayers(players);
  if (getActivePlayerId() === id) {
    clearActivePlayerId();
  }
}

export function getActivePlayerId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActivePlayerId(id: string): void {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function clearActivePlayerId(): void {
  localStorage.removeItem(ACTIVE_KEY);
}
