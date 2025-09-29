
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/language-context';
import { answerQuestion } from '@/ai/flows/answer-questions-with-chatbot';
import { Bot, User, Send, X, Loader2, PersonStanding } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
  id: number;
  role: 'user' | 'bot';
  text: string;
};

export function Chatbot() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message when language changes or on initial load
    setMessages([
      { id: 1, role: 'bot', text: t.chatbotWelcome }
    ]);
  }, [t.chatbotWelcome]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await answerQuestion({ question: input });
      const botMessage: Message = { id: Date.now() + 1, role: 'bot', text: response.answer };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = { id: Date.now() + 1, role: 'bot', text: "I'm sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={cn("relative transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}>
         <Card className="w-[350px] h-[500px] shadow-2xl flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                <div className="flex items-center gap-2">
                    <Bot className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-base">{t.appName}</CardTitle>
                        <CardDescription className="text-xs">AI Assistant</CardDescription>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                    <div className="p-4 space-y-4">
                    {messages.map(message => (
                        <div key={message.id} className={cn("flex gap-3 text-sm", message.role === 'user' ? "justify-end" : "justify-start")}>
                        {message.role === 'bot' && <div className="p-2 bg-primary rounded-full h-fit"><Bot className="h-4 w-4 text-primary-foreground"/></div>}
                        <div className={cn("p-3 rounded-lg max-w-[80%]", message.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted")}>
                            {message.text}
                        </div>
                         {message.role === 'user' && <div className="p-2 bg-muted rounded-full h-fit"><User className="h-4 w-4 text-muted-foreground"/></div>}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 text-sm justify-start">
                             <div className="p-2 bg-primary rounded-full h-fit"><Bot className="h-4 w-4 text-primary-foreground"/></div>
                             <div className="p-3 rounded-lg bg-muted flex items-center">
                                <Loader2 className="h-4 w-4 animate-spin"/>
                             </div>
                        </div>
                    )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t.chatbotInputPlaceholder}
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
         </Card>
      </div>

      <Button 
        size="icon" 
        className={cn("rounded-full w-16 h-16 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform transition-all duration-300", isOpen ? "opacity-0 scale-0 pointer-events-none" : "opacity-100 scale-100")} 
        onClick={() => setIsOpen(true)}>
        <PersonStanding className="h-8 w-8" />
      </Button>
    </div>
  );
}
