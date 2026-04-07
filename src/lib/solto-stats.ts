// Toernooi- en wedstrijddata voor SOLTO-spelers, afkomstig van padelstats.be
import rawData from './solto-detail-data.json';

export interface Opponent {
  naam: string;
  id: number;
  rank: number | null;
}

export interface Match {
  opp: Opponent[];
  ronde: string;
  score: string;
  win: boolean;
}

export interface Toernooi {
  titel: string;
  sub: string;       // subtitle: partner, ronde, datum
  serie: string;     // bijv. "PD2", "PH3", "IC"
  ic: boolean;       // interclub?
  wl: string[];      // ["W","L","W","|","L"] sequence
  punten: number[];  // [wp, vp]
  matches: Match[];
  url: string;
}

export interface RankStats {
  nw: number;  // gewonnen
  nm: number;  // totaal
  ratio: number;
}

export interface PlayerStats {
  id: number;
  naam: string;
  club: string;
  gender: string;   // "M" | "V"
  rank: number;
  pred: number;
  nm: number;       // totaal matches dit seizoen
  stats: Record<string, RankStats>;
  toernooien: Toernooi[];
}

// Cast de JSON naar het juiste type
export const SOLTO_STATS: PlayerStats[] = rawData as unknown as PlayerStats[];

// Lookup map op user_id
export const SOLTO_STATS_MAP: Map<number, PlayerStats> = new Map(
  SOLTO_STATS.map(p => [p.id, p])
);

// Helper: totale win/loss over alle toernooien
// Gebruikt p.stats (betrouwbaar) i.p.v. m.win (corrupt in regio-data)
export function getTotaalStats(p: PlayerStats): { wins: number; losses: number; total: number; pct: number } {
  let wins = 0, total = 0;
  for (const s of Object.values(p.stats)) {
    wins += s.nw;
    total += s.nm;
  }
  return { wins, losses: total - wins, total, pct: total > 0 ? Math.round((wins / total) * 100) : 0 };
}

// Helper: sorteer toernooien — interclub eerst, dan op datum (meest recent via subtitle)
export function getSortedToernooien(p: PlayerStats): Toernooi[] {
  return [...p.toernooien].sort((a, b) => {
    if (a.ic && !b.ic) return -1;
    if (!a.ic && b.ic) return 1;
    return 0;
  });
}
