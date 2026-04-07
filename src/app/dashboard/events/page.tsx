'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter, PlusCircle, Trophy, Users, ClipboardList, Swords, Calendar, Clock, MapPin, CalendarDays } from "lucide-react";
import Link from 'next/link';
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import Image from 'next/image';
import { format } from 'date-fns';

type EventType = 'Tournament' | 'Social' | 'Training' | 'Fun Match';

const eventIcons: Record<EventType, any> = {
  Tournament: Trophy,
  Social: Users,
  Training: ClipboardList,
  'Fun Match': Swords,
};

const events = [
  {
    id: "evt1",
    status: "upcoming",
    title: "Summer Club Tournament",
    type: "Tournament" as EventType,
    date: "2024-09-07",
    time: "09:00",
    location: "Main Club Courts",
    participants: 14,
    maxParticipants: 32,
    imageUrl: 'https://picsum.photos/seed/padel-tournament-1/600/400',
    imageHint: 'padel trophy',
  },
  {
    id: "evt2",
    status: "upcoming",
    title: "Friday Night Social Mixer",
    type: "Social" as EventType,
    date: "2024-08-30",
    time: "19:00",
    location: "Courts 3 & 4",
    participants: 22,
    maxParticipants: 24,
    imageUrl: 'https://picsum.photos/seed/padel-social-1/600/400',
    imageHint: 'padel players talking',
  },
  {
    id: "evt3",
    status: "upcoming",
    title: "Advanced Bandeja Training",
    type: "Training" as EventType,
    date: "2024-09-02",
    time: "18:00",
    location: "Court 1",
    participants: 5,
    maxParticipants: 8,
    imageUrl: 'https://picsum.photos/seed/padel-training-1/600/400',
    imageHint: 'padel coach',
  },
  {
    id: "evt4",
    status: "past",
    title: "King of the Court",
    type: "Fun Match" as EventType,
    date: "2024-08-20",
    time: "18:30",
    location: "All Courts",
    participants: 18,
    maxParticipants: 20,
    imageUrl: 'https://picsum.photos/seed/padel-fun-match-1/600/400',
    imageHint: 'padel match sunset',
  },
   {
    id: "evt5",
    status: "past",
    title: "Beginner's Intro Clinic",
    type: "Training" as EventType,
    date: "2024-08-18",
    time: "10:00",
    location: "Court 4",
    participants: 12,
    maxParticipants: 12,
    imageUrl: 'https://picsum.photos/seed/padel-clinic-1/600/400',
    imageHint: 'padel lesson',
  },
];

const upcomingEvents = events.filter(e => e.status === 'upcoming');
const pastEvents = events.filter(e => e.status === 'past');

