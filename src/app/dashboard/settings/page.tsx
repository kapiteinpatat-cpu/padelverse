
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Bell, Lock, User, Shield, Upload, Info } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  handle: z.string().min(3, { message: 'Handle must be at least 3 characters.' }),
  email: z.string().email(),
  genderIdentity: z.enum(['male', 'female', 'nonbinary', 'prefer_not_to_say']).optional(),
  showGenderOnProfile: z.boolean().default(false),
  allowGenderBasedMatching: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultProfileValues: Partial<ProfileFormValues> & { avatarUrl: string, bannerUrl: string } = {
  name: 'John Doe',
  handle: 'johndoe',
  email: 'john.doe@example.com',
  genderIdentity: 'prefer_not_to_say',
  showGenderOnProfile: false,
  allowGenderBasedMatching: true,
  avatarUrl: 'https://picsum.photos/seed/padel-player-1/200/200',
  bannerUrl: 'https://images.unsplash.com/photo-1646649853703-7645147474ba?q=80&w=1080',
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [uploadedBannerPreview, setUploadedBannerPreview] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaultProfileValues,
    mode: 'onChange',
  });

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setUploadedBannerPreview(reader.result as string);
          reader.readAsDataURL(file);
      }
  };

  function onProfileSubmit(data: ProfileFormValues) {
    console.log(data);
    toast({ title: 'Profile Updated', description: 'Your information has been saved.' });
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div>
        <h1 className="text-4xl font-black italic tracking-tighter text-primary uppercase">SETTINGS</h1>
        <p className="mt-2 text-lg text-muted-foreground font-medium">Personalize your experience and matchmaking privacy.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50 h-12 p-1">
          <TabsTrigger value="profile" className="font-bold uppercase text-[10px] tracking-widest"><User className="mr-2 h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="privacy" className="font-bold uppercase text-[10px] tracking-widest"><Shield className="mr-2 h-4 w-4" />Privacy</TabsTrigger>
          <TabsTrigger value="notifications" className="font-bold uppercase text-[10px] tracking-widest"><Bell className="mr-2 h-4 w-4" />Alerts</TabsTrigger>
          <TabsTrigger value="account" className="font-bold uppercase text-[10px] tracking-widest"><Lock className="mr-2 h-4 w-4" />Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-8">
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
              <Card className="border-none shadow-xl bg-card overflow-hidden">
                <CardHeader className="bg-muted/10 border-b">
                  <CardTitle className="text-lg font-black italic tracking-tight">IDENTITY & GENDER</CardTitle>
                  <CardDescription>Gender information is used for strict matchmaking rules (e.g., Mixed matches).</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="genderIdentity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender Identity (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose identity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="nonbinary">Non-binary</SelectItem>
                              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <FormField
                      control={profileForm.control}
                      name="showGenderOnProfile"
                      render={({ field }) => (
                        <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
                          <div className="space-y-0.5">
                            <p className="font-bold text-sm">Public Gender Visibility</p>
                            <p className="text-xs text-muted-foreground">Display your gender identity on your profile page.</p>
                          </div>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </div>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="allowGenderBasedMatching"
                      render={({ field }) => (
                        <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
                          <div className="space-y-0.5">
                            <p className="font-bold text-sm">Gender-based Matchmaking</p>
                            <p className="text-xs text-muted-foreground">Allow AI to use your gender for Men's, Women's, or Mixed games.</p>
                          </div>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </div>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <Button type="submit" className="w-full sm:w-auto h-12 px-12 font-black uppercase tracking-widest text-xs">Save Profile</Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <Card className="border-none shadow-xl">
            <CardHeader className="bg-muted/10 border-b">
              <CardTitle className="text-lg font-black italic">DATA PRIVACY</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex gap-3">
                <Shield className="h-5 w-5 text-primary shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  PadelVerse uses zero-knowledge logic for gender matchmaking. Other players only see if a match is "Mixed" or "Same-gender" without knowing your specific identity unless you choose to show it.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
