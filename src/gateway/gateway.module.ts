import { Module } from '@nestjs/common';
import { GatewayService } from './service/gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './controller/auth/auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 4000 },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [GatewayService],
})
export class GatewayModule {}
