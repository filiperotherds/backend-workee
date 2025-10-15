import { ConflictException, Injectable } from '@nestjs/common'
import { UserRepository } from './user.repository'
import { hash } from 'bcryptjs'
import type { CreateAccountBodySchema } from './schema/create-account.schema'

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(createAccount: CreateAccountBodySchema) {
    const { name, email, password } = createAccount

    const existingUser = await this.userRepository.findByEmail(email)

    if (existingUser) {
      throw new ConflictException('User with this email already exists')
    }

    const hashedPassword = await hash(password, 8)

    return this.userRepository.create({ name, email, password: hashedPassword })
  }
}
