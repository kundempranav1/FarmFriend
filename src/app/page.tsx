
"use client";

import { useUser, useAuth } from '@/firebase';
import { Header } from '@/components/farmfriend/header';
import { CropDoctor } from '@/components/farmfriend/crop-doctor';
import { SmartDashboard } from '@/components/farmfriend/dashboard';
import { KnowledgeHub } from '@/components/farmfriend/knowledge-hub';
import { Chatbot } from '@/components/farmfriend/chatbot';
import { Footer } from '@/components/farmfriend/footer';
import { Marketplace } from '@/components/farmfriend/marketplace';
import { FinancialServices } from '@/components/farmfriend/financial-services';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, useSidebar, SidebarFooter } from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { User, Palette, Puzzle, LogIn, LogOut, Leaf, BarChart, BrainCircuit } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { Profile } from '@/components/farmfriend/profile';
import { AppFeatures } from '@/components/farmfriend/app-features';
import { DataAnalytics } from '@/components/farmfriend/data-analytics';
import { SeasonPredictor } from '@/components/farmfriend/season-predictor';

function PageContent() {
  const { user } = useUser();
  const auth = useAuth();
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const { setOpen: setOpenMobile } = useSidebar();

  const handleSignOut = () => {
    if (auth) {
        signOut(auth);
    }
    setOpenMobile(false);
  }

  const handleLinkClick = (id: string) => {
    setOpenMobile(false);
    const element = document.getElementById(id);
    if (element) {
      // Add a slight delay to allow the sidebar to close before scrolling
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  return (
    <div className="relative flex min-h-screen">
      <Sidebar>
        <SidebarHeader>
           <div className="flex items-center gap-2 p-2">
              <Leaf className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
                  {t.appName}
              </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarMenuItem>
                  <SidebarMenuButton title="Profile" onClick={() => handleLinkClick('profile')}>
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
                <SidebarMenuButton title="Features" onClick={() => handleLinkClick('app-features')}>
                  <Puzzle />
                  Features
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton title="Analytics" onClick={() => handleLinkClick('data-analytics')}>
                  <BarChart />
                  Analytics
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton title="Predictor" onClick={() => handleLinkClick('season-predictor')}>
                  <BrainCircuit />
                  Predictor
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroup>
          </SidebarMenu>
        </SidebarContent>
         <SidebarFooter>
              {user ? (
                  <SidebarMenu>
                      <SidebarMenuItem>
                          <SidebarMenuButton title="Logout" onClick={handleSignOut}>
                              <LogOut />
                              Logout
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                  </SidebarMenu>
              ) : (
                  <SidebarMenu>
                       <SidebarMenuItem>
                         <Link href="/login" onClick={() => setOpenMobile(false)}>
                          <SidebarMenuButton title="Login">
                              <LogIn />
                              Login
                          </SidebarMenuButton>
                          </Link>
                      </SidebarMenuItem>
                  </SidebarMenu>
              )}
          </SidebarFooter>
      </Sidebar>
      <div className="flex-1">
        <Header showSidebarTrigger={true} />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <div className="grid gap-12 md:gap-16 lg:gap-20">
              <SmartDashboard />
              <CropDoctor />
              <SeasonPredictor />
              <Marketplace />
              <FinancialServices />
              <KnowledgeHub />
              <DataAnalytics />
              <Profile />
              <AppFeatures />
            </div>
          </div>
        </main>
        <Footer />
        {user && <Chatbot />}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <SidebarProvider>
      <PageContent />
    </SidebarProvider>
  );
}
