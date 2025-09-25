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
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { User, Palette, Puzzle } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Sidebar>
            <SidebarHeader>
                <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent>
                 <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip='Profile' isActive={true}>
                            <User />
                            Profile
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip='Theme'>
                            <Palette />
                            Theme
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton tooltip='Features'>
                            <Puzzle />
                           Features
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
