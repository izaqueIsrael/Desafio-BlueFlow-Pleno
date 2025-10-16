import prisma from "../config/database";

export class UsuarioRepository {
  async criar(email: string, senha: string) {
    return await prisma.usuario.create({
      data: { email, senha }
    });
  }

  async buscarPorEmail(email: string) {
    return await prisma.usuario.findUnique({
      where: { email }
    });
  }

  async buscarPorId(id: number) {
    return await prisma.usuario.findUnique({
      where: { id }
    });
  }
}