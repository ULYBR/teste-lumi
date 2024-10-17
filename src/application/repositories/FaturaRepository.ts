import { Fatura } from "../../domain/entities/Fatura";

export interface FaturaRepository {
  createFatura(fatura: Fatura): Promise<Fatura>;
  getFaturaByCliente(numCliente: string): Promise<Fatura[]>;
  getFaturaByMes(mesReferencia: string): Promise<Fatura[]>;
}
