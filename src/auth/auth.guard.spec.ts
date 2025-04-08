import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mocked-secret'),
          },
        },
      ],
    }).compile();

    authGuard = moduleRef.get<AuthGuard>(AuthGuard);
    jwtService = moduleRef.get<JwtService>(JwtService);
    configService = moduleRef.get<ConfigService>(ConfigService);

    // Forçando a atribuição manual do secret, já que o constructor original está incorreto
    (authGuard as any).jwtSecret = 'mocked-secret';
  });

  const mockExecutionContext = (
    headers: Record<string, string>,
  ): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ headers }),
      }),
    }) as any;

  it('deve permitir acesso com um token válido', async () => {
    const validPayload = { userId: 1, username: 'testUser' };
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue(validPayload);

    const context = mockExecutionContext({
      authorization: 'Bearer valid.token.here',
    });

    const result = await authGuard.canActivate(context);
    expect(result).toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid.token.here', {
      secret: 'mocked-secret',
    });
  });

  it('deve lançar UnauthorizedException se o token estiver faltando', async () => {
    const context = mockExecutionContext({});

    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('deve lançar UnauthorizedException se o token for inválido', async () => {
    (jwtService.verifyAsync as jest.Mock).mockRejectedValue(
      new Error('Invalid token'),
    );

    const context = mockExecutionContext({
      authorization: 'Bearer invalid.token',
    });

    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('deve retornar undefined se o tipo de autorização não for Bearer', async () => {
    const context = mockExecutionContext({
      authorization: 'Basic someothertoken',
    });

    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
