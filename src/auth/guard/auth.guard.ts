import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<
        Request & { email?: string; headers: { authorization?: string } }
      >();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token no encontrado');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Formato de token inválido');
    }

    try {
      const response: { isValid: boolean; email: string } = await lastValueFrom(
        this.authClient.send('auth.validate-token', { token }),
      );

      if (!response || !response.isValid) {
        throw new UnauthorizedException('Token inválido o expirado');
      }

      request.email = response.email;
      return true;
    } catch {
      throw new UnauthorizedException('No autorizado');
    }
  }
}
