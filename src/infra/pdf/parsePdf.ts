import pdfParse from 'pdf-parse';
import { Fatura } from '../../domain/entities/Fatura';

export async function parsePdf(pdfBuffer: Buffer): Promise<Fatura> {
  const pdfData = await pdfParse(pdfBuffer);
  const extractedData = extractDataFromText(pdfData.text);


  return {
    numCliente: extractedData.numCliente,
    mesReferencia: extractedData.mesReferencia,
    energiaEletricaKwh: extractedData.energiaEletricaKwh,
    energiaSceeeKwh: extractedData.energiaSceeeKwh,
    energiaCompensadaGdi: extractedData.energiaCompensadaGdi,
    valorTotal: extractedData.valorTotal,
    valorEconomiaGd: extractedData.valorEconomiaGd,
  };
}

function extractDataFromText(pdfText: string) {
  const numClienteMatch = pdfText.match(/Nº DO CLIENTE:\s*(\d+)/);
  const mesReferenciaMatch = pdfText.match(/Mês de referência:\s*(\w+\/\d+)/);
  const energiaEletricaKwhMatch = pdfText.match(/Energia Elétrica:\s*([\d,\.]+)\s*kWh/);
  const energiaSceeeKwhMatch = pdfText.match(/Energia SCEEE:\s*([\d,\.]+)\s*kWh/);
  const energiaCompensadaGdiMatch = pdfText.match(/Energia Compensada GD I:\s*([\d,\.]+)\s*kWh/);
  const valorTotalMatch = pdfText.match(/Valor Total:\s*R\$\s*([\d,\.]+)/);
  const valorEconomiaGdMatch = pdfText.match(/Economia GD:\s*R\$\s*([\d,\.]+)/);

  return {
    numCliente: numClienteMatch ? numClienteMatch[1] : 'Desconhecido',
    mesReferencia: mesReferenciaMatch ? mesReferenciaMatch[1] : 'Desconhecido',
    energiaEletricaKwh: energiaEletricaKwhMatch ? parseFloat(energiaEletricaKwhMatch[1].replace(',', '.')) : 0,
    energiaSceeeKwh: energiaSceeeKwhMatch ? parseFloat(energiaSceeeKwhMatch[1].replace(',', '.')) : 0,
    energiaCompensadaGdi: energiaCompensadaGdiMatch ? parseFloat(energiaCompensadaGdiMatch[1].replace(',', '.')) : 0,
    valorTotal: valorTotalMatch ? parseFloat(valorTotalMatch[1].replace(',', '.')) : 0,
    valorEconomiaGd: valorEconomiaGdMatch ? parseFloat(valorEconomiaGdMatch[1].replace(',', '.')) : 0
  };
}
