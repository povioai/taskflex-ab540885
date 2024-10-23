import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from '~database/prisma';
import { ITask } from '~modules/task-management/interfaces/task.interface';
import { TaskRepository } from '~modules/task-management/task.repository';
import { IPaginatedTasks } from '~modules/task-management/interfaces/paginated-tasks-dto.interface';
import { TaskManagement } from '~modules/task-management/interfaces/pagination.interface';
import { ITaskCreate } from '~modules/task-management/interfaces/task-create.interface';
import { ITaskUpdate } from '~modules/task-management/interfaces/task-update.interface';

@Injectable()
export class TaskPrismaRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService, private readonly taskManagement: TaskManagement) {}

  async findTaskById(id: string): Promise<ITask | undefined> {
    const task = await this.prisma.client.task.findUnique({
      where: { id },
    });
    return task ? this.toDomain(task) : undefined;
  }

  async createTask(input: ITaskCreate): Promise<ITask> {
    const task = await this.prisma.client.task.create({
      data: {
        userId: input.userId,
        title: input.title,
        description: input.description,
        status: input.status,
      },
    });
    return this.toDomain(task);
  }

  async updateTask(id: string, input: ITaskUpdate): Promise<ITask> {
    const task = await this.prisma.client.task.update({
      where: { id },
      data: {
        userId: input.userId,
        title: input.title,
        description: input.description,
        status: input.status,
      },
    });
    return this.toDomain(task);
  }

  async deleteTask(id: string): Promise<void> {
    await this.prisma.client.task.delete({
      where: { id },
    });
  }

  async getPaginatedTasks(page: number, tasksPerPage: number): Promise<IPaginatedTasks> {
    const offset = (page - 1) * tasksPerPage;

    const taskModels = await this.prisma.client.task.findMany({
      skip: offset,
      take: tasksPerPage,
    });

    const totalTasks = await this.prisma.client.task.count();

    const tasks = taskModels.map((task) => this.toDomain(task));

    const paginationMetadata = this.taskManagement.getPaginationMetadata(totalTasks, tasksPerPage, page);

    return {
      tasks,
      paginationMetadata,
    };
  }

  private toDomain(task: Task): ITask {
    return {
      id: task.id,
      userId: task.userId,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}