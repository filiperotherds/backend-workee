import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { ClientService } from '../client.service'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import {
  createClientAccountBodySchema,
  type CreateClientAccountBodySchema,
} from '../schema/create-client-account.schema'

@Controller('/client/accounts')
export class CreateClientAccountController {
  constructor(private clientService: ClientService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createClientAccountBodySchema))
  async handle(@Body() body: CreateClientAccountBodySchema) {
    const { name, email, password } = body

    await this.clientService.create({ name, email, password })
  }
}
