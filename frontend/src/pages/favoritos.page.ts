import { favoritosAPI } from '../api/favoritos.api';
import { Video } from '../api/types';
import { videosAPI } from '../api/videos.api';
import { Loading } from '../components/loading';
import { Toast } from '../components/toast';
import { VideoCard } from '../components/video-card';

export class FavoritosPage {
  private container: HTMLElement;
  private videos: Video[] = [];
  private favoritos: Set<string> = new Set();

  constructor() {
    this.container = document.getElementById('main')!;
  }

  async render(): Promise<void> {
    this.container.innerHTML = `
      <div class="favoritos-container">
        <div class="page-header">
          <h1>⭐ Meus Favoritos</h1>
        </div>
        
        <div id="favoritos-content">
          ${Loading.render()}
        </div>
      </div>
    `;

    await this.loadFavoritos();
  }

  private async loadFavoritos(): Promise<void> {
    const content = document.getElementById('favoritos-content')!;

    try {
      const response = await favoritosAPI.listar();

      if (!response.sucesso || !response.dados) {
        throw new Error(response.erro || 'Erro ao carregar favoritos');
      }

      const favoritos = response.dados.favoritos;

      if (favoritos.length === 0) {
        content.innerHTML = `
          <div class="empty-state">
            <h2>📭 Nenhum favorito ainda</h2>
            <p>Adicione vídeos aos favoritos para vê-los aqui</p>
          </div>
        `;
        return;
      }

      const videoIds = favoritos.map(f => f.videoId);
      this.favoritos = new Set(videoIds);

      const videosResponse = await videosAPI.obterPorIds(videoIds);

      if (videosResponse.sucesso && videosResponse.dados) {
        this.videos = videosResponse.dados.videos;
        
        content.innerHTML = `
          <p class="favoritos-count">
            ${favoritos.length} ${favoritos.length === 1 ? 'vídeo favoritado' : 'vídeos favoritados'}
          </p>
          ${VideoCard.renderList(this.videos, this.favoritos)}
        `;

        this.attachEvents();
      }
    } catch (error: any) {
      content.innerHTML = `
        <div class="error-state">
          <h2>❌ Erro ao carregar favoritos</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  private attachEvents(): void {
    const btnsFavorito = document.querySelectorAll('.btn-favorito');
    
    btnsFavorito.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const target = e.target as HTMLButtonElement;
        const videoId = target.dataset.videoId!;
        
        await this.removeFavorito(videoId);
      });
    });
  }

  private async removeFavorito(videoId: string): Promise<void> {
    try {
      await favoritosAPI.remover(videoId);
      Toast.success('Removido dos favoritos');
      
      await this.render();
    } catch (error: any) {
      Toast.error(error.message || 'Erro ao remover favorito');
    }
  }
}