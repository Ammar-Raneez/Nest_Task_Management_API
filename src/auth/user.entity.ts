/* eslint-disable prettier/prettier */
import { Task } from 'src/tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  // a user can have many tasks
  // eager: true -> automatically fetches the tasks along with the user
  // without needing for an extra query
  @OneToMany((type) => Task, task => task.user, { eager: true })
  tasks: Task[]
}
