"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/context';
import { Header } from '@/components/farmfriend/header';
import { Footer } from '@/components/farmfriend/footer';
import { Loader2, Search, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const products = [
  { name: 'Hybrid Tomato Seeds', price: '₹150', image: 'https://picsum.photos/seed/p-seeds/400/300' },
  { name: 'Organic Fertilizer (5kg)', price: '₹450', image: 'https://picsum.photos/seed/p-fertilizer/400/300' },
  { name: 'Power Sprayer', price: '₹3,500', image: 'https://picsum.photos/seed/p-tools/400/300' },
  { name: 'Neem Oil Pesticide', price: '₹250', image: 'https://picsum.photos/seed/p-pesticide/400/300' },
  { name: 'Modern Hoe', price: '₹800', image: 'https://picsum.photos/seed/p-hoe/400/300' },
  { name: 'High-Yield Wheat Seeds', price: '₹220', image: 'https://picsum.photos/seed/p-wheat/400/300' },
];

export default function BrowseProductsPage() {
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map(product => (
                  <Card key={product.name}>
                    <CardHeader className="p-0">
                      <div className="relative h-48 w-full">
                        <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" className="rounded-t-lg" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription className="text-xl font-bold text-primary">{product.price}</CardDescription>
                        <Button className="w-full">
                            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                        </Button>
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
