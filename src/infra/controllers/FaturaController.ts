import { FastifyReply, FastifyRequest } from 'fastify';
import { FaturaService } from '../../application/use-cases/FaturaService';
import { parsePdf } from '../pdf/parsePdf';
import { FaturaSchema } from '../../domain/entities/Fatura';

export class FaturaController {
  constructor(private faturaService: FaturaService) { }

  async uploadFatura(req: FastifyRequest, reply: FastifyReply) {
    try {

      const { buffer } = req.body as { buffer: Buffer };

      const parsedData = await parsePdf(buffer);


      const validationResult = FaturaSchema.safeParse(parsedData);
      if (!validationResult.success) {
        return reply.status(400).send({
          error: 'Erro de validação',
          detalhes: validationResult.error.errors
        });
      }


      const fatura = validationResult.data;
      const createdFatura = await this.faturaService.createFatura(fatura);
      return reply.status(201).send(createdFatura);
    } catch (error) {
      console.error('Erro ao processar a fatura:', error);
      return reply.status(500).send({ error: 'Erro ao processar a fatura' });
    }
  }

  async getFaturasByCliente(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { numCliente } = req.params as { numCliente: string };

      const faturas = await this.faturaService.getFaturaByCliente(numCliente);
      if (!faturas || faturas.length === 0) {
        return reply.status(404).send({ error: 'Nenhuma fatura encontrada para este cliente' });
      }
      return reply.status(200).send(faturas);
    } catch (error) {
      console.error('Erro ao buscar faturas por cliente:', error);
      return reply.status(500).send({ error: 'Erro ao buscar faturas' });
    }
  }

  async getFaturasByMes(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { mesReferencia } = req.params as { mesReferencia: string };

      const faturas = await this.faturaService.getFaturaByMes(mesReferencia);
      if (!faturas || faturas.length === 0) {
        return reply.status(404).send({ error: 'Nenhuma fatura encontrada para este mês' });
      }
      return reply.status(200).send(faturas);
    } catch (error) {
      console.error('Erro ao buscar faturas por mês:', error);
      return reply.status(500).send({ error: 'Erro ao buscar faturas' });
    }
  }
}
