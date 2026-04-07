
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserPlus, Filter, MoreHorizontal, Settings2, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const mockMembers = [
  { id: 'm1', name: 'Alex Johnson', email: 'alex@example.com', plan: 'Premium Yearly', status: 'active', joined: '2024-01-15' },
  { id: 'm2', name: 'Maria Garcia', email: 'maria@example.com', plan: 'Standard Monthly', status: 'active', joined: '2024-02-10' },
  { id: 'm3', name: 'Chris Wilson', email: 'chris@example.com', plan: '10-Session Pack', status: 'overdue', joined: '2023-11-05' },
  { id: 'm4', name: 'Jane Smith', email: 'jane@example.com', plan: 'Premium Monthly', status: 'cancelled', joined: '2023-08-20' },
];

export default function ClubMembershipsPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Memberships</h1>
          <p className="mt-2 text-lg text-muted-foreground">Manage your community and recurring revenue.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" asChild>
                <Link href="/dashboard/club/plans"><Settings2 className="mr-2 h-4 w-4" /> Manage Plans</Link>
            </Button>
            <Button className="bg-primary text-primary-foreground"><UserPlus className="mr-2 h-4 w-4" /> Add Member</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Active Members</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,248</div>
            <p className="text-xs text-green-500 mt-1 flex items-center">+12 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Churn Rate</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2.4%</div>
            <p className="text-xs text-muted-foreground mt-1">Lower than city average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Overdue Payments</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">14</div>
            <p className="text-xs text-muted-foreground mt-1">Automatic reminders sent</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Member Directory</CardTitle>
            <div className="flex gap-2">
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://picsum.photos/seed/${member.id}/80/80`} />
                        <AvatarFallback>{member.name.substring(0,2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.plan}</TableCell>
                  <TableCell>
                    <Badge variant={member.status === 'active' ? 'default' : member.status === 'overdue' ? 'destructive' : 'secondary'} className="capitalize">
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{member.joined}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
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
