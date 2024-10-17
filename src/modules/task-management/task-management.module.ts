import { Module } from '@nestjs/common';
import { TaskManagementController } from './task-management.controller';
import { TaskManagementService } from './task-management.service';
import { TaskPrismaRepository } from './task.prisma-repository';

@Module({
  controllers: [TaskManagementController],
  providers: [
    TaskManagementService,
    {
      provide: 'TaskRepository',
      useClass: TaskPrismaRepository,
    },
  ],
  exports: [TaskManagementService],
})
export class TaskManagementModule {}
