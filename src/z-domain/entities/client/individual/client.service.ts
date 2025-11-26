import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ClientRepository } from './client.repository'
import type { CreateClientAccountBodySchema } from './schema/create-client-account.schema'
import type { CreateAddressBodySchema } from '../../address/schema/create-address.schema'
import { TokenPayload } from '@/modules/auth/strategies/jwt.strategy' 

@Injectable()
export class ClientService {
  constructor(private clientRepository: ClientRepository) {}

  async create(createClientAccount: CreateClientAccountBodySchema) {
    const { name, email, password } = createClientAccount

    const existingUser = await this.clientRepository.findByEmail(email)

    if (existingUser) {
      throw new ConflictException('User with this email already exists')
    }

    const hashedPassword = await hash(password, 8)

    const user = await this.clientRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    const userId = user.id

    const userProfile = await this.clientRepository.createProfile(userId)

    return { user, userProfile }
  }

  async createAddress(
    createAddress: CreateAddressBodySchema,
    user: TokenPayload,
  ) {
    const userId = user.sub

    const userProfileId =
      await this.clientRepository.getUserProfileIdByUserId(userId)

    if (userProfileId === null) {
      throw new ConflictException('User profile not found.')
    }

    return this.clientRepository.createAddress(createAddress, userProfileId)
  }

  async getAddressesByUserId(userId: string) {
    const userProfileId =
      await this.clientRepository.getUserProfileIdByUserId(userId)

    if (userProfileId === null) {
      throw new ConflictException('User profile not found.')
    }

    return this.clientRepository.getAddressByUserProfileId(userProfileId)
  }
}
