import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { IYouTubeApiAdapter } from './youtube-api.adapter.interface';
import { VideoDto, SearchResponseDto } from '../../app/dtos/video.dto';

@Injectable()
export class YouTubeApiAdapter implements IYouTubeApiAdapter {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY!;
    if (!this.apiKey) {
      throw new Error('YOUTUBE_API_KEY not configured');
    }
  }

  async searchVideos(
    query: string, 
    maxResults: number = 20, 
    pageToken?: string
  ): Promise<SearchResponseDto> {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          key: this.apiKey,
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults,
          pageToken,
        },
      });

      const videos: VideoDto[] = response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      }));

      return {
        videos,
        nextPageToken: response.data.nextPageToken,
        prevPageToken: response.data.prevPageToken,
        totalResults: response.data.pageInfo.totalResults,
      };
    } catch (error) {
      console.error('YouTube API Error:', error.response?.data || error.message);
      throw new HttpException(
        'Failed to fetch videos from YouTube',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getVideoById(videoId: string): Promise<VideoDto> {
    try {
      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          key: this.apiKey,
          part: 'snippet,statistics',
          id: videoId,
        },
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
      }

      const item = response.data.items[0];
      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        viewCount: item.statistics.viewCount,
        likeCount: item.statistics.likeCount,
      };
    } catch (error) {
      console.error('YouTube API Error:', error.response?.data || error.message);
      throw new HttpException(
        'Failed to fetch video details',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}