import { UsersService } from './users.service';
import { UserDto } from './user.dto';
import { v4 as uuidv4 } from 'uuid';
import { hashSync as bcryptHashSync } from 'bcrypt';

jest.mock('uuid', () => ({ v4: jest.fn() }));
jest.mock('bcrypt', () => ({ hashSync: jest.fn() }));

describe('UsersService', () => {
  let service: UsersService;

  const mockUser: UserDto = {
    id: '',
    username: 'testuser',
    password: 'plainpassword',
  };

  beforeEach(() => {
    service = new UsersService();
    (uuidv4 as jest.Mock).mockClear();
    (bcryptHashSync as jest.Mock).mockClear();
  });

  describe('create()', () => {
    it('deve gerar id e hash, e adicionar usuário à lista', () => {
      (uuidv4 as jest.Mock).mockReturnValue('mock-uuid');
      (bcryptHashSync as jest.Mock).mockReturnValue('hashed-password');

      service.create({ ...mockUser });

      const createdUser = (service as any).users[0];
      expect(createdUser.id).toBe('mock-uuid');
      expect(createdUser.password).toBe('hashed-password');
      expect(createdUser.username).toBe(mockUser.username);
    });
  });

  describe('findByUserName()', () => {
    it('deve retornar usuário existente', () => {
      (service as any).users.push({
        id: '1',
        username: 'testuser',
        password: 'hashed',
      });

      const result = service.findByUserName('testuser');
      expect(result?.username).toBe('testuser');
    });

    it('deve retornar null para usuário inexistente', () => {
      const result = service.findByUserName('nao-existe');
      expect(result).toBeNull();
    });

    it('deve ser case-sensitive', () => {
      (service as any).users.push({
        id: '1',
        username: 'TestUser',
        password: 'hashed',
      });

      const result = service.findByUserName('testuser');
      expect(result).toBeNull();
    });
  });
});
