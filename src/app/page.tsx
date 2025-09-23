
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/context';
import { Header } from '@/components/farmfriend/header';
import { CropDoctor } from '@/components/farmfriend/crop-doctor';
import { SmartDashboard } from '@/components/farmfriend/dashboard';
import { KnowledgeHub } from '@/components/farmfriend/knowledge-hub';
import { Chatbot } from '@/components/farmfriend/chatbot';
import { Footer } from '@/components/farmfriend/footer';
import { Loader2 } from 'lucide-react';

export default function Home() {
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
          <div className="grid gap-12 md:gap-16 lg:gap-20">
            <CropDoctor />
            <SmartDashboard />
            <KnowledgeHub />
          </div>
        </div>
      </main>      
      <Footer />
      <Chatbot />
    </div>
  );
}
