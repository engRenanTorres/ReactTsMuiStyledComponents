import { HttpClient, HttpClientGet } from '../../utils/httpClient/httpClient';
import { tokenService } from './tokenService';

type LoginBody = { email: string; password: string };
type loginResponse = { token: string };

export const authService = {
  async login({ email, password }: LoginBody) {
    return HttpClient<LoginBody>(
      'POST',
      process.env.NEXT_PUBLIC_BACKEND_DEV + '/api/auth/login',
      {
        body: { email, password },
      },
    ).then((response) => {
      if (!response.ok) throw new Error('Usuário ou senha inválidos');
      const body = response.body as loginResponse;
      if (body.token) tokenService.save(body.token);
      console.log(body);
    });
  },
  async getSession(): Promise<Credencials | false> {
    const accessToken = tokenService.get();
    return HttpClientGet(
      process.env.NEXT_PUBLIC_BACKEND_DEV + '/api/auth/session',
      {},
      accessToken,
    ).then((response) => {
      if (!response.ok) {
        throw new Error('Não Autorizado');
      }
      const body = response.body as Body;
      return body.credencials ? body.credencials : false;
    });
  },
};

export type Body = {
  valid: boolean;
  credencials: {
    id: string;
    name: string;
    email: string;
    roles: number;
  };
};

export type Credencials = {
  id: string;
  name: string;
  email: string;
  roles: number;
};
