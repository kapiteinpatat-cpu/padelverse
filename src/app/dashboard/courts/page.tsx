'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Clock, MapPin, CheckCircle2, AlertTriangle, UserPlus, X, User, Plus, Search, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

const TIMES = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00', '21:30'];

const COURTS = [
  { id: 'c1', name: 'Court 1', type: 'Indoor', surface: 'Panoramic Blue', status: 'available' },
  { id: 'c2', name: 'Court 2', type: 'Indoor', surface: 'Panoramic Blue', status: 'available' },
  { id: 'c3', name: 'Court 3', type: 'Outdoor', surface: 'Classic Green', status: 'available' },
  { id: 'c4', name: 'Court 4', type: 'Outdoor', surface: 'Classic Green', status: 'maintenance' },
];

const MOCK_AVAILABILITY: Record<string, Record<string, boolean>> = {
  'c1': { '08:00': false, '09:30': true, '11:00': true, '12:30': false, '14:00': true, '15:30': true, '17:00': false, '18:30': true, '20:00': true, '21:30': true },
  'c2': { '08:00': true, '09:30': true, '11:00': false, '12:30': false, '14:00': true, '15:30': false, '17:00': true, '18:30': true, '20:00': false, '21:30': true },
  'c3': { '08:00': false, '09:30': false, '11:00': true, '12:30': true, '14:00': true, '15:30': true, '17:00': true, '18:30': false, '20:00': true, '21:30': true },
  'c4': { '08:00': false, '09:30': false, '11:00': false, '12:30': false, '14:00': false, '15:30': false, '17:00': false, '18:30': false, '20:00': false, '21:30': false },
};

const MOCK_FRIENDS = [
  { id: 'f1', name: 'Alex Johnson', avatar: 'https://picsum.photos/seed/p2/80/80', skill: 'P300' },
  { id: 'f2', name: 'Maria Garcia', avatar: 'https://picsum.photos/seed/p3/80/80', skill: 'P200' },
  { id: 'f3', name: 'Chris Wilson', avatar: 'https://picsum.photos/seed/p6/80/80', skill: 'P400' },
  { id: 'f4', name: 'Sarah Miller', avatar: 'https://picsum.photos/seed/p2/80/80', skill: 'P250' },
];

const MOCK_MEMBERS = [
  { id: 'm10', name: 'David Lee', avatar: 'https://picsum.photos/seed/p7/80/80', skill: 'P400' },
  { id: 'm11', name: 'Jane Smith', avatar: 'https://picsum.photos/seed/p4/80/80', skill: 'P200' },
  { id: 'm12', name: 'Mike Ross', avatar: 'https://picsum.photos/seed/p3/80/80', skill: 'P500' },
  { id: 'm13', name: 'Jessica Brown', avatar: 'https://picsum.photos/seed/p10/80/80', skill: 'P100' },
  { id: 'm14', name: 'Tom Clark', avatar: 'https://picsum.photos/seed/p8/80/80', skill: 'P400' },
];

type Player = { id: string, name: string, avatar: string | null, skill?: string };

