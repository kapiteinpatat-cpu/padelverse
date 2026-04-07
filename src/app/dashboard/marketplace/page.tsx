
'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, ShoppingBag, MessageSquare, Tag } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";

const marketplaceItems = [
  {
    id: "item1",
    title: "Slightly Used Padel Racket",
    price: 120,
    category: "Rackets",
    seller: {
      name: "Maria Garcia",
      avatarUrl: "https://picsum.photos/seed/padel-player-3/80/80",
    },
    imageUrl: "https://picsum.photos/seed/padel-racket-1/600/400",
    imageHint: "padel racket",
    condition: "Used",
  },
  {
    id: "item2",
    title: "New Padel Balls (3-pack)",
    price: 15,
    category: "Balls",
    seller: {
      name: "Alex Johnson",
      avatarUrl: "https://picsum.photos/seed/padel-player-2/80/80",
    },
    imageUrl: "https://picsum.photos/seed/padel-balls-1/600/400",
    imageHint: "padel balls",
    condition: "New",
  },
  {
    id: "item3",
    title: "Padel Shoes - Size 10",
    price: 80,
    category: "Footwear",
    seller: {
      name: "Chris Wilson",
      avatarUrl: "https://picsum.photos/seed/padel-player-6/80/80",
    },
    imageUrl: "https://picsum.photos/seed/padel-shoes-1/600/400",
    imageHint: "padel shoes",
    condition: "Like New",
  },
  {
    id: "item4",
    title: "Padel Bag",
    price: 50,
    category: "Bags",
    seller: {
      name: "Jane Smith",
      avatarUrl: "https://picsum.photos/seed/padel-player-4/80/80",
    },
    imageUrl: "https://picsum.photos/seed/padel-bag-1/600/400",
    imageHint: "padel bag",
    condition: "Used",
  },
    {
    id: "item5",
    title: "Advanced Carbon Fiber Racket",
    price: 250,
    category: "Rackets",
    seller: {
      name: "John Doe",
      avatarUrl: "https://picsum.photos/seed/padel-player-1/80/80",
    },
    imageUrl: "https://picsum.photos/seed/padel-racket-2/600/400",
    imageHint: "padel racket professional",
    condition: "Like New",
  },
  {
    id: "item6",
    title: "Club T-shirt - Large",
    price: 25,
    category: "Apparel",
    seller: {
      name: "David Lee",
      avatarUrl: "https://picsum.photos/seed/padel-player-7/80/80",
    },
    imageUrl: "https://picsum.photos/seed/padel-shirt-1/600/400",
    imageHint: "padel t-shirt",
    condition: "New",
  },
];


export default function MarketplacePage() {
    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
                 <div>
                    <h1 className="text-4xl font-bold tracking-tight">Marketplace</h1>
                    <p className="mt-1 text-lg text-muted-foreground">
                        Buy and sell second-hand gear within the club.
                    </p>
                </div>
                 <Button asChild className="bg-primary text-primary-foreground">
                    <Link href="/dashboard/marketplace/create">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        List an Item
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-card shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <SlidersHorizontal className="h-5 w-5 text-primary" />
                                Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="search-item">Search keywords</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="search-item" placeholder="e.g. racket..." className="pl-10" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="All categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All categories</SelectItem>
                                        <SelectItem value="Rackets">Rackets</SelectItem>
                                        <SelectItem value="Balls">Balls</SelectItem>
                                        <SelectItem value="Footwear">Footwear</SelectItem>
                                        <SelectItem value="Bags">Bags</SelectItem>
                                        <SelectItem value="Apparel">Apparel</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-4">
                                <Label htmlFor="price-range">Price range</Label>
                                <Slider
                                    id="price-range"
                                    max={500}
                                    defaultValue={[0, 500]}
                                    step={10}
                                    className="my-4"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground font-medium uppercase">
                                    <span>€0</span>
                                    <span>€500+</span>
                                </div>
                            </div>
                            
                            <Button className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                                Apply filters
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    {marketplaceItems.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {marketplaceItems.map((item) => (
                            <Card key={item.id} className="flex flex-col overflow-hidden border-none shadow-lg group bg-card transition-all hover:translate-y-[-4px]">
                                <div className="relative aspect-[4/3] w-full overflow-hidden">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                            data-ai-hint={item.imageHint}
                                        />
                                        <Badge variant="secondary" className="absolute top-3 right-3 bg-black/60 text-white backdrop-blur-md border-none">{item.condition}</Badge>
                                </div>
                                <CardHeader className="p-4 flex-grow">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">{item.category}</p>
                                    <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">{item.title}</CardTitle>
                                    <p className="text-2xl font-black text-primary mt-2">€{item.price}</p>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 border border-muted-foreground/10">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={item.seller.avatarUrl} alt={item.seller.name} />
                                            <AvatarFallback>{item.seller.name.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none mb-1">Seller</p>
                                                <p className="text-sm font-medium truncate">{item.seller.name}</p>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 border-t flex-col items-start gap-4">
                                    <Button className="w-full bg-primary text-primary-foreground">
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Message seller
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                        </div>
                    ) : (
                        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
                            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                                <Tag className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <CardTitle className="text-2xl mb-2">No items found</CardTitle>
                            <CardDescription className="max-w-xs mb-8">
                                Try adjusting your search or listing something new!
                            </CardDescription>
                            <Button asChild size="lg" className="bg-primary text-primary-foreground">
                                <Link href="/dashboard/marketplace/create">Start selling gear</Link>
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
