import { Test, TestingModule } from '@nestjs/testing';
import { VideosService } from '../src/app/services/videos.service';
import { YouTubeApiAdapter } from '../src/infrastructure/adapters/youtube-api.adapter';
import { VideoCacheRepository } from '../src/infrastructure/repositories/video-cache.repository';

describe('VideosService', () => {
  let service: VideosService;
  let youtubeAdapter: jest.Mocked<YouTubeApiAdapter>;
  let cacheRepository: jest.Mocked<VideoCacheRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        {
          provide: YouTubeApiAdapter,
          useValue: {
            searchVideos: jest.fn(),
            getVideoById: jest.fn(),
          },
        },
        {
          provide: VideoCacheRepository,
          useValue: {
            save: jest.fn(),
            findByVideoId: jest.fn(),
            findByQuery: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VideosService>(VideosService);
    youtubeAdapter = module.get(YouTubeApiAdapter);
    cacheRepository = module.get(VideoCacheRepository);
  });

  describe('searchVideos', () => {
    it('should search videos and cache results', async () => {
      const mockResponse = {
        videos: [
          {
            id: 'video1',
            title: 'Test Video',
            description: 'Test',
            thumbnailUrl: 'http://test.com/thumb.jpg',
            channelTitle: 'Test Channel',
            publishedAt: '2024-01-01',
          },
        ],
        nextPageToken: 'token123',
      };

      youtubeAdapter.searchVideos.mockResolvedValue(mockResponse);
      cacheRepository.save.mockResolvedValue(undefined);

      const result = await service.searchVideos({ query: 'test' });

      expect(result.videos).toHaveLength(1);
      expect(cacheRepository.save).toHaveBeenCalled();
    });
  });

  describe('getVideoById', () => {
    it('should return cached video if available', async () => {
      const mockVideo = {
        id: 'video1',
        title: 'Cached Video',
        description: 'Test',
        thumbnailUrl: 'http://test.com/thumb.jpg',
        channelTitle: 'Test Channel',
        publishedAt: '2024-01-01',
      };

      cacheRepository.findByVideoId.mockResolvedValue({
        videoId: 'video1',
        data: mockVideo,
        query: '',
        cachedAt: new Date(),
      });

      const result = await service.getVideoById('video1');

      expect(result).toEqual(mockVideo);
      expect(youtubeAdapter.getVideoById).not.toHaveBeenCalled();
    });

    it('should fetch from YouTube if not cached', async () => {
      const mockVideo = {
        id: 'video1',
        title: 'Fresh Video',
        description: 'Test',
        thumbnailUrl: 'http://test.com/thumb.jpg',
        channelTitle: 'Test Channel',
        publishedAt: '2024-01-01',
      };

      cacheRepository.findByVideoId.mockResolvedValue(null);
      youtubeAdapter.getVideoById.mockResolvedValue(mockVideo);
      cacheRepository.save.mockResolvedValue(undefined);

      const result = await service.getVideoById('video1');

      expect(result).toEqual(mockVideo);
      expect(youtubeAdapter.getVideoById).toHaveBeenCalledWith('video1');
      expect(cacheRepository.save).toHaveBeenCalled();
    });
  });
});