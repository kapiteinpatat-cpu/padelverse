// Compacte win/verlies statistieken voor regionale spelers
// Gegenereerd uit regio-stats-lite.json (aggregaat per speler, geen match-detail)
import rawLite from './regio-stats-lite.json';

interface StatsLite {
  id: number;
  nw: number; // gewonnen wedstrijden
  nm: number; // totaal wedstrijden
  pct: number; // win% (0-100)
}

const raw = rawLite as StatsLite[];

export interface RegioTotaalStats {
  wins: number;
  losses: number;
  total: number;
  pct: number;
}

export const REGIO_STATS_MAP = new Map<number, RegioTotaalStats>(
  raw.map(p => [
    p.id,
    {
      wins: p.nw,
      losses: p.nm - p.nw,
      total: p.nm,
      pct: p.pct,
    },
  ])
);

export function getRegioStats(id: number): RegioTotaalStats {
  return REGIO_STATS_MAP.get(id) ?? { wins: 0, losses: 0, total: 0, pct: 0 };
}
