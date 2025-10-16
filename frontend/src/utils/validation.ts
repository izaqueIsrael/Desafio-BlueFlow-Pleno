export class Validator {
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isMinLength(value: string, min: number): boolean {
    return value.length >= min;
  }

  static isRequired(value: string): boolean {
    return value.trim().length > 0;
  }

  static validateEmail(email: string): string | null {
    if (!this.isRequired(email)) {
      return 'Email é obrigatório';
    }
    if (!this.isEmail(email)) {
      return 'Email inválido';
    }
    return null;
  }

  static validatePassword(senha: string): string | null {
    if (!this.isRequired(senha)) {
      return 'Senha é obrigatória';
    }
    if (!this.isMinLength(senha, 6)) {
      return 'Senha deve ter no mínimo 6 caracteres';
    }
    return null;
  }

  static validateLoginForm(email: string, senha: string): { email?: string; senha?: string } {
    const errors: { email?: string; senha?: string } = {};

    const emailError = this.validateEmail(email);
    if (emailError) errors.email = emailError;

    const senhaError = this.validatePassword(senha);
    if (senhaError) errors.senha = senhaError;

    return errors;
  }
}