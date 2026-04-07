
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, Search, Filter, TrendingUp, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';

const mockInvoices = [
  { id: 'INV-2024-001', member: 'Alex Johnson', date: '2024-02-10', amount: 120.00, status: 'paid', type: 'Subscription' },
  { id: 'INV-2024-002', member: 'Maria Garcia', date: '2024-02-11', amount: 15.50, status: 'paid', type: 'POS Order' },
  { id: 'INV-2024-003', member: 'Chris Wilson', date: '2024-02-12', amount: 45.00, status: 'overdue', type: 'Court Booking' },
  { id: 'INV-2024-004', member: 'Jane Smith', date: '2024-02-12', amount: 120.00, status: 'draft', type: 'Subscription' },
];

export default function ClubInvoicesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Financial Records</h1>
          <p className="mt-2 text-lg text-muted-foreground">Invoices, billing, and accounting exports.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
            <Button className="bg-primary text-primary-foreground"><CreditCard className="mr-2 h-4 w-4" /> Stripe Dashboard</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Revenue (MTD)</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€12,450.00</div>
            <p className="text-xs mt-1 flex items-center gap-1 text-primary"><TrendingUp className="h-3 w-3" /> +18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending Payout</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€4,210.00</div>
            <p className="text-xs text-muted-foreground mt-1">Next transfer: Feb 15</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">VAT Liabilities</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€2,490.00</div>
            <p className="text-xs text-muted-foreground mt-1">Estimated for Q1</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Invoice History</CardTitle>
            <div className="flex gap-2">
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" placeholder="Invoice # or member..." />
                </div>
                <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                  <TableCell className="font-medium">{inv.member}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{inv.type}</TableCell>
                  <TableCell className="text-xs">{inv.date}</TableCell>
                  <TableCell className="font-bold">€{inv.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={inv.status === 'paid' ? 'default' : inv.status === 'overdue' ? 'destructive' : 'secondary'} className="capitalize">
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><FileText className="h-4 w-4" /></Button>
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
