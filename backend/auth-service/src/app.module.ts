import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { User } from './domain/entities/user.entity';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './app/services/auth.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { BcryptHashStrategy } from './app/strategies/bcrypt-hash.strategy';
import { JwtTokenStrategy } from './app/strategies/jwt-token.strategy';
import { JwtStrategy } from './infrastructure/guards/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'auth_user',
      password: process.env.DB_PASSWORD || 'auth_pass',
      database: process.env.DB_DATABASE || 'auth_db',
      entities: [User],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    BcryptHashStrategy,
    JwtTokenStrategy,
    JwtStrategy,
  ],
})
export class AppModule {}