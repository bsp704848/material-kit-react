import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Ajuste a URL conforme necessário

export interface SignUpParams {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  role: 'Admin' | 'Professor' | 'Supervisor';
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

interface ErrorResponse {
  message: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    try {
      await axios.post(`${API_URL}/users/register`, params);
      return {};
    } catch (error) {
      return { error: this.handleError(error) };
    }
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    try {
      const response = await axios.post<{ access_token: string }>(`${API_URL}/auth/login`, params);
      const token = response.data.access_token;
      localStorage.setItem('access_token', token);
      return {};
    } catch (error) {
      return { error: this.handleError(error, 'Invalid credentials') };
    }
  }

  async resetPassword(params: ResetPasswordParams): Promise<{ error?: string }> {
    try {
      await axios.post(`${API_URL}/auth/reset-password`, params);
      return {};
    } catch (error) {
      return { error: this.handleError(error) };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('access_token');
    return {};
  }

  private handleError(error: unknown, defaultMessage = 'An unexpected error occurred'): string {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ErrorResponse | undefined;
      return errorData?.message || defaultMessage;
    }
    return defaultMessage;
  }
}

export const authClient = new AuthClient();
