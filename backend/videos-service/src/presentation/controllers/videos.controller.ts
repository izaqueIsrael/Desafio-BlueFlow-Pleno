import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { VideosService } from '../../app/services/videos.service';
import { SearchVideosDto } from '../../app/dtos/video.dto';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';

@Controller('videos')
@UseGuards(AuthGuard)
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get('search')
  async search(@Query() dto: SearchVideosDto) {
    return this.videosService.searchVideos(dto);
  }

  @Get('trending')
  async trending() {
    return this.videosService.getTrendingVideos();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.videosService.getVideoById(id);
  }
}