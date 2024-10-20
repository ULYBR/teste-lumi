"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaturaController = void 0;
class FaturaController {
    faturaService;
    constructor(faturaService) {
        this.faturaService = faturaService;
    }
    // Controller para upload de faturas via PDF
    async uploadFatura(req, reply) {
        try {
            const data = await req.file();
            if (!data) {
                return reply.status(400).send({ error: 'Nenhum arquivo foi enviado na requisição' });
            }
            const buffer = await data.toBuffer();
            const createdFatura = await this.faturaService.uploadFaturas([buffer]);
            return reply.status(201).send(createdFatura);
        }
        catch (error) {
            console.error('Erro ao processar a fatura:', error);
            return reply.status(500).send({ error: 'Erro ao processar a fatura' });
        }
    }
    // Controller para upload de múltiplos arquivos de faturas (se necessário)
    async uploadFaturas(req, reply) {
        try {
            const files = await req.files();
            const faturasCriadas = [];
            for await (const file of files) {
                const buffer = await file.toBuffer();
                const createdFatura = await this.faturaService.uploadFaturas([buffer]);
                faturasCriadas.push(createdFatura);
            }
            return reply.status(201).send(faturasCriadas);
        }
        catch (error) {
            console.error('Erro ao processar os arquivos de fatura:', error);
            return reply.status(500).send({ error: 'Erro ao processar os arquivos de fatura' });
        }
    }
    // Controller para obter faturas por cliente
    async getFaturasByCliente(req, reply) {
        try {
            const { numCliente } = req.params;
            if (!numCliente) {
                return reply.status(400).send({ error: 'Número do cliente não informado' });
            }
            const faturas = await this.faturaService.getFaturasByCliente(numCliente);
            if (!faturas || faturas.length === 0) {
                return reply.status(404).send({ error: 'Nenhuma fatura encontrada para este cliente' });
            }
            return reply.status(200).send(faturas);
        }
        catch (error) {
            console.error('Erro ao buscar faturas por cliente:', error);
            return reply.status(500).send({ error: 'Erro ao buscar faturas' });
        }
    }
    // Controller para obter faturas por mês
    async getFaturasByMes(req, reply) {
        try {
            const { mesReferencia } = req.query;
            if (!mesReferencia) {
                return reply.status(400).send({ error: 'Mês de referência não informado' });
            }
            const faturas = await this.faturaService.getFaturasByMes(mesReferencia);
            if (!faturas || faturas.length === 0) {
                return reply.status(404).send({ error: 'Nenhuma fatura encontrada para este mês' });
            }
            return reply.status(200).send(faturas);
        }
        catch (error) {
            console.error('Erro ao buscar faturas por mês:', error);
            return reply.status(500).send({ error: 'Erro ao buscar faturas' });
        }
    }
}
exports.FaturaController = FaturaController;