export default function CourtBookingPage() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [filter, setFilter] = useState<'all' | 'indoor' | 'outdoor'>('all');
  const [selectedSlot, setSelectedSlot] = useState<{ courtId: string, time: string } | null>(null);
  const [playerSelectorOpen, setPlayerSelectorOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [roster, setRoster] = useState<(Player | null)[]>([
    { id: 'me', name: 'John Doe (You)', avatar: 'https://picsum.photos/seed/p1/80/80', skill: 'P500' },
    null,
    null,
    null
  ]);

  const filteredFriends = MOCK_FRIENDS.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredMembers = MOCK_MEMBERS.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredCourts = COURTS.filter(c => {
    if (filter === 'all') return true;
    return c.type.toLowerCase() === filter;
  });

  const handleBook = () => {
    if (!selectedSlot) return;
    const court = COURTS.find(c => c.id === selectedSlot.courtId);
    toast({
      title: "Booking Confirmed!",
      description: `${court?.name} reserved for ${format(date!, 'PPP')} at ${selectedSlot.time}.`,
    });
    setSelectedSlot(null);
    setRoster([{ id: 'me', name: 'John Doe (You)', avatar: 'https://picsum.photos/seed/p1/80/80', skill: 'P500' }, null, null, null]);
  };

  const addPlayer = (player: Player) => {
    if (activeSlotIndex === null) return;
    const newRoster = [...roster];
    newRoster[activeSlotIndex] = player;
    setRoster(newRoster);
    setPlayerSelectorOpen(false);
    setActiveSlotIndex(null);
    setSearchQuery('');
  };

  const addGuest = (index: number) => {
    const newRoster = [...roster];
    newRoster[index] = { id: `guest-${Date.now()}`, name: `Guest ${index + 1}`, avatar: null };
    setRoster(newRoster);
  };

  const removePlayer = (index: number) => {
    if (index === 0) return;
    const newRoster = [...roster];
    newRoster[index] = null;
    setRoster(newRoster);
  };

  const isRosterFull = roster.every(p => p !== null);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Court Availability</h1>
          <p className="mt-2 text-lg text-muted-foreground">Real-time overview of bookable fields.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(day) => day < new Date(new Date().setHours(0,0,0,0))}
              />
            </PopoverContent>
          </Popover>
          
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="hidden sm:block">
            <TabsList>
              <TabsTrigger value="all">All Courts</TabsTrigger>
              <TabsTrigger value="indoor">Indoor</TabsTrigger>
              <TabsTrigger value="outdoor">Outdoor</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="overflow-x-auto">
          <CardHeader className="border-b bg-muted/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Available</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded-full bg-muted" />
                  <span className="text-muted-foreground">Occupied</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded-full bg-destructive/50" />
                  <span className="text-muted-foreground">Maintenance</span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">Updated just now</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-[150px_repeat(10,1fr)] border-b">
                <div className="p-4 bg-muted/20 font-bold border-r">Courts</div>
                {TIMES.map(time => (
                  <div key={time} className="p-4 text-center text-xs font-semibold bg-muted/5 border-r last:border-r-0">
                    {time}
                  </div>
                ))}
              </div>

              {filteredCourts.map(court => (
                <div key={court.id} className="grid grid-cols-[150px_repeat(10,1fr)] border-b last:border-b-0 group">
                  <div className="p-4 border-r bg-card flex flex-col justify-center">
                    <p className="font-bold">{court.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{court.type} • {court.surface}</p>
                  </div>
                  {TIMES.map(time => {
                    const isAvailable = court.status !== 'maintenance' && MOCK_AVAILABILITY[court.id][time];
                    const isMaintenance = court.status === 'maintenance';
                    
                    return (
                      <div key={`${court.id}-${time}`} className="border-r last:border-r-0 p-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              disabled={!isAvailable}
                              onClick={() => setSelectedSlot({ courtId: court.id, time })}
                              className={cn(
                                "w-full h-12 rounded-md transition-all flex items-center justify-center relative overflow-hidden",
                                isAvailable 
                                  ? "bg-primary/10 hover:bg-primary/30 border border-primary/20 text-primary cursor-pointer" 
                                  : isMaintenance
                                  ? "bg-destructive/10 text-destructive/50 cursor-not-allowed"
                                  : "bg-muted/30 text-muted-foreground/30 cursor-not-allowed"
                              )}
                            >
                              {isAvailable ? (
                                <CheckCircle2 className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              ) : isMaintenance ? (
                                <AlertTriangle className="h-4 w-4" />
                              ) : (
                                <Clock className="h-4 w-4 opacity-20" />
                              )}
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle className="text-2xl">Confirm Court Booking</DialogTitle>
                              <DialogDescription>Every match requires 4 players. Add friends or guests to continue.</DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-6 my-4">
                              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Clock className="h-5 w-5 text-primary" />
                                  <div>
                                    <p className="font-bold">{court.name}</p>
                                    <p className="text-sm text-muted-foreground">{date ? format(date, 'MMM do') : ''} at {time}</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="border-primary/20 text-primary">90 Min</Badge>
                              </div>

                              <div className="space-y-3">
                                <Label className="text-base flex items-center justify-between">
                                  Match Roster
                                  <span className="text-xs font-normal text-muted-foreground">{roster.filter(p => p !== null).length}/4 Assigned</span>
                                </Label>
                                <div className="grid gap-2">
                                  {roster.map((player, idx) => (
                                    <div key={idx} className={cn(
                                      "flex items-center justify-between p-3 rounded-md border transition-all",
                                      player ? "bg-card border-primary/30" : "bg-muted/30 border-dashed"
                                    )}>
                                      <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                                          {idx + 1}
                                        </div>
                                        {player ? (
                                          <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                              <AvatarImage src={player.avatar || ''} />
                                              <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                              <span className="text-sm font-medium">{player.name}</span>
                                              {player.skill && <span className="text-[10px] text-muted-foreground">{player.skill}</span>}
                                            </div>
                                          </div>
                                        ) : (
                                          <span className="text-sm text-muted-foreground italic">Empty Slot</span>
                                        )}
                                      </div>
                                      
                                      <div className="flex gap-2">
                                        {player ? (
                                          idx !== 0 && (
                                            <button className="h-8 w-8 text-muted-foreground hover:text-destructive flex items-center justify-center" onClick={() => removePlayer(idx)}>
                                              <X className="h-4 w-4" />
                                            </button>
                                          )
                                        ) : (
                                          <div className="flex gap-1">
                                            <Button 
                                              variant="outline" 
                                              size="sm" 
                                              className="h-8 text-[10px]" 
                                              onClick={() => {
                                                setActiveSlotIndex(idx);
                                                setPlayerSelectorOpen(true);
                                              }}
                                            >
                                              <UserPlus className="h-3 w-3 mr-1" /> Add Player
                                            </Button>
                                            <Button variant="secondary" size="sm" className="h-8 text-[10px]" onClick={() => addGuest(idx)}>
                                              <Plus className="h-3 w-3 mr-1" /> Guest
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {!isRosterFull && (
                                <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg text-xs text-destructive">
                                  <AlertTriangle className="h-4 w-4 shrink-0" />
                                  <p>Please fill all 4 slots before confirming.</p>
                                </div>
                              )}
                            </div>

                            <DialogFooter className="gap-2">
                              <DialogClose asChild>
                                <Button variant="outline" className="flex-1">Cancel</Button>
                              </DialogClose>
                              <Button 
                                onClick={handleBook} 
                                disabled={!isRosterFull}
                                className="flex-1 bg-primary text-primary-foreground"
                              >
                                {isRosterFull ? "Confirm Reservation" : "Assign 4 Players"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-muted/10 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>PadelVerse Central • 123 Sport Avenue</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Matches</CardTitle>
            <CardDescription>Found a court but missing players? Create a match instantly.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full h-12" asChild>
              <a href="/dashboard/matches/create">Create Public Match</a>
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Professional Coaching</CardTitle>
            <CardDescription>Want to improve while you play? Book a trainer instead.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full h-12 bg-primary text-primary-foreground" asChild>
              <a href="/dashboard/training">Find a Trainer</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
