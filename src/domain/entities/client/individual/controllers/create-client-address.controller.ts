import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ClientService } from '../client.service'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import {
  createClientAddressBodySchema,
  type CreateClientAddressBodySchema,
} from '../schema/create-client-address.schema'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CurrentUser } from 'src/auth/current-user-decorator'
import type { TokenPayload } from 'src/auth/jwt.strategy'

const bodyValidationPipe = new ZodValidationPipe(createClientAddressBodySchema)

@Controller('/client/address')
@UseGuards(JwtAuthGuard)
export class CreateClientAddressController {
  constructor(private clientService: ClientService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateClientAddressBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    await this.clientService.createAddress(body, user)
  }
}
