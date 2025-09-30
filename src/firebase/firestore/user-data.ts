'use server';

import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { getStorage as getAdminStorage } from 'firebase-admin/storage';
import { revalidatePath } from 'next/cache';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp();
}

const adminAuth = getAdminAuth();
const adminDb = getAdminFirestore();
const adminStorage = getAdminStorage();

interface UpdateProfileData {
  displayName?: string;
  phoneNumber?: string;
  photoBase64?: string;
  userId: string;
}

export async function updateUserProfile(data: UpdateProfileData) {
  const { userId, displayName, phoneNumber, photoBase64 } = data;

  let photoURL: string | undefined = undefined;

  try {
    // 1. If a photo is provided, upload it to Firebase Storage
    if (photoBase64) {
      const bucket = adminStorage.bucket();
      const fileBuffer = Buffer.from(photoBase64.split(',')[1], 'base64');
      const fileName = `profile-images/${userId}/${Date.now()}`;
      const file = bucket.file(fileName);

      await file.save(fileBuffer, {
        metadata: {
          contentType: 'image/jpeg', // Assuming jpeg, adjust if needed
        },
      });
      // Make the file public and get its URL
      await file.makePublic();
      photoURL = file.publicUrl();
    }

    // 2. Update Firebase Authentication user profile
    const authUpdatePayload: { displayName?: string; photoURL?: string } = {};
    if (displayName) authUpdatePayload.displayName = displayName;
    if (photoURL) authUpdatePayload.photoURL = photoURL;
    
    if (Object.keys(authUpdatePayload).length > 0) {
      await adminAuth.updateUser(userId, authUpdatePayload);
    }

    // 3. Update user document in Firestore
    const userDocRef = adminDb.collection('users').doc(userId);
    const firestoreUpdatePayload: { displayName?: string; phoneNumber?: string; photoURL?: string } = {};
    if (displayName) firestoreUpdatePayload.displayName = displayName;
    if (phoneNumber) firestoreUpdatePayload.phoneNumber = phoneNumber;
    if (photoURL) firestoreUpdatePayload.photoURL = photoURL;

    if (Object.keys(firestoreUpdatePayload).length > 0) {
        await userDocRef.set(firestoreUpdatePayload, { merge: true });
    }

    // 4. Revalidate the path to show updated info
    revalidatePath('/');
    
    return { success: true, photoURL };

  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Failed to update profile.' };
  }
}
