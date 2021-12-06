/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  // many tasks can belong to a single user
  @ManyToOne((type) => User, (user) => user.tasks, { eager: false })
  // exclude when we print this as plain text
  @Exclude({ toPlainOnly: true })
  user: User;
}