import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './auth.dto';
import { UnauthorizedException } from '@nestjs/common';

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

  it('deve definir as instâncias', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('deve definir um token válido e o tempo em que expira caso o login seja feito', () => {
      const mockAuthResponse: AuthResponseDto = {
        token: 'mocked-jwt-token',
        expiresIn: 3600,
      };

      jest.spyOn(authService, 'signIn').mockReturnValue(mockAuthResponse);

      const result = authController.signIn('testUser', 'testPassword');

      expect(result).toEqual(mockAuthResponse);
    });

    it('deve lançar UnauthorizedException quando as credenciais são inválidas', () => {
      jest.spyOn(authService, 'signIn').mockImplementation(() => {
        throw new UnauthorizedException();
      });

      expect(() => authController.signIn('wrongUser', 'wrongPassword')).toThrow(
        UnauthorizedException,
      );
    });
  });
});
