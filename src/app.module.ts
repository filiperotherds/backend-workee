import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UserModule } from './domain/entities/user/user.module'

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
