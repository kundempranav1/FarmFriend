
"use client";

import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Header } from '@/components/farmfriend/header';
import { Footer } from '@/components/farmfriend/footer';
import { Loader2, Search, ShoppingCart, Leaf } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { collection, query } from 'firebase/firestore';
import type { CropForSale } from '@/types';


export default function BrowseProductsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const cropsForSaleQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "cropsForSale"));
  }, [firestore]);

  const { data: products, isLoading: isLoadingProducts } = useCollection<CropForSale>(cropsForSaleQuery);


  if (isUserLoading) {
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
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Farm Marketplace</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed mt-4">
                    Find high-quality seeds, fertilizers, and equipment from verified sellers.
                </p>
            </div>

            <div className="max-w-xl mx-auto mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search for products..." className="pl-10" />
                </div>
            </div>

            {isLoadingProducts && (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            )}
            
            {!isLoadingProducts && products && products.length > 0 && (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map(product => (
                      <Card key={product.id}>
                        <CardHeader className="p-0">
                          <div className="relative h-48 w-full">
                            <Image 
                                src={`https://picsum.photos/seed/${product.id}/400/300`} 
                                alt={product.cropName} 
                                layout="fill" 
                                objectFit="cover" 
                                className="rounded-t-lg" 
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            <CardTitle className="text-lg">{product.cropName}</CardTitle>
                            <CardDescription className="text-xl font-bold text-primary">₹{product.price}/kg</CardDescription>
                            <p className="text-sm text-muted-foreground">Available: {product.quantity} kg</p>
                            <Button className="w-full">
                                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                            </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
            )}

            {!isLoadingProducts && (!products || products.length === 0) && (
                <div className="text-center py-16">
                    <Leaf className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Crops for Sale Yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Check back later or be the first to list a crop!</p>
                </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
