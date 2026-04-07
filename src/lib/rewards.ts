import { LucideIcon, Gift, Shirt, Percent, GlassWater, Ticket, UserPlus } from 'lucide-react';

export type Reward = {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: LucideIcon;
  category: 'Gear' | 'Consumables' | 'Discounts';
};

export const rewards: Reward[] = [
  { id: 'r1', title: 'Free Drink', description: 'Redeem for a free sports drink or water bottle.', points: 50, icon: GlassWater, category: 'Consumables' },
  { id: 'r2', title: '10% Off Pro Shop', description: 'Get 10% off your next purchase at the pro shop.', points: 150, icon: Percent, category: 'Discounts' },
  { id: 'r3', title: 'Club T-Shirt', description: 'Show your club pride with a branded t-shirt.', points: 300, icon: Shirt, category: 'Gear' },
  { id: 'r4', title: 'Free Can of Balls', description: 'A fresh can of premium padel balls.', points: 100, icon: Ticket, category: 'Gear' },
  { id: 'r5', title: 'Guest Pass', description: 'Bring a friend for free for one session.', points: 250, icon: UserPlus, category: 'Consumables' },
  { id: 'r6', title: '$20 Off Lesson', description: 'Get $20 off your next lesson with a club trainer.', points: 400, icon: Percent, category: 'Discounts' },
];
