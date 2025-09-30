
"use client";

import { useUser } from "@/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, HelpCircle } from "lucide-react";

export function Profile() {
  const { user } = useUser();

  return (
    <section id="profile" className="w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
          About Me
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
          Your personal information and query history.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.photoURL || `https://avatar.vercel.sh/${user?.uid}.png`} />
                <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user?.displayName || "Farmer"}</CardTitle>
                <CardDescription>Your profile details.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">{user?.email || "No email provided"}</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">No phone number provided</span>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HelpCircle className="text-primary"/> My Queries</CardTitle>
            <CardDescription>A history of your past questions and diagnoses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-muted-foreground py-8">
                <p>You haven't made any queries yet.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
