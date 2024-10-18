import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import { FaturaController } from './infra/controllers/FaturaController';
import { PrismaFaturaRepository } from './infra/database/PrismaFaturaRepository';
import { FaturaService } from './application/use-cases/FaturaService';

async function buildServer() {
  const fastify = Fastify({ logger: true });

  try {
    fastify.register(multipart);

    const faturaRepository = new PrismaFaturaRepository();
    const faturaService = new FaturaService(faturaRepository);
    const faturaController = new FaturaController(faturaService);

    fastify.get('/faturas/cliente/:numCliente', faturaController.getFaturasByCliente.bind(faturaController));
    fastify.post('/faturas/upload', faturaController.uploadFatura.bind(faturaController));
    fastify.get('/faturas/mes/:mesReferencia', faturaController.getFaturasByMes.bind(faturaController));


    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server running at http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

buildServer();
