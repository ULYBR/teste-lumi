import Fastify from 'fastify';
import { FaturaController } from '../src/infra/controllers/FaturaController';
import { FaturaService } from '../src/application/use-cases/FaturaService';
import { PrismaFaturaRepository } from '../src/infra/database/PrismaFaturaRepository';
import { parsePdf } from '../src/infra/pdf/parsePdf';

jest.mock('../src/infra/pdf/parsePdf');


jest.mock('../src/infra/database/PrismaFaturaRepository', () => {
  return {
    PrismaFaturaRepository: jest.fn().mockImplementation(() => ({
      createFatura: jest.fn().mockResolvedValue({
        numCliente: '12345',
        mesReferencia: 'JAN/2024',
        energiaEletricaKwh: 500,
        energiaSceeeKwh: 50,
        energiaCompensadaGdi: 10,
        valorTotal: 100,
        valorEconomiaGd: 20,
        contribuicaoIlum: 5
      })
    }))
  };
});

const faturaRepository = new PrismaFaturaRepository();
const faturaService = new FaturaService(faturaRepository);
const faturaController = new FaturaController(faturaService);

const fastify = Fastify();


(parsePdf as jest.Mock).mockResolvedValue({
  numCliente: '12345',
  mesReferencia: 'JAN/2024',
  energiaEletricaKwh: 500,
  energiaSceeeKwh: 50,
  energiaCompensadaGdi: 10,
  valorTotal: 100,
  valorEconomiaGd: 20,
  contribuicaoIlum: 5
});

fastify.post('/faturas/upload', faturaController.uploadFatura.bind(faturaController));

describe('API de Faturas', () => {
  it('deve retornar 201 ao fazer upload de uma fatura', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/faturas/upload',
      payload: {
        buffer: Buffer.from('mocked pdf buffer'),
      },
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toEqual({
      numCliente: '12345',
      mesReferencia: 'JAN/2024',
      energiaEletricaKwh: 500,
      energiaSceeeKwh: 50,
      energiaCompensadaGdi: 10,
      valorTotal: 100,
      valorEconomiaGd: 20,
      contribuicaoIlum: 5
    });
  });
});
