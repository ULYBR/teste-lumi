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
      // Logando informações do arquivo
      console.log('Tipo de arquivo:', data.mimetype);  // Tipo de arquivo
      console.log('Nome do arquivo:', data.filename);  // Nome do arquivo
      console.log('Tamanho do arquivo:', data.file.bytesRead);
      const buffer = await data.toBuffer(); // Converte o stream em buffer
      const createdFatura = await this.faturaService.uploadFatura(buffer); // Passa o buffer para o service
      return reply.status(201).send(createdFatura);
    } catch (error) {
      console.error('Erro ao processar a fatura:', error);
      return reply.status(500).send({ error: 'Erro ao processar a fatura' });
    }
  }

  // Controller para obter faturas por cliente
  async getFaturasByCliente(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { numCliente } = req.params as { numCliente: string };
      if (!numCliente) {
        return reply.status(400).send({ error: 'Número do cliente não informado' });
      }

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

  // Controller para obter faturas por mês
  async getFaturasByMes(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { mesReferencia } = req.params as { mesReferencia: string };
      if (!mesReferencia) {
        return reply.status(400).send({ error: 'Mês de referência não informado' });
      }

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
