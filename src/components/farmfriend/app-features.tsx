
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, LineChart, TestTube2, MessageSquare, Landmark, ShoppingCart } from "lucide-react";

const features = [
  { icon: Leaf, title: "AI-Powered Crop Doctor", description: "Diagnose crop diseases from an image." },
  { icon: LineChart, title: "Smart Dashboard", description: "Get hyper-local weather and market prices." },
  { icon: TestTube2, title: "Soil & Crop Health", description: "Analyze soil health from a photo." },
  { icon: ShoppingCart, title: "Input Supply Chain", description: "Marketplace for seeds and fertilizers." },
  { icon: Landmark, title: "Financial Solutions", description: "Access to loans, subsidies, and insurance." },
  { icon: MessageSquare, title: "Knowledge Hub", description: "Connect with a community of farmers." },
];

export function AppFeatures() {
  return (
    <section id="app-features" className="w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
          App Features
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
          Everything you need for smarter farming in one place.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader className="flex flex-row items-center gap-4">
                <feature.icon className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle>{feature.title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
