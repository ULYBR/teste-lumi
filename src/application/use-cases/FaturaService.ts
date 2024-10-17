import { FaturaRepository } from "../repositories/FaturaRepository";
import { Fatura, FaturaSchema } from "../../domain/entities/Fatura";
import { ZodError } from "zod";

export class FaturaService {
  constructor(private faturaRepository: FaturaRepository) { }

  async createFatura(data: any): Promise<Fatura> {
    try {
      const validatedData = FaturaSchema.parse(data);
      return this.faturaRepository.createFatura(validatedData);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new Error("Erro de validação: " + e.errors.map(err => err.message).join(", "));
      }
      throw e;
    }
  }

  async getFaturaByCliente(numCliente: string): Promise<Fatura[]> {
    return this.faturaRepository.getFaturaByCliente(numCliente);
  }

  async getFaturaByMes(mesReferencia: string): Promise<Fatura[]> {
    return this.faturaRepository.getFaturaByMes(mesReferencia);
  }
}
