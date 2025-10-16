import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoCache } from './domain/entities/video-cache.entity';
import { VideosController } from './presentation/controllers/videos.controller';
import { VideosService } from './app/services/videos.service';
import { YouTubeApiAdapter } from './infrastructure/adapters/youtube-api.adapter';
import { VideoCacheRepository } from './infrastructure/repositories/video-cache.repository';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Configure TypeORM with ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5433),
        username: configService.get('DB_USERNAME', 'videos_user'),
        password: configService.get('DB_PASSWORD', 'videos_pass'),
        database: configService.get('DB_DATABASE', 'videos_db'),
        entities: [VideoCache],
        synchronize: true, // Set to false in production!
      }),
      inject: [ConfigService],
    }),
    
    TypeOrmModule.forFeature([VideoCache]),
  ],
  controllers: [VideosController],
  providers: [VideosService, YouTubeApiAdapter, VideoCacheRepository],
})
export class AppModule {}