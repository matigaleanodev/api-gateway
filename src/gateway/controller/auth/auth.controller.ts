import { Body, Controller, Post, HttpException } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { Observable, catchError, throwError } from 'rxjs';
import { LoginUserDTO } from 'src/models/login-user.dto';

@Controller('auth')
export class AuthController {
  @Client({
    transport: Transport.TCP,
    options: { host: 'localhost', port: 4000 },
  })
  private readonly client: ClientProxy;

  /**
   * Maneja el inicio de sesión de un usuario.
   * @param loginUserDto Datos del usuario (email y password).
   * @returns Tokens de acceso y refresh.
   */
  @Post('login')
  login(@Body() loginUserDto: LoginUserDTO): Observable<any> {
    return this.client.send('auth.login', loginUserDto).pipe(
      catchError(
        ({
          statusCode,
          message,
        }: {
          statusCode: number;
          message: string | Record<string, any>;
        }) => {
          return throwError(() => new HttpException(message, statusCode));
        },
      ),
    );
  }

  /**
   * Maneja la actualización del token de acceso usando el refresh token.
   * @param refreshToken Token de refresco.
   * @returns Nuevo access token y refresh token.
   */
  @Post('refresh')
  refreshToken(@Body() refreshToken: string): Observable<any> {
    return this.client.send('auth.refresh', refreshToken).pipe(
      catchError(
        ({
          statusCode,
          message,
        }: {
          statusCode: number;
          message: string | Record<string, any>;
        }) => {
          return throwError(() => new HttpException(message, statusCode));
        },
      ),
    );
  }

  /**
   * Solicita un token para recuperar la contraseña.
   * @param email Email del usuario.
   */
  @Post('request-password-reset')
  requestPasswordReset(@Body() { email }: { email: string }): Observable<any> {
    return this.client
      .send('auth.request-password-reset', { email })
      .pipe(
        catchError(({ statusCode, message }) =>
          throwError(() => new HttpException(message, statusCode)),
        ),
      );
  }

  /**
   * Cambia la contraseña utilizando el token de recuperación.
   * @param token Token enviado al email.
   * @param newPassword Nueva contraseña.
   */
  @Post('reset-password')
  resetPassword(
    @Body() { token, newPassword }: { token: string; newPassword: string },
  ): Observable<any> {
    return this.client
      .send('auth.reset-password', { token, newPassword })
      .pipe(
        catchError(({ statusCode, message }) =>
          throwError(() => new HttpException(message, statusCode)),
        ),
      );
  }
}
