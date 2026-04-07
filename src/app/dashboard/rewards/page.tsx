'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { rewards, Reward } from '@/lib/rewards';
import { Gift, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function RewardsPage() {
  const { toast } = useToast();
  const [userPoints, setUserPoints] = useState(750);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const handleRedeem = (reward: Reward) => {
    if (userPoints >= reward.points) {
      setUserPoints(userPoints - reward.points);
      toast({
        title: "Reward Redeemed!",
        description: `You have successfully redeemed "${reward.title}".`,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Loyalty & Rewards</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Earn points and redeem exclusive rewards for your activity.
          </p>
        </div>
        <Card className="bg-primary text-primary-foreground min-w-[200px] text-center">
            <CardHeader className="p-4">
                <CardTitle className="text-lg">Your Points</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-5xl font-bold">{userPoints}</p>
            </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rewards.map((reward) => (
          <Card key={reward.id} className="flex flex-col">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <reward.icon className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="pt-2">{reward.title}</CardTitle>
              <CardDescription className="text-xs">{reward.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow" />
            <CardFooter className="flex-col gap-4 p-4 pt-0 border-t">
               <div className="flex items-baseline justify-center gap-2 pt-4">
                 <span className="text-3xl font-bold">{reward.points}</span>
                 <span className="text-sm text-muted-foreground">points</span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    disabled={userPoints < reward.points}
                    onClick={() => setSelectedReward(reward)}
                  >
                    Redeem
                  </Button>
                </DialogTrigger>
                {selectedReward?.id === reward.id && (
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Redeem Reward</DialogTitle>
                      <DialogDescription>
                        Show this QR code at the club to claim your reward.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-4">
                      <Image
                        src="https://placehold.co/256x256/ffffff/212936?text=SCAN+ME"
                        alt="QR Code"
                        width={256}
                        height={256}
                        data-ai-hint="qr code"
                      />
                      <div className="text-center">
                        <p className="font-bold text-lg">{selectedReward.title}</p>
                        <p className="text-muted-foreground">{selectedReward.points} points</p>
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-center">
                       <DialogClose asChild>
                         <Button type="button" variant="secondary">
                           Close
                         </Button>
                       </DialogClose>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          onClick={() => handleRedeem(selectedReward)}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                          Confirm Redemption
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
