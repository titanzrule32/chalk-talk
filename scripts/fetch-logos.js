/**
 * Logo Fetcher for Chalk Talk
 *
 * Downloads team logos from TheSportsDB API and saves them locally.
 * Usage: node scripts/fetch-logos.js
 *
 * TheSportsDB free API key: 3
 * Rate limiting: 1 second delay between requests
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';
const OUTPUT_DIR = join(__dirname, '..', 'public', 'assets', 'logos');
const DELAY_MS = 1500;

const LEAGUES = [
  { name: 'NFL', query: 'NFL', dir: 'nfl' },
  { name: 'NBA', query: 'NBA', dir: 'nba' },
  { name: 'MLB', query: 'MLB', dir: 'mlb' },
];

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
  console.log(`Fetching teams for ${leagueName}...`);
  const response = await fetch(url);
  const data = await response.json();
  return data.teams || [];
}

async function downloadImage(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${url} (${response.status})`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, buffer);
}

async function main() {
  console.log('Chalk Talk Logo Fetcher');
  console.log('======================\n');

  for (const league of LEAGUES) {
    const leagueDir = join(OUTPUT_DIR, league.dir);
    if (!existsSync(leagueDir)) {
      await mkdir(leagueDir, { recursive: true });
    }

    const teams = await fetchTeamsForLeague(league.query);
    console.log(`Found ${teams.length} teams for ${league.name}\n`);

    for (const team of teams) {
      const badgeUrl = team.strBadge || team.strTeamBadge;
      if (!badgeUrl) {
        console.log(`  SKIP: ${team.strTeam} (no badge URL)`);
        continue;
      }

      const teamSlug = slugify(team.strTeam);
      const ext = badgeUrl.includes('.png') ? '.png' : '.png';
      const outputPath = join(leagueDir, `${teamSlug}${ext}`);

      if (existsSync(outputPath)) {
        console.log(`  EXISTS: ${team.strTeam}`);
        continue;
      }

      try {
        await downloadImage(badgeUrl, outputPath);
        console.log(`  OK: ${team.strTeam} -> ${teamSlug}${ext}`);
      } catch (err) {
        console.log(`  FAIL: ${team.strTeam} - ${err.message}`);
      }

      await sleep(DELAY_MS);
    }

    console.log('');
    await sleep(DELAY_MS);
  }

  console.log('Done! Logos saved to public/assets/logos/');
}

main().catch(console.error);
