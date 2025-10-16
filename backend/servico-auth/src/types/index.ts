export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senhaCriptografada: string;
  criadoEm: Date;
}

export interface RequisicaoRegistro {
  nome: string;
  email: string;
  senha: string;
}

export interface RequisicaoLogin {
  email: string;
  senha: string;
}

export interface CargaToken {
  id: string;
  email: string;
}

export interface RespostaAPI<T = any> {
  sucesso: boolean;
  dados?: T;
  erro?: string;
  codigo?: number;
}