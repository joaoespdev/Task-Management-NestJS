import { HttpException, HttpStatus } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto } from './task.dto';

describe('TaskService', () => {
  let service: TaskService;

  const mockTask: TaskDto = {
    id: '1',
    title: 'Test Task',
    description: 'This is a test task',
    status: 'pending',
    expirationDate: new Date('2025-12-31'),
  };

  beforeEach(() => {
    service = new TaskService();
  });

  afterEach(() => {
    // limpa o array interno entre os testes
    (service as any).tasks = [];
  });

  it('deve criar a task', () => {
    service.create(mockTask);
    const tasks = (service as any).tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toEqual(mockTask);
  });

  it('deve retornar a task pelo id', () => {
    service.create(mockTask);
    const result = service.findById('1');
    expect(result).toEqual(mockTask);
  });

  it('deve lançar um error quando task não for encontrada pelo id', () => {
    expect(() => service.findById('not-found')).toThrow(
      new HttpException(
        'Task with id not-found not found',
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('deve retornar todas as tasks de acordo com os parâmetros de consulta', () => {
    service.create(mockTask);
    const result = service.findAll({ title: 'Test', status: 'pending' });
    expect(result).toEqual([mockTask]);
  });

  it('deve retornar vazio quando os parâmetros não baterem', () => {
    service.create(mockTask);
    const result = service.findAll({ title: 'Another', status: 'done' });
    expect(result).toEqual([]);
  });

  it('deve retornar todas as tasks pelo título parcialmente', () => {
    service.create(mockTask);
    const result = service.findAll({ title: 'Test', status: 'pending' });
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(mockTask);
  });

  it('deve atualizar uma task existente', () => {
    service.create(mockTask);
    const updatedTask = { ...mockTask, title: 'Updated Task' };
    service.update(updatedTask);
    const result = service.findById('1');
    expect(result.title).toBe('Updated Task');
  });

  it('deve lançar erro quando tentar atualizar task não existente', () => {
    expect(() => service.update(mockTask)).toThrow(
      new HttpException('Task with id 1 not found', HttpStatus.BAD_REQUEST),
    );
  });

  it('deve remover uma task existente', () => {
    service.create(mockTask);
    service.remove('1');
    const tasks = (service as any).tasks;
    expect(tasks).toHaveLength(0);
  });

  it('deve lançar error quando tentar remover task existente', () => {
    expect(() => service.remove('1')).toThrow(
      new HttpException('Task with id 1 not found', HttpStatus.BAD_REQUEST),
    );
  });
});
