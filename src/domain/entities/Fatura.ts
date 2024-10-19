import { z } from "zod";

export const FaturaSchema = z.object({
  numCliente: z.string().min(10, "Número de cliente inválido"),
  numInstalacao: z.string().min(10, "Número de instalação inválido"),
  mesReferencia: z.string().regex(/^\w{3}\/\d{4}$/, "Formato de mês inválido (MMM/YYYY)"),
  energiaEletricaKwh: z.number(),   // Agora é z.number() para permitir valores decimais (Float)
  energiaEletricaValor: z.number(),
  energiaSceeeKwh: z.number(),
  energiaSceeeValor: z.number(),
  energiaCompensadaGdi: z.number(),
  valorTotal: z.number().positive(), // Mantém-se positivo, pois valores totais não podem ser negativos
  valorEconomiaGd: z.number(),  // Permite valores negativos e positivos
  contribuicaoIlum: z.number(),
  createdAt: z.date().optional(), // Criação da data opcional, pois o Prisma define com default (now)
});

export type Fatura = z.infer<typeof FaturaSchema>;
