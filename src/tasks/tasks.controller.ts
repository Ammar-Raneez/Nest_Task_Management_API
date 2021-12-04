import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dtos/update-task-status.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':id')
  getTaskbyId(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateTaskStatusDto,
  ) {
    const { status } = updateStatusDto;
    return this.tasksService.update(id, status);
  }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto) {
    if (Object.keys(filterDto).length) {
      return this.tasksService.findWithFilters(filterDto);
    }

    return this.tasksService.find();
  }

  @Post()
  createTask(@Body() body: CreateTaskDto) {
    return this.tasksService.create(body);
  }

  @Delete()
  deleteTask(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
