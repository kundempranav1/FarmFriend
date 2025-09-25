"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/context';
import { Header } from '@/components/farmfriend/header';
import { Footer } from '@/components/farmfriend/footer';
import { IndianRupee, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const subsidies = [
    { title: 'PM-KISAN Scheme', description: 'Income support of ₹6,000 per year for all landholding farmer families.', eligibility: 'All landholding farmers.' },
    { title: 'Pradhan Mantri Fasal Bima Yojana', description: 'Insurance coverage and financial support to farmers in the event of failure of any of the notified crops.', eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops.' },
    { title: 'Kisan Credit Card (KCC)', description: 'Provides farmers with timely access to credit.', eligibility: 'Farmers, animal husbandry and fisheries farmers.' },
];

export default function ViewSubsidiesPage() {
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
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Government Subsidies</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed mt-4">
                    Explore available schemes and subsidies to support your farming activities.
                </p>
            </div>
            <div className="grid gap-8">
                {subsidies.map(sub => (
                    <Card key={sub.title}>
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2"><IndianRupee className="text-primary"/>{sub.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>{sub.description}</p>
                            <div>
                                <h4 className="font-semibold">Eligibility:</h4>
                                <p className="text-muted-foreground">{sub.eligibility}</p>
                            </div>
                            <Button>Check Eligibility & Apply</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
