import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { FavoritesService } from '../../app/services/favorites.service';
import { AddFavoriteDto } from '../../app/dtos/favorite.dto';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';

@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getUserFavorites(@Request() req) {
    return this.favoritesService.getUserFavorites(req.user.id);
  }

  @Get('check/:videoId')
  async checkFavorite(@Request() req, @Param('videoId') videoId: string) {
    const isFavorite = await this.favoritesService.isFavorite(req.user.id, videoId);
    return { isFavorite };
  }

  @Post()
  async addFavorite(@Request() req, @Body() dto: AddFavoriteDto) {
    return this.favoritesService.addFavorite(req.user.id, dto);
  }

  @Delete(':videoId')
  async removeFavorite(@Request() req, @Param('videoId') videoId: string) {
    await this.favoritesService.removeFavorite(req.user.id, videoId);
    return { message: 'Favorite removed successfully' };
  }
}