import { FaturaService } from '../src/application/use-cases/FaturaService';
import { PrismaFaturaRepository } from '../src/infra/database/PrismaFaturaRepository';
import { Fatura } from '../src/domain/entities/Fatura';
import { parsePdf } from '../src/infra/pdf/parsePdf';

jest.mock('../src/infra/database/PrismaFaturaRepository');
jest.mock('../src/infra/pdf/parsePdf');

const faturaRepository = new PrismaFaturaRepository() as jest.Mocked<PrismaFaturaRepository>;
const faturaService = new FaturaService(faturaRepository);

describe('FaturaService', () => {

  // Mock de dados válidos para uma fatura
  const faturas: Fatura[] = [
    {
      numInstalacao: '3001116735',
      numCliente: '1234567890',
      mesReferencia: 'ABR/2024',
      energiaEletricaKwh: 500,
      energiaEletricaValor: 250.50,
      energiaSceeeKwh: 50,
      energiaSceeeValor: 125.50,
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
      energiaEletricaValor: 250.70,
      energiaSceeeKwh: 60,
      energiaSceeeValor: 128.50,
      energiaCompensadaGdi: 15,
      valorTotal: 120,
      valorEconomiaGd: 25,
      contribuicaoIlum: 6,
    }
  ];

  it('deve criar e validar uma fatura corretamente', async () => {
    // Simula o comportamento do repositório e o retorno da fatura mockada
    faturaRepository.createFatura.mockResolvedValue(faturas[0]);

    // Chama o método createFatura do serviço
    const result = await faturaService.createFatura(faturas[0]);

    // Verifica se o resultado é igual à fatura mockada
    expect(result).toEqual(faturas[0]);
    expect(faturaRepository.createFatura).toHaveBeenCalledWith(faturas[0]);
  });

  it('deve fazer upload de um PDF e criar uma fatura corretamente', async () => {
    const pdfBuffer = Buffer.from('mocked pdf buffer');
    const parsedFatura = faturas[1]; // Simula o retorno da segunda fatura

    // Mock do parsePdf para retornar dados da fatura extraídos do PDF
    (parsePdf as jest.Mock).mockResolvedValue(parsedFatura);
    faturaRepository.createFatura.mockResolvedValue(parsedFatura);

    // Chama o serviço de upload de fatura
    const result = await faturaService.uploadFaturas([pdfBuffer]);

    // Verifica se a fatura foi criada corretamente a partir do PDF
    expect(result).toEqual([parsedFatura]);
    expect(parsePdf).toHaveBeenCalledWith(pdfBuffer);
    expect(faturaRepository.createFatura).toHaveBeenCalledWith(parsedFatura);
  });
});
