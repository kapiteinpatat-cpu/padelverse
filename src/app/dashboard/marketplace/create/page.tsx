'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowLeft, DollarSign, Image as ImageIcon, Tag, Type, List, Info, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { useState, useRef } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  category: z.enum(['Rackets', 'Balls', 'Footwear', 'Bags', 'Apparel', 'Accessories']),
  condition: z.enum(['New', 'Like New', 'Used']),
  description: z.string().optional(),
});

export default function CreateListingPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            price: 0,
            category: 'Rackets',
            condition: 'Used',
            description: '',
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log({ ...values, image: imagePreview });
        toast({
            title: "Item Listed!",
            description: `Your item "${values.title}" has been successfully listed in the marketplace.`,
        });
        router.push('/dashboard/marketplace');
    }

  return (
    <div className="space-y-6">
        <div>
            <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/marketplace">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Marketplace
                </Link>
            </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">List a New Item</CardTitle>
                <CardDescription>Fill in the details below to sell your gear.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item Title</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="e.g., Slightly Used Padel Racket" {...field} className="pl-10" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input type="number" placeholder="120" {...field} className="pl-10" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                 <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Rackets">Rackets</SelectItem>
                                                <SelectItem value="Balls">Balls</SelectItem>
                                                <SelectItem value="Footwear">Footwear</SelectItem>
                                                <SelectItem value="Bags">Bags</SelectItem>
                                                <SelectItem value="Apparel">Apparel</SelectItem>
                                                <SelectItem value="Accessories">Accessories</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                         <FormField
                            control={form.control}
                            name="condition"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Condition</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select the item's condition" />
                                                </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="New">New</SelectItem>
                                            <SelectItem value="Like New">Like New</SelectItem>
                                            <SelectItem value="Used">Used</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                         <Textarea
                                            placeholder="Tell us a little bit about the item"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                         <div className="space-y-2">
                            <Label>Item Image</Label>
                             <div className="mt-2 flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
                                    {imagePreview ? (
                                        <Image src={imagePreview} alt="Uploaded preview" width={200} height={200} className="object-contain h-56" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-muted-foreground">PNG or JPG</p>
                                        </div>
                                    )}
                                    <input id="dropzone-file" type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg" />
                                </label>
                            </div> 
                        </div>
                        <FormDescription>
                            Note: All transactions are approved by the club and must be completed physically on club premises.
                        </FormDescription>

                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-6">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/dashboard/marketplace">Cancel</Link>
                        </Button>
                        <Button type="submit">List Item</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    </div>
  );
}
