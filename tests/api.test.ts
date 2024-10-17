import Fastify from 'fastify';
import { FaturaController } from '../src/infra/controllers/FaturaController';
import { FaturaService } from '../src/application/use-cases/FaturaService';
import { PrismaFaturaRepository } from '../src/infra/database/PrismaFaturaRepository';

const faturaRepository = new PrismaFaturaRepository();
const faturaService = new FaturaService(faturaRepository);
const faturaController = new FaturaController(faturaService);

const fastify = Fastify();

fastify.post('/faturas/upload', faturaController.uploadFatura.bind(faturaController));

describe('API de Faturas', () => {
  it('deve retornar 200 ao fazer upload de uma fatura', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/faturas/upload',
      payload: {
        buffer: Buffer.from('mocked pdf buffer'),
      },
    });

    expect(response.statusCode).toBe(200);
  });
});
