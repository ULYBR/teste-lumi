import { FaturaRepository } from "../repositories/FaturaRepository";
import { Fatura, FaturaSchema } from "../../domain/entities/Fatura";
import { ZodError } from "zod";
import { parsePdf } from "../../infra/pdf/parsePdf";

class ValidationError extends Error {
  constructor(public errors: string[]) {
    super("Erro de validação: " + errors.join(", "));
    this.name = "ValidationError";
  }
}

export class FaturaService {
  constructor(private faturaRepository: FaturaRepository) { }
  /**
   * Cria uma nova fatura após validação dos dados.
   * @param data - Dados da fatura a serem validados e criados.
   * @returns Promise<Fatura> - Retorna a fatura criada.
   * @throws ValidationError - Se os dados não forem válidos.
   */
  async createFatura(data: unknown): Promise<Fatura> {
    try {

      const validatedData = FaturaSchema.parse(data); // Valida usando Zod
      return await this.faturaRepository.createFatura(validatedData); // Salva no repositório
    } catch (e) {
      if (e instanceof ZodError) {
        throw new ValidationError(e.errors.map(err => err.message));
      }
      throw e;
    }
  }

  /**
   * Faz o upload do PDF, extrai os dados e cria uma nova fatura após validação.
   * @param buffer - Buffer do PDF a ser processado.
   * @returns Promise<Fatura> - Retorna a fatura criada.
   * @throws ValidationError - Se os dados extraídos não forem válidos.
   */
  async uploadFaturas(files: Buffer[]): Promise<Fatura[]> {
    const faturasCriadas: Fatura[] = [];  // Lista para armazenar as faturas criadas.

    // Itera sobre cada arquivo (file) da lista de arquivos.
    for (const file of files) {
      try {

        const parsedData = await parsePdf(file);



        const validatedData = FaturaSchema.parse(parsedData);


        const novaFatura = await this.faturaRepository.createFatura(validatedData);


        faturasCriadas.push(novaFatura);

      } catch (e) {

        if (e instanceof ValidationError) {
          console.error("Erro de validação ao processar o arquivo:", e.errors);
        } else {
          console.error("Erro ao processar o arquivo PDF:", e);
        }
      }
    }

    // Retorna a lista de faturas criadas (não existentes previamente no banco).
    return faturasCriadas;
  }

  /**
   * Obtém faturas de um cliente específico.
   * @param numCliente - Número do cliente para buscar as faturas.
   * @returns Promise<Fatura[]> - Retorna uma lista de faturas do cliente.
   */
  async getFaturasByCliente(numCliente: string): Promise<Fatura[]> {
    try {
      const faturas = await this.faturaRepository.getFaturaByCliente(numCliente);

      if (!faturas || faturas.length === 0) {
        console.warn(`Nenhuma fatura encontrada para o cliente ${numCliente}`);
        return [];  // Retorna uma lista vazia se não encontrar faturas.
      }

      return faturas;
    } catch (error) {
      console.error(`Erro ao buscar faturas para o cliente ${numCliente}:`, error);
      throw error;
    }
  }

  /**
   * Obtém faturas de um mês específico.
   * @param mesReferencia - Mês de referência para buscar as faturas.
   * @returns Promise<Fatura[]> - Retorna uma lista de faturas do mês.
   */
  async getFaturasByMes(mesReferencia: string): Promise<Fatura[]> {
    return await this.faturaRepository.getFaturaByMes(mesReferencia);
  }
}
