import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  signUp(authCredentialsDto: AuthCredentialsDto) {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      return 'success';
    }

    // prevent saying something like 'user doesnt exist'
    // to prevent transparency issues that show that there's no such username
    throw new UnauthorizedException('Please check your credentials');
  }
}
