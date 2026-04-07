
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Send, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Info,
  Plus
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

// Mock data
const matches = [
    {
    id: "m1",
    type: "Ladder",
    title: "Club Ladder - Week 5",
    date: "2024-08-15",
    time: "18:00",
    location: "Court 1",
    players: [
      { id: "me", name: "John Doe (You)", avatarUrl: "https://picsum.photos/seed/p1/80/80", skillLevel: "P500" },
      { id: "u2", name: "Alex Johnson", avatarUrl: "https://picsum.photos/seed/padel-player-2/80/80", skillLevel: "P300" },
      { id: "u3", name: "Maria Garcia", avatarUrl: "https://picsum.photos/seed/padel-player-3/80/80", skillLevel: "P200" },
      { id: "u4", name: "Jane Smith", avatarUrl: "https://picsum.photos/seed/padel-player-4/80/80", skillLevel: "P200" },
    ],
    openSlots: 0,
    status: 'active', // active | pending_confirmation | confirmed | disputed
  },
];

const chatMessages = [
    {
        id: 'c1',
        author: { name: 'John Doe', avatarUrl: 'https://picsum.photos/seed/padel-player-1/80/80' },
        message: 'Hey everyone! Excited for the match. Who is bringing the balls?',
        timestamp: '2 hours ago',
    },
];

type MatchStatus = 'active' | 'pending_confirmation' | 'confirmed' | 'disputed';

const MatchDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Simulation states
  const [matchStatus, setMatchStatus] = useState<MatchStatus>('active');
  const [confirmations, setConfirmations] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Live Score State
  const [liveScore, setLiveScore] = useState({
    teamA: { sets: 0, games: 0, points: '0' },
    teamB: { sets: 0, games: 0, points: '0' },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const match = matches[0]; // Simplified for simulation

  const pointSequence = ['0', '15', '30', '40', 'AD'];

  const handleIncrementPoint = (team: 'teamA' | 'teamB') => {
    const otherTeam = team === 'teamA' ? 'teamB' : 'teamA';
    const currentPoints = liveScore[team].points;
    const currentIndex = pointSequence.indexOf(currentPoints);

    if (currentPoints === '40' && liveScore[otherTeam].points !== '40' && liveScore[otherTeam].points !== 'AD') {
        handleIncrementGame(team);
    } else if (currentPoints === 'AD') {
        handleIncrementGame(team);
    } else if (currentPoints === '40' && liveScore[otherTeam].points === 'AD') {
        setLiveScore(prev => ({
            ...prev,
            [otherTeam]: { ...prev[otherTeam], points: '40' }
        }));
    } else {
        setLiveScore(prev => ({
            ...prev,
            [team]: { ...prev[team], points: pointSequence[currentIndex + 1] }
        }));
    }
  };

  const handleIncrementGame = (team: 'teamA' | 'teamB') => {
    const currentGames = liveScore[team].games + 1;
    
    if (currentGames >= 6) {
        setLiveScore(prev => ({
            ...prev,
            [team]: { ...prev[team], sets: prev[team].sets + 1, games: 0, points: '0' },
            [team === 'teamA' ? 'teamB' : 'teamA']: { ...prev[team === 'teamA' ? 'teamB' : 'teamA'], games: 0, points: '0' }
        }));
        toast({ title: "Set Point!", description: `Team ${team === 'teamA' ? 'A' : 'B'} won the set.` });
    } else {
        setLiveScore(prev => ({
            ...prev,
            [team]: { ...prev[team], games: currentGames, points: '0' },
            [team === 'teamA' ? 'teamB' : 'teamA']: { ...prev[team === 'teamA' ? 'teamB' : 'teamA'], points: '0' }
        }));
    }
  };

  const handleResetPoints = () => {
      setLiveScore(prev => ({
          ...prev,
          teamA: { ...prev.teamA, points: '0' },
          teamB: { ...prev.teamB, points: '0' },
      }));
  };

  const handleSubmitScore = () => {
    setMatchStatus('pending_confirmation');
    toast({
        title: "Score Submitted!",
        description: "Waiting for other players to verify the result.",
    });
  };

  const handleVerifyScore = (verified: boolean) => {
    if (verified) {
        setConfirmations(prev => prev + 1);
        if (confirmations + 1 >= 2) {
            setMatchStatus('confirmed');
            toast({
                title: "Match Confirmed!",
                description: "The result has been finalized and recorded.",
            });
        } else {
            toast({
                title: "Verification Recorded",
                description: "Waiting for remaining confirmations.",
            });
        }
    } else {
        setMatchStatus('disputed');
        toast({
            variant: "destructive",
            title: "Result Disputed",
            description: "An admin or the match initiator will need to resolve this.",
        });
    }
  };

  const getStatusLabel = (status: MatchStatus) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending_confirmation': return 'Pending Confirmation';
      case 'confirmed': return 'Finalized';
      case 'disputed': return 'Disputed';
      default: return status;
    }
  }

  if (!mounted) return null;

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/matches">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Link>
        </Button>
        <Badge variant={matchStatus === 'confirmed' ? 'default' : matchStatus === 'disputed' ? 'destructive' : 'secondary'} className="uppercase font-black tracking-widest px-3 py-1">
            {getStatusLabel(matchStatus)}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          
          {matchStatus === 'active' && (
            <Card className="bg-primary/5 border-primary/20 overflow-hidden shadow-2xl">
                <CardHeader className="bg-primary/10 py-3 border-b border-primary/10">
                    <CardTitle className="text-sm font-black flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            LIVE SCOREBOARD
                        </span>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] font-bold uppercase text-primary" onClick={handleResetPoints}>Reset Points</Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-[1fr_80px_80px_100px] items-center text-center py-6 px-4">
                        <div className="text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">Teams</div>
                        <div className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Sets</div>
                        <div className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Games</div>
                        <div className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Points</div>

                        <div className="flex items-center gap-3 text-left py-4">
                            <div className="flex -space-x-2">
                                <Avatar className="h-8 w-8 ring-2 ring-background border-none shadow-sm"><AvatarImage src={match.players[0].avatarUrl} /></Avatar>
                                <Avatar className="h-8 w-8 ring-2 ring-background border-none shadow-sm"><AvatarImage src={match.players[1].avatarUrl} /></Avatar>
                            </div>
                            <span className="font-bold text-sm truncate">Team A</span>
                        </div>
                        <div className="text-3xl font-black text-primary">{liveScore.teamA.sets}</div>
                        <div className="text-3xl font-black">{liveScore.teamA.games}</div>
                        <div className="flex flex-col items-center gap-1">
                            <div className={cn(
                                "text-4xl font-black italic px-4 py-1 rounded-lg",
                                liveScore.teamA.points === 'AD' ? "bg-primary text-primary-foreground" : "text-primary"
                            )}>
                                {liveScore.teamA.points}
                            </div>
                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-primary/20" onClick={() => handleIncrementPoint('teamA')}>
                                <Plus className="h-4 w-4 text-primary" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-3 text-left py-4">
                            <div className="flex -space-x-2">
                                <Avatar className="h-8 w-8 ring-2 ring-background border-none shadow-sm"><AvatarImage src={match.players[2].avatarUrl} /></Avatar>
                                <Avatar className="h-8 w-8 ring-2 ring-background border-none shadow-sm"><AvatarImage src={match.players[3].avatarUrl} /></Avatar>
                            </div>
                            <span className="font-bold text-sm truncate">Team B</span>
                        </div>
                        <div className="text-3xl font-black text-primary">{liveScore.teamB.sets}</div>
                        <div className="text-3xl font-black">{liveScore.teamB.games}</div>
                        <div className="flex flex-col items-center gap-1">
                            <div className={cn(
                                "text-4xl font-black italic px-4 py-1 rounded-lg",
                                liveScore.teamB.points === 'AD' ? "bg-primary text-primary-foreground" : "text-primary"
                            )}>
                                {liveScore.teamB.points}
                            </div>
                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-primary/20" onClick={() => handleIncrementPoint('teamB')}>
                                <Plus className="h-4 w-4 text-primary" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-primary/5 p-4 border-t border-primary/10">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-primary text-primary-foreground font-black h-12 shadow-lg shadow-primary/20 uppercase tracking-widest text-xs">
                                <Trophy className="mr-2 h-4 w-4" />
                                End Match & Finalize Result
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-card border-primary/20">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black italic text-primary">FINAL SCORE SUBMISSION</DialogTitle>
                                <DialogDescription className="text-muted-foreground">Confirm the final game score for each set.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="grid grid-cols-[1fr_80px_80px_80px] items-center gap-4 text-center font-bold text-[10px] uppercase tracking-widest text-muted-foreground">
                                    <div className="text-left">Teams</div>
                                    <div>Set 1</div>
                                    <div>Set 2</div>
                                    <div>Set 3</div>
                                </div>
                                <div className="grid grid-cols-[1fr_80px_80px_80px] items-center gap-4">
                                    <div className="font-bold text-sm truncate">Team A</div>
                                    <Input type="number" defaultValue={liveScore.teamA.games} className="text-center font-black h-12 text-lg bg-muted/50 border-primary/20" />
                                    <Input type="number" defaultValue={0} className="text-center font-black h-12 text-lg bg-muted/50 border-primary/20" />
                                    <Input type="number" defaultValue={0} className="text-center font-black h-12 text-lg bg-muted/50 border-primary/20" />
                                </div>
                                <div className="grid grid-cols-[1fr_80px_80px_80px] items-center gap-4">
                                    <div className="font-bold text-sm truncate">Team B</div>
                                    <Input type="number" defaultValue={liveScore.teamB.games} className="text-center font-black h-12 text-lg bg-muted/50 border-primary/20" />
                                    <Input type="number" defaultValue={0} className="text-center font-black h-12 text-lg bg-muted/50 border-primary/20" />
                                    <Input type="number" defaultValue={0} className="text-center font-black h-12 text-lg bg-muted/50 border-primary/20" />
                                </div>
                                <div className="bg-primary/10 p-4 rounded-xl flex gap-3 border border-primary/20">
                                    <Info className="h-5 w-5 text-primary shrink-0" />
                                    <p className="text-xs leading-relaxed text-muted-foreground">At least 2 other players must verify this score before it is officially recorded in the rankings.</p>
                                </div>
                            </div>
                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button variant="outline" className="flex-1 font-bold uppercase text-[10px] tracking-widest">Cancel</Button>
                                </DialogClose>
                                <Button className="flex-1 bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest" onClick={handleSubmitScore}>Submit for Verification</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
          )}

          {matchStatus === 'pending_confirmation' && (
            <Card className="border-accent bg-accent/5 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-accent uppercase font-black tracking-widest text-sm">
                        <CheckCircle2 className="h-5 w-5" />
                        Verification Required
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">Confirm the result submitted by the match initiator.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-card rounded-xl p-8 border-2 border-dashed border-accent/20 flex items-center justify-between shadow-inner">
                        <div className="space-y-2">
                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Final Score Report</p>
                            <p className="text-4xl font-black italic tracking-tighter">
                                6-4, 6-3
                            </p>
                        </div>
                        <div className="text-right">
                            <Badge variant="outline" className="border-accent text-accent font-black uppercase tracking-widest text-[10px] px-3 py-1.5">{confirmations}/3 Confirmed</Badge>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="destructive" className="h-14 font-black uppercase tracking-widest text-xs shadow-lg shadow-destructive/20" onClick={() => handleVerifyScore(false)}>
                            <XCircle className="mr-2 h-5 w-5" />
                            Disagree
                        </Button>
                        <Button className="h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20" onClick={() => handleVerifyScore(true)}>
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Confirm & Save
                        </Button>
                    </div>
                </CardContent>
            </Card>
          )}

          {matchStatus === 'confirmed' && (
            <Card className="border-primary bg-primary/5 shadow-2xl">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 shadow-inner border border-primary/20">
                        <Trophy className="h-10 w-10 text-primary drop-shadow-md" />
                    </div>
                    <CardTitle className="text-4xl font-black italic tracking-tighter text-primary">MATCH FINALIZED</CardTitle>
                    <CardDescription className="text-muted-foreground font-medium uppercase tracking-widest text-[10px] mt-2">Verified result recorded in rankings</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center gap-12 py-10">
                        <div className="text-center space-y-4">
                            <div className="flex -space-x-3 justify-center">
                                <Avatar className="h-16 w-16 ring-4 ring-background shadow-xl"><AvatarImage src={match.players[0].avatarUrl} /></Avatar>
                                <Avatar className="h-16 w-16 ring-4 ring-background shadow-xl"><AvatarImage src={match.players[1].avatarUrl} /></Avatar>
                            </div>
                            <p className="font-black text-lg uppercase tracking-tight">Team A</p>
                            <p className="text-6xl font-black text-primary italic">6 6</p>
                        </div>
                        <div className="text-muted-foreground font-black text-3xl italic opacity-10 select-none">VS</div>
                        <div className="text-center space-y-4">
                            <div className="flex -space-x-3 justify-center">
                                <Avatar className="h-16 w-16 ring-4 ring-background shadow-xl"><AvatarImage src={match.players[2].avatarUrl} /></Avatar>
                                <Avatar className="h-16 w-16 ring-4 ring-background shadow-xl"><AvatarImage src={match.players[3].avatarUrl} /></Avatar>
                            </div>
                            <p className="font-black text-lg uppercase tracking-tight">Team B</p>
                            <p className="text-6xl font-black italic text-muted-foreground/50">4 3</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 border-t border-primary/10 pt-8">
                    <Button className="w-full h-14 uppercase font-black tracking-widest text-xs shadow-lg shadow-primary/20" asChild>
                        <Link href="/dashboard/highlights">
                            <Plus className="mr-2 h-5 w-5" />
                            Create Match Highlights
                        </Link>
                    </Button>
                    <Button variant="outline" className="w-full h-12 uppercase font-bold tracking-widest text-[10px] border-primary/20 hover:bg-primary/5" asChild>
                        <Link href="/dashboard/social">
                            <Send className="mr-2 h-4 w-4" />
                            Share Victory to Feed
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
          )}

          <Card className="border-none shadow-lg bg-card">
            <CardHeader className="flex flex-row items-center justify-between border-b border-muted">
                <div>
                    <CardTitle className="text-2xl font-black italic tracking-tighter">{match.title}</CardTitle>
                    <CardDescription className="flex items-center gap-3 mt-2 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-primary" /> {match.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-primary" /> {match.time}</span>
                    </CardDescription>
                </div>
                <Badge variant="outline" className="border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest px-3 py-1">{match.type}</Badge>
            </CardHeader>
            <CardContent className="pt-8">
                <div className="grid gap-10 md:grid-cols-2">
                    <div className="space-y-6">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-muted pb-2 block">Match Roster</Label>
                        <div className="space-y-3">
                            {match.players.map(player => (
                                <div key={player.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-transparent group hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                                            <AvatarImage src={player.avatarUrl} alt={player.name} />
                                            <AvatarFallback>{player.name.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-black text-sm tracking-tight">{player.name}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{player.skillLevel}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="text-[8px] font-black uppercase tracking-tighter bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors px-2">PLAYER</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-muted pb-2 block">Match Location</Label>
                        <Card className="bg-primary/5 border-primary/10 overflow-hidden">
                            <CardContent className="p-6 flex items-center gap-5">
                                <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0 shadow-inner">
                                    <MapPin className="h-7 w-7 text-primary" />
                                </div>
                                <div>
                                    <p className="font-black text-lg tracking-tight">{match.location}</p>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">PadelVerse Central Hub</p>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest h-12 border-muted hover:border-primary/50">
                                <MapPin className="mr-2 h-4 w-4 text-primary" />
                                Directions
                            </Button>
                            <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest h-12 border-muted hover:border-primary/50">
                                <Send className="mr-2 h-4 w-4 text-primary" />
                                Invite
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-1">
          <Card className="flex flex-col h-[calc(100vh-14rem)] min-h-[600px] border-none shadow-xl bg-card">
            <CardHeader className="border-b border-muted bg-muted/10 py-4">
              <CardTitle className="text-sm font-black italic uppercase tracking-widest flex items-center gap-2">
                  <Send className="h-4 w-4 text-primary" />
                  Match Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-6">
                    <div className="space-y-8">
                        {chatMessages.map(msg => (
                           <div key={msg.id} className="flex items-start gap-4">
                                <Avatar className="h-10 w-10 shrink-0 border-2 border-background shadow-md">
                                    <AvatarImage src={msg.author.avatarUrl} alt={msg.author.name} />
                                    <AvatarFallback>{msg.author.name.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary truncate">{msg.author.name}</p>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{msg.timestamp}</p>
                                    </div>
                                    <div className="bg-muted/30 rounded-2xl rounded-tl-none p-4 text-sm shadow-inner border border-muted/20">
                                        <p className="leading-relaxed font-medium text-foreground/90">{msg.message}</p>
                                    </div>
                                </div>
                           </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-6 border-t border-muted bg-muted/5">
              <div className="relative w-full">
                <Input placeholder="Message your team..." className="pr-14 h-14 rounded-2xl bg-muted/50 border-muted focus:ring-primary focus:border-primary font-medium" />
                <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-10 w-10 rounded-xl hover:bg-primary/20 hover:text-primary transition-colors">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsPage;
