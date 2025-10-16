import jwt, { SignOptions } from 'jsonwebtoken';
import { CargaToken } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'w1IGHxaM55afjIOWiL09KdB4iy6hoSOXiX09U/yup0qpTvsYgm54SB93/qNQ2uqsd/Ye4wqFRiTps/dGeKeZUg==';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export class JWT {
  static gerar(carga: CargaToken): string {
    return jwt.sign(carga, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    } as SignOptions);
  }

  static verificar(token: string): CargaToken {
    try {
      return jwt.verify(token, JWT_SECRET) as CargaToken;
    } catch (erro) {
      throw new Error('Token inválido ou expirado');
    }
  }
}