import { Injectable } from '@nestjs/common'
import { User } from 'generated/prisma'
import { PrismaService } from '@/database/prisma/prisma.service'
import type { CreateAccountBodySchema } from './schema/create-account.schema'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(createAccount: CreateAccountBodySchema): Promise<User> {
    const { name, email, password } = createAccount

    return this.prisma.user.create({ data: { name, email, password } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } })
  }
}
