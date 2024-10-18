export class ValidationError extends Error {
  constructor(public errors: string[]) {
    super("Erro de validação: " + errors.join(", "));
    this.name = "ValidationError";
  }
}
