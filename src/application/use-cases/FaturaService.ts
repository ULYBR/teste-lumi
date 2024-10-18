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
  async uploadFatura(buffer: Buffer): Promise<Fatura> {
    try {

      const parsedData = await parsePdf(buffer);

      console.log('Dados extraídos do PDF:', parsedData);


      const validatedData = FaturaSchema.parse(parsedData);

      return await this.faturaRepository.createFatura(validatedData);
    } catch (e) {
      if (e instanceof ZodError) {
        console.error("Erro de validação:", e.errors);
        throw new ValidationError(e.errors.map(err => err.message));
      }
      console.error("Erro ao processar o PDF:", e);
      throw e;
    }
  }

  /**
   * Obtém faturas de um cliente específico.
   * @param numCliente - Número do cliente para buscar as faturas.
   * @returns Promise<Fatura[]> - Retorna uma lista de faturas do cliente.
   */
  async getFaturaByCliente(numCliente: string): Promise<Fatura[]> {
    return await this.faturaRepository.getFaturaByCliente(numCliente);
  }

  /**
   * Obtém faturas de um mês específico.
   * @param mesReferencia - Mês de referência para buscar as faturas.
   * @returns Promise<Fatura[]> - Retorna uma lista de faturas do mês.
   */
  async getFaturaByMes(mesReferencia: string): Promise<Fatura[]> {
    return await this.faturaRepository.getFaturaByMes(mesReferencia);
  }
}
