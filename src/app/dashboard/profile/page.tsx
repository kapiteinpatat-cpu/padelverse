'use client';

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Hand, 
  SplitSquareHorizontal,
  Settings,
  Calendar,
  MapPin,
  CheckCircle,
  Film,
  TrendingUp,
  History,
  ArrowUpRight
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { achievements } from "@/lib/achievements";
import { cn } from "@/lib/utils";
import { 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
} from 'recharts';
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';

const profileImage = PlaceHolderImages.find(p => p.id === "profile-banner");

const user = {
    name: 'John Doe',
    avatarUrl: 'https://picsum.photos/seed/padel-player-1/200/200',
    handle: 'johndoe',
    skillLevel: 'P500',
    handedness: 'Right-handed',
    courtSide: 'Right',
    stats: [
        { key: 'matches', label: 'Matches', value: 82 },
        { key: 'wins', label: 'Wins', value: 58 },
        { key: 'friends', label: 'Friends', value: 124 },
    ]
};

const ratingHistoryData = [
  { period: '2023 H1', rating: 100, label: 'P100' },
  { period: '2023 H2', rating: 200, label: 'P200' },
  { period: '2024 H1', rating: 300, label: 'P300' },
  { period: '2024 H2', rating: 400, label: 'P400' },
  { period: '2025 H1', rating: 500, label: 'P500' },
];

