import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../../domain/entities/favorite.entity';

@Injectable()
export class FavoriteRepository {
  constructor(
    @InjectRepository(Favorite)
    private readonly repository: Repository<Favorite>,
  ) {}

  async create(userId: string, videoId: string, videoData: any): Promise<Favorite> {
    const favorite = this.repository.create({ userId, videoId, videoData });
    return this.repository.save(favorite);
  }

  async findByUserId(userId: string): Promise<Favorite[]> {
    return this.repository.find({ 
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserAndVideo(userId: string, videoId: string): Promise<Favorite | null> {
    return this.repository.findOne({ where: { userId, videoId } });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByUserAndVideo(userId: string, videoId: string): Promise<void> {
    await this.repository.delete({ userId, videoId });
  }

  async isFavorite(userId: string, videoId: string): Promise<boolean> {
    const count = await this.repository.count({ where: { userId, videoId } });
    return count > 0;
  }
}