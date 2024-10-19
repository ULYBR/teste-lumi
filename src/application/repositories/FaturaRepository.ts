import { Fatura } from "../../domain/entities/Fatura";

export interface FaturaRepository {
  createFatura(fatura: Fatura): Promise<Fatura>;
  findFaturaByClienteAndMes(numCliente: string, mesReferencia: string): Promise<Fatura | null>;
  getFaturaByCliente(numCliente: string): Promise<Fatura[]>;
  getFaturaByMes(mesReferencia: string): Promise<Fatura[]>;
}
