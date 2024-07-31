// src/lib/auth/client.ts
'use client';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../server/lib/firebase.js'
import type { User } from '@/types/user';
import { doc, setDoc } from 'firebase/firestore'

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

      await setDoc(doc(firestore, 'users', user.uid), {
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

  async resetPassword(params: ResetPasswordParams): Promise<{ error?: string }> {
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







// const user = {
//   id: 'USR-000',
//   avatar: '/assets/avatar.png',
//   firstName: 'Sofia',
//   lastName: 'Rivers',
//   email: 'sofia@devias.io',
// } satisfies User;
