"use client";

import { useAuth } from '@/app/auth/context';
import { Header } from '@/components/farmfriend/header';
import { CropDoctor } from '@/components/farmfriend/crop-doctor';
import { SmartDashboard } from '@/components/farmfriend/dashboard';
import { KnowledgeHub } from '@/components/farmfriend/knowledge-hub';
import { Chatbot } from '@/components/farmfriend/chatbot';
import { Footer } from '@/components/farmfriend/footer';
import { Marketplace } from '@/components/farmfriend/marketplace';
import { FinancialServices } from '@/components/farmfriend/financial-services';

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-12 md:gap-16 lg:gap-20">
            <SmartDashboard />
            <CropDoctor />
            <Marketplace />
            <FinancialServices />
            <KnowledgeHub />
          </div>
        </div>
      </main>      
      <Footer />
      { user && <Chatbot /> }
    </div>
  );
}
