import Fastify, { FastifyInstance } from 'fastify';
import multipart from '@fastify/multipart';
import { FaturaController } from '../src/infra/controllers/FaturaController';
import { FaturaService } from '../src/application/use-cases/FaturaService';
import { PrismaFaturaRepository } from '../src/infra/database/PrismaFaturaRepository';
import FormData from 'form-data';

jest.mock('../src/infra/database/PrismaFaturaRepository');
jest.mock('../src/application/use-cases/FaturaService');

describe('Fatura API Endpoints', () => {
  let fastify: FastifyInstance;

  const mockFaturas = [
    {
      numInstalacao: '3001116735',
      numCliente: '1234567890',
      mesReferencia: 'ABR/2024',
      energiaEletricaKwh: 500,
      energiaEletricaValor: 50,
      energiaSceeeKwh: 50,
      energiascceeeValor: 5,
      energiaCompensadaGdi: 10,
      valorTotal: 100,
      valorEconomiaGd: 20,
      contribuicaoIlum: 5,
    },
    {
      numInstalacao: '3001116736',
      numCliente: '9876543210',
      mesReferencia: 'MAI/2024',
      energiaEletricaKwh: 600,
      energiaEletricaValor: 60,
      energiaSceeeKwh: 50,
      energiascceeeValor: 6,
      energiaCompensadaGdi: 15,
      valorTotal: 120,
      valorEconomiaGd: 25,
      contribuicaoIlum: 6,
    }
  ];

  beforeAll(async () => {
    fastify = Fastify();
    fastify.register(multipart);

    const faturaRepository = new PrismaFaturaRepository();
    const faturaService = new FaturaService(faturaRepository);
    const faturaController = new FaturaController(faturaService);

    // Mocking methods for the tests
    (faturaRepository.createFatura as jest.Mock).mockResolvedValue(mockFaturas[0]);
    (faturaRepository.getFaturaByCliente as jest.Mock).mockResolvedValue([mockFaturas[0]]);
    (faturaRepository.getFaturaByMes as jest.Mock).mockResolvedValue([mockFaturas[1]]);

    fastify.get('/faturas/cliente/:numCliente', faturaController.getFaturasByCliente.bind(faturaController));
    fastify.post('/faturas/upload', faturaController.uploadFaturas.bind(faturaController));
    fastify.get('/faturas/mes/:mesReferencia', faturaController.getFaturasByMes.bind(faturaController));

    await fastify.ready();
  });

  afterAll(() => {
    fastify.close();
  });

  // Teste para a rota de upload de fatura
  it('deve fazer upload de uma fatura e retornar status 201', async () => {  // Alterado para 201
    const form = new FormData();
    const mockFile = Buffer.from('mocked pdf content');
    form.append('file', mockFile, { filename: 'fatura.pdf', contentType: 'application/pdf' });

    const response = await fastify.inject({
      method: 'POST',
      url: '/faturas/upload',
      payload: form,
      headers: form.getHeaders(),
    });

    expect(response.statusCode).toBe(201);  // Alterado para 201
    expect(JSON.parse(response.body)).toEqual(mockFaturas);
  });

  // Teste para buscar faturas por cliente
  it('deve buscar faturas por cliente e retornar status 200', async () => {
    const numCliente = '1234567890';

    const response = await fastify.inject({
      method: 'GET',
      url: `/faturas/cliente/${numCliente}`,
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual([mockFaturas[0]]);
  });

  // Teste para buscar faturas por mês
  it('deve buscar faturas por mês e retornar status 200', async () => {
    const mesReferencia = 'JAN/2024';

    const response = await fastify.inject({
      method: 'GET',
      url: `/faturas/mes?mesReferencia=${mesReferencia}`,  // Usando query string
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual([mockFaturas[0]]);
  });
});
