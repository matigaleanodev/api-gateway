import { Body, Controller, Post, HttpException } from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { LoginUserDTO } from 'src/auth/dto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Maneja el inicio de sesión de un usuario.
   * @param loginUserDto Datos del usuario (email y password).
   * @returns Tokens de acceso y refresh.
   */
  @Post('login')
  login(@Body() loginUserDto: LoginUserDTO): Observable<any> {
    return this.authService
      .login(loginUserDto)
      .pipe(
        catchError(({ statusCode, message }) =>
          throwError(() => new HttpException(message, statusCode)),
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
    return this.authService
      .refreshToken(refreshToken)
      .pipe(
        catchError(({ statusCode, message }) =>
          throwError(() => new HttpException(message, statusCode)),
        ),
      );
  }

  /**
   * Solicita un token para recuperar la contraseña.
   * @param email Email del usuario.
   */
  @Post('request-password-reset')
  requestPasswordReset(@Body() { email }: { email: string }): Observable<any> {
    return this.authService
      .requestPasswordReset(email)
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
    return this.authService
      .resetPassword(token, newPassword)
      .pipe(
        catchError(({ statusCode, message }) =>
          throwError(() => new HttpException(message, statusCode)),
        ),
      );
  }
}
