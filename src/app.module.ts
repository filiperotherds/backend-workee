import { Module } from '@nestjs/common'
import { PrismaService } from './database/prisma/prisma.service'
import { UserModule } from './z-domain/entities/user/user.module'
import { ClientModule } from './z-domain/entities/client/individual/client.module'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './config/env'
import { AuthModule } from './modules/auth/auth.module'

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
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
