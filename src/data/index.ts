import type { DifficultyTier, Mode1Question, Mode2Question } from '../types';
// Mode 1 - Geography quiz team data
import nflTeams from './mode1/nfl-teams.json';
import nbaTeams from './mode1/nba-teams.json';
import mlbTeams from './mode1/mlb-teams.json';
import nhlTeams from './mode1/nhl-teams.json';
import mlsTeams from './mode1/mls-teams.json';
import eplTeams from './mode1/epl-teams.json';
// Mode 2 - Trivia questions (rookie)
import rookieNfl from './mode2/rookie-nfl.json';
import rookieNba from './mode2/rookie-nba.json';
import rookieMlb from './mode2/rookie-mlb.json';
import rookieNhl from './mode2/rookie-nhl.json';
import rookieMls from './mode2/rookie-mls.json';
import rookieEpl from './mode2/rookie-epl.json';
import rookieExtra from './mode2/rookie-extra.json';
// Mode 2 - Trivia questions (pro)
import proMajor from './mode2/pro-major.json';
import proExpansion from './mode2/pro-expansion.json';
// Mode 2 - Trivia questions (legend)
import legendMajor from './mode2/legend-major.json';
import legendExpansion from './mode2/legend-expansion.json';

const allMode1: Mode1Question[] = [
  ...(nflTeams as Mode1Question[]),
  ...(nbaTeams as Mode1Question[]),
  ...(mlbTeams as Mode1Question[]),
  ...(nhlTeams as Mode1Question[]),
  ...(mlsTeams as Mode1Question[]),
  ...(eplTeams as Mode1Question[]),
];

const allMode2: Mode2Question[] = [
  ...(rookieNfl as Mode2Question[]),
  ...(rookieNba as Mode2Question[]),
  ...(rookieMlb as Mode2Question[]),
  ...(rookieNhl as Mode2Question[]),
  ...(rookieMls as Mode2Question[]),
  ...(rookieEpl as Mode2Question[]),
  ...(rookieExtra as Mode2Question[]),
  ...(proMajor as Mode2Question[]),
  ...(proExpansion as Mode2Question[]),
  ...(legendMajor as Mode2Question[]),
  ...(legendExpansion as Mode2Question[]),
];

const tierLeagues: Record<DifficultyTier, string[]> = {
  rookie: ['NFL', 'NBA', 'MLB'],
  pro: ['NFL', 'NBA', 'MLB', 'NHL', 'MLS', 'CFB', 'CBB'],
  legend: [
    'NFL', 'NBA', 'MLB', 'NHL', 'MLS', 'CFB', 'CBB',
    'Premier League', 'Champions League', 'PGA', 'World Cup', 'Olympics',
  ],
};

export function getMode1Questions(tier: DifficultyTier): Mode1Question[] {
  const leagues = tierLeagues[tier];
  return allMode1.filter((q) => leagues.includes(q.league));
}

export function getMode2Questions(tier: DifficultyTier): Mode2Question[] {
  const leagues = tierLeagues[tier];
  return allMode2.filter(
    (q) => leagues.includes(q.league) && tierRank(q.tier) <= tierRank(tier),
  );
}

function tierRank(tier: DifficultyTier): number {
  return tier === 'rookie' ? 1 : tier === 'pro' ? 2 : 3;
}

export function getMode1ById(id: string): Mode1Question | undefined {
  return allMode1.find((q) => q.id === id);
}

export function getMode2ById(id: string): Mode2Question | undefined {
  return allMode2.find((q) => q.id === id);
}
