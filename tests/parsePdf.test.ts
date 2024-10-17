import { parsePdf } from '../src/infra/pdf/parsePdf';
import fs from 'fs';
import path from 'path';

describe('parsePdf', () => {
  it('deve extrair corretamente os dados de uma fatura PDF', async () => {
    const pdfBuffer = fs.readFileSync(path.join(__dirname, 'samples', 'fatura_sample.pdf')); // Adicione um exemplo de PDF

    const fatura = await parsePdf(pdfBuffer);

    expect(fatura.numCliente).toBe('12345');
    expect(fatura.mesReferencia).toBe('04/2024');
    expect(fatura.energiaEletricaKwh).toBe(500);
  });
});
