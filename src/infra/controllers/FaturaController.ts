import { FastifyReply, FastifyRequest } from 'fastify';
import { FaturaService } from '../../application/use-cases/FaturaService';
import { parsePdf } from '../pdf/parsePdf';
import { FaturaSchema } from '../../domain/entities/Fatura';

export class FaturaController {
  constructor(private faturaService: FaturaService) { }

  async uploadFatura(req: FastifyRequest, reply: FastifyReply) {
    const { buffer } = req.body as { buffer: Buffer };
    const parsedData = await parsePdf(buffer);  

    const validationResult = FaturaSchema.safeParse(parsedData);
    if (!validationResult.success) {
      reply.status(400).send({ error: validationResult.error.errors });
      return;
    }

    const fatura = validationResult.data;
    const createdFatura = await this.faturaService.createFatura(fatura);
    reply.send(createdFatura);
  }

  async getFaturasByCliente(req: FastifyRequest, reply: FastifyReply) {
    const { numCliente } = req.params as { numCliente: string };
    const faturas = await this.faturaService.getFaturaByCliente(numCliente);
    reply.send(faturas);
  }

  async getFaturasByMes(req: FastifyRequest, reply: FastifyReply) {
    const { mesReferencia } = req.params as { mesReferencia: string };
    const faturas = await this.faturaService.getFaturaByMes(mesReferencia);
    reply.send(faturas);
  }
}
