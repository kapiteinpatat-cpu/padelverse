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
import { Calendar, Clock, MapPin, Users, ArrowLeft, Share2, Bookmark, Trophy, ClipboardList, Swords } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

type EventType = 'Tournament' | 'Social' | 'Training' | 'Fun Match';

const eventIcons: Record<EventType, LucideIcon> = {
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
    description: "Our biggest tournament of the year! All skill levels are welcome to compete in a friendly yet competitive environment. Prizes for winners and a BBQ for all participants.",
    type: "Tournament" as EventType,
    date: "2024-09-07",
    time: "09:00 - 17:00",
    location: "Main Club Courts",
    organizer: { name: 'Club Management', avatarUrl: 'https://placehold.co/80x80/212936/83F969?text=PV' },
    participants: [
      { id: "u1", name: "John Doe", avatarUrl: "https://picsum.photos/seed/padel-player-1/80/80" },
      { id: "u2", name: "Alex Johnson", avatarUrl: "https://picsum.photos/seed/padel-player-2/80/80" },
      { id: "u3", name: "Maria Garcia", avatarUrl: "https://picsum.photos/seed/padel-player-3/80/80" },
      { id: "u4", name: "Jane Smith", avatarUrl: "https://picsum.photos/seed/padel-player-4/80/80" },
      { id: "u5", name: "Mike Brown", avatarUrl: "https://picsum.photos/seed/padel-player-5/80/80" },
      { id: "u6", name: "Chris Wilson", avatarUrl: "https://picsum.photos/seed/padel-player-6/80/80" },
      { id: "u7", name: "David Lee", avatarUrl: "https://picsum.photos/seed/padel-player-7/80/80" },
    ],
    maxParticipants: 32,
    imageUrl: 'https://picsum.photos/seed/padel-tournament-1/1200/400',
    imageHint: 'padel tournament',
  },
  {
    id: "evt2",
    status: "upcoming",
    title: "Friday Night Social Mixer",
    description: "Join us for a relaxed evening of padel. A great way to meet new players and enjoy some friendly matches. We'll rotate partners throughout the night.",
    type: "Social" as EventType,
    date: "2024-08-30",
    time: "19:00",
    location: "Courts 3 & 4",
    organizer: { name: 'Jane Smith', avatarUrl: 'https://picsum.photos/seed/padel-player-4/80/80' },
    participants: [],
    maxParticipants: 24,
    imageUrl: 'https://picsum.photos/seed/padel-social-1/1200/400',
    imageHint: 'padel players social',
  },
];

const media = [
    { id: 'm1', type: 'photo', url: 'https://picsum.photos/seed/past-event-1/600/400', hint: 'padel award' },
    { id: 'm2', type: 'photo', url: 'https://picsum.photos/seed/past-event-2/600/400', hint: 'padel group photo' },
    { id: 'm3', type: 'highlight', url: 'https://picsum.photos/seed/past-event-3/600/400', hint: 'padel final point' },
    { id: 'm4', type: 'photo', url: 'https://picsum.photos/seed/past-event-4/600/400', hint: 'padel celebration' },
];

export default function EventDetailsPage() {
    const params = useParams<{ id: string }>();
    const event = events.find((e) => e.id === params.id) || events[0]; // Fallback to first event for demo
    const EventIcon = eventIcons[event.type];

    if (!event) {
        return (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Event not found</h1>
            <Button asChild variant="link">
              <Link href="/dashboard/events">Back to events</Link>
            </Button>
          </div>
        );
      }

    return(
        <div className="space-y-6">
            <div>
                <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/events">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Events
                    </Link>
                </Button>
            </div>
            
            <Card className="overflow-hidden">
                <div className="relative h-48 md:h-64 w-full">
                    <Image src={event.imageUrl} alt={event.title} fill className="object-cover" data-ai-hint={event.imageHint} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                        <Badge variant="secondary" className="mb-2 text-base">
                            <EventIcon className="mr-2 h-4 w-4" />
                            {event.type}
                        </Badge>
                        <h1 className="text-3xl md:text-5xl font-bold">{event.title}</h1>
                    </div>
                </div>
                
                <CardContent className="p-6">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                             <div>
                                <h2 className="text-xl font-semibold mb-2">About this event</h2>
                                <p className="text-muted-foreground">{event.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-8 w-8 text-primary" />
                                    <div>
                                        <p className="font-semibold">Date</p>
                                        <p className="text-muted-foreground">{new Date(event.date).toLocaleDate-String('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                                 <div className="flex items-center gap-3">
                                    <Clock className="h-8 w-8 text-primary" />
                                    <div>
                                        <p className="font-semibold">Time</p>
                                        <p className="text-muted-foreground">{event.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-8 w-8 text-primary" />
                                    <div>
                                        <p className="font-semibold">Location</p>
                                        <p className="text-muted-foreground">{event.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="h-8 w-8 text-primary" />
                                    <div>
                                        <p className="font-semibold">Participants</p>
                                        <p className="text-muted-foreground">{event.participants.length} / {event.maxParticipants}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-1 space-y-4">
                            <Card className="bg-muted/50">
                                <CardHeader className="p-4">
                                     <CardTitle className="text-lg">Organizer</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                     <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={event.organizer.avatarUrl} alt={event.organizer.name} />
                                            <AvatarFallback>{event.organizer.name.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-semibold">{event.organizer.name}</p>
                                    </div>
                                </CardContent>
                            </Card>
                             <div className="flex items-center gap-2">
                                <Button className="w-full">RSVP Now</Button>
                                <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon"><Bookmark className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Participants ({event.participants.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {event.participants.map(p => (
                            <Link href="/dashboard/profile" key={p.id}>
                                <div className="flex flex-col items-center gap-2 text-center hover:bg-muted/50 p-2 rounded-md transition-colors">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={p.avatarUrl} alt={p.name} data-ai-hint="padel player" />
                                        <AvatarFallback>{p.name.substring(0,2)}</AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm font-medium leading-tight">{p.name}</p>
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Event Media</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                       {media.map(m => (
                           <div key={m.id} className="aspect-video relative rounded-md overflow-hidden">
                               <Image src={m.url} alt="Event media" fill className="object-cover" data-ai-hint={m.hint}/>
                           </div>
                       ))}
                       {media.length === 0 && <p className="text-muted-foreground text-sm col-span-2">No media from this event yet.</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
