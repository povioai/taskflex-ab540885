import { Injectable, Inject } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '~common/exceptions';
import { LoggerService } from '~common/logging';
import { ITaskCreate } from '~modules/task-management/interfaces/task-create.interface';
import { ITaskUpdate } from '~modules/task-management/interfaces/task-update.interface';
import { ITask } from '~modules/task-management/interfaces/task.interface';
import { TaskRepository } from '~modules/task-management/task.repository';
import { IPaginatedTasksDto } from '~modules/task-management/interfaces/paginated-tasks-dto.interface';

@Injectable()
export class TaskManagementService {
  constructor(
    private readonly logger: LoggerService,
    @Inject('TaskRepository')
    private readonly taskRepository: TaskRepository,
  ) {}

  async createTask(task: ITaskCreate): Promise<ITask> {
    this.validateTaskInput(task);
    return this.taskRepository.createTask(task);
  }

  async updateTask(taskId: string, taskUpdate: ITaskUpdate): Promise<ITask> {
    this.validateTaskInput(taskUpdate);
    return this.taskRepository.updateTask(taskId, taskUpdate);
  }

  async findTaskById(taskId: string): Promise<ITask | undefined> {
    return this.taskRepository.findTaskById(taskId);
  }

  async deleteTask(taskId: string): Promise<void> {
    return this.taskRepository.deleteTask(taskId);
  }

  async updateTaskStatus(taskId: string, status: string, currentUserId: string): Promise<ITask> {
    const validStatuses = ['todo', 'in-progress', 'done'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const task = await this.taskRepository.findTaskById(taskId);
    if (!task) {
      throw new Error('Task does not exist');
    }

    if (task.userId !== currentUserId) {
      throw new Error('Task does not belong to the current user');
    }

    const taskUpdate: ITaskUpdate = {
      userId: task.userId,
      title: task.title,
      description: task.description,
      status,
    };

    return this.taskRepository.updateTask(taskId, taskUpdate);
  }

  async deleteTaskForUser(taskId: string, currentUserId: string): Promise<void> {
    const task = await this.taskRepository.findTaskById(taskId);
    if (!task) {
      throw new Error('Task does not exist');
    }

    if (task.userId !== currentUserId) {
      throw new Error('Task does not belong to the current user');
    }

    await this.taskRepository.deleteTask(taskId);
  }

  async getPaginatedTasks(page: number, tasksPerPage: number): Promise<IPaginatedTasksDto> {
    this.validatePaginationParameters(page, tasksPerPage);
    const paginatedTasks = await this.taskRepository.getPaginatedTasks(page, tasksPerPage);
    if (!paginatedTasks.tasks.length) {
      throw new NotFoundException('No tasks found for the given page', 'tasks_not_found');
    }
    return paginatedTasks;
  }

  private validateTaskInput(task: { title: string; description: string }): void {
    if (!task.title.trim()) {
      throw new Error('Title should be a non-empty string');
    }
    if (!task.description.trim()) {
      throw new Error('Description should be a non-empty string');
    }
  }

  private validatePaginationParameters(page: number, tasksPerPage: number): void {
    if (page < 1) {
      throw new BadRequestException('Page number must be greater than zero', 'invalid_page_number');
    }
    if (tasksPerPage < 1 || tasksPerPage > 100) {
      throw new BadRequestException('Tasks per page must be between 1 and 100', 'invalid_tasks_per_page');
    }
  }
}