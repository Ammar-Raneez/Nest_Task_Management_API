import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  async findOne(id: string) {
    const task = await this.tasksRepository.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task of id ${id} not found`);
    }

    return task;
  }

  find(filterDto: GetTasksFilterDto) {
    return this.tasksRepository.getTasks(filterDto);
  }

  create(createTaskDto: CreateTaskDto) {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async remove(id: string) {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task of id ${id} not found`);
    }
  }

  async update(id: string, status: TaskStatus) {
    const task = await this.findOne(id);
    task.status = status;
    return this.tasksRepository.save(task);
  }
}
