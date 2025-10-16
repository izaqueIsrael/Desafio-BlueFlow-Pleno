import { HttpClient } from './http-client';
import { VideosResponse } from './types';

class VideosAPI {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient();
  }

  async buscar(query: string, pageToken?: string): Promise<VideosResponse> {
    const params = new URLSearchParams({ q: query });
    if (pageToken) {
      params.append('pageToken', pageToken);
    }
    
    return this.client.get<VideosResponse>(`/videos/buscar?${params.toString()}`);
  }

  async obterPorIds(ids: string[]): Promise<VideosResponse> {
    return this.client.post<VideosResponse>('/videos/ids', { ids });
  }
}

export const videosAPI = new VideosAPI();