export interface Usuario {
  id: number;
  email: string;
  criadoEm?: Date;
}

export interface AuthResponse {
  sucesso: boolean;
  dados?: {
    token: string;
    usuario: Usuario;
  };
  erro?: string;
}

export interface Video {
  id: string;
  titulo: string;
  descricao: string;
  canal: string;
  canalId: string;
  thumbnail: string;
  publicadoEm: string;
}

export interface VideosResponse {
  sucesso: boolean;
  dados?: {
    videos: Video[];
    totalResultados: number;
    proximaPagina?: string;
    paginaAnterior?: string;
  };
  erro?: string;
}

export interface Favorito {
  id: number;
  videoId: string;
  adicionadoEm: Date;
}

export interface FavoritosResponse {
  sucesso: boolean;
  dados?: {
    favoritos: Favorito[];
    total: number;
  };
  erro?: string;
}

export interface FavoritoCheckResponse {
  sucesso: boolean;
  dados?: {
    favoritado: boolean;
    favoritoId?: number;
  };
  erro?: string;
}

export interface ApiError {
  erro: string;
}