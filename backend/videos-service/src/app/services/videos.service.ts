import { Injectable } from '@nestjs/common';
import { YouTubeApiAdapter } from '../../infrastructure/adapters/youtube-api.adapter';
import { VideoCacheRepository } from '../../infrastructure/repositories/video-cache.repository';
import { SearchVideosDto, SearchResponseDto, VideoDto } from '../dtos/video.dto';

@Injectable()
export class VideosService {
  constructor(
    private readonly youtubeAdapter: YouTubeApiAdapter,
    private readonly cacheRepository: VideoCacheRepository,
  ) {}

  async searchVideos(dto: SearchVideosDto): Promise<SearchResponseDto> {
    try {
      const result = await this.youtubeAdapter.searchVideos(
        dto.query,
        dto.maxResults || 20,
        dto.pageToken,
      );

      // Cache videos
      for (const video of result.videos) {
        await this.cacheRepository.save(video.id, video, dto.query);
      }

      return result;
    } catch (error) {
      console.error('Error searching videos:', error);
      throw error;
    }
  }

  async getVideoById(videoId: string): Promise<VideoDto> {
    // Check cache first
    const cached = await this.cacheRepository.findByVideoId(videoId);
    if (cached) {
      return cached.data;
    }

    // Fetch from YouTube API
    const video = await this.youtubeAdapter.getVideoById(videoId);
    
    // Cache the result
    await this.cacheRepository.save(videoId, video, '');

    return video;
  }

  async getTrendingVideos(): Promise<SearchResponseDto> {
    return this.searchVideos({ 
      query: 'trending', 
      maxResults: 20 
    });
  }
}