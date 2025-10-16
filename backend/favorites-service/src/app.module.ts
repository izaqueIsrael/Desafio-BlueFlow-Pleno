import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './domain/entities/favorite.entity';
import { FavoritesController } from './presentation/controllers/favorites.controller';
import { FavoritesService } from './app/services/favorites.service';
import { FavoriteRepository } from './infrastructure/repositories/favorite.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5434'),
      username: process.env.DB_USERNAME || 'favorites_user',
      password: process.env.DB_PASSWORD || 'favorites_pass',
      database: process.env.DB_DATABASE || 'favorites_db',
      entities: [Favorite],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Favorite]),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService, FavoriteRepository],
})
export class AppModule {}