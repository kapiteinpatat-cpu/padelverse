'use client';

import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Users, Swords, GraduationCap, TrendingUp, TrendingDown } from 'lucide-react';

const weeklyMatchesData = [
  { week: 'Week 1', matches: 45 },
  { week: 'Week 2', matches: 52 },
  { week: 'Week 3', matches: 48 },
  { week: 'Week 4', matches: 60 },
  { week: 'Week 5', matches: 55 },
  { week: 'Week 6', matches: 65 },
];

const weeklyMatchesConfig = {
  matches: {
    label: 'Matches',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const memberActivityData = [
  { month: 'Jan', members: 186 },
  { month: 'Feb', members: 305 },
  { month: 'Mar', members: 237 },
  { month: 'Apr', members: 273 },
  { month: 'May', members: 209 },
  { month: 'Jun', members: 214 },
];

const memberActivityConfig = {
  members: {
    label: 'Active Members',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const peakHoursData = [
    { hour: 'Morning', value: 275, fill: "hsl(var(--chart-1))" },
    { hour: 'Afternoon', value: 350, fill: "hsl(var(--chart-2))" },
    { hour: 'Evening', value: 520, fill: "hsl(var(--chart-3))" },
    { hour: 'Night', value: 180, fill: "hsl(var(--chart-4))" },
]
const peakHoursConfig = {
    value: { label: "Matches" },
    morning: { label: "Morning", color: "hsl(var(--chart-1))"},
    afternoon: { label: "Afternoon", color: "hsl(var(--chart-2))"},
    evening: { label: "Evening", color: "hsl(var(--chart-3))"},
    night: { label: "Night", color: "hsl(var(--chart-4))"},
} satisfies ChartConfig

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight">Club Analytics</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Real-time performance metrics and member engagement.
        </p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">314</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matches This Month</CardTitle>
            <Swords className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Booked</CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82</div>
             <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingDown className="h-4 w-4 text-destructive" />
                -5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trainer Utilization</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
             <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                +3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Member Activity</CardTitle>
            <CardDescription>Unique members with at least one match.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={memberActivityConfig}>
              <BarChart accessibilityLayer data={memberActivityData}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="members" fill="var(--color-members)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Matches</CardTitle>
            <CardDescription>Total matches played per week.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={weeklyMatchesConfig}>
              <LineChart
                accessibilityLayer
                data={weeklyMatchesData}
                margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                <Line
                  dataKey="matches"
                  type="natural"
                  stroke="var(--color-matches)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--color-matches)" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
       <Card>
          <CardHeader>
            <CardTitle>Peak Playing Hours</CardTitle>
            <CardDescription>Distribution of matches throughout the day.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
             <ChartContainer
                config={peakHoursConfig}
                className="mx-auto aspect-square max-h-[350px]"
            >
              <PieChart>
                 <ChartTooltip
                  content={<ChartTooltipContent nameKey="value" hideLabel />}
                />
                <Pie data={peakHoursData} dataKey="value" nameKey="hour" innerRadius={60} strokeWidth={2} stroke="hsl(var(--background))" />
              </PieChart>
            </ChartContainer>
          </CardContent>
           <CardFooter className="flex-col gap-2 text-sm pt-4">
            <div className="flex items-center gap-2 font-medium leading-none text-primary">
              Evening hours are the most popular for matches.
            </div>
            <div className="leading-none text-muted-foreground">
              Showing data for the last 30 days.
            </div>
          </CardFooter>
        </Card>
    </div>
  );
}