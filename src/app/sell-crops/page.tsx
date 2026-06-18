
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Header } from '@/components/farmfriend/header';
import { Footer } from '@/components/farmfriend/footer';
import { Loader2, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export default function SellCropsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !quantity || !price) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all the fields.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
        const cropData = {
            userId: user?.uid || 'guest',
            cropName,
            quantity: Number(quantity),
            price: Number(price),
            status: 'available',
            listedAt: serverTimestamp(),
            // Image URL will be added after upload
        };

        const docRef = await addDocumentNonBlocking(collection(firestore, 'cropsForSale'), cropData);

        // For now, we are not handling image uploads as it requires Firebase Storage setup.
        // We will just show a success message.

        toast({
            title: "Success!",
            description: `${cropName} has been listed for sale.`,
        });

        // Reset form
        setCropName('');
        setQuantity('');
        setPrice('');
        setImageFile(null);
        // Maybe redirect user
        router.push('/browse-products');

    } catch (error) {
        console.error("Error listing crop: ", error);
        toast({
            variant: "destructive",
            title: "Listing Failed",
            description: "There was an error listing your crop. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
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
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                          <Label htmlFor="crop-name">Crop Name</Label>
                          <Input 
                            id="crop-name" 
                            placeholder="e.g., Tomatoes" 
                            value={cropName}
                            onChange={(e) => setCropName(e.target.value)}
                            disabled={isSubmitting}
                          />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity (in kg)</Label>
                          <Input 
                            id="quantity" 
                            type="number" 
                            placeholder="e.g., 100" 
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            disabled={isSubmitting}
                          />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="price">Expected Price (per kg)</Label>
                          <Input 
                            id="price" 
                            type="number" 
                            placeholder="e.g., 25" 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            disabled={isSubmitting}
                          />
                      </div>
                       <div className="space-y-2">
                          <Label htmlFor="crop-image">Upload Image</Label>
                          <Input 
                            id="crop-image" 
                            type="file" 
                            onChange={handleImageChange}
                            disabled={isSubmitting}
                          />
                      </div>
                      <Button size="lg" className="w-full" type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Listing...' : 'List Crop for Sale'}
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
