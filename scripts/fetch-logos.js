/**
 * Logo Fetcher for Chalk Talk
 *
 * Downloads team logos from TheSportsDB API and saves them locally.
 *
 * Usage:
 *   node scripts/fetch-logos.js              # Fetch all default leagues (NFL, NBA, MLB)
 *   node scripts/fetch-logos.js nhl          # Fetch NHL logos only
 *   node scripts/fetch-logos.js mls epl      # Fetch MLS and EPL logos
 *   node scripts/fetch-logos.js --all        # Fetch all supported leagues
 *
 * Supported leagues:
 *   nfl, nba, mlb, nhl, mls, epl, ncaaf, ncaab
 *
 * TheSportsDB API key: 3 (free tier)
 * Rate limiting: 1.5 second delay between requests
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';
const OUTPUT_DIR = join(__dirname, '..', 'public', 'assets', 'logos');
const DELAY_MS = 1500;

// Map of CLI shorthand → TheSportsDB league name + output directory
const LEAGUE_CONFIG = {
  nfl:   { query: 'NFL',                         dir: 'nfl',   label: 'NFL' },
  nba:   { query: 'NBA',                         dir: 'nba',   label: 'NBA' },
  mlb:   { query: 'MLB',                         dir: 'mlb',   label: 'MLB' },
  nhl:   { query: 'NHL',                         dir: 'nhl',   label: 'NHL' },
  mls:   { query: 'American Major League Soccer',  dir: 'mls',   label: 'MLS' },
  epl:   { query: 'English Premier League',      dir: 'epl',   label: 'English Premier League' },
  ncaaf: { query: 'NCAAF',                       dir: 'ncaaf', label: 'NCAA Football' },
  ncaab: { query: 'NCAAB',                       dir: 'ncaab', label: 'NCAA Basketball' },
};

const DEFAULT_LEAGUES = ['nfl', 'nba', 'mlb'];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchTeamsForLeague(leagueName) {
  const url = `${BASE_URL}/search_all_teams.php?l=${encodeURIComponent(leagueName)}`;
  console.log(`  Fetching teams for "${leagueName}"...`);
  const response = await fetch(url);
  const data = await response.json();
  return data.teams || [];
}

async function downloadImage(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, buffer);
}

async function fetchLeague(key) {
  const config = LEAGUE_CONFIG[key];
  if (!config) {
    console.log(`  Unknown league: "${key}". Supported: ${Object.keys(LEAGUE_CONFIG).join(', ')}`);
    return;
  }

  console.log(`\n=== ${config.label} ===`);

  const leagueDir = join(OUTPUT_DIR, config.dir);
  if (!existsSync(leagueDir)) {
    await mkdir(leagueDir, { recursive: true });
  }

  const teams = await fetchTeamsForLeague(config.query);
  console.log(`  Found ${teams.length} teams\n`);

  if (teams.length === 0) {
    console.log(`  No teams found. The league name "${config.query}" may not match TheSportsDB.`);
    console.log(`  Try searching at: https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=YOUR_LEAGUE`);
    return;
  }

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const team of teams) {
    const badgeUrl = team.strBadge || team.strTeamBadge;
    if (!badgeUrl) {
      console.log(`  SKIP: ${team.strTeam} (no badge URL)`);
      skipped++;
      continue;
    }

    const teamSlug = slugify(team.strTeam);
    const outputPath = join(leagueDir, `${teamSlug}.png`);

    if (existsSync(outputPath)) {
      console.log(`  EXISTS: ${team.strTeam}`);
      skipped++;
      continue;
    }

    try {
      await downloadImage(badgeUrl, outputPath);
      console.log(`  OK: ${team.strTeam} -> ${teamSlug}.png`);
      downloaded++;
    } catch (err) {
      console.log(`  FAIL: ${team.strTeam} - ${err.message}`);
      failed++;
    }

    await sleep(DELAY_MS);
  }

  console.log(`\n  Summary: ${downloaded} downloaded, ${skipped} skipped, ${failed} failed`);
}

async function main() {
  console.log('Chalk Talk Logo Fetcher');
  console.log('======================');

  const args = process.argv.slice(2).map((a) => a.toLowerCase().replace(/^--?/, ''));

  let leaguesToFetch;

  if (args.length === 0) {
    console.log(`\nNo leagues specified. Fetching defaults: ${DEFAULT_LEAGUES.join(', ')}`);
    console.log(`Usage: node scripts/fetch-logos.js [league1] [league2] ...`);
    console.log(`       node scripts/fetch-logos.js --all`);
    console.log(`Supported: ${Object.keys(LEAGUE_CONFIG).join(', ')}\n`);
    leaguesToFetch = DEFAULT_LEAGUES;
  } else if (args.includes('all')) {
    leaguesToFetch = Object.keys(LEAGUE_CONFIG);
  } else {
    leaguesToFetch = args;
  }

  for (const league of leaguesToFetch) {
    await fetchLeague(league);
    await sleep(DELAY_MS);
  }

  console.log('\nDone! Logos saved to public/assets/logos/');
}

main().catch(console.error);
