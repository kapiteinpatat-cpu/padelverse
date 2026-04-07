'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Trash2, CreditCard, Banknote, History, Package, Plus, Minus, Search, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PRODUCTS = [
  { id: 'p1', name: 'Cold Water 500ml', price: 1.50, category: 'Drinks', stock: 45 },
  { id: 'p2', name: 'Sports Drink Blue', price: 2.50, category: 'Drinks', stock: 22 },
  { id: 'p3', name: 'Protein Bar Nut', price: 3.00, category: 'Snacks', stock: 15 },
  { id: 'p4', name: 'Fresh Apple', price: 1.00, category: 'Snacks', stock: 10 },
  { id: 'p5', name: 'Overgrip Pro (3pk)', price: 8.50, category: 'Gear', stock: 30 },
  { id: 'p6', name: 'Can of Balls (Head)', price: 6.50, category: 'Gear', stock: 12 },
];

export default function ClubPosPage() {
  const { toast } = useToast();
  const [cart, setCart] = useState<{ product: any, qty: number }[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

  const handleCheckout = (method: string) => {
    toast({
      title: "Order Completed",
      description: `Total: €${total.toFixed(2)} via ${method}. Receipt sent to customer.`,
    });
    setCart([]);
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon">
                  <Link href="/dashboard/club"><ArrowLeft className="h-6 w-6" /></Link>
              </Button>
              <h1 className="text-2xl font-bold">Canteen POS</h1>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex">
              <History className="mr-2 h-4 w-4" /> Order History
          </Button>
      </div>

      <div className="grid flex-1 overflow-hidden grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Catalog */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          <CardHeader className="pb-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Terminal</CardTitle>
              <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search items..." className="pl-10 h-9" />
              </div>
            </div>
            <Tabs defaultValue="All" className="mt-4" onValueChange={setActiveCategory}>
              <TabsList className="bg-muted/50">
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Drinks">Drinks</TabsTrigger>
                <TabsTrigger value="Snacks">Snacks</TabsTrigger>
                <TabsTrigger value="Gear">Gear</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-4">
            <ScrollArea className="h-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {PRODUCTS.filter(p => activeCategory === 'All' || p.category === activeCategory).map(product => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="flex flex-col text-left p-4 rounded-xl border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{product.category}</span>
                    <span className="font-bold text-sm mt-1 group-hover:text-primary transition-colors">{product.name}</span>
                    <span className="text-lg font-black mt-2">€{product.price.toFixed(2)}</span>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] py-0">{product.stock} in stock</Badge>
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Plus className="h-3 w-3" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Cart & Checkout */}
        <Card className="flex flex-col border-primary/20 overflow-hidden">
          <CardHeader className="bg-muted/30 flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Active Order
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full">
              {cart.length > 0 ? (
                <div className="divide-y">
                  {cart.map(item => (
                    <div key={item.product.id} className="p-4 flex items-center justify-between group">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">€{item.product.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded-lg bg-muted/50">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQty(item.product.id, -1)}><Minus className="h-3 w-3" /></Button>
                          <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQty(item.product.id, 1)}><Plus className="h-3 w-3" /></Button>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeFromCart(item.product.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                  <Package className="h-12 w-12 mb-4 opacity-20" />
                  <p>The cart is empty.</p>
                  <p className="text-xs">Tap items on the left to start an order.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 p-6 border-t bg-muted/30 flex-shrink-0">
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>€{(total / 1.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>VAT (20%)</span>
                <span>€{(total - total / 1.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-black pt-2 border-t border-primary/20">
                <span>Total</span>
                <span className="text-primary">€{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button variant="outline" className="h-12" onClick={() => handleCheckout('Cash')} disabled={cart.length === 0}>
                <Banknote className="mr-2 h-4 w-4" /> Cash
              </Button>
              <Button className="h-12 bg-primary text-primary-foreground" onClick={() => handleCheckout('Card')} disabled={cart.length === 0}>
                <CreditCard className="mr-2 h-4 w-4" /> Card
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}