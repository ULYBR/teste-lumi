import { parsePdf } from '../src/infra/pdf/parsePdf';
import fs from 'fs';
import path from 'path';

describe('parsePdf', () => {
  it('deve extrair corretamente os dados de uma fatura PDF', async () => {
    // Lê o arquivo PDF da amostra
    const pdfBuffer = fs.readFileSync(path.join(__dirname, 'samples', 'fatura_sample.pdf'));

    // Chama a função para processar o PDF
    const fatura = await parsePdf(pdfBuffer);

    // Verifica os valores extraídos
    expect(fatura.numCliente).toBe('7204076116');
    expect(fatura.mesReferencia).toBe('JAN/2024');
    expect(fatura.energiaEletricaKwh).toBe(50); // Valor extraído de "Energia Elétrica"
    expect(fatura.energiaSceeeKwh).toBe(456); // Valor extraído de "Energia SCEE"
    expect(fatura.energiaCompensadaGdi).toBe(456); // Valor extraído de "Energia Compensada GD I"
    expect(fatura.contribuicaoIlum).toBe(49.43); // Valor da contribuição
    expect(fatura.valorTotal).toBe(107.38); // Valor total
    expect(fatura.valorEconomiaGd).toBe(-222.22); // Valor da economia
  });
});
