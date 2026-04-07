'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, User, ShieldCheck, Search } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { SOLTO_HEREN, SOLTO_DAMES, SOLTO_VOLWASSENEN, type SoltoPlayer } from '@/lib/solto-players';

type Category = 'open' | 'men' | 'women' | 'mixed';
type SkillLevel = 'P50' | 'P100' | 'P200' | 'P300' | 'P400' | 'P500' | 'P700' | 'P1000';

const LEVELS: SkillLevel[] = ['P50', 'P100', 'P200', 'P300', 'P400', 'P500', 'P700', 'P1000'];
const LEVEL_VALUES: Record<SkillLevel, number> = {
  P50: 50, P100: 100, P200: 200, P300: 300, P400: 400, P500: 500, P700: 700, P1000: 1000
};

function PlayerCard({ player, onInvite }: { player: SoltoPlayer; onInvite: (p: SoltoPlayer) => void }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-muted hover:border-primary/40 hover:bg-primary/5 transition-all">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={player.avatarUrl} alt={player.naam} data-ai-hint="padel player" />
          <AvatarFallback className="text-xs font-bold">{player.initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm">{player.naam}</p>
          <p className="text-xs text-muted-foreground">{player.geslacht}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="font-mono text-xs">P{player.huidig_ranking}</Badge>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onInvite(player)}>
          Uitnodigen
        </Button>
      </div>
    </div>
  );
}

export default function MatchmakingPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [category, setMatchCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [minLevel, setMinLevel] = useState<SkillLevel>('P200');
  const [maxLevel, setMaxLevel] = useState<SkillLevel>('P400');
  const [searchQuery, setSearchQuery] = useState('');

  const beschikbareSpelers = useMemo(() => {
    const minVal = LEVEL_VALUES[minLevel];
    const maxVal = LEVEL_VALUES[maxLevel];

    let pool: SoltoPlayer[];
    if (category === 'men') pool = SOLTO_HEREN;
    else if (category === 'women') pool = SOLTO_DAMES;
    else pool = SOLTO_VOLWASSENEN;

    return pool.filter(p => {
      const inLevel = p.huidig_ranking >= minVal && p.huidig_ranking <= maxVal;
      const inSearch = !searchQuery.trim() || p.naam.toLowerCase().includes(searchQuery.toLowerCase());
      return inLevel && inSearch;
    });
  }, [category, minLevel, maxLevel, searchQuery]);

  const handleInvite = (player: SoltoPlayer) => {
    toast({
      title: "Uitnodiging verstuurd!",
      description: `${player.naam} is uitgenodigd voor jouw wedstrijd.`,
    });
  };

  const handleCreateRequest = () => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      toast({
        title: "Verzoek aangemaakt!",
        description: `Jouw ${category} wedstrijdverzoek staat nu live.`,
      });
      setStep(1);
      setMatchCategory(null);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Match Finder</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Zoek spelers bij jouw niveau — {SOLTO_VOLWASSENEN.length} SOLTO-leden beschikbaar.
        </p>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-black italic text-center text-primary uppercase">Stap 1: Kies categorie</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'open', label: 'Open Wedstrijd', desc: 'Iedereen kan meedoen. Inclusief en flexibel.', icon: Users },
              { id: 'men', label: 'Enkel Heren', desc: 'Alle 4 spelers moeten mannelijk zijn.', icon: User },
              { id: 'women', label: 'Enkel Dames', desc: 'Alle 4 spelers moeten vrouwelijk zijn.', icon: User },
              { id: 'mixed', label: 'Gemengd Dubbel', desc: 'Exact 2 heren + 2 dames vereist.', icon: ShieldCheck },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setMatchCategory(item.id as Category); setStep(2); }}
                className={cn(
                  "p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] active:scale-95 group",
                  category === item.id ? "border-primary bg-primary/10" : "border-muted bg-card hover:border-primary/50"
                )}
              >
                <item.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-1">{item.label}</h3>
                <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && category && (
        <div className="space-y-6">
          <Card className="border-none shadow-2xl bg-card overflow-hidden">
            <CardHeader className="bg-primary/10 border-b border-primary/10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black italic uppercase text-primary">Wedstrijdvoorkeuren</CardTitle>
                <CardDescription>Stel jouw {category} verzoek in.</CardDescription>
              </div>
              <Badge variant="outline" className="border-primary text-primary font-bold uppercase">{category}</Badge>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Niveaubereik</Label>
                  <div className="flex gap-2">
                    <Select value={minLevel} onValueChange={(v) => setMinLevel(v as SkillLevel)}>
                      <SelectTrigger><SelectValue placeholder="Min" /></SelectTrigger>
                      <SelectContent>
                        {LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={maxLevel} onValueChange={(v) => setMaxLevel(v as SkillLevel)}>
                      <SelectTrigger><SelectValue placeholder="Max" /></SelectTrigger>
                      <SelectContent>
                        {LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tijdslot</Label>
                  <Select defaultValue="evening">
                    <SelectTrigger><SelectValue placeholder="Kies tijdslot" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Ochtend (08:00 - 12:00)</SelectItem>
                      <SelectItem value="afternoon">Namiddag (12:00 - 17:00)</SelectItem>
                      <SelectItem value="evening">Avond (17:00 - 22:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/20 border-2 border-dashed border-muted flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-bold text-sm">Ik heb al een partner</p>
                  <p className="text-xs text-muted-foreground">Schrijf je samen in met een teamgenoot.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter className="flex gap-3 pt-6 border-t bg-muted/5">
              <Button variant="outline" className="flex-1 h-12 font-bold uppercase tracking-widest text-[10px]" onClick={() => setStep(1)}>Terug</Button>
              <Button
                className="flex-[2] h-12 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs"
                onClick={handleCreateRequest}
                disabled={isCreating}
              >
                {isCreating ? 'Publiceren...' : 'Wedstrijdverzoek aanmaken'}
              </Button>
            </CardFooter>
          </Card>

          {/* SOLTO spelers zoeken */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">
                Beschikbare SOLTO-spelers
                <Badge className="ml-2 bg-primary/20 text-primary border-primary/30">
                  {beschikbareSpelers.length} gevonden
                </Badge>
              </h3>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Zoek op naam..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {beschikbareSpelers.slice(0, 50).map(player => (
                <PlayerCard key={player.id} player={player} onInvite={handleInvite} />
              ))}
              {beschikbareSpelers.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Geen spelers gevonden in dit niveau.</p>
              )}
              {beschikbareSpelers.length > 50 && (
                <p className="text-center text-xs text-muted-foreground py-2">
                  + {beschikbareSpelers.length - 50} meer — verfijn je zoekopdracht.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
