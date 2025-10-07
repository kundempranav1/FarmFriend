
"use client";

import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/language-context';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/app/auth/context';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase';
import { PasswordProtect } from '@/components/farmfriend/password-protect';

// Metadata cannot be exported from a client component.
// We can either move it to a server component or define it here
// and accept that it might not be ideal for a fully client-rendered layout root.
// For now, let's keep it but acknowledge this limitation.
// export const metadata: Metadata = {
//   title: 'FarmFriend',
//   description: 'An all-in-one problem-solving tool for farmers.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>FarmFriend</title>
        <meta name="description" content="An all-in-one problem-solving tool for farmers." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background">
        <PasswordProtect>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>
              <FirebaseClientProvider>
                <AuthProvider>
                  {children}
                  <Toaster />
                </AuthProvider>
              </FirebaseClientProvider>
            </LanguageProvider>
          </ThemeProvider>
        </PasswordProtect>
      </body>
    </html>
  );
}
