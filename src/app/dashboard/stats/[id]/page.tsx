'use client';
import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ArrowLeft, TrendingUp, TrendingDown, Minus,
  Trophy, Swords, CheckCircle2, XCircle, Users, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SOLTO_STATS_MAP, getTotaalStats, getSortedToernooien,
  type PlayerStats, type Toernooi, type Match,
} from '@/lib/solto-stats';
import { SOLTO_PLAYERS } from '@/lib/solto-players';

// ─── WL badge ────────────────────────────────────────────────────────────────
function WLBadge({ val }: { val: string }) {
  if (val === 'W') return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-500/15 text-green-500 text-xs font-black border border-green-500/30">W</span>
  );
  if (val === 'L') return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-500/15 text-red-400 text-xs font-black border border-red-500/30">L</span>
  );
  if (val === 'G') return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted text-muted-foreground text-xs font-black border border-muted">G</span>
  );
  return null;
}

// ─── Wedstrijd rij ───────────────────────────────────────────────────────────
function WedstrijdRij({ match }: { match: Match }) {
  const oppNamen = match.opp.map(o => o.naam).join(' & ');
  const oppRank = match.opp.length > 0 ? `P${match.opp.map(o => o.rank).filter(Boolean).join('/')}` : '';
  return (
    <div className={cn(
      'flex items-center justify-between p-3 rounded-lg text-sm',
      match.win ? 'bg-green-500/5 border border-green-500/15' : 'bg-red-500/5 border border-red-500/10'
    )}>
      <div className="flex items-center gap-3 min-w-0">
        {match.win
          ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
          : <XCircle className="h-4 w-4 text-red-400 shrink-0" />}
        <div className="min-w-0">
          <p className="font-medium truncate">{oppNamen || 'Onbekende tegenstanders'}</p>
          <p className="text-xs text-muted-foreground">{match.ronde}{oppRank && ` · ${oppRank}`}</p>
        </div>
      </div>
      <span className={cn(
        'font-mono font-bold text-sm ml-4 shrink-0',
        match.win ? 'text-green-500' : 'text-red-400'
      )}>
        {match.score}
      </span>
    </div>
  );
}

