import { User } from '../../domain/entities/user.entity';

export interface IUserRepository {
  create(email: string, password: string, name: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}