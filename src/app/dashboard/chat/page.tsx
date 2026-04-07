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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, Send, Video, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const conversations = [
  {
    id: 'conv1',
    name: 'Alex Johnson',
    avatarUrl: 'https://picsum.photos/seed/padel-player-2/80/80',
    lastMessage: 'I can bring a new can. See you all there!',
    timestamp: '1h ago',
    unreadCount: 0,
    online: true,
  },
  {
    id: 'conv2',
    name: 'Maria Garcia',
    avatarUrl: 'https://picsum.photos/seed/padel-player-3/80/80',
    lastMessage: 'I might be a few minutes late, traffic is a bit heavy.',
    timestamp: '30m ago',
    unreadCount: 2,
    online: false,
  },
  {
    id: 'conv3',
    name: 'Chris Wilson',
    avatarUrl: 'https://picsum.photos/seed/padel-player-6/80/80',
    lastMessage: 'Sounds good!',
    timestamp: '3h ago',
    unreadCount: 0,
    online: true,
  },
   {
    id: 'conv4',
    name: 'Jane Smith',
    avatarUrl: 'https://picsum.photos/seed/padel-player-4/80/80',
    lastMessage: 'Let\'s aim for a game next week.',
    timestamp: '1d ago',
    unreadCount: 0,
    online: false,
  },
   {
    id: 'conv5',
    name: 'David Lee',
    avatarUrl: 'https://picsum.photos/seed/padel-player-7/80/80',
    lastMessage: 'Can you send me the address?',
    timestamp: '2d ago',
    unreadCount: 1,
    online: false,
  },
];

const messagesData = {
  conv1: [
    {
      id: 'msg1',
      author: 'Alex Johnson',
      avatarUrl: 'https://picsum.photos/seed/padel-player-2/80/80',
      message: 'Hey! Are we still on for the match today?',
      timestamp: '2h ago',
    },
    {
      id: 'msg2',
      author: 'John Doe',
      avatarUrl: 'https://picsum.photos/seed/padel-player-1/80/80',
      message: 'Yep, absolutely. I\'m looking forward to it.',
      timestamp: '2h ago',
    },
     {
      id: 'msg3',
      author: 'Alex Johnson',
      avatarUrl: 'https://picsum.photos/seed/padel-player-2/80/80',
      message: 'Great. I can bring a new can of balls if we need them.',
      timestamp: '1h ago',
    },
  ],
  conv2: [
    {
      id: 'msg4',
      author: 'Maria Garcia',
      avatarUrl: 'https://picsum.photos/seed/padel-player-3/80/80',
      message: 'I might be a few minutes late, traffic is a bit heavy.',
      timestamp: '30m ago',
    },
  ],
  conv3: [
     {
      id: 'msg5',
      author: 'Chris Wilson',
      avatarUrl: 'https://picsum.photos/seed/padel-player-6/80/80',
      message: 'Ready for the league match this weekend?',
      timestamp: '4h ago',
    },
    {
      id: 'msg6',
      author: 'John Doe',
      avatarUrl: 'https://picsum.photos/seed/padel-player-1/80/80',
      message: 'Born ready! It\'s going to be a tough one.',
      timestamp: '4h ago',
    },
     {
      id: 'msg7',
      author: 'Chris Wilson',
      avatarUrl: 'https://picsum.photos/seed/padel-player-6/80/80',
      message: 'Sounds good!',
      timestamp: '3h ago',
    },
  ],
  conv4: [],
  conv5: [],
};


export default function ChatPage() {
  const [activeConversation, setActiveConversation] = useState(conversations[0].id);
  const currentConversation = conversations.find(c => c.id === activeConversation);
  const messages = messagesData[activeConversation as keyof typeof messagesData] || [];

  return (
    <div className="h-[calc(100vh-8rem)]">
        <div className="grid h-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card className="md:col-span-1 lg:col-span-1 flex flex-col">
                <CardHeader className="p-4">
                    <CardTitle className="text-2xl">Chats</CardTitle>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search conversations..." className="pl-10" />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full">
                        <div className="space-y-0">
                           {conversations.map(conv => (
                            <button
                                key={conv.id}
                                onClick={() => setActiveConversation(conv.id)}
                                className={cn(
                                    "flex w-full items-center gap-4 p-4 text-left hover:bg-muted/50 transition-colors",
                                    activeConversation === conv.id && 'bg-muted'
                                )}
                            >
                                <Avatar className="h-12 w-12 border-2 border-background">
                                    <AvatarImage src={conv.avatarUrl} alt={conv.name} data-ai-hint="padel player" />
                                    <AvatarFallback>{conv.name.substring(0,2)}</AvatarFallback>
                                    {conv.online && <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />}
                                </Avatar>
                                <div className="flex-1 truncate">
                                    <p className="font-semibold">{conv.name}</p>
                                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1 self-start">
                                    <p className="text-xs text-muted-foreground whitespace-nowrap">{conv.timestamp}</p>
                                    {conv.unreadCount > 0 && <Badge className="h-5 w-5 justify-center p-0">{conv.unreadCount}</Badge>}
                                </div>
                            </button>
                           ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-3 flex flex-col">
                {currentConversation ? (
                    <>
                        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                            <div className="flex items-center gap-4">
                                 <Avatar className="h-10 w-10">
                                    <AvatarImage src={currentConversation.avatarUrl} alt={currentConversation.name} data-ai-hint="padel player" />
                                    <AvatarFallback>{currentConversation.name.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-lg">{currentConversation.name}</CardTitle>
                                    <CardDescription>{currentConversation.online ? 'Online' : 'Offline'}</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                    <Phone className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Video className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-hidden p-2 sm:p-4">
                             <ScrollArea className="h-full pr-4">
                                <div className="space-y-6">
                                    {messages.map((msg) => (
                                       <div key={msg.id} className={cn("flex items-end gap-3", msg.author === 'John Doe' && 'flex-row-reverse')}>
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={msg.avatarUrl} alt={msg.author} data-ai-hint="padel player" />
                                                <AvatarFallback>{msg.author.substring(0,2)}</AvatarFallback>
                                            </Avatar>
                                            <div className={cn("max-w-xs sm:max-w-md rounded-xl p-3 text-sm", msg.author === 'John Doe' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                                <p>{msg.message}</p>
                                                <p className={cn("text-xs mt-1 opacity-70", msg.author === 'John Doe' ? 'text-right' : 'text-left')}>{msg.timestamp}</p>
                                            </div>
                                       </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>

                        <CardFooter className="pt-4 border-t p-4">
                            <div className="relative w-full">
                                <Input placeholder="Type a message..." className="pr-12 text-base" />
                                <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-9 w-9">
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardFooter>
                    </>
                ) : (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="text-center">
                            <p className="text-lg font-semibold">Select a conversation</p>
                            <p className="text-muted-foreground">Start chatting with your friends and fellow players.</p>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    </div>
  );
}
