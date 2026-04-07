'use client';

import { achievements, AchievementCategory } from '@/lib/achievements';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Mock data for unlocked achievements.
const unlockedAchievementIds = new Set([
  'perf_1',
  'perf_7',
  'perf_8',
  'media_1',
  'media_2',
  'media_6',
  'comm_1',
  'cons_1',
  'cons_7',
]);

// Mock data for in-progress achievements.
const inProgressAchievements = new Map<string, number>([
  ['perf_2', 3],
  ['perf_9', 7],
  ['media_3', 6],
  ['comm_16', 2],
  ['cons_2', 3],
]);

const achievementCategories: AchievementCategory[] = [
  'Performance',
  'Media & Social',
  'Community & Club',
  'Consistency & Fun',
];

export default function AchievementsPage() {
  return (
    <div className="space-y-6">
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight">Your Achievements</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Track your progress and celebrate your milestones on and off the court.
        </p>
      </div>

      <Tabs defaultValue="Performance" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto sm:grid-cols-4">
          {achievementCategories.map((category) => (
            <TabsTrigger key={category} value={category} className="py-2.5">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        {achievementCategories.map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {achievements
                .filter((ach) => ach.category === category)
                .map((achievement) => {
                  const isUnlocked = unlockedAchievementIds.has(achievement.id);
                  const progress = inProgressAchievements.get(achievement.id);
                  const isInProgress = progress !== undefined && !isUnlocked;
                  const progressPercentage = isInProgress && achievement.threshold > 1 ? (progress / achievement.threshold) * 100 : 0;
                  
                  return (
                    <Card
                      key={achievement.id}
                      className={cn(
                        'flex flex-col text-center items-center transition-all',
                        isUnlocked
                          ? 'border-primary/50 bg-card shadow-lg'
                          : isInProgress
                          ? 'bg-card'
                          : 'bg-muted/30 grayscale opacity-60 hover:opacity-80 hover:grayscale-0'
                      )}
                    >
                      <CardHeader className="p-4 pb-2">
                        <div
                          className={cn(
                            'mx-auto h-16 w-16 rounded-full flex items-center justify-center',
                            isUnlocked || isInProgress ? 'bg-primary/10' : 'bg-muted'
                          )}
                        >
                          <achievement.icon
                            className={cn(
                              'h-8 w-8',
                              isUnlocked || isInProgress
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            )}
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow p-4 pt-2">
                        <CardTitle className="text-base font-semibold leading-tight">
                          {achievement.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                      </CardContent>
                      <CardFooter className="w-full flex flex-col justify-center p-4 pt-0 min-h-[52px]">
                        {isUnlocked ? (
                          <div className="flex items-center gap-1.5 text-primary">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm font-medium">Unlocked</span>
                          </div>
                        ) : isInProgress && achievement.threshold > 1 ? (
                          <div className="w-full text-center">
                            <Progress value={progressPercentage} className="h-2 bg-muted" />
                            <p className="text-xs font-medium text-muted-foreground mt-2">{`${progress} / ${achievement.threshold}`}</p>
                          </div>
                        ) : (
                          <p className="text-xs font-medium text-muted-foreground">In Progress</p>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
