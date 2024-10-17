import { z } from "zod";

export const FaturaSchema = z.object({
  numCliente: z.string().min(5, "Número de cliente inválido"),
  mesReferencia: z.string().regex(/^\w{3}\/\d{4}$/, "Formato de mês inválido (MMM/YYYY)"), // Ajuste para aceitar "JAN/2024"
  energiaEletricaKwh: z.number().positive(),
  energiaSceeeKwh: z.number().positive(),
  energiaCompensadaGdi: z.number().nonnegative(),
  valorTotal: z.number().positive(),
  valorEconomiaGd: z.number().nonnegative(),
  contribuicaoIlum: z.number().nonnegative(), // Adicionando a propriedade aqui
});

export type Fatura = z.infer<typeof FaturaSchema>;
