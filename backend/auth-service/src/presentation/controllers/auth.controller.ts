import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus, ValidationPipe, UsePipes } from '@nestjs/common';
import { AuthService } from '../../app/services/auth.service';
import { RegisterDto, LoginDto } from '../../app/dtos/auth.dto';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return req.user;
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  async validate(@Request() req) {
    return { 
      valid: true, 
      user: req.user 
    };
  }
}