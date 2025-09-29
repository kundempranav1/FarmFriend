
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { Header } from '@/components/farmfriend/header';
import { Footer } from '@/components/farmfriend/footer';
import { Landmark, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';


export default function ApplyLoanPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [loanAmount, setLoanAmount] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanAmount || !loanPurpose) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill out all the fields.",
        });
        return;
    }

    if (!user || !firestore) {
        toast({
            variant: "destructive",
            title: "Not Authenticated or Ready",
            description: "You must be logged in to apply for a loan.",
        });
        return;
    }

    setIsSubmitting(true);
    try {
        const loanApplicationsCollection = collection(firestore, "loanApplications");
        
        addDocumentNonBlocking(loanApplicationsCollection, {
            userId: user.uid,
            email: user.email,
            loanAmount: Number(loanAmount),
            loanPurpose: loanPurpose,
            status: 'pending',
            submittedAt: serverTimestamp(),
        });

        toast({
            title: "Application Submitted",
            description: "Your loan application has been successfully submitted.",
        });

        // Clear the form
        setLoanAmount('');
        setLoanPurpose('');
        router.push('/');

    } catch (error) {
        console.error("Error submitting loan application: ", error);
        // The non-blocking update handler will emit a global error, which is caught
        // by the FirebaseErrorListener. We don't need a specific toast here unless we want to.
    } finally {
        setIsSubmitting(false);
    }
  }

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
                        <Landmark className="h-10 w-10 text-primary" />
                        <div>
                            <CardTitle className="text-3xl font-bold">Apply for a Farm Loan</CardTitle>
                            <CardDescription>Get the financial support you need to grow your farming business.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="loan-amount">Loan Amount (in ₹)</Label>
                            <Input 
                                id="loan-amount" 
                                type="number" 
                                placeholder="e.g., 50000"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="loan-purpose">Purpose of Loan</Label>
                            <Textarea 
                                id="loan-purpose" 
                                placeholder="e.g., Buying seeds, new equipment, etc."
                                value={loanPurpose}
                                onChange={(e) => setLoanPurpose(e.target.value)}
                                disabled={isSubmitting}
                             />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="document-upload">Upload Documents (Aadhaar, Land Papers)</Label>
                            <Input id="document-upload" type="file" multiple disabled={isSubmitting}/>
                        </div>
                        <Button size="lg" className="w-full" type="submit" disabled={isSubmitting}>
                             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             {isSubmitting ? 'Submitting...' : 'Submit Loan Application'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
