import { z } from "zod";

export const FaturaSchema = z.object({
  numCliente: z.string().min(5, "Número de cliente inválido"),
  mesReferencia: z.string().regex(/^\w{3}\/\d{4}$/, "Formato de mês inválido (MMM/YYYY)"),
  energiaEletricaKwh: z.number().positive(),
  energiaSceeeKwh: z.number().positive(),
  energiaCompensadaGdi: z.number().nonnegative(),
  valorTotal: z.number().positive(),
  valorEconomiaGd: z.number(),
  contribuicaoIlum: z.number().nonnegative(),
});

export type Fatura = z.infer<typeof FaturaSchema>;
