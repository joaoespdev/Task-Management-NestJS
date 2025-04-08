import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { UserDto } from './user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: UserDto = {
    id: '1',
    username: 'john_doe',
    password: 'securePassword123',
  };

  const mockUsersService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve definir a instância', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar UsersService.create com os dados corretos do usuário', () => {
      controller.create(mockUser);
      expect(service.create).toHaveBeenCalledWith(mockUser);
    });

    it('deve lançar um erro se o método UsersService.create lançar uma exceção', () => {
      const error = new Error('Failed to create user');
      jest.spyOn(service, 'create').mockImplementation(() => {
        throw error;
      });

      expect(() => controller.create(mockUser)).toThrow(error);
    });
  });
});
