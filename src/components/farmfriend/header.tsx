"use client";

import Link from 'next/link';
import { useLanguage, type Language } from '@/contexts/language-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Leaf } from 'lucide-react';
import { SidebarTrigger } from '../ui/sidebar';
import { useAuth } from '@/app/auth/context';
import { Button } from '../ui/button';

export function Header({ showSidebarTrigger = false }: { showSidebarTrigger?: boolean }) {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
            {showSidebarTrigger && <SidebarTrigger />}
            <Link href="/" className="flex items-center gap-2">
                <Leaf className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline hidden sm:block">
                    {t.appName}
                </h1>
            </Link>
        </div>
        <div className="flex items-center gap-4">
          <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
            <SelectTrigger className="w-auto gap-2">
              <Globe className="h-4 w-4" />
              <SelectValue placeholder={t.language} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिन्दी</SelectItem>
              <SelectItem value="te">తెలుగు</SelectItem>
              <SelectItem value="ta">தமிழ்</SelectItem>
              <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
            </SelectContent>
          </Select>
          {!user && (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/login">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
