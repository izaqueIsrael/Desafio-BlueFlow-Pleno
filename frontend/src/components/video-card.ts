import { Video } from '../api/types';
import { FormatHelper } from '../utils/format';

export class VideoCard {
  static render(video: Video, isFavorito: boolean = false): string {
    return `
      <div class="video-card" data-video-id="${video.id}">
        <a href="${FormatHelper.getYouTubeUrl(video.id)}" target="_blank" class="video-thumbnail">
          <img src="${video.thumbnail}" alt="${video.titulo}" loading="lazy" />
          <div class="video-duration-overlay">
            <span class="video-badge">YouTube</span>
          </div>
        </a>
        
        <div class="video-info">
          <h3 class="video-title" title="${video.titulo}">
            ${FormatHelper.truncate(video.titulo, 60)}
          </h3>
          
          <p class="video-channel">${video.canal}</p>
          
          <p class="video-date">${FormatHelper.formatDate(video.publicadoEm)}</p>
          
          <div class="video-actions">
            <button 
              class="btn-favorito ${isFavorito ? 'favorited' : ''}" 
              data-video-id="${video.id}"
              title="${isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}"
            >
              ${isFavorito ? '⭐' : '☆'} ${isFavorito ? 'Favoritado' : 'Favoritar'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  static renderList(videos: Video[], favoritos: Set<string> = new Set()): string {
    if (videos.length === 0) {
      return '<div class="empty-state">Nenhum vídeo encontrado</div>';
    }

    return `
      <div class="videos-grid">
        ${videos.map(video => this.render(video, favoritos.has(video.id))).join('')}
      </div>
    `;
  }
}