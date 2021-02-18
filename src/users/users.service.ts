import { ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const queryRunner = getConnection('default').createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = new User(createUserDto.email, createUserDto.password);
      const duplicationUser = await this.usersRepository.findOne({ email: createUserDto.email });
      if (duplicationUser) {
        throw new ConflictException('User already exists!');
      }
      const savedUser = await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return savedUser;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new UnprocessableEntityException(e);
    } finally {
      await queryRunner.release();
    }
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.findByEmail(username);
    if (user && (await user.verifyPassword(pass))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  public getCookieWithJwtToken(payload: { id: string; email: string }): string {
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`;
  }

  public getCookieForLogOut(): string {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  findOne(id: string): Promise<User> | undefined {
    return this.usersRepository.findOne(id);
  }

  findByEmail(email: string): Promise<User> | undefined {
    return this.usersRepository.findOne({ email: email });
  }
}
