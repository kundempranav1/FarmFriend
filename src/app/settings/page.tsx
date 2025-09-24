"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/context';
import { Header } from '@/components/farmfriend/header';
import { Footer } from '@/components/farmfriend/footer';
import { Loader2, User, Palette, Puzzle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

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
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Settings</CardTitle>
                    <CardDescription>Manage your account and application preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="profile">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4"/>Profile</TabsTrigger>
                            <TabsTrigger value="theme"><Palette className="mr-2 h-4 w-4"/>Theme</TabsTrigger>
                            <TabsTrigger value="features"><Puzzle className="mr-2 h-4 w-4"/>Features</TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>Update your personal details.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" defaultValue={user?.displayName || ''} placeholder="Your Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" value={user?.email || ''} disabled />
                                    </div>
                                    <Button>Update Profile</Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="theme" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Theme</CardTitle>
                                    <CardDescription>Customize the look and feel of the application.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Enable dark mode for a better experience at night.
                                            </p>
                                        </div>
                                        <Switch 
                                            id="dark-mode"
                                            checked={theme === 'dark'}
                                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="features" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Additional Features</CardTitle>
                                    <CardDescription>Enable or disable experimental features.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="beta-dashboard" className="text-base">Beta Dashboard</Label>
                                            <p className="text-sm text-muted-foreground">
                                               Try out the new and improved dashboard layout.
                                            </p>
                                        </div>
                                        <Switch id="beta-dashboard" />
                                    </div>
                                     <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="sms-alerts" className="text-base">SMS Alerts</Label>
                                            <p className="text-sm text-muted-foreground">
                                               Receive important weather and market alerts via SMS.
                                            </p>
                                        </div>
                                        <Switch id="sms-alerts" />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

    
