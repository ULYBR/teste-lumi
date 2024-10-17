import Fastify from 'fastify';
import {FastifyReply, FastifyRequest } from 'fastify';

import { PrismaFaturaRepository } from './infra/database/PrismaFaturaRepository';
import { FaturaService } from './application/use-cases/FaturaService';
import { FaturaController } from './infra/controllers/FaturaController';
import swagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { swaggerOptions, swaggerUiOptions } from './infra/config/swaggerConfig';

const fastify = Fastify({ logger: true });
const faturaRepository = new PrismaFaturaRepository();
const faturaService = new FaturaService(faturaRepository);
const faturaController = new FaturaController(faturaService);


fastify.register(swagger, swaggerOptions);
fastify.register(fastifySwaggerUi, swaggerUiOptions);

// Rota para upload de faturas
fastify.post('/faturas/upload', {
  schema: {
    description: 'Faz o upload de uma fatura de energia elétrica via PDF',
    tags: ['Fatura'],
    response: {
      200: {
        description: 'Fatura criada com sucesso',
        type: 'object',
        properties: {
          id: { type: 'number' },
          numCliente: { type: 'string' },
          mesReferencia: { type: 'string' },
          energiaEletricaKwh: { type: 'number' },
          energiaSceeeKwh: { type: 'number' },
          energiaCompensadaGdi: { type: 'number' },
          valorTotal: { type: 'number' },
          valorEconomiaGd: { type: 'number' },
        },
      },
    },
  },
}, faturaController.uploadFatura.bind(faturaController));

// Rota para obter faturas por cliente
fastify.get('/faturas/cliente/:numCliente', {
  schema: {
    description: 'Obtém as faturas de um cliente específico',
    tags: ['Fatura'],
    params: {
      type: 'object',
      properties: {
        numCliente: { type: 'string' },
      },
      required: ['numCliente'],
    },
    response: {
      200: {
        description: 'Lista de faturas do cliente',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            numCliente: { type: 'string' },
            mesReferencia: { type: 'string' },
            energiaEletricaKwh: { type: 'number' },
            energiaSceeeKwh: { type: 'number' },
            energiaCompensadaGdi: { type: 'number' },
            valorTotal: { type: 'number' },
            valorEconomiaGd: { type: 'number' },
          },
        },
      },
    },
  },
}, faturaController.getFaturasByCliente.bind(faturaController));

// Rota para obter faturas por mês
fastify.get('/faturas/mes/:mesReferencia', {
  schema: {
    description: 'Obtém as faturas de um mês específico',
    tags: ['Fatura'],
    params: {
      type: 'object',
      properties: {
        mesReferencia: { type: 'string' },
      },
      required: ['mesReferencia'],
    },
    response: {
      200: {
        description: 'Lista de faturas para o mês solicitado',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            numCliente: { type: 'string' },
            mesReferencia: { type: 'string' },
            energiaEletricaKwh: { type: 'number' },
            energiaSceeeKwh: { type: 'number' },
            energiaCompensadaGdi: { type: 'number' },
            valorTotal: { type: 'number' },
            valorEconomiaGd: { type: 'number' },
          },
        },
      },
    },
  },
}, faturaController.getFaturasByMes.bind(faturaController));

// Iniciando o servidor
fastify.listen({ port: 3000 }, (err: Error | null, address: string) => {
  if (err) throw err;
  fastify.log.info(`Servidor rodando em ${address}`);
});
