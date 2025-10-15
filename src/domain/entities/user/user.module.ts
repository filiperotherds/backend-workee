import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateAccountController } from './controllers/create-account.controller'
import { UserService } from './user.service'
import { UserRepository } from './user.repository'

@Module({
  imports: [],
  controllers: [CreateAccountController],
  providers: [PrismaService, UserService, UserRepository],
})
export class UserModule {}
