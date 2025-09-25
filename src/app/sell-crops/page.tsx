"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/context';
import { Header } from '@/components/farmfriend/header';
import { Footer } from '@/components/farmfriend/footer';
import { Loader2, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SellCropsPage() {
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
      <Header showSidebarTrigger={false} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <ShoppingCart className="h-10 w-10 text-primary" />
                        <div>
                            <CardTitle className="text-3xl font-bold">Sell Your Crops</CardTitle>
                            <CardDescription>Reach a wider market and get fair prices for your produce.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="crop-name">Crop Name</Label>
                        <Input id="crop-name" placeholder="e.g., Tomatoes" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity (in kg)</Label>
                        <Input id="quantity" type="number" placeholder="e.g., 100" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Expected Price (per kg)</Label>
                        <Input id="price" type="number" placeholder="e.g., 25" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="crop-image">Upload Image</Label>
                        <Input id="crop-image" type="file" />
                    </div>
                    <Button size="lg" className="w-full">List Crop for Sale</Button>
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
