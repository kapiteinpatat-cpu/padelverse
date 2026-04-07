'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LogOut,
  Settings,
  ShoppingBag,
  Film,
  Swords,
  User as UserIcon,
  Share2,
  Users,
  Trophy,
  GraduationCap,
  Gift,
  Medal,
  ShieldCheck,
  Grid3X3,
  CalendarDays,
  Home,
  MessageSquare
} from 'lucide-react';
import type { ReactNode } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { PadelVerseLogo } from './icons';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: '/dashboard', icon: Home, label: "Home" },
    { href: '/dashboard/social', icon: Share2, label: "Social" },
    { href: '/dashboard/courts', icon: Grid3X3, label: "Play" },
    { href: '/dashboard/matches', icon: Swords, label: "Matches" },
    { href: '/dashboard/highlights', icon: Film, label: "Media Hub" },
    { href: '/dashboard/training', icon: GraduationCap, label: "Training" },
    { href: '/dashboard/leaderboard', icon: Trophy, label: "Rankings" },
    { href: '/dashboard/achievements', icon: Medal, label: "Achievements" },
    { href: '/dashboard/rewards', icon: Gift, label: "Rewards" },
    { href: '/dashboard/matchmaking', icon: Users, label: "Find Game" },
    { href: '/dashboard/marketplace', icon: ShoppingBag, label: "Market" },
    { href: '/dashboard/chat', icon: MessageSquare, label: "Chat" },
    { href: '/dashboard/events', icon: CalendarDays, label: "Events" },
  ];

  const bottomNavItems = [
    { href: '/dashboard', icon: Home, label: "Home" },
    { href: '/dashboard/courts', icon: Grid3X3, label: "Play" },
    { href: '/dashboard/highlights', icon: Film, label: "Media" },
    { href: '/dashboard/club', icon: ShieldCheck, label: "Admin" },
    { href: '/dashboard/profile', icon: UserIcon, label: "Profile" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background" suppressHydrationWarning>
        {mounted && (
          <Sidebar collapsible="icon" className="hidden md:flex group-data-[variant=sidebar]:bg-sidebar">
            <SidebarHeader>
              <div className="px-2 py-4">
                <Link href="/dashboard" className="transition-opacity hover:opacity-80 block">
                  <PadelVerseLogo className="h-8 w-auto hidden group-data-[state=expanded]:block" />
                  <PadelVerseLogo className="h-8 w-auto block group-data-[state=expanded]:hidden" fill="hsl(var(--primary))" />
                </Link>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={{ children: item.label }}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>

              <div className="mt-6 px-2 group-data-[state=collapsed]:hidden border-t pt-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">Management</p>
              </div>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/club')}>
                    <Link href="/dashboard/club">
                      <ShieldCheck className="text-primary" />
                      <span>Control Center</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="gap-2">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <div className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-sidebar-accent">
                          <Avatar className="h-9 w-9">
                              <AvatarImage src="https://picsum.photos/seed/padel-player-1/80/80" alt="JD" />
                              <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div className="hidden flex-col group-data-[state=expanded]:flex">
                              <span className="text-sm font-semibold text-sidebar-foreground">John Doe</span>
                              <span className="text-xs text-muted-foreground">P500 Player</span>
                          </div>
                      </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="w-56">
                      <DropdownMenuLabel>Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link href="/dashboard/profile">Profile</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href="/dashboard/settings">Settings</Link></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link href="/">Logout</Link></DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
            </SidebarFooter>
          </Sidebar>
        )}

        <SidebarInset className={cn("flex-1", !mounted && "w-full")}>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
            {mounted && (
              <div className="flex items-center gap-4 md:hidden">
                 <Link href="/dashboard">
                   <PadelVerseLogo className="h-6 w-auto" />
                 </Link>
              </div>
            )}
            <div className="flex-1" />
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative" asChild>
                    <Link href="/dashboard/chat">
                        <MessageSquare className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                    </Link>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://picsum.photos/seed/padel-player-1/80/80" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href="/dashboard/profile">Profile</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/dashboard/club">Control Center</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/">Logout</Link></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>

          {mounted && (
            <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur-md md:hidden px-4 pb-safe">
              {bottomNavItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 min-w-[64px]",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isActive && "fill-primary/10")} />
                    <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
