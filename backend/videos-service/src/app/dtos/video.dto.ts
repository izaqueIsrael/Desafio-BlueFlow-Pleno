export class VideoDto {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  viewCount?: string;
  likeCount?: string;
}

export class SearchVideosDto {
  query: string;
  maxResults?: number;
  pageToken?: string;
}

export class SearchResponseDto {
  videos: VideoDto[];
  nextPageToken?: string;
  prevPageToken?: string;
  totalResults?: number;
}