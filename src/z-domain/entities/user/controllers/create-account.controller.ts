import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { UserService } from '../user.service'
import {
  createAccountBodySchema,
  type CreateAccountBodySchema,
} from '../schema/create-account.schema'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    await this.userService.create({ name, email, password })
  }
}
