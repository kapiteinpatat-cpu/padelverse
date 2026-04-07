'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ShieldAlert, RefreshCcw, Ban, FileText, ArrowLeft, Save, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ClubPoliciesPage() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: "Policies Updated", description: "Membership rules have been synced." });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/club"><ArrowLeft className="h-6 w-6" /></Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Policies & Rules</h1>
          <p className="text-lg text-muted-foreground">Define how your club handles bookings and cancellations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCcw className="h-5 w-5 text-primary" />
              Cancellation Policy
            </CardTitle>
            <CardDescription>Determine the timeframe for free cancellations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Free Cancellation Window</Label>
              <Select defaultValue="24">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">Up to 12 hours before</SelectItem>
                  <SelectItem value="24">Up to 24 hours before</SelectItem>
                  <SelectItem value="48">Up to 48 hours before</SelectItem>
                  <SelectItem value="never">No free cancellation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <p>Cancellations within this window will trigger an automatic refund or credit based on the payment method used.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              No-Show Policy
            </CardTitle>
            <CardDescription>Rules for when players fail to attend.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Late Penalty Fee (%)</Label>
              <Input type="number" defaultValue="100" />
            </div>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <p>Players who do not show up without cancelling will be charged the full amount. This fee helps compensate trainers for lost time.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Terms of Service (User Facing)
          </CardTitle>
          <CardDescription>This text is shown to users before they complete a booking.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            rows={10} 
            defaultValue="By booking a lesson at PadelVerse Central, you agree to follow all club etiquette and safety rules. Please arrive 10 minutes before your scheduled start time. Appropriate padel or tennis footwear is required on all courts. We reserve the right to archive or reschedule bookings in the event of extreme weather or maintenance requirements."
          />
        </CardContent>
        <CardFooter className="bg-muted/30 border-t py-4">
          <Button variant="outline" className="w-full">
            <Sparkles className="mr-2 h-4 w-4 text-primary" /> Preview User Experience
          </Button>
        </CardFooter>
      </Card>

      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="bg-primary text-primary-foreground shadow-xl px-12" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" /> Save Policies
        </Button>
      </div>
    </div>
  );
}
