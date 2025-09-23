"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/context';
import { Header } from '@/components/farmfriend/header';
import { Footer } from '@/components/farmfriend/footer';
import { Landmark, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ApplyLoanPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
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
                        <Landmark className="h-10 w-10 text-primary" />
                        <div>
                            <CardTitle className="text-3xl font-bold">Apply for a Farm Loan</CardTitle>
                            <CardDescription>Get the financial support you need to grow your farming business.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="loan-amount">Loan Amount (in ₹)</Label>
                        <Input id="loan-amount" type="number" placeholder="e.g., 50000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="loan-purpose">Purpose of Loan</Label>
                        <Textarea id="loan-purpose" placeholder="e.g., Buying seeds, new equipment, etc." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="document-upload">Upload Documents (Aadhaar, Land Papers)</Label>
                        <Input id="document-upload" type="file" multiple />
                    </div>
                    <Button size="lg" className="w-full">Submit Loan Application</Button>
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
