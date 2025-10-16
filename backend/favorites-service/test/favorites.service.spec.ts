import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from '../src/app/services/favorites.service';
import { FavoriteRepository } from '../src/infrastructure/repositories/favorite.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let repository: jest.Mocked<FavoriteRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: FavoriteRepository,
          useValue: {
            create: jest.fn(),
            findByUserId: jest.fn(),
            findByUserAndVideo: jest.fn(),
            delete: jest.fn(),
            isFavorite: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    repository = module.get(FavoriteRepository);
  });

  describe('addFavorite', () => {
    it('should add a favorite successfully', async () => {
      const userId = 'user1';
      const dto = {
        videoId: 'video1',
        videoData: {
          title: 'Test Video',
          description: 'Test',
          thumbnailUrl: 'http://test.com/thumb.jpg',
          channelTitle: 'Test Channel',
        },
      };

      repository.findByUserAndVideo.mockResolvedValue(null);
      repository.create.mockResolvedValue({
        id: '1',
        userId,
        videoId: dto.videoId,
        videoData: dto.videoData,
        createdAt: new Date(),
      });

      const result = await service.addFavorite(userId, dto);

      expect(result.videoId).toBe(dto.videoId);
      expect(repository.create).toHaveBeenCalledWith(userId, dto.videoId, dto.videoData);
    });

    it('should throw ConflictException if already favorited', async () => {
      const userId = 'user1';
      const dto = {
        videoId: 'video1',
        videoData: {
          title: 'Test Video',
          description: 'Test',
          thumbnailUrl: 'http://test.com/thumb.jpg',
          channelTitle: 'Test Channel',
        },
      };

      repository.findByUserAndVideo.mockResolvedValue({
        id: '1',
        userId,
        videoId: dto.videoId,
        videoData: dto.videoData,
        createdAt: new Date(),
      });

      await expect(service.addFavorite(userId, dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('removeFavorite', () => {
    it('should remove a favorite successfully', async () => {
      const userId = 'user1';
      const videoId = 'video1';

      repository.findByUserAndVideo.mockResolvedValue({
        id: '1',
        userId,
        videoId,
        videoData: {} as any,
        createdAt: new Date(),
      });
      repository.delete.mockResolvedValue(undefined);

      await service.removeFavorite(userId, videoId);

      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if favorite not found', async () => {
      const userId = 'user1';
      const videoId = 'video1';

      repository.findByUserAndVideo.mockResolvedValue(null);

      await expect(service.removeFavorite(userId, videoId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserFavorites', () => {
    it('should return all user favorites', async () => {
      const userId = 'user1';
      const favorites = [
        {
          id: '1',
          userId,
          videoId: 'video1',
          videoData: {
            title: 'Video 1',
            description: 'Test',
            thumbnailUrl: 'http://test.com/1.jpg',
            channelTitle: 'Channel 1',
          },
          createdAt: new Date(),
        },
      ];

      repository.findByUserId.mockResolvedValue(favorites);

      const result = await service.getUserFavorites(userId);

      expect(result).toHaveLength(1);
      expect(result[0].videoId).toBe('video1');
    });
  });
});