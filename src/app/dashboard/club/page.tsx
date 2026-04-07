'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Calendar,
  Bell,
  Palette,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  AreaChart,
  ShoppingBasket,
  FileText,
  UserCheck,
  Zap,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

export default function ClubManagementPage() {
  const managementSections = [
    {
      title: 'Memberships',
      description: 'Subscriptions, punch cards, and member states.',
      icon: UserCheck,
      href: '/dashboard/club/memberships',
    },
    {
      title: 'POS (Bar & Gear)',
      description: 'Take bar orders and manage gear inventory.',
      icon: ShoppingBasket,
      href: '/dashboard/club/pos',
    },
    {
      title: 'Invoices & Payouts',
      description: 'Immutable financials and Stripe Connect sync.',
      icon: FileText,
      href: '/dashboard/club/invoices',
    },
    {
      title: 'Resource Planning',
      description: 'Block courts for events and tournaments.',
      icon: Calendar,
      href: '/dashboard/club/reservations',
    },
    {
      title: 'Club Profile',
      description: 'Edit address, courts, and opening hours.',
      icon: Building2,
      href: '/dashboard/club/profile',
    },
    {
      title: 'Club Analytics',
      description: 'View performance and engagement metrics.',
      icon: AreaChart,
      href: '/dashboard/club/analytics',
    },
    {
      title: 'Staff & Roles',
      description: 'Manage admins and granular permissions.',
      icon: ShieldCheck,
      href: '/dashboard/club/staff',
    },
    {
      title: 'Trainers Hub',
      description: 'Manage profiles and self-service toggles.',
      icon: GraduationCap,
      href: '/dashboard/club/trainers',
    },
    {
      title: 'Branding & Thema',
      description: 'Logo, colors, and sponsor banner logic.',
      icon: Palette,
      href: '/dashboard/club/branding',
    },
    {
      title: 'Communications',
      description: 'Broadcast alerts and manage newsletters.',
      icon: Bell,
      href: '/dashboard/club/notifications',
    },
    {
      title: 'Policies',
      description: 'Cancellation and no-show rules engine.',
      icon: ShieldAlert,
      href: '/dashboard/club/policies',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="h-10 w-10">
                <Link href="/dashboard"><ArrowLeft className="h-6 w-6" /></Link>
            </Button>
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Admin Center</h1>
                <p className="mt-1 text-lg text-muted-foreground">
                    Operational command for PadelVerse Central.
                </p>
            </div>
        </div>
        <div className="flex gap-2">
            <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary py-1.5 px-4 font-bold uppercase tracking-widest text-[10px] h-fit">
                <Zap className="mr-2 h-3 w-3" /> System Health: Optimal
            </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {managementSections.map((section) => (
          <Card key={section.title} className="group hover:border-primary/50 transition-all flex flex-col bg-card border-muted overflow-hidden shadow-lg">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <section.icon className="h-6 w-6 text-primary" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <CardTitle className="text-xl font-bold leading-tight mb-2">{section.title}</CardTitle>
              <CardDescription className="line-clamp-2 text-sm font-medium leading-relaxed">{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-4 border-t bg-muted/10 p-6">
              <Button asChild variant="outline" className="w-full h-10 font-bold uppercase tracking-widest text-[10px] group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <Link href={section.href}>Enter Module</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
