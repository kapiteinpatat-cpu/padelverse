'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Shield, ShieldCheck, Search, Trash2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockStaff = [
  { id: 's1', name: 'John Doe', email: 'john@padelverse.com', role: 'club_owner', avatarUrl: 'https://picsum.photos/seed/p1/80/80' },
  { id: 's2', name: 'Sarah Miller', email: 'sarah@padelverse.com', role: 'club_admin', avatarUrl: 'https://picsum.photos/seed/p2/80/80' },
  { id: 's3', name: 'Mike Ross', email: 'mike@padelverse.com', role: 'club_admin', avatarUrl: 'https://picsum.photos/seed/p3/80/80' },
];

export default function ClubStaffPage() {
  const { toast } = useToast();
  const [staff, setStaff] = useState(mockStaff);

  const handleRoleChange = (id: string, newRole: string) => {
    setStaff(staff.map(s => s.id === id ? { ...s, role: newRole } : s));
    toast({ title: 'Role Updated', description: 'The staff member\'s role has been updated.' });
  };

  const handleRemoveStaff = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
    toast({ title: 'Access Revoked', description: 'The staff member has been removed from the club.' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Staff & Permissions</h1>
          <p className="mt-2 text-lg text-muted-foreground">Manage who can administrate your club.</p>
        </div>
        <Button className="bg-primary text-primary-foreground"><UserPlus className="mr-2 h-4 w-4" /> Invite Staff</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Staff Directory</CardTitle>
              <CardDescription>View and manage roles for your club team.</CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search staff..." />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{member.name.substring(0,2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{member.email}</TableCell>
                  <TableCell>
                    <Select defaultValue={member.role} onValueChange={(val) => handleRoleChange(member.id, val)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="club_owner">
                          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Owner</div>
                        </SelectItem>
                        <SelectItem value="club_admin">
                          <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Admin</div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleRemoveStaff(member.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /> Pending Invites</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">No pending invitations. Invite new staff members by email.</p>
            <div className="flex gap-2">
              <Input placeholder="email@example.com" />
              <Button variant="secondary">Send Invite</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">Role Descriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Owner:</strong> Full access to all club settings, billing, payouts, and staff management.</p>
            <p><strong className="text-foreground">Admin:</strong> Can manage trainers, availability, events, and announcements.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
