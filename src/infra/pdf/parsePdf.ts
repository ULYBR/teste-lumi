import pdfParse from 'pdf-parse';
import { Fatura } from '../../domain/entities/Fatura';

/**
 * Função que processa o buffer do PDF, extrai o texto e mapeia os dados.
 */
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

/**
 * Função responsável por extrair dados do texto do PDF utilizando expressões regulares.
 */
function extractDataFromText(pdfText: string) {
  const numClienteMatch = pdfText.match(/N[ºo]? DO CLIENTE\s*(\d+)/i);
  const mesReferenciaMatch = pdfText.match(/Referente a\s*(\w+\/\d+)/i);
  const energiaEletricaKwhMatch = pdfText.match(/Energia El[e|é]trica.*kWh\s*(\d+)/i);
  const energiaSceeeKwhMatch = pdfText.match(/Energia SCEE.*kWh\s*(\d+)/i);
  const energiaCompensadaGdiMatch = pdfText.match(/Energia compensada GD I.*kWh\s*(\d+)/i);
  const valorTotalMatch = pdfText.match(/Valor a pagar \(R\$\)\s*(\d+,\d+)/i);
  const valorEconomiaGdMatch = pdfText.match(/Economia GD\s*R\$\s*(\d+,\d+)/i);

  return {
    numCliente: numClienteMatch ? numClienteMatch[1] : 'Desconhecido',
    mesReferencia: mesReferenciaMatch ? mesReferenciaMatch[1] : 'Desconhecido',
    energiaEletricaKwh: energiaEletricaKwhMatch ? parseFloat(energiaEletricaKwhMatch[1].replace(',', '.')) : 0,
    energiaSceeeKwh: energiaSceeeKwhMatch ? parseFloat(energiaSceeeKwhMatch[1].replace(',', '.')) : 0,
    energiaCompensadaGdi: energiaCompensadaGdiMatch ? parseFloat(energiaCompensadaGdiMatch[1].replace(',', '.')) : 0,
    valorTotal: valorTotalMatch ? parseFloat(valorTotalMatch[1].replace(',', '.')) : 0,
    valorEconomiaGd: valorEconomiaGdMatch ? parseFloat(valorEconomiaGdMatch[1].replace(',', '.')) : 0,
  };
}
