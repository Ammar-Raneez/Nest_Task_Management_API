/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    return this.save(task);
  }

  async getTasks(filterDto: GetTasksFilterDto) {
    const { status, search } = filterDto;

    // will use 'task' as our object to check
    const query = this.createQueryBuilder('task');
    if (status) {
      // check if the 'task' status is equal to the filter status (:status)
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      // check if the search terms is included in title or description, doesnt have to be complete match, (therefore automatic search filter can happen)
      query.andWhere(
        'LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE LOWER(:search)',

        // not looking for exact thing
        { search: `%${search}%` }
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }
}
