export class AddFavoriteDto {
  videoId: string;
  videoData: {
    title: string;
    description: string;
    thumbnailUrl: string;
    channelTitle: string;
  };
}

export class FavoriteResponseDto {
  id: string;
  userId: string;
  videoId: string;
  videoData: {
    title: string;
    description: string;
    thumbnailUrl: string;
    channelTitle: string;
  };
  createdAt: Date;
}