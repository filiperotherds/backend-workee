import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ClientService } from '../client.service'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import {
  createAddressBodySchema,
  type CreateAddressBodySchema,
} from '../../../address/schema/create-address.schema'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard' 
import { CurrentUser } from '@/common/decorators/current-user-decorator' 
import type { TokenPayload } from '@/modules/auth/strategies/jwt.strategy' 

const bodyValidationPipe = new ZodValidationPipe(createAddressBodySchema)

@Controller('/client/address')
@UseGuards(JwtAuthGuard)
export class CreateClientAddressController {
  constructor(private clientService: ClientService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateAddressBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    await this.clientService.createAddress(body, user)
  }
}
