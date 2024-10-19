import { FastifyReply, FastifyRequest } from 'fastify';
import { FaturaService } from '../../application/use-cases/FaturaService';
import { MultipartFile } from '@fastify/multipart'; // Usando o tipo MultipartFile

export class FaturaController {
  constructor(private faturaService: FaturaService) { }

  // Controller para upload de faturas via PDF
  async uploadFatura(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data: MultipartFile | undefined = await req.file();


      if (!data) {
        return reply.status(400).send({ error: 'Nenhum arquivo foi enviado na requisição' });
      }

      const buffer = await data.toBuffer();
      const createdFatura = await this.faturaService.uploadFaturas([buffer]);
      return reply.status(201).send(createdFatura);
    } catch (error) {
      console.error('Erro ao processar a fatura:', error);
      return reply.status(500).send({ error: 'Erro ao processar a fatura' });
    }
  }
  // Controller para upload de múltiplos arquivos de faturas (se necessário)
  async uploadFaturas(req: FastifyRequest, reply: FastifyReply) {
    try {
      const files = await req.files();
      const faturasCriadas = [];

      for await (const file of files) {
        const buffer = await file.toBuffer();
        const createdFatura = await this.faturaService.uploadFaturas([buffer]);
        faturasCriadas.push(createdFatura);
      }

      return reply.status(201).send(faturasCriadas);
    } catch (error) {
      console.error('Erro ao processar os arquivos de fatura:', error);
      return reply.status(500).send({ error: 'Erro ao processar os arquivos de fatura' });
    }
  }
  // Controller para obter faturas por cliente
  async getFaturasByCliente(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { numCliente } = req.params as { numCliente: string };
      if (!numCliente) {
        return reply.status(400).send({ error: 'Número do cliente não informado' });
      }

      const faturas = await this.faturaService.getFaturasByCliente(numCliente);
      if (!faturas || faturas.length === 0) {
        return reply.status(404).send({ error: 'Nenhuma fatura encontrada para este cliente' });
      }

      return reply.status(200).send(faturas);
    } catch (error) {
      console.error('Erro ao buscar faturas por cliente:', error);
      return reply.status(500).send({ error: 'Erro ao buscar faturas' });
    }
  }

  // Controller para obter faturas por mês
  async getFaturasByMes(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { mesReferencia } = req.query as { mesReferencia: string };

      if (!mesReferencia) {
        return reply.status(400).send({ error: 'Mês de referência não informado' });
      }

      const faturas = await this.faturaService.getFaturasByMes(mesReferencia);
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
