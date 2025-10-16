import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/app/services/auth.service';
import { UserRepository } from '../src/infrastructure/repositories/user.repository';
import { BcryptHashStrategy } from '../src/app/strategies/bcrypt-hash.strategy';
import { JwtTokenStrategy } from '../src/app/strategies/jwt-token.strategy';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let hashStrategy: jest.Mocked<BcryptHashStrategy>;
  let tokenStrategy: jest.Mocked<JwtTokenStrategy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: BcryptHashStrategy,
          useValue: {
            hash: jest.fn(),
            compare: jest.fn(),
          },
        },
        {
          provide: JwtTokenStrategy,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
    hashStrategy = module.get(BcryptHashStrategy);
    tokenStrategy = module.get(JwtTokenStrategy);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const dto = { email: 'test@test.com', password: '123456', name: 'Test' };
      userRepository.findByEmail.mockResolvedValue(null);
      hashStrategy.hash.mockResolvedValue('hashedPassword');
      userRepository.create.mockResolvedValue({
        id: '1',
        email: dto.email,
        name: dto.name,
        password: 'hashedPassword',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      tokenStrategy.sign.mockReturnValue('token123');

      const result = await service.register(dto);

      expect(result).toHaveProperty('accessToken');
      expect(result.user.email).toBe(dto.email);
    });

    it('should throw ConflictException if email exists', async () => {
      const dto = { email: 'test@test.com', password: '123456', name: 'Test' };
      userRepository.findByEmail.mockResolvedValue({
        id: '1',
        email: dto.email,
        name: dto.name,
        password: 'hashedPassword',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const dto = { email: 'test@test.com', password: '123456' };
      userRepository.findByEmail.mockResolvedValue({
        id: '1',
        email: dto.email,
        name: 'Test',
        password: 'hashedPassword',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      hashStrategy.compare.mockResolvedValue(true);
      tokenStrategy.sign.mockReturnValue('token123');

      const result = await service.login(dto);

      expect(result).toHaveProperty('accessToken');
      expect(result.user.email).toBe(dto.email);
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      const dto = { email: 'test@test.com', password: 'wrong' };
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});