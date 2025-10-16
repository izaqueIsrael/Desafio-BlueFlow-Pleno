import { HttpClient } from './http-client';
import { FavoritoCheckResponse, FavoritosResponse } from './types';

class FavoritosAPI {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient();
  }

  async adicionar(videoId: string): Promise<any> {
    return this.client.post('/favoritos', { videoId });
  }

  async remover(videoId: string): Promise<any> {
    return this.client.delete(`/favoritos/${videoId}`);
  }

  async listar(): Promise<FavoritosResponse> {
    return this.client.get<FavoritosResponse>('/favoritos');
  }

  async verificar(videoId: string): Promise<FavoritoCheckResponse> {
    return this.client.get<FavoritoCheckResponse>(`/favoritos/${videoId}/verificar`);
  }
}

export const favoritosAPI = new FavoritosAPI();