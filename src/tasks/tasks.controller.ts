import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TaskStatus } from './task.model';
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
    @Body('status') status: TaskStatus,
  ) {
    return this.tasksService.update(id, status);
  }

  @Get()
  getAllTasks() {
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
