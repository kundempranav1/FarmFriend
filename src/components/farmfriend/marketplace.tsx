
"use client";

import Image from "next/image";
import Link from 'next/link';
import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const marketplaceItems = [
  {
    id: 1,
    nameKey: 'seeds',
    descriptionKey: 'seedsDescription',
    image: 'https://picsum.photos/seed/plant-seeds/400/300',
    imageHint: 'plant seeds'
  },
  {
    id: 2,
    nameKey: 'fertilizers',
    descriptionKey: 'fertilizersDescription',
    image: 'https://picsum.photos/seed/soil-fertilizer/400/300',
    imageHint: 'soil fertilizer'
  },
  {
    id: 3,
    nameKey: 'tools',
    descriptionKey: 'toolsDescription',
    image: 'https://picsum.photos/seed/gardening-tools/400/300',
    imageHint: 'gardening tools'
  }
];

export function Marketplace() {
  const { t } = useLanguage();

  return (
    <section id="marketplace" className="w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
          {t.marketplaceTitle}
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
          {t.marketplaceDescription}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {marketplaceItems.map(item => (
          <Card key={item.id}>
            <CardHeader>
              <div className="relative h-40 w-full mb-4">
                <Image 
                  src={item.image} 
                  alt={t.marketplace[item.nameKey as keyof typeof t.marketplace]} 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-t-lg"
                  data-ai-hint={item.imageHint} 
                />
              </div>
              <CardTitle>{t.marketplace[item.nameKey as keyof typeof t.marketplace]}</CardTitle>
              <CardDescription>{t.marketplace[item.descriptionKey as keyof typeof t.marketplace]}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/browse-products" passHref>
                <Button className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" /> {t.browseProducts}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
