import { FaturaRepository } from "../repositories/FaturaRepository";
import { Fatura, FaturaSchema } from "../../domain/entities/Fatura";
import { ZodError } from "zod";

class ValidationError extends Error {
  constructor(public errors: string[]) {
    super("Erro de validação: " + errors.join(", "));
    this.name = "ValidationError"; // Define o nome do erro para facilitar a identificação
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
      // Valida os dados da fatura usando o Zod
      const validatedData = FaturaSchema.parse(data);

      // Cria a fatura no repositório
      return await this.faturaRepository.createFatura(validatedData);
    } catch (e) {
      if (e instanceof ZodError) {
        // Lança um erro de validação se os dados não forem válidos
        throw new ValidationError(e.errors.map(err => err.message));
      }
      // Lança qualquer outro erro que ocorrer
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
