import { HttpClient } from '../config/http-client';
import { RespostaAuth } from '../types';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

export class AuthProxy {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient(AUTH_SERVICE_URL);
  }

  async registrar(email: string, senha: string): Promise<RespostaAuth> {
    try {
      return await this.client.post<RespostaAuth>('/api/registrar', { email, senha });
    } catch (erro: any) {
      throw new Error(erro.response?.data?.erro || 'Erro ao registrar usuário');
    }
  }

  async entrar(email: string, senha: string): Promise<RespostaAuth> {
    try {
      return await this.client.post<RespostaAuth>('/api/entrar', { email, senha });
    } catch (erro: any) {
      throw new Error(erro.response?.data?.erro || 'Erro ao fazer login');
    }
  }

  async obterUsuario(token: string): Promise<RespostaAuth> {
    try {
      return await this.client.get<RespostaAuth>('/api/usuario', token);
    } catch (erro: any) {
      throw new Error(erro.response?.data?.erro || 'Erro ao buscar usuário');
    }
  }
}