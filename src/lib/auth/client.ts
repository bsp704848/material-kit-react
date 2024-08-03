// src/lib/auth/client.ts
'use client';
import { auth, db } from '../../../server/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { User } from '@/types/user';

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    const { firstName, lastName, email, password, role = 'user' } = params;

    try {
      // Create new user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store the user details in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        role,
        createdAt: new Date()
      });

      return {};
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    try {
      await signInWithEmailAndPassword(auth, params.email, params.password);
      return {};
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  async isAdmin(userId: string): Promise<boolean> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role === 'admin';
    }
    return false;
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const user: User = {
              id: firebaseUser.uid,
              avatar: '/assets/avatar.png',
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              role: userData.role
            };
            resolve({ data: user });
          } else {
            resolve({ data: null });
          }
        } else {
          resolve({ data: null });
        }
      });
    });
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      await signOut(auth);
      return {};
    } catch (error) {
      return { error: (error as Error).message };
    }
  }
}

export const authClient = new AuthClient();
