
'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format, parse } from 'date-fns';
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
import { Calendar } from "@/components/ui/calendar";
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
import { ArrowLeft, Star, DollarSign, Clock, CheckCircle, Sparkles, BookOpen } from "lucide-react";
import { trainers } from '@/lib/trainers';
import { useToast } from '@/hooks/use-toast';

export default function TrainerProfilePage() {
    const params = useParams<{ id: string }>();
    const { toast } = useToast();
    
    const trainer = trainers.find((t) => t.id === params.id);

    // Find the first available date to initialize the calendar
    const getFirstAvailableDate = () => {
        if (!trainer?.availability) return new Date();
        const today = new Date();
        today.setHours(0,0,0,0);

        const sortedDates = Object.keys(trainer.availability)
            .map(d => parse(d, 'yyyy-MM-dd', new Date()))
            .filter(d => d >= today)
            .sort((a, b) => a.getTime() - b.getTime());

        return sortedDates.length > 0 ? sortedDates[0] : new Date();
    }

    const [date, setDate] = useState<Date | undefined>(getFirstAvailableDate());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    
    const availableDays = useMemo(() => {
        return Object.keys(trainer?.availability || {}).map(d => parse(d, 'yyyy-MM-dd', new Date()));
    }, [trainer]);

    const handleBooking = () => {
        setIsBooking(true);
        setTimeout(() => {
            setIsBooking(false);
            toast({
                title: "Booking Confirmed!",
                description: `Your lesson with ${trainer?.name} on ${format(date!, 'PPP')} at ${selectedTime} is confirmed.`,
            });
        }, 1500);
    };

    if (!trainer) {
        return (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Trainer not found</h1>
            <Button asChild variant="link">
              <Link href="/dashboard/training">Back to trainers</Link>
            </Button>
          </div>
        );
      }
    
    // Lookup keys must use local 'yyyy-MM-dd' to match our new generation logic in trainers.ts
    const selectedDateString = date ? format(date, 'yyyy-MM-dd') : '';
    const timeSlots = trainer.availability[selectedDateString] || [];

    return(
        <div className="space-y-6">
             <div>
                <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/training">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                     <Card className="overflow-hidden">
                        <CardHeader className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                                <AvatarImage src={trainer.avatarUrl} alt={trainer.name} data-ai-hint="padel trainer" />
                                <AvatarFallback>{trainer.name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <CardTitle className="text-3xl">{trainer.name}</CardTitle>
                                <div className="flex items-center gap-1.5 mt-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`h-5 w-5 ${i < trainer.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                                    ))}
                                    <span className="text-sm text-muted-foreground ml-1">({trainer.reviews} reviews)</span>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {trainer.specializations.map(spec => (
                                        <Badge key={spec} variant="secondary">{spec}</Badge>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Book a Lesson
                            </CardTitle>
                            <CardDescription>Select a date and time to book your lesson.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <div className="flex justify-center">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        className="rounded-md border"
                                        month={date}
                                        onMonthChange={(month) => setDate(month)}
                                        disabled={(day) => day < new Date(new Date().setHours(0,0,0,0))}
                                        modifiers={{ available: availableDays }}
                                        modifiersClassNames={{
                                            available: 'bg-primary/20 text-primary-foreground font-bold',
                                        }}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-center md:text-left">
                                        Details for {date ? format(date, 'MMM d, yyyy') : '...'}
                                    </h3>
                                    {date ? (
                                        timeSlots.length > 0 ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {timeSlots.map(time => (
                                                    <Dialog key={time}>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" onClick={() => setSelectedTime(time)}>
                                                                {time}
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Confirm Your Booking</DialogTitle>
                                                                <DialogDescription>
                                                                    You are about to book a lesson with {trainer.name}.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="space-y-4 my-4">
                                                                <div className="flex items-center gap-4">
                                                                    <Avatar className="h-16 w-16">
                                                                        <AvatarImage src={trainer.avatarUrl} alt={trainer.name} />
                                                                        <AvatarFallback>{trainer.name.substring(0,2)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <p className="font-bold text-lg">{trainer.name}</p>
                                                                        <p className="text-muted-foreground">Padel Trainer</p>
                                                                    </div>
                                                                </div>
                                                                <div className="p-4 bg-muted rounded-md space-y-2">
                                                                    <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary"/> <strong>Date:</strong> {date ? format(date, 'PPPP') : ''}</p>
                                                                    <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary"/> <strong>Time:</strong> {selectedTime}</p>
                                                                    <p className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary"/> <strong>Price:</strong> €{trainer.price} (1 hour)</p>
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <DialogClose asChild>
                                                                    <Button variant="outline" disabled={isBooking}>Cancel</Button>
                                                                </DialogClose>
                                                                <Button onClick={handleBooking} disabled={isBooking} className="bg-primary text-primary-foreground">
                                                                    {isBooking ? 'Booking...' : `Confirm & Pay €${trainer.price}`}
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground p-4 text-center bg-muted rounded-md h-full flex items-center justify-center">
                                                <p>No available slots for this day.</p>
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-sm text-muted-foreground p-4 text-center bg-muted rounded-md h-full flex items-center justify-center">
                                            <p>Select a date to see times.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                 <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>About {trainer.name.split(' ')[0]}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">{trainer.bio}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <div className="flex items-baseline justify-between rounded-lg border p-4">
                                <p>Standard 1-on-1 (60 min)</p>
                                <p className="font-bold text-lg">€{trainer.price}</p>
                            </div>
                             <div className="flex items-baseline justify-between rounded-lg border p-4">
                                <p>Duo Lesson (60 min)</p>
                                <p className="font-bold text-lg">€{trainer.price + 20}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Player Levels</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {trainer.levels.map(level => (
                                <Badge key={level} variant="outline">{level}</Badge>
                            ))}
                            </div>
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </div>
    );
}
