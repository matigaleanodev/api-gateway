import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { LoginUserDTO } from 'src/auth/dto/login-user.dto';

@Injectable()
export class AuthService {
  private readonly client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: 4000 },
    });
  }

  login(loginUserDto: LoginUserDTO): Observable<any> {
    return this.client.send('auth.login', loginUserDto);
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.client.send('auth.refresh', refreshToken);
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.client.send('auth.request-password-reset', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.client.send('auth.reset-password', { token, newPassword });
  }
}
