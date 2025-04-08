import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskDto, FindAllParameters } from './task.dto';
import { AuthGuard } from '../auth/auth.guard';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTask: TaskDto = {
    id: '1',
    title: 'Test Task',
    description: 'This is a test task',
    status: 'pending',
    expirationDate: new Date('2025-12-31'),
  };

  const mockTaskService = {
    create: jest.fn(),
    findById: jest.fn().mockReturnValue(mockTask),
    findAll: jest.fn().mockReturnValue([mockTask]),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve definir a instância', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar service.create com a task correta', () => {
      controller.create(mockTask);
      expect(service.create).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('findById', () => {
    it('deve retornar a task encontrada pelo id', () => {
      const result = controller.findById('1');
      expect(result).toEqual(mockTask);
      expect(service.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as tasks de acordo com seus parâmetros de consulta', () => {
      const query: FindAllParameters = {
        title: 'Test',
        status: 'pending',
      };
      const result = controller.findAll(query);
      expect(result).toEqual([mockTask]);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('update', () => {
    it('deve chamar service.update com a task correta', () => {
      controller.update(mockTask);
      expect(service.update).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('remove', () => {
    it('deve chamar service.remove com o id correto', () => {
      controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
