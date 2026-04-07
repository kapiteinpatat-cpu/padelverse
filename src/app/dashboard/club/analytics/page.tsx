'use client';

import { Bar, BarChart, CartesianGrid, Label, Line, LineChart, Pie, PieChart, XAxis } from 'recharts';
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
import { Users, Swords, GraduationCap, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
    { hour: 'Morning', value: 275, fill: "var(--color-Morning)" },
    { hour: 'Afternoon', value: 350, fill: "var(--color-Afternoon)" },
    { hour: 'Evening', value: 520, fill: "var(--color-Evening)" },
    { hour: 'Night', value: 180, fill: "var(--color-Night)" },
]
const peakHoursConfig = {
    value: { label: "Matches" },
    Morning: { label: "Morning", color: "hsl(var(--chart-1))"},
    Afternoon: { label: "Afternoon", color: "hsl(var(--chart-2))"},
    Evening: { label: "Evening", color: "hsl(var(--chart-3))"},
    Night: { label: "Night", color: "hsl(var(--chart-4))"},
} satisfies ChartConfig

export default function ClubAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/club"><ArrowLeft className="h-6 w-6" /></Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Club Analytics</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Monitor performance and member engagement.
          </p>
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">314</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matches This Month</CardTitle>
            <Swords className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Booked</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82</div>
             <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                -5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trainer Utilization</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
             <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                +3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Member Activity</CardTitle>
            <CardDescription>Number of unique members who played at least one match.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={memberActivityConfig}>
              <BarChart accessibilityLayer data={memberActivityData}>
                <CartesianGrid vertical={false} />
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
            <CardDescription>Total number of matches played each week.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={weeklyMatchesConfig}>
              <LineChart
                accessibilityLayer
                data={weeklyMatchesData}
                margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                <Line
                  dataKey="matches"
                  type="natural"
                  stroke="var(--color-matches)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
       <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Peak Playing Hours</CardTitle>
            <CardDescription>Distribution of matches played throughout the day.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
             <ChartContainer
                config={peakHoursConfig}
                className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                 <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={peakHoursData}
                  dataKey="value"
                  nameKey="hour"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              1,325
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Matches
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
           <CardFooter className="flex-col gap-2 text-sm pt-4">
            <div className="flex items-center gap-2 font-medium leading-none">
              Evening hours are the most popular for matches. <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing distribution for the last 30 days.
            </div>
          </CardFooter>
        </Card>
    </div>
  );
}
