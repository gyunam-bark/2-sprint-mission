import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async createUser(
    email: string,
    hashedPassword: string,
    role: UserRole = UserRole.USER,
  ): Promise<User> {
    const user = this.usersRepo.create({
      email,
      password: hashedPassword,
      role,
    });
    return this.usersRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async deleteUser(id: number): Promise<void> {
    await this.usersRepo.delete(id);
  }
}
