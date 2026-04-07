import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// ─── Types ───────────────────────────────────────────────────────────────────
interface PlayerIndex {
  id: number;
  naam: string;
  club: string;
  club_id: number;
  g: 'M' | 'V' | 'U';
  r: number | null;
  p: number | null;
}

interface StatsLite {
  id: number;
  nw: number;
  nm: number;
  pct: number;
}

interface PlayerRow {
  id: number;
  naam: string;
  club: string;
  club_id: number;
  geslacht_code: 'M' | 'V' | 'U';
  huidig_ranking: number | null;
  verwacht_ranking: number | null;
  initials: string;
  wins: number;
  losses: number;
  total: number;
  pct: number;
}

// ─── Module-level cache ───────────────────────────────────────────────────────
let _players: PlayerRow[] | null = null;
let _playerMap: Map<number, PlayerRow> | null = null;

function initials(naam: string): string {
  const parts = naam.split(' ').filter(p => /[a-zA-Z]/.test(p));
  if (parts.length >= 2) {
    const last  = parts[parts.length - 1].split('').find(c => /[a-zA-Z]/.test(c)) ?? '';
    const first = parts[0].split('').find(c => /[a-zA-Z]/.test(c)) ?? '';
    return (last + first).toUpperCase();
  }
  return naam.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
}

function loadPlayers(): PlayerRow[] {
  if (_players) return _players;

  const libDir = path.join(process.cwd(), 'src/lib');

  const indexRaw: PlayerIndex[] = JSON.parse(
    fs.readFileSync(path.join(libDir, 'belgie-index.json'), 'utf-8')
  );
  const statsRaw: StatsLite[] = JSON.parse(
    fs.readFileSync(path.join(libDir, 'belgie-stats-lite.json'), 'utf-8')
  );

  // Bouw stats map
  const statsMap = new Map<number, StatsLite>(statsRaw.map(s => [s.id, s]));

  _players = indexRaw.map(p => {
    const st = statsMap.get(p.id);
    return {
      id:               p.id,
      naam:             p.naam,
      club:             p.club,
      club_id:          p.club_id,
      geslacht_code:    p.g,
      huidig_ranking:   p.r,
      verwacht_ranking: p.p,
      initials:         initials(p.naam),
      wins:             st?.nw ?? 0,
      losses:           st ? (st.nm - st.nw) : 0,
      total:            st?.nm ?? 0,
      pct:              st?.pct ?? 0,
    };
  });

  _playerMap = new Map(_players.map(p => [p.id, p]));
  console.log(`[api/players] ${_players.length} spelers geladen in geheugen`);
  return _players;
}

// ─── GET handler ─────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const gender      = searchParams.get('gender') ?? 'all';   // 'M' | 'V' | 'all'
  const zoek        = (searchParams.get('zoek') ?? '').trim().toLowerCase();
  const clubId      = parseInt(searchParams.get('club_id') ?? '0', 10);
  const sortBy      = searchParams.get('sortBy') ?? 'ranking';
  const niveaus     = searchParams.get('niveaus')?.split(',').filter(Boolean) ?? [];
  const minWinpct   = parseInt(searchParams.get('minWinpct') ?? '0', 10);
  const minGespeeld = parseInt(searchParams.get('minGespeeld') ?? '0', 10);
  const page        = parseInt(searchParams.get('page') ?? '0', 10);
  const pageSize    = Math.min(parseInt(searchParams.get('pageSize') ?? '100', 10), 500);

  const all = loadPlayers();

  // ── Filteren ──────────────────────────────────────────────────────────────
  let result = all;

  if (gender !== 'all') {
    result = result.filter(p => p.geslacht_code === gender);
  }
  if (clubId > 0) {
    result = result.filter(p => p.club_id === clubId);
  }
  if (zoek) {
    result = result.filter(p => p.naam.toLowerCase().includes(zoek));
  }
  if (niveaus.length > 0) {
    result = result.filter(p => p.huidig_ranking != null && niveaus.includes(`P${p.huidig_ranking}`));
  }
  if (minWinpct > 0) {
    result = result.filter(p => p.total > 0 && p.pct >= minWinpct);
  }
  if (minGespeeld > 0) {
    result = result.filter(p => p.total >= minGespeeld);
  }

  // ── Sorteren ──────────────────────────────────────────────────────────────
  const sorted = [...result].sort((a, b) => {
    const rA = a.huidig_ranking ?? 9999;
    const rB = b.huidig_ranking ?? 9999;
    const pA = a.verwacht_ranking ?? 9999;
    const pB = b.verwacht_ranking ?? 9999;
    switch (sortBy) {
      case 'naam':     return a.naam.localeCompare(b.naam);
      case 'verwacht': return pA - pB || a.naam.localeCompare(b.naam);
      case 'winpct':   return b.pct - a.pct || b.total - a.total;
      case 'wins':     return b.wins - a.wins;
      case 'gespeeld': return b.total - a.total;
      default:         return rA - rB || a.naam.localeCompare(b.naam);
    }
  });

  // ── Pagineren ─────────────────────────────────────────────────────────────
  const total = sorted.length;
  const start = page * pageSize;
  const rows  = sorted.slice(start, start + pageSize);

  return NextResponse.json({
    players:  rows,
    total,
    page,
    pageSize,
    pages: Math.ceil(total / pageSize),
  });
}
