import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthResponseDto } from './auth.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByUserName: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(3600),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
    jwtService = moduleRef.get(JwtService);
    configService = moduleRef.get(ConfigService);
  });

  it('deve retornar um token válido com o tempo em que expira se as credenciais estiverem corretas', () => {
    const mockUser = {
      id: '1',
      username: 'testUser',
      password: '$2b$10$hashedpassword', // senha "123456" hash fictício
    };

    jest.spyOn(usersService, 'findByUserName').mockReturnValue(mockUser);
    jest.spyOn(jwtService, 'sign').mockReturnValue('mocked.jwt.token');
    jest.spyOn(require('bcrypt'), 'compareSync').mockReturnValue(true);

    const result: AuthResponseDto = authService.signIn('testUser', '123456');

    expect(result).toEqual({
      token: 'mocked.jwt.token',
      expiresIn: 3600,
    });
    expect(usersService.findByUserName).toHaveBeenCalledWith('testUser');
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: mockUser.id,
      username: mockUser.username,
    });
  });

  it('deve lançar UnauthorizedException se o usuário não for encontrado', () => {
    jest.spyOn(usersService, 'findByUserName').mockReturnValue(null);

    expect(() => authService.signIn('wrongUser', '123456')).toThrow(
      UnauthorizedException,
    );
  });

  it('deve lançar UnauthorizedException se a senha for incorreta', () => {
    const mockUser = {
      id: '1',
      username: 'testUser',
      password: '$2b$10$hashedpassword',
    };

    jest.spyOn(usersService, 'findByUserName').mockReturnValue(mockUser);
    jest.spyOn(require('bcrypt'), 'compareSync').mockReturnValue(false);

    expect(() => authService.signIn('testUser', 'wrongPassword')).toThrow(
      UnauthorizedException,
    );
  });
});
