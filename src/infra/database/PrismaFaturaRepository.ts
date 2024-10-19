import prisma from '../../../database/prisma';
import { Fatura } from '../../domain/entities/Fatura';
import { FaturaRepository } from '../../application/repositories/FaturaRepository';

export class PrismaFaturaRepository implements FaturaRepository {
  async createFatura(fatura: Fatura): Promise<Fatura> {

    if (!fatura.numCliente || !fatura.mesReferencia || !fatura.energiaEletricaKwh || !fatura.valorTotal || fatura.contribuicaoIlum === undefined) {
      throw new Error('Os campos obrigatórios não estão presentes.');
    }

    return await prisma.fatura.create({
      data: {
        numCliente: fatura.numCliente,
        numInstalacao: fatura.numInstalacao,
        mesReferencia: fatura.mesReferencia,
        energiaEletricaKwh: fatura.energiaEletricaKwh,
        energiaEletricaValor: fatura.energiaEletricaValor,
        energiaSceeeKwh: fatura.energiaSceeeKwh || 0,
        energiaSceeeValor: fatura.energiaSceeeValor,
        energiaCompensadaGdi: fatura.energiaCompensadaGdi || 0,
        valorTotal: fatura.valorTotal,
        valorEconomiaGd: fatura.valorEconomiaGd || 0,
        contribuicaoIlum: fatura.contribuicaoIlum || 0,
      },
    });
  }

  async updateFatura(id: number, data: Fatura): Promise<Fatura | null> {
    return await prisma.fatura.update({
      where: { id },
      data,
    });
  }

  async findFaturaByClienteAndMes(numCliente: string, mesReferencia: string): Promise<Fatura | null> {
    return await prisma.fatura.findFirst({
      where: {
        numInstalacao: numCliente,
        mesReferencia: mesReferencia,
      },
    });
  }

  async getFaturaByCliente(numCliente: string): Promise<Fatura[]> {


    const faturas = await prisma.fatura.findMany({
      where: { numCliente }

    });

    return faturas;
  }

  async getFaturaByMes(mesReferencia: string): Promise<Fatura[]> {


    const faturas = await prisma.fatura.findMany({
      where: { mesReferencia }
    });

    return faturas;
  }
}
