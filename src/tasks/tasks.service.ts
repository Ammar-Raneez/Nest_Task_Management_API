import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  find() {
    return this.tasks;
  }

  findWithFilters(filterDto: GetTasksFilterDto) {
    const { status, search } = filterDto;
    let tasks = this.find();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
      });
    }

    return tasks;
  }

  remove(id: string) {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task of id ${id} not found`);
    }

    this.tasks = this.tasks.filter((task) => task.id !== id);
    return this.tasks;
  }

  findOne(id: string) {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task of id ${id} not found`);
    }

    return task;
  }

  update(id: string, status: TaskStatus) {
    const task = this.findOne(id);
    task.status = status;
    return task;
  }

  create({ title, description }: CreateTaskDto) {
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }
}
