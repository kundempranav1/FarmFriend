
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-6848947015-7e582",
  "appId": "1:697780501101:web:4fc1fe684942d481105d64",
  "apiKey": "AIzaSyC6xNkk_poGPXtspvvrTKe9rt5tLQcoOzA",
  "authDomain": "studio-6848947015-7e582.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "697780501101"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
