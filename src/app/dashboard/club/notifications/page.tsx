'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Bell, Send, Mail, Megaphone, Smartphone, ArrowLeft, History, Plus } from 'lucide-react';
import Link from 'next/link';

export default function ClubCommunicationsPage() {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast({
        title: "Announcement Sent!",
        description: "Your message has been broadcasted to all selected members."
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/club"><ArrowLeft className="h-6 w-6" /></Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Communications</h1>
          <p className="text-lg text-muted-foreground">Broadcast announcements and manage notifications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Megaphone className="h-5 w-5" />
                New Announcement
              </CardTitle>
              <CardDescription>Create a message to appear in the club feed and send via notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g. New Opening Hours for Holidays" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="target">Target Audience</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="target">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    <SelectItem value="trainers">Trainers Only</SelectItem>
                    <SelectItem value="active">Active Players (Last 30 days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message Content</Label>
                <Textarea id="message" rows={6} placeholder="Type your message here..." />
              </div>
              
              <div className="flex flex-col gap-3 p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Push Notification</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Email Broadcast</span>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button className="w-full bg-primary text-primary-foreground" onClick={handleSend} disabled={isSending}>
                {isSending ? "Broadcasting..." : <><Send className="mr-2 h-4 w-4" /> Send Announcement</>}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-4 w-4" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-1">
                <p className="font-semibold">Holiday Tournament Info</p>
                <p className="text-xs text-muted-foreground">Sent 2 days ago to 314 members</p>
              </div>
              <div className="text-sm space-y-1">
                <p className="font-semibold">New Court 4 Maintenance</p>
                <p className="text-xs text-muted-foreground">Sent 1 week ago to All Members</p>
              </div>
              <Button variant="ghost" size="sm" className="w-full">View All History</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Automated Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Lesson Reminders (24h)</span>
                <Switch size="sm" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Match Fill Alerts</span>
                <Switch size="sm" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Court Booking Confirms</span>
                <Switch size="sm" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
