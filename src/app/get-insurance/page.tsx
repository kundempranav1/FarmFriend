
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Header } from '@/components/farmfriend/header';
import { Footer } from '@/components/farmfriend/footer';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function GetInsurancePage() {
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
                        <ShieldCheck className="h-10 w-10 text-primary" />
                        <div>
                            <CardTitle className="text-3xl font-bold">Get Crop Insurance</CardTitle>
                            <CardDescription>Protect your crops from unforeseen events and secure your income.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="crop-type">Select Crop</Label>
                        <Select>
                            <SelectTrigger id="crop-type">
                                <SelectValue placeholder="e.g., Wheat, Rice, Cotton" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="wheat">Wheat</SelectItem>
                                <SelectItem value="rice">Rice</SelectItem>
                                <SelectItem value="cotton">Cotton</SelectItem>
                                <SelectItem value="sugarcane">Sugarcane</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="land-area">Area to be Insured (in acres)</Label>
                        <Input id="land-area" type="number" placeholder="e.g., 5" />
                    </div>
                    <Button size="lg" className="w-full">Get Insurance Quote</Button>
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
