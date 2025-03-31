import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './auth.dto';
import { TestingModule } from '@nestjs/testing';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(() => {
    const mockAuthService = {
      signIn: jest.fn(
        (username: string, password: string): AuthResponseDto => ({
          expiresIn: 3600,
          token: 'token',
        }),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();
  });
});
