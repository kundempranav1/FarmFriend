
"use client";

import { useState } from 'react';
import { useUser, useDoc } from "@/firebase";
import { doc, DocumentData } from "firebase/firestore";
import { useFirestore, useMemoFirebase } from "@/firebase/provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, HelpCircle, Loader2 } from "lucide-react";
import { updateUserProfile } from '@/firebase/firestore/user-data';

export function Profile() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData } = useDoc<{ displayName?: string; phoneNumber?: string; photoURL?: string }>(userDocRef);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsUpdating(true);

    let photoBase64: string | undefined = undefined;
    if (photoFile) {
      const reader = new FileReader();
      reader.readAsDataURL(photoFile);
      await new Promise<void>((resolve, reject) => {
        reader.onload = () => {
          photoBase64 = reader.result as string;
          resolve();
        };
        reader.onerror = (error) => reject(error);
      });
    }

    try {
      await updateUserProfile({
        userId: user.uid,
        displayName: displayName || user.displayName || undefined,
        phoneNumber: phoneNumber,
        photoBase64,
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update your profile. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const displayNameToShow = userData?.displayName || user?.displayName || "Farmer";
  const photoURLToShow = userData?.photoURL || user?.photoURL || `https://avatar.vercel.sh/${user?.uid}.png`;
  const phoneNumberToShow = userData?.phoneNumber || "No phone number provided";

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
                <AvatarImage src={photoURLToShow} />
                <AvatarFallback>{displayNameToShow?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{displayNameToShow}</CardTitle>
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
              <span className="text-muted-foreground">{phoneNumberToShow}</span>
            </div>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Update your name, phone number, and profile picture.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="photo">Profile Picture</Label>
                            <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} disabled={isUpdating}>Cancel</Button>
                        <Button onClick={handleSaveChanges} disabled={isUpdating}>
                            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
