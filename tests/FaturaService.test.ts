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
  const fatura: Fatura = {
    numCliente: '1234567890',
    mesReferencia: 'ABR/2024',
    energiaEletricaKwh: 500,
    energiaSceeeKwh: 50,
    energiaCompensadaGdi: 10,
    valorTotal: 100,
    valorEconomiaGd: 20,
    contribuicaoIlum: 5,
  };

  it('deve criar e validar uma fatura corretamente', async () => {
    // Simula o comportamento do repositório e o retorno da fatura mockada
    faturaRepository.createFatura.mockResolvedValue(fatura);

    // Chama o método createFatura do serviço
    const result = await faturaService.createFatura(fatura);

    // Verifica se o resultado é igual à fatura mockada
    expect(result).toEqual(fatura);
    expect(faturaRepository.createFatura).toHaveBeenCalledWith(fatura);
  });

  it('deve fazer upload de um PDF e criar uma fatura corretamente', async () => {
    const pdfBuffer = Buffer.from('mocked pdf buffer');
    const parsedFatura = { ...fatura };

    // Mock do parsePdf para retornar dados da fatura extraídos do PDF
    (parsePdf as jest.Mock).mockResolvedValue(parsedFatura);
    faturaRepository.createFatura.mockResolvedValue(fatura);

    // Chama o serviço de upload de fatura
    const result = await faturaService.uploadFatura(pdfBuffer);

    // Verifica se a fatura foi criada corretamente a partir do PDF
    expect(result).toEqual(fatura);
    expect(parsePdf).toHaveBeenCalledWith(pdfBuffer);
    expect(faturaRepository.createFatura).toHaveBeenCalledWith(parsedFatura);
  });

  it('deve buscar faturas de um cliente específico', async () => {
    const numCliente = '1234567890';
    const faturasMock = [fatura, fatura];

    // Mock do repositório para retornar uma lista de faturas
    faturaRepository.getFaturaByCliente.mockResolvedValue(faturasMock);

    // Chama o método getFaturaByCliente do serviço
    const result = await faturaService.getFaturaByCliente(numCliente);

    // Verifica se o resultado é uma lista de faturas
    expect(result).toEqual(faturasMock);
    expect(faturaRepository.getFaturaByCliente).toHaveBeenCalledWith(numCliente);
  });

  it('deve buscar faturas de um mês específico', async () => {
    const mesReferencia = 'ABR/2024';
    const faturasMock = [fatura, fatura];

    // Mock do repositório para retornar uma lista de faturas
    faturaRepository.getFaturaByMes.mockResolvedValue(faturasMock);

    // Chama o método getFaturaByMes do serviço
    const result = await faturaService.getFaturaByMes(mesReferencia);

    // Verifica se o resultado é uma lista de faturas
    expect(result).toEqual(faturasMock);
    expect(faturaRepository.getFaturaByMes).toHaveBeenCalledWith(mesReferencia);
  });

});
