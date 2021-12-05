/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hash = await  bcrypt.hash(password, salt);

    const user = this.create({ username, password: hash });
    try {
      await this.save(user);
    } catch (err) {
      if (+err.code === 23505) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
