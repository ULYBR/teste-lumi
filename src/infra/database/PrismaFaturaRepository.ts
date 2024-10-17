import { PrismaClient } from '@prisma/client';
import { Fatura } from '../../domain/entities/Fatura';
import { FaturaRepository } from '../../application/repositories/FaturaRepository';

const prisma = new PrismaClient();

export class PrismaFaturaRepository implements FaturaRepository {
  async createFatura(fatura: Fatura): Promise<Fatura> {
    return await prisma.fatura.create({
      data: fatura,
    });
  }

  async getFaturaByCliente(numCliente: string): Promise<Fatura[]> {
    return await prisma.fatura.findMany({
      where: { numCliente },
    });
  }

  async getFaturaByMes(mesReferencia: string): Promise<Fatura[]> {
    return await prisma.fatura.findMany({
      where: { mesReferencia },
    });
  }
}
