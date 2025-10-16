import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { FavoriteRepository } from '../../infrastructure/repositories/favorite.repository';
import { AddFavoriteDto, FavoriteResponseDto } from '../dtos/favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async addFavorite(userId: string, dto: AddFavoriteDto): Promise<FavoriteResponseDto> {
    const existing = await this.favoriteRepository.findByUserAndVideo(
      userId,
      dto.videoId,
    );

    if (existing) {
      throw new ConflictException('Video already in favorites');
    }

    const favorite = await this.favoriteRepository.create(
      userId,
      dto.videoId,
      dto.videoData,
    );

    return this.mapToResponseDto(favorite);
  }

  async removeFavorite(userId: string, videoId: string): Promise<void> {
    const favorite = await this.favoriteRepository.findByUserAndVideo(userId, videoId);

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favoriteRepository.delete(favorite.id);
  }

  async getUserFavorites(userId: string): Promise<FavoriteResponseDto[]> {
    const favorites = await this.favoriteRepository.findByUserId(userId);
    return favorites.map(f => this.mapToResponseDto(f));
  }

  async isFavorite(userId: string, videoId: string): Promise<boolean> {
    return this.favoriteRepository.isFavorite(userId, videoId);
  }

  private mapToResponseDto(favorite: any): FavoriteResponseDto {
    return {
      id: favorite.id,
      userId: favorite.userId,
      videoId: favorite.videoId,
      videoData: favorite.videoData,
      createdAt: favorite.createdAt,
    };
  }
}