// ─── Toernooi kaart ──────────────────────────────────────────────────────────
function ToernooiKaart({ t, index }: { t: Toernooi; index: number }) {
  // wl kan een string zijn ("WWLWL") of een array (['W','W','L'])
  const wlStr = typeof t.wl === 'string' ? t.wl : (Array.isArray(t.wl) ? t.wl.join('') : '');
  const wlArr = wlStr.split('').filter(c => c === 'W' || c === 'L');
  // punten: kan een getal of array zijn
  const puntenVal = t.punten as unknown;
  const wp = Array.isArray(puntenVal) ? (puntenVal[0] ?? 0) : (typeof puntenVal === 'number' ? puntenVal : 0);

  return (
    <AccordionItem value={`t-${index}`} className="border rounded-xl px-4 mb-2 bg-card">
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-start justify-between w-full mr-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {t.ic
              ? <Users className="h-5 w-5 text-blue-400 shrink-0" />
              : <Trophy className="h-5 w-5 text-primary shrink-0" />}
            <div className="min-w-0 text-left">
              <p className="font-bold truncate">{t.titel}</p>
              <p className="text-xs text-muted-foreground truncate">{t.sub || t.serie}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-0.5">
              {wlArr.map((v, i) => <WLBadge key={i} val={v} />)}
            </div>
            {wp > 0 && (
              <span className="text-xs font-mono font-bold text-primary">{wp}p</span>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        {wlArr.length > 0 && (
          <div className="flex sm:hidden items-center gap-0.5 mb-3 flex-wrap">
            {wlArr.map((v, i) => <WLBadge key={i} val={v} />)}
          </div>
        )}
        <div className="space-y-2">
          {t.matches.length > 0
            ? t.matches.map((m, i) => <WedstrijdRij key={i} match={m} />)
            : <p className="text-sm text-muted-foreground italic">Geen gedetailleerde wedstrijddata beschikbaar.</p>
          }
          {t.url && (
            <a
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-primary underline"
            >
              Bekijk op padelstats.be ↗
            </a>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

// ─── Hoofd pagina ────────────────────────────────────────────────────────────
export default function SpelerStatsPage() {
  const params = useParams();
  const userId = Number(params.id);

  // SOLTO: directe lookup (instant, data al geladen)
  const soltoStats = useMemo(() => SOLTO_STATS_MAP.get(userId), [userId]);
  const soltoBasis = useMemo(() => SOLTO_PLAYERS.find(p => p.id === userId), [userId]);

  // Regio / overig: laden via API route
  const [apiData, setApiData] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (soltoStats || soltoBasis) return;
    setLoading(true);
    setNotFound(false);
    fetch(`/api/player/${userId}`)
      .then(r => r.json())
      .then(data => {
        if (data?.error) setNotFound(true);
        else setApiData(data as PlayerStats);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [userId, soltoStats, soltoBasis]);

  // ── Laadscherm ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Spelersdata laden…</p>
      </div>
    );
  }

  // ── Niet gevonden ────────────────────────────────────────────────────────
  if (notFound || (!loading && !soltoStats && !soltoBasis && !apiData)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4">
        <p className="text-muted-foreground">Speler niet gevonden.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/leaderboard"><ArrowLeft className="mr-2 h-4 w-4" />Terug naar leaderboard</Link>
        </Button>
      </div>
    );
  }

  // ── Data samenstellen ────────────────────────────────────────────────────
  const stats: PlayerStats | undefined = soltoStats ?? apiData ?? undefined;
  const isRegio = !soltoStats && !!apiData;

  const naam = stats?.naam ?? soltoBasis?.naam ?? 'Onbekende speler';
  const rank = stats?.rank ?? soltoBasis?.huidig_ranking ?? 0;
  const pred = stats?.pred ?? soltoBasis?.verwacht_ranking ?? 0;
  const gender = stats?.gender ?? soltoBasis?.geslacht_code ?? 'M';
  const club = isRegio ? (stats?.club ?? '') : 'SOLTO';
  const initials = naam.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase();
  const avatarUrl = `https://picsum.photos/seed/${isRegio ? 'regio' : 'solto'}-${userId}/80/80`;

  const totaal = stats ? getTotaalStats(stats) : null;
  const toernooien = stats ? getSortedToernooien(stats) : [];
  const rankTrend = pred < rank ? 'up' : pred > rank ? 'down' : 'same';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Terug-knop */}
      <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
        <Link href="/dashboard/leaderboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar leaderboard
        </Link>
      </Button>

      {/* Speler header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-20 w-20 border-2 border-primary/30">
              <AvatarImage src={avatarUrl} alt={naam} data-ai-hint="padel player" />
              <AvatarFallback className="text-xl font-black">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-black tracking-tight">{naam}</h1>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {gender === 'V' ? 'Dame' : 'Heer'}
                </Badge>
                <Badge variant="secondary">{club}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Ranking:</span>
                  <Badge className="bg-primary text-primary-foreground font-mono font-black text-base px-3 py-1">
                    P{rank}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Verwacht:</span>
                  <span className={cn(
                    'font-mono font-bold text-base',
                    rankTrend === 'up' ? 'text-green-500' : rankTrend === 'down' ? 'text-red-400' : 'text-muted-foreground'
                  )}>
                    P{pred}
                  </span>
                  {rankTrend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {rankTrend === 'down' && <TrendingDown className="h-4 w-4 text-red-400" />}
                  {rankTrend === 'same' && <Minus className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seizoensstats */}
      {totaal && totaal.total > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Wedstrijden', value: totaal.total, color: '' },
            { label: 'Gewonnen', value: totaal.wins, color: 'text-green-500' },
            { label: 'Verloren', value: totaal.losses, color: 'text-red-400' },
            { label: 'Win %', value: `${totaal.pct}%`, color: totaal.pct >= 50 ? 'text-green-500' : 'text-red-400' },
          ].map(stat => (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-4 pb-4">
                <p className={cn('text-3xl font-black', stat.color)}>{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center py-8 text-muted-foreground gap-2">
            <Swords className="h-5 w-5" />
            <p>Geen wedstrijddata beschikbaar voor dit seizoen.</p>
          </CardContent>
        </Card>
      )}

      {/* Win% per ranking-niveau */}
      {stats && Object.keys(stats.stats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stats per ranking-niveau</CardTitle>
            <CardDescription>Prestaties opgesplitst per circuit-niveau</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.stats).map(([rnk, s]) => {
                const pct = s.nm > 0 ? Math.round((s.nw / s.nm) * 100) : 0;
                return (
                  <div key={rnk} className="flex items-center gap-4">
                    <Badge variant="secondary" className="font-mono w-16 justify-center shrink-0">P{rnk}</Badge>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', pct >= 50 ? 'bg-green-500' : 'bg-red-400')}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono font-bold w-20 text-right shrink-0">
                      {s.nw}/{s.nm} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Toernooi historiek */}
      {toernooien.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">
            Toernooi-historiek
            <Badge variant="outline" className="ml-2 font-normal">{toernooien.length} deelnames</Badge>
          </h2>
          <Accordion type="multiple" className="space-y-0">
            {toernooien.map((t, i) => (
              <ToernooiKaart key={i} t={t} index={i} />
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
