'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, TrendingUp, Calendar, Filter, Download } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const mockBookings = [
  { id: 'b1', member: 'Alex Johnson', trainer: 'Carlos Sanchez', date: '2025-02-15', time: '10:00', amount: 90, status: 'confirmed', payment: 'paid' },
  { id: 'b2', member: 'Maria Garcia', trainer: 'Isabella Rossi', date: '2025-02-15', time: '11:00', amount: 60, status: 'confirmed', payment: 'paid' },
  { id: 'b3', member: 'Chris Wilson', trainer: 'Carlos Sanchez', date: '2025-02-16', time: '14:00', amount: 90, status: 'pending', payment: 'unpaid' },
  { id: 'b4', member: 'Jane Smith', trainer: 'Liam Chen', date: '2025-02-16', time: '10:00', amount: 75, status: 'cancelled', payment: 'refunded' },
];

export default function ClubBookingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Bookings & Payouts</h1>
          <p className="mt-2 text-lg text-muted-foreground">Monitor lesson volume and revenue distribution.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
            <Button className="bg-primary text-primary-foreground"><CreditCard className="mr-2 h-4 w-4" /> Payout Settings</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium opacity-80">Total Revenue (MTD)</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€4,850.00</div>
            <p className="text-xs mt-1 flex items-center gap-1 opacity-80"><TrendingUp className="h-3 w-3" /> +12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Active Bookings</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">124</div>
            <p className="text-xs mt-1 text-muted-foreground">Across all trainers this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Avg. Lesson Price</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€72.50</div>
            <p className="text-xs mt-1 text-muted-foreground">Market competitive rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest lesson reservations and their status.</CardDescription>
            </div>
            <Button variant="ghost" size="sm"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Trainer</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.member}</TableCell>
                  <TableCell>{booking.trainer}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{booking.date} at {booking.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>€{booking.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'secondary' : 'destructive'} className="capitalize">
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("capitalize", booking.payment === 'paid' ? 'border-primary text-primary' : '')}>
                      {booking.payment}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
