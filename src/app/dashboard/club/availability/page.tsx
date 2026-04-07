'use client';

import { useState, useMemo } from 'react';
import { trainers as initialTrainers, type Trainer } from '@/lib/trainers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format, parse } from 'date-fns';
import { Plus, Trash2, Clock, Calendar as CalendarIcon, Users, Copy, Ban, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const HOUR_PRESETS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', 
  '20:00', '21:00'
];

export default function ClubAvailabilityAdminPage() {
  const { toast } = useToast();
  const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>(trainers[0].id);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [newSlotTime, setNewSlotTime] = useState('');

  const selectedTrainer = useMemo(() => 
    trainers.find(t => t.id === selectedTrainerId)!, 
  [trainers, selectedTrainerId]);

  const selectedDateString = date ? format(date, 'yyyy-MM-dd') : '';
  const currentSlots = selectedTrainer.availability[selectedDateString] || [];

  const availableDays = useMemo(() => {
    return Object.keys(selectedTrainer.availability).map(d => parse(d, 'yyyy-MM-dd', new Date()));
  }, [selectedTrainer]);

  const addTimeSlot = (time: string) => {
    if (!time || !date) return;
    
    // Simple HH:mm validation
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      toast({ variant: 'destructive', title: 'Invalid time format', description: 'Use HH:mm' });
      return;
    }

    if (currentSlots.includes(time)) {
      toast({ variant: 'destructive', title: 'Slot exists', description: 'This time slot is already in the list.' });
      return;
    }

    const updatedTrainers = trainers.map(t => {
      if (t.id === selectedTrainerId) {
        const newAvailability = { ...t.availability };
        newAvailability[selectedDateString] = [...(newAvailability[selectedDateString] || []), time].sort();
        return { ...t, availability: newAvailability };
      }
      return t;
    });
    
    setTrainers(updatedTrainers);
    toast({ title: 'Slot Added', description: `Added ${time} to ${selectedTrainer.name}'s schedule.` });
  };

  const handleAddSlot = () => {
    addTimeSlot(newSlotTime);
    setNewSlotTime('');
  };

  const handleRemoveSlot = (timeToRemove: string) => {
    const updatedTrainers = trainers.map(t => {
      if (t.id === selectedTrainerId) {
        const newAvailability = { ...t.availability };
        newAvailability[selectedDateString] = newAvailability[selectedDateString].filter(time => time !== timeToRemove);
        return { ...t, availability: newAvailability };
      }
      return t;
    });
    setTrainers(updatedTrainers);
    toast({ title: 'Slot Removed' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Trainer Availability</h1>
          <p className="mt-2 text-lg text-muted-foreground">Manage schedules and block time for your club trainers.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><Copy className="mr-2 h-4 w-4" /> Copy Week</Button>
            <Button variant="outline" className="text-destructive hover:bg-destructive/10"><Ban className="mr-2 h-4 w-4" /> Block Time</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader className="p-4"><CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Trainers</CardTitle></CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="space-y-1">
              {trainers.map((trainer) => (
                <button key={trainer.id} onClick={() => setSelectedTrainerId(trainer.id)}
                  className={cn("w-full flex items-center gap-3 p-3 rounded-md transition-colors text-left", selectedTrainerId === trainer.id ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
                  <Avatar className="h-10 w-10 border border-background/20">
                    <AvatarImage src={trainer.avatarUrl} alt={trainer.name} />
                    <AvatarFallback>{trainer.name.substring(0,2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <p className="font-semibold text-sm">{trainer.name}</p>
                    <p className={cn("text-xs", selectedTrainerId === trainer.id ? "text-primary-foreground/80" : "text-muted-foreground")}>{trainer.specializations[0]}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedTrainer.avatarUrl} alt={selectedTrainer.name} />
                  <AvatarFallback>{selectedTrainer.name.substring(0,2)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{selectedTrainer.name}'s Schedule</CardTitle>
                  <CardDescription>Select a date to manage availability slots.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base">1. Select Date</Label>
                    <div className="flex justify-center border rounded-lg p-2 bg-card">
                      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md"
                        modifiers={{ hasSlots: availableDays }}
                        modifiersClassNames={{ hasSlots: 'bg-primary/20 text-primary-foreground font-bold border-b-2 border-primary' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Quick Add (1h Slots)
                    </Label>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {HOUR_PRESETS.map(time => (
                        <Button
                          key={time}
                          variant="secondary"
                          size="sm"
                          className="text-xs h-9"
                          onClick={() => addTimeSlot(time)}
                          disabled={currentSlots.includes(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base">2. Current Slots for {date ? format(date, 'PPP') : '...'}</Label>
                    {currentSlots.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {currentSlots.map(time => (
                          <div key={time} className="group relative">
                            <Badge variant="outline" className="w-full h-10 flex items-center justify-center text-sm font-medium pr-8">
                              <Clock className="mr-2 h-3 w-3 text-primary" />{time}
                            </Badge>
                            <Button variant="destructive" size="icon" className="absolute right-0 top-0 h-10 w-8 rounded-l-none opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveSlot(time)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground bg-muted/30">
                        <Clock className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-sm">No slots defined for this day</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <Label className="text-base">3. Add Custom Slot</Label>
                    <div className="flex gap-2 mt-2">
                      <div className="relative flex-1">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="e.g. 09:30" 
                          className="pl-10"
                          value={newSlotTime} 
                          onChange={(e) => setNewSlotTime(e.target.value)} 
                          onKeyDown={(e) => e.key === 'Enter' && handleAddSlot()} 
                        />
                      </div>
                      <Button onClick={handleAddSlot}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t py-4">
              <p className="text-xs text-muted-foreground italic">
                Changes made here are visible to all club members immediately.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
