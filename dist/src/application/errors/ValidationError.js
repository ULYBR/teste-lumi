"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
class ValidationError extends Error {
    errors;
    constructor(errors) {
        super("Erro de validação: " + errors.join(", "));
        this.errors = errors;
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
