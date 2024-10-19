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
    expect(fatura.numInstalacao).toBe('3001422762');
    expect(fatura.numCliente).toBe('7202210726');
    expect(fatura.mesReferencia).toBe('FEV/2024');
    expect(fatura.energiaEletricaKwh).toBe(100);
    expect(fatura.energiaSceeeKwh).toBe(1940);
    expect(fatura.energiaSceeeValor).toBe(994.96);
    expect(fatura.energiaCompensadaGdi).toBe(1940);
    expect(fatura.contribuicaoIlum).toBe(40.45);
    expect(fatura.valorTotal).toBe(186.11);
    expect(fatura.valorEconomiaGd).toBe(-945.42);
});
});
