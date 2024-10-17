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
    contribuicaoIlum: extractedData.contribuicaoIlum,
  };
}

/**
 * Função responsável por extrair dados do texto do PDF.
 */
function extractDataFromText(pdfText: string) {
  const normalizedText = normalizeText(pdfText);

  const extractedData = {
    numCliente: 'Desconhecido',
    mesReferencia: 'Desconhecido',
    energiaEletricaKwh: 0,
    energiaEletricaValor: 0,
    energiaSceeeKwh: 0,
    energiaSceeeValor: 0,
    energiaCompensadaGdi: 0,
    valorTotal: 0,
    valorEconomiaGd: 0,
    contribuicaoIlum: 0,
  };

  extractedData.numCliente = extractNumCliente(normalizedText);
  extractedData.mesReferencia = extractMesReferencia(normalizedText);
  const valoresFaturados = extractValoresFaturados(normalizedText);
  extractedData.energiaEletricaKwh = valoresFaturados.energiaEletricaKwh;
  extractedData.energiaEletricaValor = valoresFaturados.energiaEletricaValor;
  extractedData.energiaSceeeKwh = valoresFaturados.energiaSceeeKwh;
  extractedData.energiaSceeeValor = valoresFaturados.energiaSceeeValor;
  extractedData.energiaCompensadaGdi = valoresFaturados.energiaCompensadaGdi;
  extractedData.valorEconomiaGd = valoresFaturados.valorEconomiaGd;
  extractedData.contribuicaoIlum = extractContribuicaoIlum(normalizedText);
  extractedData.valorTotal = extractValorTotal(normalizedText);

  return extractedData;
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function extractNumCliente(pdfText: string): string {

  const match = pdfText.match(/Nº DO CLIENTE\s+Nº DA INSTALAÇÃO\s+(\d{10})/);
  return match ? match[1].trim() : 'Desconhecido';
}

function extractMesReferencia(pdfText: string): string {

  const match = pdfText.match(/Referente a\s+Vencimento\s+Valor a pagar.*([A-Z]{3}\/\d{4})/);
  return match ? match[1].trim() : 'Desconhecido';
}

function extractValoresFaturados(pdfText: string) {
  const valores = {
    energiaEletricaKwh: 0,
    energiaEletricaValor: 0,
    energiaSceeeKwh: 0,
    energiaSceeeValor: 0,
    energiaCompensadaGdi: 0,
    valorEconomiaGd: 0,
  };

  const energiaEletricaMatch = pdfText.match(/Energia Elétrica\s*kWh\s*(\d+)\s+\d+,\d+\s+(\d+,\d+)/);
  if (energiaEletricaMatch) {
    valores.energiaEletricaKwh = parseFloat(energiaEletricaMatch[1]);
    valores.energiaEletricaValor = parseFloat(energiaEletricaMatch[2].replace(',', '.'));
  }

  const energiaSceeeMatch = pdfText.match(/Energia SCEE s\/ ICMS\s*kWh\s*(\d+)\s+\d+,\d+\s+(\d+,\d+)/);
  if (energiaSceeeMatch) {
    valores.energiaSceeeKwh = parseFloat(energiaSceeeMatch[1]);
    valores.energiaSceeeValor = parseFloat(energiaSceeeMatch[2].replace(',', '.'));
  }

  const energiaCompensadaMatch = pdfText.match(/Energia compensada GD I\s*kWh\s*(\d+)\s+\d+,\d+\s+(-?\d+,\d+)/);
  if (energiaCompensadaMatch) {
    valores.energiaCompensadaGdi = parseFloat(energiaCompensadaMatch[1]);
    valores.valorEconomiaGd = parseFloat(energiaCompensadaMatch[2].replace(',', '.'));
  }

  return valores;
}

function extractContribuicaoIlum(pdfText: string): number {
  const match = pdfText.match(/Contrib Ilum Publica Municipal\s+(\d+,\d+)/);
  return match ? parseFloat(match[1].replace(',', '.')) : 0;
}

function extractValorTotal(pdfText: string): number {
  const match = pdfText.match(/TOTAL\s+(\d+,\d+)/);
  return match ? parseFloat(match[1].replace(',', '.')) : 0;
}
