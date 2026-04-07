'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Palette, Image as ImageIcon, CheckCircle2, ArrowLeft, Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ClubBrandingPage() {
  const { toast } = useToast();
  const [logo, setLogo] = useState<string | null>(null);

  const handleUpload = () => {
    // Simulated upload
    setLogo("https://placehold.co/200x200/212936/83F969?text=LOGO");
    toast({ title: "Logo Uploaded", description: "Your club logo has been updated." });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/club"><ArrowLeft className="h-6 w-6" /></Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Branding & Theme</h1>
          <p className="text-lg text-muted-foreground">Control how your club looks inside the app.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Club Logo</CardTitle>
            <CardDescription>Upload a high-quality logo (PNG or JPG). Recommended size: 512x512px.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center p-8">
            {logo ? (
              <div className="relative group">
                <Image src={logo} alt="Logo" width={160} height={160} className="rounded-xl border-2 border-primary" />
                <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setLogo(null)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-xl p-12 flex flex-col items-center gap-4 bg-muted/20 w-full">
                <ImageIcon className="h-12 w-12 text-muted-foreground opacity-20" />
                <Button variant="outline" onClick={handleUpload}><Upload className="mr-2 h-4 w-4" /> Upload Image</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme Preview</CardTitle>
            <CardDescription>Your club page will use the global PadelVerse dark theme with lime accents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Primary Brand Color</Label>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-primary border" />
                <Input disabled defaultValue="#83F969" className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-[#001524] border" />
                <Input disabled defaultValue="#001524" className="flex-1" />
              </div>
            </div>
            <Button className="w-full" variant="secondary">
              <Eye className="mr-2 h-4 w-4" /> Preview Live Page
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sponsor Management</CardTitle>
          <CardDescription>Add sponsors to be displayed on your club profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/10 text-muted-foreground">
            <p className="mb-4">No sponsors added yet.</p>
            <Button variant="outline">Add Sponsor Banner</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
