'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, PlayCircle, Star, Grid, List, Film, Calendar, Heart, MessageSquare, Share2, Bookmark, Loader2, Video } from 'lucide-react';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useToast } from '@/hooks/use-toast';
import { suggestHighlights, type HighlightSuggestionsInput, type HighlightSuggestionsOutput } from '@/ai/flows/highlight-suggestions';
import { Input } from '@/components/ui/input';

const myMedia = [
  {
    id: 'h1',
    type: 'highlight',
    thumbnailUrl: 'https://picsum.photos/seed/padel-highlight-1/600/400',
    title: 'Incredible Rally',
    date: '2024-08-15',
    match: 'Club Ladder - Week 5',
    likes: 12,
    comments: 3,
    imageHint: 'padel match',
  },
  {
    id: 'h2',
    type: 'highlight',
    thumbnailUrl: 'https://picsum.photos/seed/padel-highlight-2/600/400',
    title: 'Amazing Smash',
    date: '2024-08-10',
    match: 'Friendly vs. Alex',
    likes: 25,
    comments: 8,
    imageHint: 'padel practice',
  },
];

const MyContentTab = () => {
    const [view, setView] = useState('grid');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [tags, setTags] = useState('');
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestedMoments, setSuggestedMoments] = useState<HighlightSuggestionsOutput['suggestedMoments'] | null>(null);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast({ variant: 'destructive', title: 'File too large', description: 'Please upload a video smaller than 10MB.' });
                return;
            }
            setVideoFile(file);
            setSuggestedMoments(null);
        }
    };

    const handleSuggestHighlights = async () => {
        if (!videoFile) return;
        setIsSuggesting(true);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(videoFile);
            reader.onload = async () => {
                const videoDataUri = reader.result as string;
                const result = await suggestHighlights({
                    videoDataUri,
                    tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                });
                setSuggestedMoments(result.suggestedMoments);
                toast({ title: 'Highlights Suggested!', description: `Found ${result.suggestedMoments.length} moments.` });
            };
        } finally {
            setIsSuggesting(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myMedia.map((item) => (
                    <Card key={item.id} className="overflow-hidden border-none shadow-lg bg-card group cursor-pointer transition-all hover:translate-y-[-4px]">
                        <div className="relative aspect-video overflow-hidden">
                            <Image src={item.thumbnailUrl} alt={item.title} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={item.imageHint} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <h3 className="font-bold text-lg leading-tight line-clamp-1">{item.title}</h3>
                                <p className="text-xs text-white/70 mt-1">{item.match}</p>
                            </div>
                            <Badge variant="secondary" className="absolute top-3 right-3 capitalize bg-primary text-primary-foreground border-none font-bold text-[10px]">{item.type}</Badge>
                        </div>
                        <CardFooter className="p-4 flex items-center justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1.5"><Heart className="h-3 w-3 text-primary" /> {item.likes}</span>
                                <span className="flex items-center gap-1.5"><MessageSquare className="h-3 w-3" /> {item.comments}</span>
                            </div>
                            <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {item.date}</span>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            
             <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-primary" />
                       AI Highlight Suggester
                    </CardTitle>
                    <CardDescription>Upload a long recording and let AI find the winners.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-center w-full">
                            <Label htmlFor="video-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-card hover:bg-muted/50 transition-all border-muted">
                                {videoFile ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <Film className="h-8 w-8 text-primary" />
                                        <p className="font-bold text-sm">{videoFile.name}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                                        <p className="mb-1 text-sm font-bold tracking-tight">Tap to upload video</p>
                                    </div>
                                )}
                                <Input id="video-upload" type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
                            </Label>
                        </div>
                    </div>

                    {isSuggesting && (
                        <div className="flex flex-col items-center justify-center gap-3 p-8 rounded-lg bg-card border animate-pulse">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Analyzing footage...</p>
                        </div>
                    )}

                    {suggestedMoments && suggestedMoments.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-primary/10">
                            {suggestedMoments.map((moment, index) => (
                                <div key={index} className="flex items-center gap-4 rounded-xl border bg-card p-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-sm">
                                        {Math.floor(moment.timestamp / 60)}:{(moment.timestamp % 60).toString().padStart(2, '0')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold leading-tight line-clamp-1">{moment.reason}</p>
                                    </div>
                                    <Button size="sm" variant="outline">Confirm</Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
                 <CardFooter>
                    <Button className="w-full bg-primary text-primary-foreground h-12 text-lg font-bold" onClick={handleSuggestHighlights} disabled={isSuggesting || !videoFile}>
                        {isSuggesting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Find Highlights'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default function HighlightsPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Media Hub</h1>
          <p className="mt-1 text-lg text-muted-foreground">Watch highlights, full matches, and club footage.</p>
      </div>

       <Tabs defaultValue="my-content" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 h-12">
          <TabsTrigger value="my-content" className="font-bold uppercase text-[10px] tracking-widest">My Content</TabsTrigger>
          <TabsTrigger value="club-feed" className="font-bold uppercase text-[10px] tracking-widest">Club Feed</TabsTrigger>
          <TabsTrigger value="highlights-reel" className="font-bold uppercase text-[10px] tracking-widest">Highlights Reel</TabsTrigger>
        </TabsList>
        <TabsContent value="my-content" className="mt-8">
            <MyContentTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
