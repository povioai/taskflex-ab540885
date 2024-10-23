import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '~common/exceptions';
import { LoggerService } from '~common/logging';
import { ITaskCreate } from '~modules/task-management/interfaces/task-create.interface';
import { ITaskUpdate } from '~modules/task-management/interfaces/task-update.interface';
import { ITask } from '~modules/task-management/interfaces/task.interface';
import { TaskRepository } from '~modules/task-management/task.repository';
import { IPaginatedTasks } from '~modules/task-management/interfaces/paginated-tasks-dto.interface';
import { TaskManagement } from '~modules/task-management/interfaces/pagination.interface';

@Injectable()
export class TaskManagementService {
  constructor(
    private readonly logger: LoggerService,
    @Inject('TaskRepository')
    private readonly taskRepository: TaskRepository,
    private readonly taskManagement: TaskManagement,
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

  private validateTaskInput(task: { title: string; description: string }): void {
    if (!task.title.trim()) {
      throw new Error('Title should be a non-empty string');
    }
    if (!task.description.trim()) {
      throw new Error('Description should be a non-empty string');
    }
  }

  async getPaginatedTasks(page: number, tasksPerPage: number): Promise<IPaginatedTasks> {
    const paginatedTasks = await this.taskRepository.getPaginatedTasks(page, tasksPerPage);

    if (!paginatedTasks) {
      throw new NotFoundException('No tasks found', 'TASKS_NOT_FOUND');
    }

    const paginationMetadata = this.taskManagement.getPaginationMetadata(
      paginatedTasks.paginationMetadata.totalItems,
      tasksPerPage,
      page
    );

    return {
      tasks: paginatedTasks.tasks,
      paginationMetadata,
    };
  }
}