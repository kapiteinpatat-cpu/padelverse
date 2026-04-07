'use client';

import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Crown, Users, Search, TrendingUp, TrendingDown, Minus,
  BarChart2, SlidersHorizontal, X, ChevronDown, ChevronUp, MapPin,
  Globe, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SOLTO_HEREN, SOLTO_DAMES, SOLTO_VOLWASSENEN } from '@/lib/solto-players';
import { SOLTO_STATS_MAP, getTotaalStats } from '@/lib/solto-stats';
import { REGIO_HEREN, REGIO_DAMES, REGIO_VOLWASSENEN, type RegioPlayer } from '@/lib/regio-players';
import { REGIO_STATS_MAP } from '@/lib/regio-stats';
import rawSoltoDuos from '@/lib/solto-duos.json';
import rawRegioDuos from '@/lib/regio-duos.json';
import rawBelgieDuos from '@/lib/belgie-duos.json';
import rawBelgieClubs from '@/lib/belgie-clubs.json';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Player {
  id: number;
  naam: string;
  club: string;
  club_id?: number;
  geslacht_code: string;
  huidig_ranking: number | null;
  verwacht_ranking: number | null;
  initials: string;
  // stats (optioneel, voor in-memory pools)
  _wins?: number;
  _losses?: number;
  _total?: number;
  _pct?: number;
}

