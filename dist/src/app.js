"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const FaturaController_1 = require("./infra/controllers/FaturaController");
const PrismaFaturaRepository_1 = require("./infra/database/PrismaFaturaRepository");
const FaturaService_1 = require("./application/use-cases/FaturaService");
async function buildServer() {
    const fastify = (0, fastify_1.default)({ logger: true });
    try {
        fastify.register(multipart_1.default);
        const faturaRepository = new PrismaFaturaRepository_1.PrismaFaturaRepository();
        const faturaService = new FaturaService_1.FaturaService(faturaRepository);
        const faturaController = new FaturaController_1.FaturaController(faturaService);
        fastify.get('/faturas/cliente/:numCliente', faturaController.getFaturasByCliente.bind(faturaController));
        fastify.post('/faturas/upload', faturaController.uploadFaturas.bind(faturaController));
        fastify.get('/faturas/mes/:mesReferencia', faturaController.getFaturasByMes.bind(faturaController));
        await fastify.listen({ port: 3000 });
        fastify.log.info(`Server running at http://localhost:3000`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
buildServer();
