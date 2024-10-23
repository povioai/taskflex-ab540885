import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from '~database/prisma';
import { ITaskCreate } from '~modules/task-management/interfaces/task-create.interface';
import { ITaskUpdate } from '~modules/task-management/interfaces/task-update.interface';
import { ITask } from '~modules/task-management/interfaces/task.interface';
import { TaskRepository } from '~modules/task-management/task.repository';
import { IPaginatedListQuery } from '~common/interfaces/paginated-list.query.interface';
import { IPaginatedList } from '~common/interfaces/paginated-list.interface';
import { TaskManagementService } from '~modules/task-management/interfaces/pagination.interface';

@Injectable()
export class TaskPrismaRepository implements TaskRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: TaskManagementService
  ) {}

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

  async listTasks(query: IPaginatedListQuery): Promise<IPaginatedList<ITask>> {
    const { page, limit } = query;
    const offset = (page - 1) * limit;

    const taskModels = await this.prisma.client.task.findMany({
      skip: offset,
      take: limit,
    });
    const count = await this.prisma.client.task.count();

    const items = taskModels.map((task) => this.toDomain(task));

    const paginationMetadata = this.paginationService.getPaginationMetadata(count, limit, page);

    return {
      page,
      limit,
      totalItems: paginationMetadata.totalItems,
      items,
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