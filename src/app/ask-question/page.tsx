"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Header } from '@/components/farmfriend/header';
import { Footer } from '@/components/farmfriend/footer';
import { HelpCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AskQuestionPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <HelpCircle className="h-10 w-10 text-primary" />
                        <div>
                            <CardTitle className="text-3xl font-bold">Ask the Community</CardTitle>
                            <CardDescription>Post your question and get help from fellow farmers and experts.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="question-title">Question Title</Label>
                        <Input id="question-title" placeholder="e.g., How to treat yellow spots on tomato leaves?" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="question-description">Description</Label>
                        <Textarea id="question-description" placeholder="Provide more details about your problem..." className="min-h-[150px]" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="question-image">Upload Image (Optional)</Label>
                        <Input id="question-image" type="file" />
                    </div>
                    <Button size="lg" className="w-full">Post Question</Button>
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
