import { FaturaService } from '../src/application/use-cases/FaturaService';
import { PrismaFaturaRepository } from '../src/infra/database/PrismaFaturaRepository';
import { Fatura } from '../src/domain/entities/Fatura';


jest.mock('../src/infra/database/PrismaFaturaRepository');


const faturaRepository = new PrismaFaturaRepository() as jest.Mocked<PrismaFaturaRepository>;
const faturaService = new FaturaService(faturaRepository);

describe('FaturaService', () => {
  it('deve criar e validar uma fatura corretamente', async () => {
    const fatura: Fatura = {
      numCliente: '12345',
      mesReferencia: '04/2024',
      energiaEletricaKwh: 500,
      energiaSceeeKwh: 50,
      energiaCompensadaGdi: 10,
      valorTotal: 100,
      valorEconomiaGd: 20,
    };

   
    faturaRepository.createFatura.mockResolvedValue(fatura);

  
    const result = await faturaService.createFatura(fatura);

    
    expect(result).toEqual(fatura);
  });
});
