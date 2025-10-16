import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { BcryptHashStrategy } from '../strategies/bcrypt-hash.strategy';
import { JwtTokenStrategy } from '../strategies/jwt-token.strategy';
import { RegisterDto, LoginDto, AuthResponseDto } from '../dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashStrategy: BcryptHashStrategy,
    private readonly tokenStrategy: JwtTokenStrategy,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    if (!dto.email || !dto.password || !dto.name) {
      throw new ConflictException('Email, password and name are required');
    }

    const existingUser = await this.userRepository.findByEmail(dto.email);
    
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await this.hashStrategy.hash(dto.password);
    const user = await this.userRepository.create(dto.email, hashedPassword, dto.name);

    const token = this.tokenStrategy.sign({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashStrategy.compare(dto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.tokenStrategy.sign({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}