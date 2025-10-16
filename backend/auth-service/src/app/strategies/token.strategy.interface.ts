import { JwtPayload } from '../interfaces/jwt-payload.interface';

export interface ITokenStrategy {
  sign(payload: JwtPayload): string;
  verify(token: string): JwtPayload;
}