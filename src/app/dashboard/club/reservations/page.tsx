'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar as CalendarIcon,
  Clock,
  Lock,
  ShieldAlert,
  ArrowLeft,
  PlusCircle,
  Filter,
  Hammer,
  Trophy,
  User,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const COURTS = ['Court 1 (Indoor)', 'Court 2 (Indoor)', 'Court 3 (Outdoor)', 'Court 4 (Outdoor)'];
const TIMES = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00'];

type ReservationType = 'maintenance' | 'event' | 'match' | 'coaching';

interface GridBlock {
  court: string;
  time: string;
  type: ReservationType;
  label: string;
}

const INITIAL_BLOCKS: GridBlock[] = [
  { court: 'Court 1 (Indoor)', time: '08:00', type: 'maintenance', label: 'Glass Cleaning' },
  { court: 'Court 1 (Indoor)', time: '09:30', type: 'maintenance', label: 'Glass Cleaning' },
  { court: 'Court 4 (Outdoor)', time: '18:30', type: 'event', label: 'Club Tournament' },
  { court: 'Court 4 (Outdoor)', time: '20:00', type: 'event', label: 'Club Tournament' },
  { court: 'Court 2 (Indoor)', time: '11:00', type: 'match', label: 'Alex J. + 3' },
];

export default function ClubReservationsPlanningPage() {
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState('Today, Feb 12');
  const [blocks, setBlocks] = useState<GridBlock[]>(INITIAL_BLOCKS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form State
  const [newBlock, setNewBlock] = useState<Partial<GridBlock>>({
    court: COURTS[0],
    time: TIMES[0],
    type: 'maintenance',
    label: ''
  });

  const handleAddBlock = () => {
    if (!newBlock.label) {
      toast({ variant: 'destructive', title: 'Label required', description: 'Please provide a name or reason for this block.' });
      return;
    }
    
    setBlocks(prev => [...prev, newBlock as GridBlock]);
    setIsDialogOpen(false);
    setNewBlock({ court: COURTS[0], time: TIMES[0], type: 'maintenance', label: '' });
    
    toast({
      title: 'Resource Updated',
      description: `Successfully scheduled ${newBlock.type} on ${newBlock.court}.`,
    });
  };

  const removeBlock = (court: string, time: string) => {
    setBlocks(prev => prev.filter(b => !(b.court === court && b.time === time)));
    toast({ title: 'Block Removed', description: 'The slot is now open for public booking.' });
  };

  const getBlockAt = (court: string, time: string) => {
    return blocks.find(b => b.court === court && b.time === time);
  };

  const getIconForType = (type: ReservationType) => {
    switch (type) {
      case 'maintenance': return Hammer;
      case 'event': return Trophy;
      case 'coaching': return User;
      case 'match': return CheckCircle2;
      default: return Lock;
    }
  };

  const getColorForType = (type: ReservationType) => {
    switch (type) {
      case 'maintenance': return 'bg-destructive/10 border-destructive/20 text-destructive';
      case 'event': return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      case 'coaching': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'match': return 'bg-primary/10 border-primary/20 text-primary';
      default: return 'bg-muted/20 border-muted';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="h-10 w-10">
            <Link href="/dashboard/club"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase text-primary">Resource Planning</h1>
            <p className="mt-1 text-lg text-muted-foreground font-medium">Override availability and manage manual club reservations.</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs h-12 px-8 shadow-lg shadow-primary/20">
              <PlusCircle className="mr-2 h-4 w-4" />
              Manual Override
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black italic text-primary uppercase">Schedule Override</DialogTitle>
              <DialogDescription>Block a court for maintenance or create a manual reservation.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Resource</Label>
                  <Select value={newBlock.court} onValueChange={(v) => setNewBlock(p => ({...p, court: v}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {COURTS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Start Time</Label>
                  <Select value={newBlock.time} onValueChange={(v) => setNewBlock(p => ({...p, time: v}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Override Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'maintenance', label: 'Maintenance', icon: Hammer },
                    { id: 'event', label: 'Club Event', icon: Trophy },
                    { id: 'match', label: 'Manual Match', icon: CheckCircle2 },
                    { id: 'coaching', label: 'Coaching Block', icon: User },
                  ].map(type => (
                    <Button
                      key={type.id}
                      variant="outline"
                      className={cn(
                        "h-12 justify-start gap-2 border-muted hover:border-primary/50",
                        newBlock.type === type.id && "border-primary bg-primary/5 text-primary"
                      )}
                      onClick={() => setNewBlock(p => ({...p, type: type.id as any}))}
                    >
                      <type.icon className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-tight">{type.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Label / Description</Label>
                <Input 
                  placeholder="e.g. Court 1 Deep Cleaning" 
                  value={newBlock.label}
                  onChange={(e) => setNewBlock(p => ({...p, label: e.target.value}))}
                  className="bg-muted/50 border-muted"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1 font-bold uppercase text-[10px] tracking-widest">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddBlock} className="flex-1 bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest">Apply Block</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-xl w-fit border border-muted">
        {['Feb 11', 'Today, Feb 12', 'Feb 13', 'Feb 14'].map(day => (
          <Button 
            key={day} 
            variant={selectedDay === day ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setSelectedDay(day)}
            className={cn(
              "text-[10px] font-black uppercase tracking-widest h-9 px-4",
              selectedDay === day ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            )}
          >
            {day}
          </Button>
        ))}
      </div>

      <Card className="overflow-x-auto border-none shadow-2xl bg-card">
        <CardContent className="p-0">
          <div className="min-w-[1100px]">
            <div className="grid grid-cols-[220px_repeat(9,1fr)] border-b border-muted">
              <div className="p-6 bg-muted/20 font-black italic uppercase tracking-tighter text-sm border-r border-muted">Resource</div>
              {TIMES.map(t => (
                <div key={t} className="p-6 text-center text-[10px] font-black uppercase tracking-widest bg-muted/5 border-r border-muted last:border-r-0 text-muted-foreground">{t}</div>
              ))}
            </div>

            {COURTS.map(court => (
              <div key={court} className="grid grid-cols-[220px_repeat(9,1fr)] border-b border-muted last:border-b-0 group">
                <div className="p-6 border-r border-muted bg-card flex flex-col justify-center">
                  <p className="font-black text-sm tracking-tight">{court}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Status: Operational</p>
                </div>
                {TIMES.map((t) => {
                  const block = getBlockAt(court, t);
                  const Icon = block ? getIconForType(block.type) : PlusCircle;
                  const colorClasses = block ? getColorForType(block.type) : "bg-muted/10 border-dashed text-muted-foreground/20 hover:bg-primary/5 hover:text-primary/50";
                  
                  return (
                    <div key={t} className="border-r border-muted last:border-r-0 p-1.5 min-h-[100px]">
                      {block ? (
                        <div className={cn(
                          "h-full w-full rounded-xl border flex flex-col items-center justify-center p-3 text-center transition-all relative group/item",
                          colorClasses
                        )}>
                          <Icon className="h-4 w-4 mb-2" />
                          <span className="text-[9px] font-black uppercase tracking-tighter leading-tight line-clamp-2">{block.label}</span>
                          
                          <button 
                            onClick={() => removeBlock(court, t)}
                            className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive text-white opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setNewBlock({ court, time: t, type: 'maintenance', label: '' });
                            setIsDialogOpen(true);
                          }}
                          className={cn(
                            "h-full w-full rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer",
                            colorClasses
                          )}
                        >
                          <PlusCircle className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="bg-muted/10 py-6 border-t border-muted">
          <div className="flex flex-wrap items-center gap-8 text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2.5">
              <div className="h-4 w-4 rounded-md bg-destructive/30 border border-destructive/50" />
              <span>Maintenance Block</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-4 w-4 rounded-md bg-amber-500/30 border border-amber-500/50" />
              <span>Club Event</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-4 w-4 rounded-md bg-primary/30 border border-primary/50" />
              <span>Manual Reservation</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-4 w-4 rounded-md bg-blue-500/30 border border-blue-500/50" />
              <span>Coaching Slot</span>
            </div>
            <div className="flex items-center gap-2.5 ml-auto text-muted-foreground/50 italic">
              <span>* Click any empty slot to add an override</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
