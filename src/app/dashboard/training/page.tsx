'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, Star, Search, Sparkles, UserCheck } from "lucide-react";
import { trainers } from '@/lib/trainers';
import { format } from 'date-fns';

const getNextAvailableSlot = (trainer: typeof trainers[0]) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const yStr = date.getFullYear();
        const mStr = String(date.getMonth() + 1).padStart(2, '0');
        const dStr = String(date.getDate()).padStart(2, '0');
        const dateKey = `${yStr}-${mStr}-${dStr}`;
        
        const slots = trainer.availability[dateKey];
        if (slots && slots.length > 0) {
            return {
                date: format(date, 'eee, MMM do'),
                time: slots[0]
            };
        }
    }
    return null;
}

export default function TrainingPage() {
    const levels = ['P50', 'P100', 'P200', 'P300', 'P400', 'P500', 'P700', 'P1000'];

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold tracking-tight">Professional Coaching</h1>
                <p className="mt-1 text-lg text-muted-foreground">
                    Book a specialized lesson with certified padel trainers.
                </p>
            </div>

            <Card className="border-none shadow-xl bg-gradient-to-br from-primary/20 via-card to-card overflow-hidden">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2 text-2xl font-black italic">
                                <Sparkles className="h-6 w-6 text-primary" />
                                SMART BOOKING
                            </CardTitle>
                            <CardDescription className="text-muted-foreground font-medium">Auto-match with the best trainer for your level.</CardDescription>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center hidden sm:flex">
                            <UserCheck className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Your Skill Level</Label>
                        <Select defaultValue="P300">
                             <SelectTrigger className="bg-card">
                                <SelectValue placeholder="Level" />
                            </SelectTrigger>
                            <SelectContent>
                                {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Lesson Format</Label>
                        <Select defaultValue="1:1">
                             <SelectTrigger className="bg-card">
                                <SelectValue placeholder="Format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1:1">1-on-1 Lesson</SelectItem>
                                <SelectItem value="duo">Duo (2 Players)</SelectItem>
                                <SelectItem value="group">Group Clinic</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Duration</Label>
                        <Select defaultValue="60">
                             <SelectTrigger className="bg-card">
                                <SelectValue placeholder="Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="60">60 minutes</SelectItem>
                                <SelectItem value="90">90 minutes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/10 p-6 border-t border-primary/10">
                    <Button size="lg" className="w-full md:w-auto bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs h-12 px-8">
                        <Search className="mr-2 h-4 w-4" />
                        Find Next Available Slot
                    </Button>
                </CardFooter>
            </Card>

            <div>
                <h2 className="text-xl font-bold uppercase tracking-widest text-muted-foreground mb-6">Certified Trainers</h2>
                {trainers.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {trainers.map((trainer) => {
                            const nextSlot = getNextAvailableSlot(trainer);
                            return (
                                <Card key={trainer.id} className="flex flex-col border-none shadow-lg bg-card overflow-hidden group hover:translate-y-[-4px] transition-all">
                                   <CardHeader className="flex flex-row items-start gap-4 p-6 bg-muted/5 group-hover:bg-primary/5 transition-colors">
                                       <Avatar className="h-16 w-16 border-2 border-background shadow-md">
                                           <AvatarImage src={trainer.avatarUrl} alt={trainer.name} />
                                           <AvatarFallback>{trainer.name.substring(0,2)}</AvatarFallback>
                                       </Avatar>
                                       <div className="flex-1 min-w-0">
                                           <CardTitle className="text-xl font-bold truncate group-hover:text-primary transition-colors">{trainer.name}</CardTitle>
                                           <div className="flex items-center gap-1.5 mt-1">
                                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                                <span className="text-xs font-bold">{trainer.rating} <span className="text-muted-foreground font-medium">({trainer.reviews})</span></span>
                                           </div>
                                           <p className="text-xs font-black text-primary mt-2 uppercase tracking-widest">€{trainer.price} / hour</p>
                                       </div>
                                   </CardHeader>
                                   <CardContent className="flex-grow p-6 space-y-4">
                                       <div className="flex flex-wrap gap-1.5">
                                           {trainer.specializations.slice(0, 3).map(spec => (
                                               <Badge key={spec} variant="secondary" className="text-[10px] uppercase font-bold tracking-tighter bg-muted text-muted-foreground border-none px-2">{spec}</Badge>
                                           ))}
                                       </div>
                                       <Card className="bg-muted/30 p-4 border-none flex flex-col justify-center min-h-[80px]">
                                            {nextSlot ? (
                                                <>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Next Availability</p>
                                                    <p className="text-sm font-black">{nextSlot.date} <span className="text-primary ml-1">@ {nextSlot.time}</span></p>
                                                </>
                                            ) : (
                                                <p className="text-xs text-muted-foreground italic text-center font-medium uppercase tracking-widest">No slots next 90 days</p>
                                            )}
                                       </Card>
                                   </CardContent>
                                   <CardFooter className="p-6 pt-0 grid grid-cols-2 gap-3 mt-auto">
                                       <Button variant="outline" className="text-[10px] font-bold uppercase tracking-widest h-10 border-muted hover:border-primary/50" disabled={!nextSlot} asChild>
                                            <Link href={`/dashboard/training/${trainer.id}`}>
                                                Quick Book
                                            </Link>
                                       </Button>
                                       <Button asChild className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground text-[10px] font-bold uppercase tracking-widest h-10">
                                            <Link href={`/dashboard/training/${trainer.id}`}>
                                                Full Profile
                                            </Link>
                                       </Button>
                                   </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed bg-muted/10">
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                            <GraduationCap className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-2xl mb-2">No trainers available</CardTitle>
                        <CardDescription className="max-w-xs mb-8">
                            Our coaching staff is currently fully booked or offline. Please check back later.
                        </CardDescription>
                        <Button asChild variant="outline" className="border-primary text-primary">
                            <Link href="/dashboard/social">Join the community feed</Link>
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
}