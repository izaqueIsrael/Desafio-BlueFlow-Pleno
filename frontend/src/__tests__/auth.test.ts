import { authAPI } from '../api/auth.api';
import { authStore } from '../store/auth.store';

jest.mock('../api/auth.api');

describe('AuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('deve fazer login com sucesso', async () => {
    const mockResponse = {
      sucesso: true,
      dados: {
        token: 'fake-token',
        usuario: { id: 1, email: 'test@test.com' }
      }
    };

    (authAPI.entrar as jest.Mock).mockResolvedValue(mockResponse);

    await authStore.login('test@test.com', '123456');

    expect(authStore.isAuth()).toBe(true);
    expect(authStore.getState().usuario.email).toBe('test@test.com');
  });

  it('deve fazer logout', () => {
    authStore.logout();

    expect(authStore.isAuth()).toBe(false);
    expect(authStore.getState().usuario).toBeNull();
  });
});