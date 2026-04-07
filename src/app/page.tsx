'use client';

import Image from "next/image";
import Link from "next/link";
import { Apple, AtSign, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon, PadelVerseLogo } from "@/components/icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LoginPage() {
  const loginImage = PlaceHolderImages.find(p => p.id === "login-background");

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
         {loginImage && (
            <Image
              src={loginImage.imageUrl}
              alt={loginImage.description}
              fill
              className="object-cover"
              data-ai-hint={loginImage.imageHint}
            />
         )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/50" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <PadelVerseLogo className="h-8 w-auto" />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This platform has revolutionized how our club connects and plays.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis, Club Owner</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md space-y-6">
          <Card className="border-0 bg-transparent shadow-none sm:border sm:bg-card sm:shadow-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold tracking-tight">Welcome Back</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="m@example.com" required className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline text-primary hover:text-primary/80">
                      Forgot your password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" required className="pl-10" />
                  </div>
                </div>
                 <Button type="submit" className="w-full" asChild>
                  <Link href="/dashboard">Sign In</Link>
                </Button>
              </form>
              <Separator className="my-6">
                <span className="px-2 text-xs uppercase text-muted-foreground bg-card">Or continue with</span>
              </Separator>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline">
                  <Apple className="mr-2 h-4 w-4 fill-current" />
                  Apple
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Link href="#" className="underline text-primary hover:text-primary/80">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
