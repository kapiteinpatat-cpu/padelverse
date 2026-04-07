'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Film, 
  Swords, 
  Grid3X3,
  CalendarDays,
  TrendingUp,
  Clock,
  MapPin,
  ShoppingBag,
  Gift,
  Medal,
  GraduationCap,
  Trophy
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

export default function DashboardPage() {
  const primaryActions = [
    {
      title: "Book a Court",
      description: "Find an open field and reserve it in 2 taps.",
      icon: Grid3X3,
      link: "/dashboard/courts",
      color: "bg-primary/10 text-primary border-primary/20"
    },
    {
      title: "Join a Match",
      description: "See public matches looking for players.",
      icon: Swords,
      link: "/dashboard/matches",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20"
    },
    {
      title: "Upload Media",
      description: "Share your best highlights with the club.",
      icon: Film,
      link: "/dashboard/highlights",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20"
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Hi, John! 👋</h1>
          <p className="text-muted-foreground mt-1 text-lg">Ready for a match at PadelVerse Central?</p>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 text-sm border-primary/30 text-primary">
                <TrendingUp className="mr-2 h-4 w-4" />
                Rank: #4 Club Elite
            </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-primary/20 bg-primary/5 relative overflow-hidden group hover:border-primary/40 transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <Swords className="h-32 w-32" />
              </div>
              <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Next Activity</CardTitle>
                    <Badge className="bg-primary text-primary-foreground">Match</Badge>
                  </div>
                  <CardDescription>You have a match starting soon.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                              <CalendarDays className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                              <p className="font-bold">{format(new Date(), 'EEEE, MMM do')}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> 18:00 (90 min)
                              </p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                              <MapPin className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                              <p className="font-semibold">PadelVerse Central</p>
                              <p className="text-sm text-muted-foreground">Court 1 (Indoor)</p>
                          </div>
                      </div>
                  </div>
              </CardContent>
              <CardFooter>
                  <Button className="w-full bg-primary text-primary-foreground" asChild>
                      <Link href="/dashboard/matches/m1">View Details</Link>
                  </Button>
              </CardFooter>
          </Card>

          <Card className="bg-muted/30 border-muted relative overflow-hidden group hover:border-muted-foreground/30 transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <Trophy className="h-32 w-32" />
              </div>
              <CardHeader>
                  <CardTitle className="text-xl">Club Progress</CardTitle>
                  <CardDescription>Track your achievements and ranking.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-end justify-between">
                      <div className="space-y-1">
                          <p className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Matches Won</p>
                          <p className="text-3xl font-black">58 <span className="text-sm font-normal text-muted-foreground">/ 82</span></p>
                      </div>
                      <div className="text-right">
                          <Badge variant="secondary">70% Win Rate</Badge>
                      </div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[70%]" />
                  </div>
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full font-bold text-[10px] uppercase tracking-widest" asChild>
                      <Link href="/dashboard/leaderboard">Rankings</Link>
                  </Button>
                  <Button variant="outline" className="w-full font-bold text-[10px] uppercase tracking-widest" asChild>
                      <Link href="/dashboard/achievements">Achievements</Link>
                  </Button>
              </CardFooter>
          </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {primaryActions.map((action) => (
          <Card key={action.title} className="flex flex-col border-none bg-card hover:translate-y-[-4px] transition-all shadow-lg overflow-hidden group">
            <CardHeader className={cn("pb-4", action.color)}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">{action.title}</CardTitle>
                <action.icon className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent className="pt-6 flex-grow">
              <p className="text-muted-foreground text-sm leading-relaxed">{action.description}</p>
            </CardContent>
            <CardFooter>
               <Button asChild className="w-full bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Link href={action.link} className="flex items-center justify-center gap-2">
                    <span>Explore Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="pt-4 pb-12">
          <h2 className="text-xl font-bold mb-4">Shortcuts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {[
                  { label: "Training", icon: GraduationCap, href: "/dashboard/training" },
                  { label: "Market", icon: ShoppingBag, href: "/dashboard/marketplace" },
                  { label: "Events", icon: CalendarDays, href: "/dashboard/events" },
                  { label: "Rewards", icon: Gift, href: "/dashboard/rewards" },
                  { label: "Achievements", icon: Medal, href: "/dashboard/achievements" },
              ].map(item => (
                  <Button key={item.label} variant="outline" className="h-auto py-4 flex flex-col gap-2 border-muted hover:border-primary/50" asChild>
                      <Link href={item.href}>
                          <item.icon className="h-5 w-5 text-primary" />
                          <span className="text-xs font-semibold">{item.label}</span>
                      </Link>
                  </Button>
              ))}
          </div>
      </div>
    </div>
  );
}