const ratingChartConfig = {
  rating: {
    label: 'Skill Rating',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const posts = [
  {
    id: 1,
    author: {
      name: 'John Doe',
      avatarUrl: 'https://picsum.photos/seed/padel-player-1/80/80',
      handle: 'johndoe'
    },
    timestamp: '1d ago',
    content: {
      text: 'Who is up for a match tomorrow evening? Looking for a partner.',
    }
  },
  {
    id: 3,
    author: {
      name: 'John Doe',
      avatarUrl: 'https://picsum.photos/seed/padel-player-1/80/80',
      handle: 'johndoe'
    },
    timestamp: '3d ago',
    content: {
      text: 'Practicing my bandeja shots today. Making some good progress! 💪',
      highlightUrl: 'https://picsum.photos/seed/padel-highlight-2/600/400',
      imageHint: "padel practice"
    }
  },
];

const matchesData = {
    upcoming: [
        { id: "m1", title: "Club Ladder - Week 5", date: "2024-08-15", location: "Court 1", type: "Ladder" },
        { id: "m3", title: "Men's Doubles League", date: "2024-08-17", location: "Court 2", type: "Competitive" },
    ],
    past: [
        { id: "m5", title: "Friendly vs. Alex", date: "2024-08-10", location: "Court 4", result: 'Win', score: '6-4, 6-3' },
        { id: "m6", title: "Recreational Mixer", date: "2024-08-08", location: "Court 3", result: 'N/A', score: '' },
        { id: "m7", title: "Friendly vs. Maria", date: "2024-08-05", location: "Court 1", result: 'Loss', score: '2-6, 7-5, 3-6' },
    ]
};

const friendsList = [
    { id: "u2", name: "Alex Johnson", avatarUrl: "https://picsum.photos/seed/padel-player-2/80/80", skillLevel: "P300" },
    { id: "u3", name: "Maria Garcia", avatarUrl: "https://picsum.photos/seed/padel-player-3/80/80", skillLevel: "P200" },
    { id: "u6", name: "Chris Wilson", avatarUrl: "https://picsum.photos/seed/padel-player-6/80/80", skillLevel: "P700" },
    { id: "u7", name: "David Lee", avatarUrl: "https://picsum.photos/seed/padel-player-7/80/80", skillLevel: "P400" },
    { id: "u4", name: "Jane Smith", avatarUrl: "https://picsum.photos/seed/padel-player-4/80/80", skillLevel: "P200" },
    { id: "u5", name: "Mike Brown", avatarUrl: "https://picsum.photos/seed/padel-player-5/80/80", skillLevel: "P100" },
];

const unlockedAchievementIds = new Set([
  'perf_1', 'perf_7', 'perf_8', 'media_1', 'media_2', 'media_6', 'comm_1', 'cons_1', 'cons_7',
]);
const unlockedAchievements = achievements.filter(ach => unlockedAchievementIds.has(ach.id));

export default function ProfilePage() {
  return (
    <div className="max-w-5xl mx-auto pb-20">
        <Card className="overflow-hidden border-none shadow-2xl">
            <div className="relative h-48 w-full">
                {profileImage && (
                    <Image
                    src={profileImage.imageUrl}
                    alt={profileImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={profileImage.imageHint}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                 <div className="absolute bottom-0 left-6 translate-y-1/2">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="padel player"/>
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <div className="pt-20 pb-6 px-6 bg-card">
                 <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter">{user.name}</h1>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">@{user.handle}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <Badge className="bg-primary text-primary-foreground font-black italic">{user.skillLevel}</Badge>
                            <span className="flex items-center gap-1.5 text-muted-foreground font-medium"><Hand className="h-4 w-4 text-primary" /> {user.handedness}</span>
                            <span className="flex items-center gap-1.5 text-muted-foreground font-medium"><SplitSquareHorizontal className="h-4 w-4 text-primary" /> {user.courtSide} Side</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild className="bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs h-11 px-6 shadow-lg shadow-primary/20">
                            <Link href="/dashboard/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Link>
                        </Button>
                        <Button variant="outline" className="font-bold uppercase tracking-widest text-[10px] h-11 border-muted">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                        </Button>
                    </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-x-12 gap-y-4 border-t border-muted pt-6">
                    {user.stats.map(stat => (
                        <div key={stat.key} className="text-center sm:text-left">
                            <p className="text-3xl font-black italic tracking-tighter text-primary">{stat.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Card>

        <Tabs defaultValue="feed" className="mt-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-muted/50 p-1 h-auto md:h-12">
                <TabsTrigger value="feed" className="font-bold uppercase text-[10px] tracking-widest">Feed</TabsTrigger>
                <TabsTrigger value="progress" className="font-bold uppercase text-[10px] tracking-widest">Progress</TabsTrigger>
                <TabsTrigger value="matches" className="font-bold uppercase text-[10px] tracking-widest">Matches</TabsTrigger>
                <TabsTrigger value="achievements" className="font-bold uppercase text-[10px] tracking-widest">Medals</TabsTrigger>
                <TabsTrigger value="friends" className="font-bold uppercase text-[10px] tracking-widest">Friends</TabsTrigger>
                <TabsTrigger value="media" className="font-bold uppercase text-[10px] tracking-widest">Media</TabsTrigger>
            </TabsList>
            
            <TabsContent value="feed" className="mt-8 space-y-6">
                 {posts.map((post) => (
                    <Card key={post.id} className="border-none shadow-lg bg-card">
                        <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar className="ring-2 ring-background border-none">
                            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} data-ai-hint="padel player" />
                            <AvatarFallback>{post.author.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-black text-sm tracking-tight">{post.author.name}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">@{post.author.handle} &middot; {post.timestamp}</p>
                        </div>
                        </CardHeader>
                        <CardContent>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{post.content.text}</p>
                        {post.content.highlightUrl && (
                            <div className="mt-4 rounded-2xl overflow-hidden border border-muted aspect-video relative group cursor-pointer shadow-inner">
                                <Image
                                    src={post.content.highlightUrl}
                                    alt="Highlight"
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                    data-ai-hint={post.content.imageHint}
                                />
                            </div>
                        )}
                        </CardContent>
                        <CardFooter className="flex items-center gap-2 px-6 py-4 border-t border-muted bg-muted/5">
                            <Button variant="ghost" size="sm" className="h-8 flex items-center gap-2 hover:text-primary transition-colors">
                                <Heart className="h-4 w-4" />
                                <span className="font-bold text-xs">Like</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 flex items-center gap-2 hover:text-primary transition-colors">
                                <MessageCircle className="h-4 w-4" />
                                <span className="font-bold text-xs">Comment</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 flex items-center gap-2 hover:text-primary transition-colors ml-auto">
                                <Share2 className="h-4 w-4" />
                                <span className="font-bold text-xs uppercase tracking-widest text-[10px]">Share</span>
                            </Button>
                        </CardFooter>
                    </Card>
                 ))}
            </TabsContent>

            <TabsContent value="progress" className="mt-8 space-y-6">
                <Card className="border-none shadow-xl bg-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-black italic uppercase tracking-tighter text-primary">
                            <TrendingUp className="h-5 w-5" />
                            Rating Evolution
                        </CardTitle>
                        <CardDescription>Visualizing your journey through the ranks.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] w-full pt-4">
                        <ChartContainer config={ratingChartConfig} className="h-full w-full">
                            <LineChart data={ratingHistoryData} margin={{ left: -20, right: 20, top: 10, bottom: 10 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis 
                                    dataKey="period" 
                                    stroke="rgba(255,255,255,0.5)" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="rgba(255,255,255,0.5)" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    domain={[0, 1000]}
                                />
                                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                                <Line 
                                    type="monotone" 
                                    dataKey="rating" 
                                    stroke="var(--color-rating)" 
                                    strokeWidth={4} 
                                    dot={{ r: 6, fill: "var(--color-rating)", strokeWidth: 2, stroke: "hsl(var(--card))" }} 
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-none shadow-lg bg-card">
                        <CardHeader>
                            <CardTitle className="text-sm font-black italic uppercase text-muted-foreground">Rating History</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[...ratingHistoryData].reverse().map((item, idx) => (
                                <div key={item.period} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-transparent hover:border-primary/20 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <History className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="font-bold text-sm">{item.period}</span>
                                    </div>
                                    <Badge className="bg-primary text-primary-foreground font-black italic">{item.label}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg bg-primary/5 border-primary/10">
                        <CardHeader>
                            <CardTitle className="text-sm font-black italic uppercase text-primary">Performance Insight</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                You've increased your rating significantly since the first half of 2023. Your most significant jump happened in the last 6 months.
                            </p>
                            <div className="pt-4 border-t border-primary/10 flex items-center gap-2 text-xs font-bold text-primary uppercase">
                                <ArrowUpRight className="h-4 w-4" />
                                On track for P700 by 2025 H2
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="matches" className="mt-8 space-y-8">
                <div className="space-y-4">
                    <h2 className="text-xl font-black italic uppercase tracking-tighter text-primary">Matches</h2>
                     <div className="grid gap-4 md:grid-cols-2">
                        {matchesData.upcoming.map(match => (
                            <Card key={match.id} className="border-none shadow-md bg-card group hover:bg-primary/5 transition-colors">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-black text-lg tracking-tight group-hover:text-primary transition-colors">{match.title}</p>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                            <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-primary" />{match.date}</span>
                                            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-primary" />{match.location}</span>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="font-black uppercase text-[10px] tracking-widest border-muted group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all" asChild>
                                        <Link href={`/dashboard/matches/${match.id}`}>Details</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {unlockedAchievements.map((achievement) => (
                    <Card
                        key={achievement.id}
                        className='flex flex-col text-center items-center transition-all border-none bg-card shadow-lg p-6 group hover:translate-y-[-4px]'
                    >
                        <div className='mx-auto h-20 w-20 rounded-full flex items-center justify-center bg-primary/10 mb-4 shadow-inner border border-primary/10 group-hover:scale-110 transition-transform'>
                            <achievement.icon className='h-10 w-10 text-primary drop-shadow-md' />
                        </div>
                        <CardTitle className="text-sm font-black italic uppercase tracking-tighter mb-2">
                            {achievement.title}
                        </CardTitle>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                            {achievement.description}
                        </p>
                        <div className="mt-6 flex items-center gap-1.5 text-primary">
                            <CheckCircle className="h-3 w-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">UNLOCKED</span>
                        </div>
                    </Card>
                    ))}
                </div>
            </TabsContent>

            <TabsContent value="friends" className="mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {friendsList.map(friend => (
                        <Card key={friend.id} className="border-none shadow-md bg-card hover:bg-primary/5 transition-all group cursor-pointer">
                            <CardContent className="p-4 flex items-center gap-4">
                                <Avatar className="h-14 w-14 ring-2 ring-background border-none shadow-lg">
                                    <AvatarImage src={friend.avatarUrl} alt={friend.name} data-ai-hint="padel player" />
                                    <AvatarFallback>{friend.name.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-black text-sm tracking-tight group-hover:text-primary transition-colors">{friend.name}</p>
                                    <Badge variant="secondary" className="mt-1 text-[8px] font-black italic tracking-widest uppercase">{friend.skillLevel}</Badge>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                    <MessageCircle className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </TabsContent>

             <TabsContent value="media" className="mt-8">
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        {id: 'h1', url: 'https://picsum.photos/seed/padel-highlight-1/600/400', hint: 'padel match'},
                        {id: 'h2', url: 'https://picsum.photos/seed/padel-highlight-2/600/400', hint: 'padel practice'},
                        {id: 'h3', url: 'https://picsum.photos/seed/padel-highlight-3/600/400', hint: 'padel players'},
                        {id: 'h4', url: 'https://picsum.photos/seed/padel-highlight-4/600/400', hint: 'padel court'},
                        {id: 'h5', url: 'https://picsum.photos/seed/padel-highlight-5/600/400', hint: 'padel gear'},
                        {id: 'h6', url: 'https://picsum.photos/seed/padel-highlight-6/600/400', hint: 'padel win'},
                    ].map(highlight => (
                        <Card key={highlight.id} className="overflow-hidden border-none shadow-lg relative aspect-video group cursor-pointer">
                            <Image src={highlight.url} alt="highlight" fill className="object-cover transition-transform group-hover:scale-110" data-ai-hint={highlight.hint} />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                <Film className="h-8 w-8 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </Card>
                    ))}
                 </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}