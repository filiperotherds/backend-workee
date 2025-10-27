import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UserModule } from './domain/entities/user/user.module'
import { ClientModule } from './domain/entities/client/individual/client.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthenticateController } from './auth/controllers/authenticate.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    UserModule,
    ClientModule,
    AuthModule,
  ],
  controllers: [AuthenticateController],
  providers: [PrismaService],
})
export class AppModule {}
