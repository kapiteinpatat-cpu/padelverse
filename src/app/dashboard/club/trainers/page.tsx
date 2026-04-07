'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trainers as initialTrainers, type Trainer } from '@/lib/trainers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit2, GraduationCap, DollarSign, Star, CheckCircle2, MoreVertical, Trash2, ArrowLeft } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ClubTrainersDirectoryPage() {
  const { toast } = useToast();
  const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);

  const filteredTrainers = trainers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUpdateTrainer = (updatedTrainer: Trainer) => {
    setTrainers(trainers.map(t => t.id === updatedTrainer.id ? updatedTrainer : t));
    toast({
      title: "Profile Updated",
      description: `${updatedTrainer.name}'s information has been saved successfully.`
    });
    setEditingTrainer(null);
  };

  const handleToggleStatus = (id: string) => {
    setTrainers(trainers.map(t => {
      if (t.id === id) {
        const newStatus = !t.active;
        toast({
          title: newStatus ? "Trainer Activated" : "Trainer Deactivated",
          description: `${t.name} is now ${newStatus ? 'visible' : 'hidden'} to club members.`
        });
        return { ...t, active: newStatus };
      }
      return t;
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
                <Link href="/dashboard/club"><ArrowLeft className="h-6 w-6" /></Link>
            </Button>
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Trainers Directory</h1>
                <p className="mt-2 text-lg text-muted-foreground">Manage coaching profiles and club-trainer revenue splits.</p>
            </div>
        </div>
        <div className="flex gap-2">
            <Button asChild variant="outline">
                <Link href="/dashboard/club/availability">Manage Schedules</Link>
            </Button>
            <Button className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" /> Add Trainer
            </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or specialty..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainers.map((trainer) => (
          <Card key={trainer.id} className="group relative overflow-hidden">
            <CardHeader className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={trainer.avatarUrl} alt={trainer.name} />
                    <AvatarFallback>{trainer.name.substring(0,2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{trainer.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span>{trainer.rating} ({trainer.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingTrainer(trainer)}>
                      <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(trainer.id)}>
                      {trainer.active ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => toast({ variant: 'destructive', title: 'Action blocked', description: 'Cannot delete active trainer.'})}>
                      <Trash2 className="mr-2 h-4 w-4" /> Remove Trainer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="flex flex-wrap gap-2">
                {trainer.specializations.map(spec => (
                  <Badge key={spec} variant="secondary">{spec}</Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm pt-4 border-t">
                <div className="flex items-center gap-2 font-medium">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span>${trainer.price} / 60 min</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">Status:</span>
                  <Badge variant={trainer.active ? "default" : "outline"}>
                    {trainer.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex gap-2">
              <Button variant="outline" className="w-full" onClick={() => setEditingTrainer(trainer)}>
                <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {editingTrainer && (
        <Dialog open={!!editingTrainer} onOpenChange={(open) => !open && setEditingTrainer(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Edit Trainer Profile</DialogTitle>
              <DialogDescription>Update {editingTrainer.name}'s public information and settings.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={editingTrainer.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Base Price ($ / hour)</Label>
                  <Input id="price" type="number" defaultValue={editingTrainer.price} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea 
                  id="bio" 
                  rows={4} 
                  defaultValue={editingTrainer.bio} 
                  placeholder="Describe the trainer's background and experience..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specializations">Specializations (comma separated)</Label>
                <Input id="specializations" defaultValue={editingTrainer.specializations.join(', ')} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-base">Self-Manage Availability</Label>
                  <p className="text-xs text-muted-foreground">Allow trainer to edit their own schedule slots.</p>
                </div>
                <Switch defaultChecked={true} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-base">Visible to Members</Label>
                  <p className="text-xs text-muted-foreground">If off, this trainer won't appear in the directory.</p>
                </div>
                <Switch defaultChecked={editingTrainer.active} />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={() => {
                handleUpdateTrainer(editingTrainer);
              }}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}