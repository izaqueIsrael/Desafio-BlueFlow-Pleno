import { authAPI } from "../api/auth.api";

interface AuthState {
  isAuthenticated: boolean;
  usuario: any | null;
  token: string | null;
}

type AuthListener = (state: AuthState) => void;

class AuthStore {
  private state: AuthState;
  private listeners: Set<AuthListener> = new Set();

  constructor() {
    this.state = {
      isAuthenticated: authAPI.isAuthenticated(),
      usuario: authAPI.getUsuario(),
      token: authAPI.getToken()
    };
  }

  subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  getState(): AuthState {
    return { ...this.state };
  }

  async login(email: string, senha: string): Promise<void> {
    const response = await authAPI.entrar(email, senha);
    
    if (response.sucesso && response.dados) {
      authAPI.saveAuth(response.dados.token, response.dados.usuario);
      this.state = {
        isAuthenticated: true,
        usuario: response.dados.usuario,
        token: response.dados.token
      };
      this.notify();
    } else {
      throw new Error(response.erro || 'Erro ao fazer login');
    }
  }

  async register(email: string, senha: string): Promise<void> {
    const response = await authAPI.registrar(email, senha);
    
    if (response.sucesso && response.dados) {
      authAPI.saveAuth(response.dados.token, response.dados.usuario);
      this.state = {
        isAuthenticated: true,
        usuario: response.dados.usuario,
        token: response.dados.token
      };
      this.notify();
    } else {
      throw new Error(response.erro || 'Erro ao registrar');
    }
  }

  logout(): void {
    authAPI.logout();
    this.state = {
      isAuthenticated: false,
      usuario: null,
      token: null
    };
    this.notify();
  }

  isAuth(): boolean {
    return this.state.isAuthenticated;
  }
}

export const authStore = new AuthStore();