import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { appConstants } from '~modules/app/app.constants';
import { GetAuthenticatedUser } from '~modules/auth/decorators/get-authenticated-user.decorator';
import { AuthenticationGuard } from '~modules/auth/guards/authentication.guard';
import { IAuthenticatedUser } from '~modules/auth/interfaces/authenticated-user.interface';

import { NewTaskDto } from './dto/new-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { TaskManagementService } from './task-management.service';

@ApiTags('TaskManagement')
@Controller('task-management')
export class TaskManagementController {
  constructor(private taskManagementService: TaskManagementService) {}

  @Post('/tasks')
  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiOkResponse({ type: TaskResponseDto })
  async createTask(
    @GetAuthenticatedUser() user: IAuthenticatedUser,
    @Body() newTaskDto: NewTaskDto,
  ): Promise<TaskResponseDto> {
    const taskCreate = newTaskDto.toITaskCreate(user.id, 'pending');
    const createdTask = await this.taskManagementService.createTask(taskCreate);
    return TaskResponseDto.fromITask(createdTask);
  }

  @Put('/tasks/:id/status')
  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'Update task status' })
  @ApiOkResponse({ type: TaskResponseDto })
  async updateTaskStatus(
    @GetAuthenticatedUser() user: IAuthenticatedUser,
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDTO,
  ): Promise<TaskResponseDto> {
    const [taskId, status, currentUserId] = updateTaskStatusDto.toServiceArguments(id, user.id);
    const updatedTask = await this.taskManagementService.updateTaskStatus(taskId, status, currentUserId);
    return TaskResponseDto.fromITask(updatedTask);
  }

  @Delete('/tasks/:id')
  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'Delete a task' })
  async deleteTask(@GetAuthenticatedUser() user: IAuthenticatedUser, @Param('id') id: string): Promise<void> {
    await this.taskManagementService.deleteTaskForUser(id, user.id);
  }
}
