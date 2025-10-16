import { HttpClient } from './http-client';
import { AuthResponse } from './types';

class AuthAPI {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient();
  }

  async registrar(email: string, senha: string): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/auth/registrar', { email, senha });
  }

  async entrar(email: string, senha: string): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/auth/entrar', { email, senha });
  }

  async obterUsuario(): Promise<AuthResponse> {
    return this.client.get<AuthResponse>('/auth/usuario');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveAuth(token: string, usuario: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuario(): any | null {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }
}

export const authAPI = new AuthAPI();