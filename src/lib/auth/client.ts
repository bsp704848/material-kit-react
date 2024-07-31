// src/lib/auth/client.ts
'use client';
import { auth, db } from '../../../server/lib/firebase'; // Update this import
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import type { User } from '@/types/user';

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    const { firstName, lastName, email, password } = params;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), { // Use db instead of firestore
        firstName,
        lastName,
        email
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

  async resetPassword(_params: ResetPasswordParams): Promise<{ error?: string }> {
    // Implement password reset logic with Firebase
    return { error: 'Password reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const user: User = {
            id: firebaseUser.uid,
            avatar: '/assets/avatar.png',
            firstName: firebaseUser.displayName?.split(' ')[0] || '',
            lastName: firebaseUser.displayName?.split(' ')[1] || '',
            email: firebaseUser.email || '',
          };
          resolve({ data: user });
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
