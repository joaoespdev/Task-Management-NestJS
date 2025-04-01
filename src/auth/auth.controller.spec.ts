import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a valid token and expiration time on successful login', () => {
      const mockAuthResponse: AuthResponseDto = {
        token: 'mocked-jwt-token',
        expiresIn: 3600,
      };

      jest.spyOn(authService, 'signIn').mockReturnValue(mockAuthResponse);

      const result = authController.signIn('testUser', 'testPassword');

      expect(result).toEqual(mockAuthResponse);
    });
  });
});
