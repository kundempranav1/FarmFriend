
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Leaf, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SITE_PASSWORD = "farmfriend2024"; // The password to access the site
const SESSION_KEY = 'site_authenticated';

export function PasswordProtect({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // This effect runs only on the client-side
    setIsClient(true);
    const sessionAuthenticated = sessionStorage.getItem(SESSION_KEY) === 'true';
    if (sessionAuthenticated) {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsAuthenticated(true);
      setError('');
      toast({
        title: "Access Granted",
        description: "Welcome to FarmFriend!",
      });
    } else {
      setError('Incorrect password. Please try again.');
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "The password you entered is incorrect.",
      });
    }
    setPassword('');
  };

  if (!isClient) {
    // Render nothing on the server and during the initial client render
    // to prevent hydration mismatch.
    return null;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Leaf className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">FarmFriend</CardTitle>
          <CardDescription>This site is password protected.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="pl-10"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full">
              Unlock
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
