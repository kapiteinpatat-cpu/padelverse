'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Building2, MapPin, Phone, Mail, Globe, Clock, Map, Plus, Trash2, Save, Undo2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const INITIAL_FACILITIES = [
  { id: 'f1', label: 'Parking', checked: true },
  { id: 'f2', label: 'Showers', checked: true },
  { id: 'f3', label: 'Bar / Cafe', checked: true },
  { id: 'f4', label: 'Pro Shop', checked: true },
  { id: 'f5', label: 'Gym', checked: false },
  { id: 'f6', label: 'WiFi', checked: true },
];

const INITIAL_COURTS = [
  { id: 'c1', name: 'Court 1', type: 'Indoor', surface: 'Panoramic Blue', active: true },
  { id: 'c2', name: 'Court 2', type: 'Indoor', surface: 'Panoramic Blue', active: true },
  { id: 'c3', name: 'Court 3', type: 'Outdoor', surface: 'Classic Green', active: true },
  { id: 'c4', name: 'Court 4', type: 'Outdoor', surface: 'Classic Green', active: false },
];

export default function ClubProfileEditorPage() {
  const { toast } = useToast();
  const [courts, setCourts] = useState(INITIAL_COURTS);
  const [facilities, setFacilities] = useState(INITIAL_FACILITIES);

  const handleSave = () => {
    toast({
      title: "Changes Saved",
      description: "Club profile has been updated successfully."
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/club"><ArrowLeft className="h-6 w-6" /></Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Club Profile</h1>
          <p className="text-lg text-muted-foreground">Manage your club's public information and facilities.</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="courts">Courts</TabsTrigger>
          <TabsTrigger value="facilities">Facilities & Hours</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>This information is visible to all members on the club page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="club-name">Club Name</Label>
                <Input id="club-name" defaultValue="PadelVerse Central" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="club-desc">Description</Label>
                <Textarea id="club-desc" rows={4} defaultValue="The premier padel destination in the city. Featuring 4 state-of-the-art panoramic courts, a pro shop, and a social bar." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="club-email">Contact Email</Label>
                  <Input id="club-email" type="email" defaultValue="hello@padelverse.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="club-phone">Phone Number</Label>
                  <Input id="club-phone" defaultValue="+1 (555) 000-1234" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="club-address">Address</Label>
                <Input id="club-address" defaultValue="123 Sport Avenue, Fitness City, FC 54321" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courts" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Court Management</CardTitle>
                <CardDescription>Add, remove, or disable courts for maintenance.</CardDescription>
              </div>
              <Button size="sm" className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" /> Add Court
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courts.map((court) => (
                  <div key={court.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {court.id.replace('c', '')}
                      </div>
                      <div>
                        <p className="font-semibold">{court.name}</p>
                        <p className="text-xs text-muted-foreground">{court.type} • {court.surface}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`active-${court.id}`} className="text-xs">Active</Label>
                        <Switch id={`active-${court.id}`} checked={court.active} />
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Facilities</CardTitle>
                <CardDescription>Select what your club offers.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {facilities.map((facility) => (
                  <div key={facility.id} className="flex items-center space-x-2">
                    <Checkbox id={facility.id} defaultChecked={facility.checked} />
                    <Label htmlFor={facility.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {facility.label}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Opening Hours</CardTitle>
                <CardDescription>Set your standard operating times.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {['Mon - Fri', 'Sat - Sun'].map((day) => (
                  <div key={day} className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium w-24">{day}</span>
                    <Input className="h-8" defaultValue={day.includes('Fri') ? "07:00 - 22:00" : "08:00 - 20:00"} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-6 right-6 flex gap-3">
        <Button variant="outline" size="lg">
          <Undo2 className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button size="lg" className="bg-primary text-primary-foreground px-8" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" /> Save All Changes
        </Button>
      </div>
    </div>
  );
}
