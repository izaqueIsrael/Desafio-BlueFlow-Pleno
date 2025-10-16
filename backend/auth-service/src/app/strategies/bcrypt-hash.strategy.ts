import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IHashStrategy } from './hash.strategy.interface';

@Injectable()
export class BcryptHashStrategy implements IHashStrategy {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    if (!password) {
      throw new Error('Password is required for hashing');
    }
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) {
      throw new Error('Password and hash are required for comparison');
    }
    return bcrypt.compare(password, hash);
  }
}