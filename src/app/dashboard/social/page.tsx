
'use client';

import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Heart, MessageCircle, Share2, ImageIcon, Video as VideoIcon, Send, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SOLTO_PLAYERS } from '@/lib/solto-players';

// Gebruik echte SOLTO-spelers voor social posts
const p = (id: number) => {
  const sp = SOLTO_PLAYERS.find(s => s.id === id);
  return sp ? { name: sp.naam, avatarUrl: sp.avatarUrl, handle: sp.naam.split(' ')[0].toLowerCase() } : { name: 'SOLTO Speler', avatarUrl: `https://picsum.photos/seed/solto-${id}/80/80`, handle: 'solto' };
};

const initialPosts = [
  {
    id: 1,
    author: p(25783), // Finne Marie-France (P50)
    timestamp: '1u geleden',
    content: {
      text: 'Geweldige training vandaag op de binnenvelden! Klaar voor het volgende toernooi 🎾🔥',
      highlightUrl: 'https://picsum.photos/seed/padel-highlight-1/600/400',
      imageHint: "padel match"
    }
  },
  {
    id: 2,
    author: p(95291), // Peeters Sally (P50)
    timestamp: '3u geleden',
    content: {
      text: 'Mooie overwinning vanavond bij SOLTO! Dankjewel partner voor de geweldige samenwerking. 💪',
      match: {
        teamA: {
          players: [{ name: p(95291).name, avatarUrl: p(95291).avatarUrl }, { name: p(25783).name, avatarUrl: p(25783).avatarUrl }],
          score: 2,
          isWinner: true,
        },
        teamB: {
          players: [{ name: p(6554).name, avatarUrl: p(6554).avatarUrl }, { name: p(39457).name, avatarUrl: p(39457).avatarUrl }],
          score: 1,
          isWinner: false,
        },
        sets: ['7-5', '4-6', '6-3'],
        matchType: 'Clubcompetitie',
      }
    }
  },
  {
    id: 3,
    author: p(76967), // Vandeput Joris (P200)
    timestamp: '5u geleden',
    content: {
      text: 'Zware match vandaag maar we blijven trainen. De weg naar P100 is lang maar lohnend! 💪',
      highlightUrl: 'https://picsum.photos/seed/padel-highlight-3/600/400',
      imageHint: "padel training"
    }
  },
  {
    id: 4,
    author: p(21287), // Van Eycken Frank (P300)
    timestamp: '1 dag geleden',
    content: {
      text: 'Spannende avond bij SOLTO! Wat een niveau bij de heren dit seizoen.',
      match: {
        teamA: {
          players: [{ name: p(21287).name, avatarUrl: p(21287).avatarUrl }, { name: p(82354).name, avatarUrl: p(82354).avatarUrl }],
          score: 1,
          isWinner: false,
        },
        teamB: {
          players: [{ name: p(76967).name, avatarUrl: p(76967).avatarUrl }, { name: p(82354).name, avatarUrl: p(82354).avatarUrl }],
          score: 2,
          isWinner: true,
        },
        sets: ['3-6', '6-4', '3-6'],
        matchType: 'Vriendschappelijk',
      }
    }
  },
];

