"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaFaturaRepository = void 0;
const prisma_1 = __importDefault(require("../../../database/prisma"));
class PrismaFaturaRepository {
    async createFatura(fatura) {
        if (!fatura.numCliente || !fatura.mesReferencia || !fatura.energiaEletricaKwh || !fatura.valorTotal || fatura.contribuicaoIlum === undefined) {
            throw new Error('Os campos obrigatórios não estão presentes.');
        }
        return await prisma_1.default.fatura.create({
            data: {
                numCliente: fatura.numCliente,
                numInstalacao: fatura.numInstalacao,
                mesReferencia: fatura.mesReferencia,
                energiaEletricaKwh: fatura.energiaEletricaKwh,
                energiaEletricaValor: fatura.energiaEletricaValor,
                energiaSceeeKwh: fatura.energiaSceeeKwh || 0,
                energiaSceeeValor: fatura.energiaSceeeValor,
                energiaCompensadaGdi: fatura.energiaCompensadaGdi || 0,
                valorTotal: fatura.valorTotal,
                valorEconomiaGd: fatura.valorEconomiaGd || 0,
                contribuicaoIlum: fatura.contribuicaoIlum || 0,
            },
        });
    }
    async updateFatura(id, data) {
        return await prisma_1.default.fatura.update({
            where: { id },
            data,
        });
    }
    async findFaturaByClienteAndMes(numCliente, mesReferencia) {
        return await prisma_1.default.fatura.findFirst({
            where: {
                numInstalacao: numCliente,
                mesReferencia: mesReferencia,
            },
        });
    }
    async getFaturaByCliente(numCliente) {
        const faturas = await prisma_1.default.fatura.findMany({
            where: { numCliente }
        });
        return faturas;
    }
    async getFaturaByMes(mesReferencia) {
        const faturas = await prisma_1.default.fatura.findMany({
            where: { mesReferencia }
        });
        return faturas;
    }
}
exports.PrismaFaturaRepository = PrismaFaturaRepository;
