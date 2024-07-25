'use client';

import * as React from 'react';

import type { User } from '@/types/user';
import { logger } from '@/lib/default-logger';

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
    user: null,
    error: null,
    isLoading: true,
  });

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setState({ user: null, error: null, isLoading: false });
        return;
      }

      // Aqui você pode fazer uma chamada à API para obter as informações do usuário, se necessário.
      // No momento, estamos simulando um usuário autenticado.
      const user: User = { id: '1', email: 'user@example.com', name: 'User', role: 'User' };

      setState({ user, error: null, isLoading: false });
    } catch (err) {
      logger.error(err);
      setState({ user: null, error: 'Algo deu errado', isLoading: false });
    }
  }, []);

  React.useEffect(() => {
    checkSession().catch((err: unknown) => {
      logger.error(err);
      // noop
    });
  }, [checkSession]);

  return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
