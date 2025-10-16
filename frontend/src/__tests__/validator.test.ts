import { Validator } from '../utils/validation';

describe('Validator', () => {
  it('deve validar email correto', () => {
    expect(Validator.isEmail('test@test.com')).toBe(true);
    expect(Validator.isEmail('invalid')).toBe(false);
  });

  it('deve validar senha mínima', () => {
    expect(Validator.isMinLength('123456', 6)).toBe(true);
    expect(Validator.isMinLength('12345', 6)).toBe(false);
  });

  it('deve validar formulário completo', () => {
    const errors = Validator.validateLoginForm('test@test.com', '123456');
    expect(Object.keys(errors).length).toBe(0);
  });

  it('deve retornar erros no formulário', () => {
    const errors = Validator.validateLoginForm('invalid', '123');
    expect(errors.email).toBeDefined();
    expect(errors.senha).toBeDefined();
  });
});