"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaturaSchema = void 0;
const zod_1 = require("zod");
exports.FaturaSchema = zod_1.z.object({
    numCliente: zod_1.z.string().min(10, "Número de cliente inválido"),
    numInstalacao: zod_1.z.string().min(10, "Número de instalação inválido"),
    mesReferencia: zod_1.z.string().regex(/^\w{3}\/\d{4}$/, "Formato de mês inválido (MMM/YYYY)"),
    energiaEletricaKwh: zod_1.z.number(), // Agora é z.number() para permitir valores decimais (Float)
    energiaEletricaValor: zod_1.z.number(),
    energiaSceeeKwh: zod_1.z.number(),
    energiaSceeeValor: zod_1.z.number(),
    energiaCompensadaGdi: zod_1.z.number(),
    valorTotal: zod_1.z.number().positive(), // Mantém-se positivo, pois valores totais não podem ser negativos
    valorEconomiaGd: zod_1.z.number(), // Permite valores negativos e positivos
    contribuicaoIlum: zod_1.z.number(),
    createdAt: zod_1.z.date().optional(), // Criação da data opcional, pois o Prisma define com default (now)
});
