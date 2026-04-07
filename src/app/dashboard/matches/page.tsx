'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, UserPlus, Swords } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from 'date-fns';

const matches = [
  {
    id: "m1",
    type: "Ladder",
    title: "Club Ladder - Week 5",
    date: "2024-08-15",
    time: "18:00",
    location: "Court 1",
    players: [
      { id: "u1", name: "John Doe", avatarUrl: "https://picsum.photos/seed/padel-player-1/80/80", skillLevel: "P500" },
      { id: "u2", name: "Alex Johnson", avatarUrl: "https://picsum.photos/seed/padel-player-2/80/80", skillLevel: "P300" },
    ],
    openSlots: 2,
  },
  {
    id: "m2",
    type: "Friendly",
    title: "Evening Friendly",
    date: "2024-08-16",
    time: "19:30",
    location: "Court 3",
    players: [
      { id: "u3", name: "Maria Garcia", avatarUrl: "https://picsum.photos/seed/padel-player-3/80/80", skillLevel: "P200" },
      { id: "u4", name: "Jane Smith", avatarUrl: "https://picsum.photos/seed/padel-player-4/80/80", skillLevel: "P200" },
      { id: "u5", name: "Mike Brown", avatarUrl: "https://picsum.photos/seed/padel-player-5/80/80", skillLevel: "P100" },
    ],
    openSlots: 1,
  },
  {
    id: "m3",
    type: "Competitive",
    title: "Men's Doubles League",
    date: "2024-08-17",
    time: "20:00",
    location: "Court 2",
    players: [
      { id: "u1", name: "John Doe", avatarUrl: "https://picsum.photos/seed/padel-player-1/80/80", skillLevel: "P500" },
      { id: "u6", name: "Chris Wilson", avatarUrl: "https://picsum.photos/seed/padel-player-6/80/80", skillLevel: "P400" },
      { id: "u7", name: "David Lee", avatarUrl: "https://picsum.photos/seed/padel-player-7/80/80", skillLevel: "P400" },
      { id: "u8", name: "Tom Clark", avatarUrl: "https://picsum.photos/seed/padel-player-8/80/80", skillLevel: "P400" },
    ],
    openSlots: 0,
  },
   {
    id: "m4",
    type: 'Recreational',
    title: 'Beginner\'s Practice',
    date: '2024-08-18',
    time: '10:00',
    location: 'Court 4',
    players: [
      { id: 'u9', name: 'Emily White', avatarUrl: 'https://picsum.photos/seed/padel-player-9/80/80', skillLevel: "P50" },
    ],
    openSlots: 3,
  },
];

type MatchType = "Ladder" | "Friendly" | "Competitive" | "Recreational";

const getBadgeVariant = (matchType: MatchType): React.ComponentProps<typeof Badge>['variant'] => {
    switch (matchType) {
        case "Competitive": return "destructive";
        case "Ladder": return "default";
        case "Friendly": return "secondary";
        default: return "outline";
    }
}

export default function MatchesPage() {
  return (
    <TooltipProvider>
      <div className="space-y-8 max-w-6xl mx-auto pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Upcoming Matches</h1>
            <p className="text-muted-foreground mt-1">Join an open match or view your schedule.</p>
          </div>
          <Button asChild className="bg-primary text-primary-foreground">
            <Link href="/dashboard/matches/create">Create Match</Link>
          </Button>
        </div>
        
        {matches.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((match) => (
              <Card key={match.id} className="flex flex-col hover:border-primary/50 transition-all bg-card shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-xl font-bold">{match.title}</CardTitle>
                    <Badge variant={getBadgeVariant(match.type as MatchType)} className="whitespace-nowrap">
                      {match.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-4 border-t pt-4">
                  <div className="grid gap-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      <span>{format(new Date(match.date), 'EEEE, MMM do')}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4 text-primary" />
                      <span>{match.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4 text-primary" />
                      <span>{match.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center pt-2">
                    <Users className="mr-3 h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 flex-grow">
                      {match.players.map((player) => (
                        <Tooltip key={player.id}>
                          <TooltipTrigger asChild>
                            <Avatar className="h-8 w-8 border-2 border-background ring-1 ring-border">
                              <AvatarImage src={player.avatarUrl} alt={player.name} />
                              <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{player.name} ({player.skillLevel})</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      {match.openSlots > 0 && (
                          <div className="flex -space-x-2">
                            {[...Array(match.openSlots)].map((_, i) => (
                              <div key={i} className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                <UserPlus className="h-3 w-3 text-muted-foreground" />
                              </div>
                            ))}
                          </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/dashboard/matches/${match.id}`}>
                      View Match
                    </Link>
                  </Button>
                  {match.openSlots > 0 && (
                    <Button className="flex-1 bg-primary text-primary-foreground">
                      Join now
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Swords className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl mb-2">No matches found</CardTitle>
            <CardDescription className="max-w-xs mb-8">
              There are no matches scheduled right now.
            </CardDescription>
            <Button asChild size="lg" className="bg-primary text-primary-foreground">
              <Link href="/dashboard/matches/create">Create your first match</Link>
            </Button>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