// Rij die de API teruggeeft
interface ApiPlayerRow {
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

interface ApiResponse {
  players: ApiPlayerRow[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

type StatsLookup = (id: number) => { wins: number; losses: number; total: number; pct: number };
type SortKey = 'ranking' | 'naam' | 'verwacht' | 'wins' | 'winpct' | 'gespeeld' | 'trend';
type DuoSortKey = 'winpct' | 'wins' | 'gespeeld' | 'toernooien';
type Scope = 'solto' | 'regio' | 'belgie';
type BelgieTab = 'heren' | 'dames' | 'allen' | 'duos';

interface Duo {
  speler_a: string; speler_b: string;
  id_a: number | null; id_b: number | null;
  wins: number; losses: number; total: number;
  toernooien: number; pct: number; cat: 'M' | 'V' | 'mixed';
}

const SOLTO_DUOS  = rawSoltoDuos as Duo[];
const REGIO_DUOS  = rawRegioDuos as Duo[];
const BELGIE_DUOS = rawBelgieDuos as Duo[];

interface ClubEntry { id: number; naam: string; leden?: number; }
const BELGIE_CLUBS = rawBelgieClubs as ClubEntry[];

// ─── Stats lookups (SOLTO & Regio, in-memory) ────────────────────────────────
const EMPTY_STATS = { wins: 0, losses: 0, total: 0, pct: 0 };

const soltoLookup: StatsLookup = (id) => {
  const st = SOLTO_STATS_MAP.get(id);
  return st ? getTotaalStats(st) : EMPTY_STATS;
};
const regioLookup: StatsLookup = (id) => REGIO_STATS_MAP.get(id) ?? EMPTY_STATS;

// ─── Club index voor Regio ────────────────────────────────────────────────────
const REGIO_CLUB_LIST = (() => {
  const map = new Map<number, string>();
  REGIO_VOLWASSENEN.forEach((p: RegioPlayer) => {
    if (p.club_id && !map.has(p.club_id)) map.set(p.club_id, p.club);
  });
  return Array.from(map.entries())
    .map(([id, naam]) => ({ id, naam }))
    .sort((a, b) => a.naam.localeCompare(b.naam));
})();

const ALLE_NIVEAUS = ['P50', 'P100', 'P200', 'P300', 'P400', 'P500', 'P700', 'P1000'] as const;

// ─── Hulpfuncties ─────────────────────────────────────────────────────────────
function RankTrend({ huidig, verwacht }: { huidig: number | null; verwacht: number | null }) {
  if (huidig == null || verwacht == null) return <Minus className="h-4 w-4 text-muted-foreground" />;
  if (verwacht > huidig) return <TrendingUp  className="h-4 w-4 text-green-500" />;
  if (verwacht < huidig) return <TrendingDown className="h-4 w-4 text-red-400" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function WinPctBadge({ pct, total }: { pct: number; total: number }) {
  if (total === 0) return <span className="text-muted-foreground/40 text-xs">—</span>;
  return (
    <span className={cn('font-bold font-mono text-sm',
      pct >= 60 ? 'text-green-500' : pct >= 40 ? 'text-yellow-500' : 'text-red-400')}>
      {pct}%
    </span>
  );
}

// ─── Filter state (SOLTO / Regio) ────────────────────────────────────────────
interface FilterState {
  zoek: string; niveaus: string[];
  minWinpct: number; minGespeeld: number; sortKey: SortKey; sortDir: 'asc' | 'desc';
}
const DEFAULT_FILTERS: FilterState = {
  zoek: '', niveaus: [], minWinpct: 0, minGespeeld: 0, sortKey: 'ranking', sortDir: 'desc',
};

// ─── Filter paneel (gedeeld voor SOLTO/Regio) ─────────────────────────────────
function FilterPanel({
  filters, setFilters, totalShown, totalAvailable,
}: { filters: FilterState; setFilters: (f: FilterState) => void; totalShown: number; totalAvailable: number; }) {
  const [open, setOpen] = useState(false);
  const active = (filters.niveaus.length > 0 ? 1 : 0) + (filters.minWinpct > 0 ? 1 : 0)
    + (filters.minGespeeld > 0 ? 1 : 0) + (filters.zoek ? 1 : 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Zoek speler op naam…" className="pl-9"
            value={filters.zoek} onChange={e => setFilters({ ...filters, zoek: e.target.value })} />
        </div>
        <Select value={filters.sortKey} onValueChange={v => setFilters({ ...filters, sortKey: v as SortKey })}>
          <SelectTrigger className="w-full sm:w-[220px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ranking">Huidig ranking</SelectItem>
            <SelectItem value="verwacht">Verwacht ranking</SelectItem>
            <SelectItem value="naam">Naam (A–Z)</SelectItem>
            <SelectItem value="winpct">Hoogste win%</SelectItem>
            <SelectItem value="wins">Meeste overwinningen</SelectItem>
            <SelectItem value="gespeeld">Meeste wedstrijden</SelectItem>
          </SelectContent>
        </Select>
        <Button variant={open ? 'default' : 'outline'} className="shrink-0 gap-2" onClick={() => setOpen(v => !v)}>
          <SlidersHorizontal className="h-4 w-4" /> Filters
          {active > 0 && <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary-foreground text-primary">{active}</Badge>}
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
      </div>
      {open && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-5 pb-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Niveau</Label>
                <div className="flex flex-wrap gap-1.5">
                  {ALLE_NIVEAUS.map(n => (
                    <button key={n} onClick={() => {
                      const next = filters.niveaus.includes(n) ? filters.niveaus.filter(x => x !== n) : [...filters.niveaus, n];
                      setFilters({ ...filters, niveaus: next });
                    }} className={cn('px-2.5 py-1 rounded-md text-xs font-mono font-bold border transition-all',
                      filters.niveaus.includes(n) ? 'bg-primary text-primary-foreground border-primary' : 'border-muted text-muted-foreground hover:border-primary/50 hover:text-foreground')}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Min. winrate — <span className="text-primary">{filters.minWinpct}%</span>
                </Label>
                <Slider min={0} max={100} step={5} value={[filters.minWinpct]}
                  onValueChange={([v]) => setFilters({ ...filters, minWinpct: v })} className="mt-2" />
                <div className="flex justify-between text-[10px] text-muted-foreground"><span>0%</span><span>50%</span><span>100%</span></div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Min. wedstrijden — <span className="text-primary">{filters.minGespeeld}</span>
                </Label>
                <Slider min={0} max={30} step={1} value={[filters.minGespeeld]}
                  onValueChange={([v]) => setFilters({ ...filters, minGespeeld: v })} className="mt-2" />
                <div className="flex justify-between text-[10px] text-muted-foreground"><span>0</span><span>15</span><span>30+</span></div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-primary/10">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{totalShown}</span> van {totalAvailable} spelers
              </p>
              {active > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setFilters(DEFAULT_FILTERS)} className="gap-1 text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" /> Wissen
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Speler-tabel (SOLTO / Regio, in-memory) ──────────────────────────────────
const PAGE_SIZE = 200;

function PlayerTable({ players, filters, setFilters, statsLookup, showClub = false }: {
  players: Player[]; filters: FilterState; setFilters: (f: FilterState) => void; statsLookup: StatsLookup; showClub?: boolean;
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const rows = useMemo(() => {
    let r = players.map(p => ({ p, tot: statsLookup(p.id) }));
    if (filters.zoek.trim()) { const q = filters.zoek.toLowerCase(); r = r.filter(({ p }) => p.naam.toLowerCase().includes(q)); }
    if (filters.niveaus.length > 0) r = r.filter(({ p }) => p.huidig_ranking != null && filters.niveaus.includes(`P${p.huidig_ranking}`));
    if (filters.minWinpct > 0) r = r.filter(({ tot }) => tot.total > 0 && tot.pct >= filters.minWinpct);
    if (filters.minGespeeld > 0) r = r.filter(({ tot }) => tot.total >= filters.minGespeeld);
    r.sort((a, b) => {
      const rA = a.p.huidig_ranking ?? 9999, rB = b.p.huidig_ranking ?? 9999;
      const pA = a.p.verwacht_ranking ?? 9999, pB = b.p.verwacht_ranking ?? 9999;
      let cmp = 0;
      switch (filters.sortKey) {
        case 'naam':     cmp = a.p.naam.localeCompare(b.p.naam); break;
        case 'verwacht': cmp = pA - pB || a.p.naam.localeCompare(b.p.naam); break;
        case 'winpct':   cmp = b.tot.pct - a.tot.pct || b.tot.total - a.tot.total; break;
        case 'wins':     cmp = b.tot.wins - a.tot.wins; break;
        case 'gespeeld': cmp = b.tot.total - a.tot.total; break;
        case 'trend': { const dA = (a.p.verwacht_ranking ?? 0) - (a.p.huidig_ranking ?? 0); const dB = (b.p.verwacht_ranking ?? 0) - (b.p.huidig_ranking ?? 0); cmp = dB - dA || a.p.naam.localeCompare(b.p.naam); break; }
        default:         cmp = rA - rB || a.p.naam.localeCompare(b.p.naam);
      }
      return filters.sortDir === 'desc' ? -cmp : cmp;
    });
    return r;
  }, [players, filters, statsLookup]);

  // Reset paginering bij filterwijziging
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => setVisible(PAGE_SIZE), [rows]);

  if (rows.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
      <Search className="h-8 w-8 opacity-30" /><p>Geen spelers gevonden.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <PlayerRows rows={rows.slice(0, visible)} showClub={showClub} sortKey={filters.sortKey} sortDir={filters.sortDir} onSort={k => setFilters(k === filters.sortKey ? { ...filters, sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' } : { ...filters, sortKey: k, sortDir: 'asc' })} />
      {visible < rows.length && (
        <div className="flex items-center justify-center gap-3 py-2">
          <span className="text-sm text-muted-foreground">{visible} van {rows.length}</span>
          <Button variant="outline" size="sm" onClick={() => setVisible(c => c + PAGE_SIZE)}>
            Toon meer ({Math.min(PAGE_SIZE, rows.length - visible)})
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Gedeelde tabel-rijen component ───────────────────────────────────────────
function PlayerRows({ rows, showClub = false, sortKey, sortDir = 'asc', onSort }: {
  rows: { p: Player; tot: { wins: number; losses: number; total: number; pct: number } }[];
  showClub?: boolean;
  sortKey?: SortKey;
  sortDir?: 'asc' | 'desc';
  onSort?: (k: SortKey) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[52px] text-center">#</TableHead>
          <TableHead className="text-left">
            {onSort ? <button onClick={() => onSort('naam')} className={cn('flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer', sortKey === 'naam' ? 'text-foreground font-semibold' : 'text-muted-foreground')}>Speler {sortKey === 'naam' ? (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronDown className="h-3 w-3 opacity-30" />}</button> : 'Speler'}
          </TableHead>
          {showClub && <TableHead className="hidden md:table-cell">Club</TableHead>}
          <TableHead className="text-left">
            {onSort ? <button onClick={() => onSort('ranking')} className={cn('flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer', sortKey === 'ranking' ? 'text-foreground font-semibold' : 'text-muted-foreground')}>Niveau {sortKey === 'ranking' ? (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronDown className="h-3 w-3 opacity-30" />}</button> : 'Niveau'}
          </TableHead>
          <TableHead className="text-left text-center hidden sm:table-cell">
            {onSort ? <button onClick={() => onSort('gespeeld')} className={cn('flex items-center gap-1 justify-center w-full hover:text-foreground transition-colors cursor-pointer', sortKey === 'gespeeld' ? 'text-foreground font-semibold' : 'text-muted-foreground')}>Wedstr. {sortKey === 'gespeeld' ? (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronDown className="h-3 w-3 opacity-30" />}</button> : 'Wedstr.'}
          </TableHead>
          <TableHead className="text-left text-center hidden sm:table-cell">
            {onSort ? <button onClick={() => onSort('wins')} className={cn('flex items-center gap-1 justify-center w-full hover:text-foreground transition-colors cursor-pointer', sortKey === 'wins' ? 'text-foreground font-semibold' : 'text-muted-foreground')}>W / V {sortKey === 'wins' ? (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronDown className="h-3 w-3 opacity-30" />}</button> : 'W / V'}
          </TableHead>
          <TableHead className="text-left text-center hidden md:table-cell">
            {onSort ? <button onClick={() => onSort('winpct')} className={cn('flex items-center gap-1 justify-center w-full hover:text-foreground transition-colors cursor-pointer', sortKey === 'winpct' ? 'text-foreground font-semibold' : 'text-muted-foreground')}>Win% {sortKey === 'winpct' ? (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronDown className="h-3 w-3 opacity-30" />}</button> : 'Win%'}
          </TableHead>
          <TableHead className="text-right hidden sm:table-cell">
            {onSort ? <button onClick={() => onSort('verwacht')} className={cn('flex items-center gap-1 justify-end w-full hover:text-foreground transition-colors cursor-pointer', sortKey === 'verwacht' ? 'text-foreground font-semibold' : 'text-muted-foreground')}>Verwacht {sortKey === 'verwacht' ? (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronDown className="h-3 w-3 opacity-30" />}</button> : 'Verwacht'}
          </TableHead>
          <TableHead className="text-right w-[40px]">
            {onSort ? <button onClick={() => onSort('trend')} className={cn('flex items-center gap-1 justify-end w-full hover:text-foreground transition-colors cursor-pointer', sortKey === 'trend' ? 'text-foreground font-semibold' : 'text-muted-foreground')}>Trend {sortKey === 'trend' ? (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronDown className="h-3 w-3 opacity-30" />}</button> : 'Trend'}
          </TableHead>
          <TableHead className="w-[40px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ p, tot }, index) => (
          <TableRow key={p.id} className="group">
            <TableCell className="text-center font-bold text-base text-muted-foreground">{index + 1}</TableCell>
            <TableCell>
              <Link href={`/dashboard/stats/${p.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="text-xs font-bold">{p.initials}</AvatarFallback>
                </Avatar>
                <span className="font-medium group-hover:text-primary transition-colors">{p.naam}</span>
              </Link>
            </TableCell>
            {showClub && (
              <TableCell className="hidden md:table-cell">
                <span className="text-xs text-muted-foreground">{p.club}</span>
              </TableCell>
            )}
            <TableCell>
              {p.huidig_ranking != null
                ? <Badge variant="secondary" className="font-mono font-bold">P{p.huidig_ranking}</Badge>
                : <span className="text-muted-foreground/40 text-xs">—</span>}
            </TableCell>
            <TableCell className="text-center hidden sm:table-cell">
              {tot.total > 0 ? <span className="text-sm font-mono">{tot.total}</span> : <span className="text-muted-foreground/40 text-xs">—</span>}
            </TableCell>
            <TableCell className="text-center hidden sm:table-cell">
              {tot.total > 0 ? (
                <span className="text-sm font-mono">
                  <span className="text-green-500">{tot.wins}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-red-400">{tot.losses}</span>
                </span>
              ) : <span className="text-muted-foreground/40 text-xs">—</span>}
            </TableCell>
            <TableCell className="text-center hidden md:table-cell">
              <WinPctBadge pct={tot.pct} total={tot.total} />
            </TableCell>
            <TableCell className="text-right hidden sm:table-cell">
              {p.verwacht_ranking != null
                ? <span className="text-sm text-muted-foreground font-mono">P{p.verwacht_ranking}</span>
                : <span className="text-muted-foreground/40 text-xs">—</span>}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end">
                <RankTrend huidig={p.huidig_ranking} verwacht={p.verwacht_ranking} />
              </div>
            </TableCell>
            <TableCell>
              <Link href={`/dashboard/stats/${p.id}`}
                className="flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <BarChart2 className="h-4 w-4" />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ─── België leaderboard (API-gedreven) ───────────────────────────────────────
const API_PAGE_SIZE = 100;

function BelgieLeaderboard() {
  const [activeTab, setActiveTab] = useState<BelgieTab>('allen');
  const [zoek, setZoek] = useState('');
  const [clubId, setClubId] = useState(0);
  const [sortBy, setSortBy] = useState<SortKey>('ranking');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [niveaus, setNiveaus] = useState<string[]>([]);
  const [minWinpct, setMinWinpct] = useState(0);
  const [minGespeeld, setMinGespeeld] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [rows, setRows] = useState<ApiPlayerRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const gender = activeTab === 'heren' ? 'M' : activeTab === 'dames' ? 'V' : 'all';

  const buildUrl = useCallback((p: number) => {
    const params = new URLSearchParams({
      gender,
      zoek,
      club_id: String(clubId),
      sortBy,
      niveaus: niveaus.join(','),
      minWinpct: String(minWinpct),
      minGespeeld: String(minGespeeld),
      page: String(p),
      pageSize: String(API_PAGE_SIZE),
    });
    return `/api/players?${params}`;
  }, [gender, zoek, clubId, sortBy, niveaus, minWinpct, minGespeeld]);

  // Nieuwe zoekopdracht (filters gewijzigd)
  useEffect(() => {
    if (activeTab === 'duos') return;
    const timer = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      setPage(0);
      try {
        const res = await fetch(buildUrl(0), { signal: abortRef.current.signal });
        const data: ApiResponse = await res.json();
        setRows(data.players);
        setTotal(data.total);
      } catch {
        // aborted
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [gender, zoek, clubId, sortBy, niveaus, minWinpct, minGespeeld, activeTab, buildUrl]);

  // Toon meer
  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const res = await fetch(buildUrl(nextPage));
      const data: ApiResponse = await res.json();
      setRows(prev => [...prev, ...data.players]);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  }, [page, buildUrl]);

  function resetFilters() {
    setZoek(''); setNiveaus([]); setMinWinpct(0); setMinGespeeld(0);
    setSortBy('ranking'); setClubId(0);
  }

  const activeFilterCount = (niveaus.length > 0 ? 1 : 0) + (minWinpct > 0 ? 1 : 0)
    + (minGespeeld > 0 ? 1 : 0) + (zoek ? 1 : 0);

  if (activeTab === 'duos') {
    return <DuoTable duos={BELGIE_DUOS} label="België (206k spelers)" />;
  }

  return (
    <div className="space-y-4">
      {/* Club filter */}
      <div className="flex items-center gap-3">
        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
        <Select value={String(clubId)} onValueChange={v => setClubId(Number(v))}>
          <SelectTrigger className="w-full sm:w-[360px]">
            <SelectValue placeholder="Alle clubs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Alle 451 clubs</SelectItem>
            {BELGIE_CLUBS.map(c => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.naam}{c.leden ? ` (${c.leden})` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {clubId > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setClubId(0)} className="gap-1 text-muted-foreground">
            <X className="h-3 w-3" /> Alle clubs
          </Button>
        )}
      </div>

      {/* Zoek + sorteer + filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Zoek speler op naam…" className="pl-9"
            value={zoek} onChange={e => setZoek(e.target.value)} />
        </div>
        <Select value={sortBy} onValueChange={v => setSortBy(v as SortKey)}>
          <SelectTrigger className="w-full sm:w-[220px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ranking">Huidig ranking</SelectItem>
            <SelectItem value="verwacht">Verwacht ranking</SelectItem>
            <SelectItem value="naam">Naam (A–Z)</SelectItem>
            <SelectItem value="winpct">Hoogste win%</SelectItem>
            <SelectItem value="wins">Meeste overwinningen</SelectItem>
            <SelectItem value="gespeeld">Meeste wedstrijden</SelectItem>
          </SelectContent>
        </Select>
        <Button variant={showFilters ? 'default' : 'outline'} className="shrink-0 gap-2"
          onClick={() => setShowFilters(v => !v)}>
          <SlidersHorizontal className="h-4 w-4" /> Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary-foreground text-primary">
              {activeFilterCount}
            </Badge>
          )}
          {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
      </div>

      {showFilters && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-5 pb-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Niveau</Label>
                <div className="flex flex-wrap gap-1.5">
                  {ALLE_NIVEAUS.map(n => (
                    <button key={n} onClick={() => {
                      setNiveaus(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]);
                    }} className={cn('px-2.5 py-1 rounded-md text-xs font-mono font-bold border transition-all',
                      niveaus.includes(n) ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-muted text-muted-foreground hover:border-primary/50 hover:text-foreground')}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Min. winrate — <span className="text-primary">{minWinpct}%</span>
                </Label>
                <Slider min={0} max={100} step={5} value={[minWinpct]}
                  onValueChange={([v]) => setMinWinpct(v)} className="mt-2" />
                <div className="flex justify-between text-[10px] text-muted-foreground"><span>0%</span><span>50%</span><span>100%</span></div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Min. wedstrijden — <span className="text-primary">{minGespeeld}</span>
                </Label>
                <Slider min={0} max={30} step={1} value={[minGespeeld]}
                  onValueChange={([v]) => setMinGespeeld(v)} className="mt-2" />
                <div className="flex justify-between text-[10px] text-muted-foreground"><span>0</span><span>15</span><span>30+</span></div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-primary/10">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{loading ? '…' : total.toLocaleString('nl')}</span> spelers
              </p>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1 text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" /> Wissen
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            {activeTab === 'heren' ? 'Herenranking' : activeTab === 'dames' ? 'Damesranking' : 'Alle spelers'} — België
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </CardTitle>
          <CardDescription>
            {!loading && <><span className="font-semibold text-foreground">{rows.length}</span> van <span className="font-semibold">{total.toLocaleString('nl')}</span> spelers · klik op naam voor toernooihistoriek</>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && rows.length === 0 ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <Search className="h-8 w-8 opacity-30" /><p>Geen spelers gevonden.</p>
            </div>
          ) : (
            <PlayerRows
              rows={(sortDir === 'desc' ? [...rows].reverse() : rows).map(p => ({
                p: { ...p, avatarUrl: '' },
                tot: { wins: p.wins, losses: p.losses, total: p.total, pct: p.pct },
              }))}
              showClub={clubId === 0}
              sortKey={sortBy}
              sortDir={sortDir}
              onSort={k => { if (k === sortBy) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortBy(k); setSortDir('asc'); } }}
            />
          )}

          {!loading && rows.length < total && (
            <div className="flex items-center justify-center gap-3 py-4">
              <span className="text-sm text-muted-foreground">{rows.length} van {total.toLocaleString('nl')}</span>
              <Button variant="outline" size="sm" onClick={loadMore} disabled={loadingMore} className="gap-2">
                {loadingMore && <Loader2 className="h-3 w-3 animate-spin" />}
                Toon meer ({Math.min(API_PAGE_SIZE, total - rows.length)} volgende)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── België tabs wrapper ─────────────────────────────────────────────────────
function BelgieSection() {
  const [tab, setTab] = useState<BelgieTab>('allen');
  return (
    <Tabs value={tab} onValueChange={v => setTab(v as BelgieTab)}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="heren"><Crown className="mr-1.5 h-3.5 w-3.5" />Heren</TabsTrigger>
        <TabsTrigger value="dames"><Crown className="mr-1.5 h-3.5 w-3.5" />Dames</TabsTrigger>
        <TabsTrigger value="allen"><Users className="mr-1.5 h-3.5 w-3.5" />Alle</TabsTrigger>
        <TabsTrigger value="duos"><Users className="mr-1.5 h-3.5 w-3.5" />Duo's <span className="ml-1 hidden sm:inline text-muted-foreground">({BELGIE_DUOS.length.toLocaleString('nl')})</span></TabsTrigger>
      </TabsList>
      <TabsContent value={tab} className="mt-5">
        {tab === 'duos'
          ? <DuoTable duos={BELGIE_DUOS} label="België" />
          : <BelgieLeaderboard key={tab} />
        }
      </TabsContent>
    </Tabs>
  );
}

// ─── Duo tabel ────────────────────────────────────────────────────────────────
interface DuoFilterState { zoek: string; cat: 'alle' | 'M' | 'V' | 'X'; minGespeeld: number; sortKey: DuoSortKey; }
const DEFAULT_DUO: DuoFilterState = { zoek: '', cat: 'alle', minGespeeld: 3, sortKey: 'winpct' };

function DuoWinBar({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-400')}
          style={{ width: `${pct}%` }} />
      </div>
      <span className={cn('text-sm font-bold font-mono w-12 text-right shrink-0',
        pct >= 70 ? 'text-green-500' : pct >= 50 ? 'text-yellow-500' : 'text-red-400')}>{pct}%</span>
    </div>
  );
}

function DuoTable({ duos, label }: { duos: Duo[]; label: string }) {
  const [f, setF] = useState<DuoFilterState>(DEFAULT_DUO);
  const rows = useMemo(() => {
    let r = [...duos];
    if (f.zoek.trim()) { const q = f.zoek.toLowerCase(); r = r.filter(d => d.speler_a.toLowerCase().includes(q) || d.speler_b.toLowerCase().includes(q)); }
    if (f.cat !== 'alle') r = r.filter(d => d.cat === f.cat);
    r = r.filter(d => d.total >= f.minGespeeld);
    r.sort((a, b) => { switch (f.sortKey) { case 'wins': return b.wins - a.wins; case 'gespeeld': return b.total - a.total; case 'toernooien': return b.toernooien - a.toernooien; default: return b.pct - a.pct || b.total - a.total; } });
    return r;
  }, [duos, f]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Zoek speler in duo…" className="pl-9" value={f.zoek} onChange={e => setF({ ...f, zoek: e.target.value })} />
        </div>
        <Select value={f.cat} onValueChange={v => setF({ ...f, cat: v as 'alle' | 'M' | 'V' | 'X' })}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle categorieën</SelectItem>
            <SelectItem value="M">Enkel heren</SelectItem>
            <SelectItem value="V">Enkel dames</SelectItem>
            <SelectItem value="X">Gemengd</SelectItem>
          </SelectContent>
        </Select>
        <Select value={f.sortKey} onValueChange={v => setF({ ...f, sortKey: v as DuoSortKey })}>
          <SelectTrigger className="w-full sm:w-[210px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="winpct">Hoogste win%</SelectItem>
            <SelectItem value="wins">Meeste overwinningen</SelectItem>
            <SelectItem value="gespeeld">Meeste wedstrijden</SelectItem>
            <SelectItem value="toernooien">Meeste toernooien</SelectItem>
          </SelectContent>
        </Select>
        <Select value={String(f.minGespeeld)} onValueChange={v => setF({ ...f, minGespeeld: Number(v) })}>
          <SelectTrigger className="w-full sm:w-[170px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Min. 3 wedstrijden</SelectItem>
            <SelectItem value="5">Min. 5 wedstrijden</SelectItem>
            <SelectItem value="8">Min. 8 wedstrijden</SelectItem>
            <SelectItem value="12">Min. 12 wedstrijden</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Beste Duo's — {label}</CardTitle>
          <CardDescription><span className="font-semibold text-foreground">{rows.length}</span> koppels · padelstats.be</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[52px] text-center pl-6">#</TableHead>
                <TableHead>Duo</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Toern.</TableHead>
                <TableHead className="text-center">W / V</TableHead>
                <TableHead>Win%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">Geen duo's gevonden.</TableCell></TableRow>}
              {rows.map((duo, i) => {
                const iA = duo.speler_a.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
                const iB = duo.speler_b.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
                return (
                  <TableRow key={`${duo.speler_a}-${duo.speler_b}`} className={cn(i < 3 && 'bg-primary/5')}>
                    <TableCell className="text-center pl-6">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span className="font-bold text-base text-muted-foreground">{i + 1}</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                          <Avatar className="h-9 w-9 border-2 border-background"><AvatarFallback className="text-[10px] font-bold">{iA}</AvatarFallback></Avatar>
                          <Avatar className="h-9 w-9 border-2 border-background"><AvatarFallback className="text-[10px] font-bold">{iB}</AvatarFallback></Avatar>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm leading-tight truncate">{duo.speler_a}</p>
                          <p className="text-xs text-muted-foreground truncate">{duo.speler_b}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className={cn('text-xs', duo.cat === 'M' ? 'border-blue-500/30 text-blue-400' : duo.cat === 'V' ? 'border-pink-500/30 text-pink-400' : 'border-purple-500/30 text-purple-400')}>
                        {duo.cat === 'M' ? 'Heren' : duo.cat === 'V' ? 'Dames' : 'Gemengd'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell"><span className="text-sm font-mono text-muted-foreground">{duo.toernooien}</span></TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-mono">
                        <span className="text-green-500">{duo.wins}</span><span className="text-muted-foreground">/</span>
                        <span className="text-red-400">{duo.losses}</span>
                        <span className="text-muted-foreground text-xs ml-1">({duo.total})</span>
                      </span>
                    </TableCell>
                    <TableCell><DuoWinBar pct={duo.pct} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Hoofd pagina ─────────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const [scope, setScope] = useState<Scope>('solto');
  const [selectedClub, setSelectedClub] = useState<string>('alle');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  function switchScope(s: Scope) {
    setScope(s); setSelectedClub('alle'); setFilters(DEFAULT_FILTERS);
  }

  const isSolto = scope === 'solto';
  const isRegio = scope === 'regio';
  const isBelgie = scope === 'belgie';

  const statsLookup = isSolto ? soltoLookup : regioLookup;
  const duos = isSolto ? SOLTO_DUOS : REGIO_DUOS;

  function applyClub(pool: Player[]) {
    if (!isRegio || selectedClub === 'alle') return pool;
    const id = Number(selectedClub);
    return pool.filter(p => p.club_id === id);
  }

  const herenPool = useMemo(() => applyClub(SOLTO_HEREN as unknown as Player[]), [scope, selectedClub]);
  const damesPool = useMemo(() => applyClub(SOLTO_DAMES as unknown as Player[]), [scope, selectedClub]);
  const allePool  = useMemo(() => applyClub(SOLTO_VOLWASSENEN as unknown as Player[]), [scope, selectedClub]);

  const rHerenPool = useMemo(() => applyClub(REGIO_HEREN as unknown as Player[]), [scope, selectedClub]);
  const rDamesPool = useMemo(() => applyClub(REGIO_DAMES as unknown as Player[]), [scope, selectedClub]);
  const rAllePool  = useMemo(() => applyClub(REGIO_VOLWASSENEN as unknown as Player[]), [scope, selectedClub]);

  const activeHerenPool = isSolto ? herenPool : rHerenPool;
  const activeDamesPool = isSolto ? damesPool : rDamesPool;
  const activeAllePool  = isSolto ? allePool  : rAllePool;

  function getFilteredCount(pool: Player[]) {
    let r = pool.map(p => ({ p, tot: statsLookup(p.id) }));
    if (filters.zoek.trim()) r = r.filter(({ p }) => p.naam.toLowerCase().includes(filters.zoek.toLowerCase()));
    if (filters.niveaus.length > 0) r = r.filter(({ p }) => p.huidig_ranking != null && filters.niveaus.includes(`P${p.huidig_ranking}`));
    if (filters.minWinpct > 0) r = r.filter(({ tot }) => tot.total > 0 && tot.pct >= filters.minWinpct);
    if (filters.minGespeeld > 0) r = r.filter(({ tot }) => tot.total >= filters.minGespeeld);
    return r.length;
  }

  // Totalen voor header
  const totalSpelers = isBelgie ? 206572 : isSolto ? (SOLTO_VOLWASSENEN as unknown as Player[]).length : (REGIO_VOLWASSENEN as unknown as Player[]).length;
  const totalDuos = isBelgie ? BELGIE_DUOS.length : duos.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Club Leaderboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Officiële rankings via padelstats.be —{' '}
            <span className="text-primary font-semibold">{totalSpelers.toLocaleString('nl')} spelers</span>,{' '}
            <span className="text-primary font-semibold">{totalDuos.toLocaleString('nl')} duo's</span>
          </p>
        </div>

        {/* Scope selector */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit">
          {([
            { key: 'solto',  icon: Crown,  label: 'SOLTO', sub: null },
            { key: 'regio',  icon: MapPin, label: 'Regio', sub: '27 clubs' },
            { key: 'belgie', icon: Globe,  label: 'België', sub: '451 clubs' },
          ] as const).map(({ key, icon: Icon, label, sub }) => (
            <button key={key} onClick={() => switchScope(key)}
              className={cn('flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-all',
                scope === key ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground')}>
              <Icon className="h-4 w-4" />
              {label}
              {sub && <Badge variant="outline" className="text-[10px] font-normal py-0 px-1.5 hidden sm:inline-flex">{sub}</Badge>}
            </button>
          ))}
        </div>
      </div>

      {/* ── België scope ── */}
      {isBelgie && <BelgieSection />}

      {/* ── SOLTO / Regio scope ── */}
      {!isBelgie && (
        <>
          {/* Club-filter voor Regio */}
          {isRegio && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <Select value={selectedClub} onValueChange={setSelectedClub}>
                <SelectTrigger className="w-full sm:w-[360px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="alle">Alle {REGIO_CLUB_LIST.length} clubs</SelectItem>
                  {REGIO_CLUB_LIST.map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.naam}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedClub !== 'alle' && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedClub('alle')} className="gap-1 text-muted-foreground">
                  <X className="h-3 w-3" /> Alle clubs
                </Button>
              )}
            </div>
          )}

          <Tabs defaultValue="heren">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="heren"><Crown className="mr-1.5 h-3.5 w-3.5" />Heren <span className="ml-1 hidden sm:inline text-muted-foreground">({activeHerenPool.length.toLocaleString('nl')})</span></TabsTrigger>
              <TabsTrigger value="dames"><Crown className="mr-1.5 h-3.5 w-3.5" />Dames <span className="ml-1 hidden sm:inline text-muted-foreground">({activeDamesPool.length.toLocaleString('nl')})</span></TabsTrigger>
              <TabsTrigger value="allen"><Users className="mr-1.5 h-3.5 w-3.5" />Alle <span className="ml-1 hidden sm:inline text-muted-foreground">({activeAllePool.length.toLocaleString('nl')})</span></TabsTrigger>
              <TabsTrigger value="duos"><Users className="mr-1.5 h-3.5 w-3.5" />Duo's <span className="ml-1 hidden sm:inline text-muted-foreground">({duos.length})</span></TabsTrigger>
            </TabsList>

            {(['heren', 'dames', 'allen'] as const).map(tabKey => {
              const pool = tabKey === 'heren' ? activeHerenPool : tabKey === 'dames' ? activeDamesPool : activeAllePool;
              const label = tabKey === 'heren' ? 'Herenranking' : tabKey === 'dames' ? 'Damesranking' : 'Alle spelers';
              const clubLabel = isRegio && selectedClub !== 'alle'
                ? REGIO_CLUB_LIST.find(c => String(c.id) === selectedClub)?.naam ?? 'Regio'
                : isRegio ? 'Regio (27 clubs)' : 'SOLTO';
              return (
                <TabsContent key={tabKey} value={tabKey} className="mt-5 space-y-4">
                  <FilterPanel filters={filters} setFilters={setFilters}
                    totalShown={getFilteredCount(pool)} totalAvailable={pool.length} />
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{label} — {clubLabel}</CardTitle>
                      <CardDescription>Klik op naam of <BarChart2 className="inline h-3 w-3" /> voor toernooihistoriek.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PlayerTable players={pool} filters={filters} setFilters={setFilters} statsLookup={statsLookup}
                        showClub={isRegio && selectedClub === 'alle'} />
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}

            <TabsContent value="duos" className="mt-5">
              <DuoTable duos={duos} label={isRegio ? 'Regio (27 clubs)' : 'SOLTO'} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
