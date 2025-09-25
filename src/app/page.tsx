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
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { User, Palette, Puzzle, LogIn, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarGroup>
                <SidebarGroupLabel>Settings</SidebarGroupLabel>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip='Profile'>
                    <User />
                    Profile
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                   <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-2">
                            <Palette />
                            <Label htmlFor="theme-switch">Theme</Label>
                        </div>
                        <Switch
                            id="theme-switch"
                            checked={theme === 'dark'}
                            onCheckedChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        />
                    </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip='Features'>
                    <Puzzle />
                    Features
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarGroup>
            </SidebarMenu>
          </SidebarContent>
           <SidebarHeader>
                {user ? (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => signOut()}>
                                <LogOut />
                                Logout
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                ) : (
                    <SidebarMenu>
                         <SidebarMenuItem>
                           <Link href="/login">
                            <SidebarMenuButton>
                                <LogIn />
                                Login
                            </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarHeader>
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
          {user && <Chatbot />}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