export default function EventsPage() {
    return (
        <TooltipProvider>
            <div className="space-y-8 max-w-6xl mx-auto">
                 <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Club Events</h1>
                        <p className="mt-1 text-lg text-muted-foreground">
                            Tournaments, social mixers, and training sessions.
                        </p>
                    </div>
                    <Button asChild className="bg-primary text-primary-foreground">
                        <Link href="/dashboard/events/create">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Event
                        </Link>
                    </Button>
                </div>
                
                 <Tabs defaultValue="upcoming" className="w-full">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                         <TabsList className="grid grid-cols-2 w-full max-w-[400px] h-12 bg-muted/50 p-1">
                            <TabsTrigger value="upcoming" className="font-bold text-[10px] uppercase tracking-widest">Upcoming</TabsTrigger>
                            <TabsTrigger value="past" className="font-bold text-[10px] uppercase tracking-widest">Past Gallery</TabsTrigger>
                        </TabsList>
                        <div className="flex items-center gap-2">
                             <Select defaultValue="all">
                                <SelectTrigger className="w-[180px] bg-card">
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All types</SelectItem>
                                    <SelectItem value="Tournament">Tournaments</SelectItem>
                                    <SelectItem value="Social">Social Mixers</SelectItem>
                                    <SelectItem value="Training">Training</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon" className="h-10 w-10">
                                <ListFilter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <TabsContent value="upcoming" className="mt-8">
                        {upcomingEvents.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {upcomingEvents.map(event => {
                                    const EventIcon = eventIcons[event.type as EventType];
                                    return (
                                    <Card key={event.id} className="flex flex-col border-none shadow-lg overflow-hidden group hover:translate-y-[-4px] transition-all bg-card">
                                        <div className="relative aspect-video overflow-hidden">
                                            <Image src={event.imageUrl} alt={event.title} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={event.imageHint} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            <Badge variant="secondary" className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white border-none font-bold text-[10px]">
                                                <EventIcon className="h-3 w-3 text-primary" />
                                                {event.type}
                                            </Badge>
                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <h3 className="font-black text-xl leading-tight drop-shadow-md">{event.title}</h3>
                                            </div>
                                        </div>
                                        <CardContent className="pt-6 flex-grow space-y-4 px-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center text-sm font-medium text-muted-foreground">
                                                    <Calendar className="mr-3 h-4 w-4 text-primary" />
                                                    <span>{format(new Date(event.date), 'PPPP')}</span>
                                                </div>
                                                <div className="flex items-center text-sm font-medium text-muted-foreground">
                                                    <Clock className="mr-3 h-4 w-4 text-primary" />
                                                    <span>{event.time}</span>
                                                </div>
                                                <div className="flex items-center text-sm font-medium text-muted-foreground">
                                                    <MapPin className="mr-3 h-4 w-4 text-primary" />
                                                    <span>{event.location}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 pt-4 border-t border-muted">
                                                <div className="flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                    <Users className="mr-2 h-4 w-4" />
                                                    <span>{event.participants} / {event.maxParticipants} Spots</span>
                                                </div>
                                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }} />
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-6 pt-0 mt-auto">
                                            {event.participants < event.maxParticipants ? (
                                                <Button className="w-full bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs h-11" asChild>
                                                    <Link href={`/dashboard/events/${event.id}`}>
                                                        RSVP Now
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <Button variant="secondary" disabled className="w-full h-11 font-black uppercase tracking-widest text-xs">Waiting List Full</Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                )})}
                            </div>
                        ) : (
                            <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed bg-muted/10">
                                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                                    <CalendarDays className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <CardTitle className="text-2xl mb-2">No upcoming events</CardTitle>
                                <CardDescription className="max-w-xs mb-8">
                                    The club hasn't scheduled any events recently. Check back later or create your own social match!
                                </CardDescription>
                                <Button asChild size="lg" className="bg-primary text-primary-foreground">
                                    <Link href="/dashboard/matches/create">Create a match</Link>
                                </Button>
                            </Card>
                        )}
                    </TabsContent>
                    
                     <TabsContent value="past" className="mt-8">
                         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {pastEvents.map(event => {
                                 const EventIcon = eventIcons[event.type as EventType];
                                return (
                                <Card key={event.id} className="flex flex-col opacity-80 border-none shadow-md overflow-hidden bg-card grayscale hover:grayscale-0 transition-all">
                                    <div className="relative aspect-video">
                                        <Image src={event.imageUrl} alt={event.title} fill className="object-cover" data-ai-hint={event.imageHint} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <Badge variant="secondary" className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 text-white border-none font-bold text-[10px]">
                                            <EventIcon className="h-3 w-3" />
                                            {event.type}
                                        </Badge>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <h3 className="font-bold text-lg">{event.title}</h3>
                                        </div>
                                    </div>
                                    <CardFooter className="p-4 pt-4 border-t bg-muted/5">
                                         <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-widest border-muted hover:bg-primary hover:text-primary-foreground" asChild>
                                            <Link href={`/dashboard/events/${event.id}`}>
                                                View gallery
                                            </Link>
                                         </Button>
                                    </CardFooter>
                                </Card>
                            )})}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </TooltipProvider>
    );
}
