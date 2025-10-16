import { favoritosAPI } from '../api/favoritos.api';
import { Video } from '../api/types';
import { videosAPI } from '../api/videos.api';
import { Loading } from '../components/loading';
import { SearchBar } from '../components/search-bar';
import { Toast } from '../components/toast';
import { VideoCard } from '../components/video-card';

export class HomePage {
  private container: HTMLElement;
  private searchBar: SearchBar;
  private videos: Video[] = [];
  private favoritos: Set<string> = new Set();
  private currentQuery: string = '';
  private nextPageToken?: string;

  constructor() {
    this.container = document.getElementById('main')!;
    this.searchBar = new SearchBar((query) => this.handleSearch(query));
  }

  async render(): Promise<void> {
    this.container.innerHTML = `
      <div class="home-container">
        ${this.searchBar.render()}
        
        <div id="videos-container" class="videos-container">
          <div class="empty-state">
            <img src="/assets/search.svg" alt="Buscar" class="empty-icon" />
            <h2>Busque vídeos no YouTube</h2>
            <p>Digite algo na barra de busca para começar</p>
          </div>
        </div>

        <div id="pagination-container"></div>
      </div>
    `;

    this.searchBar.attachEvents();
    await this.loadFavoritos();
  }

  private async loadFavoritos(): Promise<void> {
    try {
      const response = await favoritosAPI.listar();
      if (response.sucesso && response.dados) {
        this.favoritos = new Set(response.dados.favoritos.map(f => f.videoId));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  }

  private async handleSearch(query: string, pageToken?: string): Promise<void> {
    const videosContainer = document.getElementById('videos-container')!;
    
    videosContainer.innerHTML = Loading.render();

    try {
      this.currentQuery = query;
      const response = await videosAPI.buscar(query, pageToken);

      if (response.sucesso && response.dados) {
        this.videos = response.dados.videos;
        this.nextPageToken = response.dados.proximaPagina;
        
        videosContainer.innerHTML = VideoCard.renderList(this.videos, this.favoritos);
        this.renderPagination();
        this.attachVideoEvents();
      }
    } catch (error: any) {
      videosContainer.innerHTML = `
        <div class="error-state">
          <h2>❌ Erro ao buscar vídeos</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  private renderPagination(): void {
    const paginationContainer = document.getElementById('pagination-container')!;
    
    if (this.nextPageToken) {
      paginationContainer.innerHTML = `
        <div class="pagination">
          <button class="btn btn-secondary" id="btn-load-more">
            Carregar mais vídeos
          </button>
        </div>
      `;

      const btnLoadMore = document.getElementById('btn-load-more');
      btnLoadMore?.addEventListener('click', () => {
        this.handleSearch(this.currentQuery, this.nextPageToken);
      });
    } else {
      paginationContainer.innerHTML = '';
    }
  }

  private attachVideoEvents(): void {
    const btnsFavorito = document.querySelectorAll('.btn-favorito');
    
    btnsFavorito.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const target = e.target as HTMLButtonElement;
        const videoId = target.dataset.videoId!;
        
        await this.toggleFavorito(videoId, target);
      });
    });
  }

  private async toggleFavorito(videoId: string, btn: HTMLButtonElement): Promise<void> {
    const isFavorito = this.favoritos.has(videoId);
    
    btn.disabled = true;

    try {
      if (isFavorito) {
        await favoritosAPI.remover(videoId);
        this.favoritos.delete(videoId);
        btn.classList.remove('favorited');
        btn.innerHTML = '<img src="/assets/favoritos.png" alt="" class="btn-icon-small" /> Favoritar';
        btn.title = 'Adicionar aos favoritos';
        Toast.success('Removido dos favoritos');
      } else {
        await favoritosAPI.adicionar(videoId);
        this.favoritos.add(videoId);
        btn.classList.add('favorited');
        btn.innerHTML = '<img src="/assets/favoritos.png" alt="" class="btn-icon-small" /> Favoritado';
        btn.title = 'Remover dos favoritos';
        Toast.success('Adicionado aos favoritos');
      }
    } catch (error: any) {
      Toast.error(error.message || 'Erro ao atualizar favorito');
    } finally {
      btn.disabled = false;
    }
  }
}