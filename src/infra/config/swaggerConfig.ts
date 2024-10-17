import swagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { FastifyPluginOptions } from 'fastify';

// Configuração do Swagger
export const swaggerOptions: FastifyPluginOptions = {
  // Aqui não usamos 'mode' ou 'options', apenas as configurações do swagger
  openapi: {
    info: {
      title: 'API de Faturas',
      description: 'Documentação da API para o gerenciamento de faturas de energia elétrica',
      version: '1.0.0',
    },
    // Outras configurações OpenAPI podem ser adicionadas aqui
  },
};

export const swaggerUiOptions = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  staticCSP: true,
};
