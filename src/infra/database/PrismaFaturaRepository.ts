import  prisma  from '../../../database/prisma';
import { Fatura } from '../../domain/entities/Fatura';
import { FaturaRepository } from '../../application/repositories/FaturaRepository';

export class PrismaFaturaRepository implements FaturaRepository {
  async createFatura(fatura: Fatura): Promise<Fatura> {

    if (!fatura.numCliente || !fatura.mesReferencia || !fatura.energiaEletricaKwh || !fatura.valorTotal) {
      throw new Error('Os campos obrigatórios não estão presentes.');
    }

    return await prisma.fatura.create({
      data: {
        numCliente: fatura.numCliente,
        mesReferencia: fatura.mesReferencia,
        energiaEletricaKwh: fatura.energiaEletricaKwh,
        energiaSceeeKwh: fatura.energiaSceeeKwh || 0,
        energiaCompensadaGdi: fatura.energiaCompensadaGdi || 0,
        valorTotal: fatura.valorTotal,
        valorEconomiaGd: fatura.valorEconomiaGd || 0
      },
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