const CreatePost = ({ onAddPost }: { onAddPost: (post: any) => void }) => {
    const { toast } = useToast();
    const [postText, setPostText] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [isPosting, setIsPosting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { 
                 toast({
                    variant: 'destructive',
                    title: 'File too large',
                    description: 'Please upload a file smaller than 10MB.',
                });
                return;
            }
            setMediaFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePost = () => {
        setIsPosting(true);
        // Simulate network delay
        setTimeout(() => {
            const newPostData = {
                content: {
                    text: postText,
                    ...(mediaFile && {
                        highlightUrl: mediaPreview,
                        imageHint: mediaFile.type.startsWith('image/') ? 'user photo' : 'user video',
                    })
                }
            };

            onAddPost(newPostData);
            
            toast({
                title: "Post Shared!",
                description: "Your highlight has been added to the club feed.",
            });
            
            setPostText('');
            setMediaFile(null);
            setMediaPreview(null);
            setIsPosting(false);
            if(fileInputRef.current) fileInputRef.current.value = '';
        }, 1000);
    };
    
    return (
        <Card className="border-none shadow-xl bg-card overflow-hidden">
            <CardHeader className="bg-muted/10 py-3 border-b">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Send className="h-3 w-3 text-primary" />
                    Share a Moment
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                        <AvatarImage src="https://picsum.photos/seed/padel-player-1/80/80" alt="John Doe" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Textarea
                        placeholder="What's happening at the club, John?"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        className="min-h-[100px] bg-muted/20 border-muted focus:border-primary transition-all resize-none text-base"
                    />
                </div>
                {mediaPreview && (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-primary/20 aspect-video ml-16 shadow-2xl">
                        {mediaFile?.type.startsWith('image/') ? (
                            <Image src={mediaPreview} alt="Preview" fill className="object-cover" />
                        ) : (
                            <video src={mediaPreview} controls className="w-full h-full bg-black" />
                        )}
                        <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                            onClick={() => { setMediaPreview(null); setMediaFile(null); }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                 <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                />
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t bg-muted/5 p-4">
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="font-bold text-[10px] uppercase tracking-widest hover:text-primary" onClick={() => fileInputRef.current?.click()}>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Add Photo
                    </Button>
                    <Button variant="ghost" size="sm" className="font-bold text-[10px] uppercase tracking-widest hover:text-primary" onClick={() => fileInputRef.current?.click()}>
                        <VideoIcon className="mr-2 h-4 w-4" />
                        Add Video
                    </Button>
                </div>
                <Button 
                    onClick={handlePost} 
                    disabled={(!postText && !mediaFile) || isPosting}
                    className="bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] h-10 px-8 shadow-lg shadow-primary/20"
                >
                    {isPosting ? 'Posting...' : 'Share Post'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default function SocialPage() {
  const [posts, setPosts] = useState(initialPosts);

  const handleAddPost = (newPostData: any) => {
    const newPost = {
      id: Date.now(),
      author: {
        name: 'John Doe',
        avatarUrl: 'https://picsum.photos/seed/padel-player-1/80/80',
        handle: 'johndoe'
      },
      timestamp: 'Just now',
      ...newPostData
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="text-center sm:text-left">
        <h1 className="text-4xl font-black italic tracking-tighter text-primary uppercase">Club Feed</h1>
        <p className="mt-2 text-lg text-muted-foreground font-medium">
          Connect with players and see the latest club highlights.
        </p>
      </div>
      <div className="space-y-8">
        <CreatePost onAddPost={handleAddPost} />
        
        {posts.map((post) => (
          <Card key={post.id} className="border-none shadow-xl bg-card overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 border-b bg-muted/5 py-4 px-6">
              <Avatar className="h-10 w-10 ring-2 ring-background border-none shadow-md">
                <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                <AvatarFallback>{post.author.name.substring(0,2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-black text-sm tracking-tight">{post.author.name}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">@{post.author.handle} &middot; {post.timestamp}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <Share2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {post.content.text && <p className="whitespace-pre-wrap text-base leading-relaxed">{post.content.text}</p>}
                
                {post.content.highlightUrl && (
                  <div className="rounded-2xl overflow-hidden border border-muted aspect-video relative shadow-inner group cursor-pointer">
                      <Image
                          src={post.content.highlightUrl}
                          alt="Highlight"
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          data-ai-hint={post.content.imageHint}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex items-center gap-4 px-6 py-4 border-t bg-muted/5">
               <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest">
                 <Heart className="h-4 w-4" />
                 <span>Like</span>
               </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest">
                    <MessageCircle className="h-4 w-4" />
                    <span>Comment</span>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
