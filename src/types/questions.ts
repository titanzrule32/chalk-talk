import type { DifficultyTier } from './player';

export interface Mode1Question {
  id: string;
  sport: string;
  league: string;
  team_name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  conference: string;
  division: string;
  logo_url: string;
  star_players: string[];
  tier: DifficultyTier;
  distractors: {
    cities: string[];
    teams: string[];
  };
}

export interface Mode2Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  league: string;
  season: string;
  category: string;
  tier: DifficultyTier;
  date_added: string;
  source_year: number;
}
