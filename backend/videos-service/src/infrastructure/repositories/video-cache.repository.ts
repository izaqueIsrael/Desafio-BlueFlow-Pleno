import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoCache } from '../../domain/entities/video-cache.entity';

@Injectable()
export class VideoCacheRepository {
  constructor(
    @InjectRepository(VideoCache)
    private readonly repository: Repository<VideoCache>,
  ) {}

  async save(videoId: string, data: any, query: string): Promise<VideoCache> {
    // Check if this videoId + query combo already exists
    const existing = await this.repository.findOne({
      where: { videoId, query }
    });

    if (existing) {
      // Update existing cache
      existing.data = data;
      existing.cachedAt = new Date();
      return await this.repository.save(existing);
    }

    // Create new cache entry
    const cache = this.repository.create({
      videoId: videoId,  // MUST be explicitly set
      data: data,
      query: query,
    });
    
    return await this.repository.save(cache);
  }

  async findByVideoId(videoId: string): Promise<VideoCache | null> {
    return await this.repository.findOne({ 
      where: { videoId },
      order: { cachedAt: 'DESC' }
    });
  }

  async findByQuery(query: string): Promise<VideoCache[]> {
    return await this.repository.find({ 
      where: { query },
      order: { cachedAt: 'DESC' }
    });
  }
}