"use client";

import { useLanguage } from '@/contexts/language-context';
import { Leaf } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-background/80 py-6 border-t mt-12">
      <div className="container mx-auto px-4 flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary"/>
            <span className="font-bold">{t.appName}</span>
        </div>
        <p>{t.footerText}</p>
      </div>
    </footer>
  );
}
