import { VideoDto, SearchResponseDto } from '../../app/dtos/video.dto';

export interface IYouTubeApiAdapter {
  searchVideos(query: string, maxResults?: number, pageToken?: string): Promise<SearchResponseDto>;
  getVideoById(videoId: string): Promise<VideoDto>;
}
