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
    fastify.post('/faturas/upload', faturaController.uploadFaturas.bind(faturaController));
    fastify.get('/faturas/mes/:mesReferencia', faturaController.getFaturasByMes.bind(faturaController));

    const port = Number(process.env.PORT) || 3000;
    const host = '0.0.0.0';

    fastify.listen({ port, host }, (err, address) => {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
      fastify.log.info(`Server listening at ${address}`);
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

buildServer();
