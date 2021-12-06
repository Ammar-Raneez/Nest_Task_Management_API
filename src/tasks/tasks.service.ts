import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  async findOne(id: string, user: User) {
    const task = await this.tasksRepository.findOne({ where: { id, user } });
    if (!task) {
      throw new NotFoundException(`Task of id ${id} not found`);
    }

    return task;
  }

  find(filterDto: GetTasksFilterDto, user: User) {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  create(createTaskDto: CreateTaskDto, user: User) {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async remove(id: string, user: User) {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task of id ${id} not found`);
    }
  }

  async update(id: string, status: TaskStatus, user: User) {
    const task = await this.findOne(id, user);
    task.status = status;
    return this.tasksRepository.save(task);
  }
}
